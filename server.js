const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = __dirname;
function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
loadEnv(path.join(ROOT, '.env'));
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'));
const DB_FILE = path.join(DATA_DIR, 'submissions.json');
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 20;
const rate = new Map();
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.json':'application/json; charset=utf-8'};
fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ requests: [], suppliers: [] }, null, 2));
function readStore() { try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { return { requests: [], suppliers: [] }; } }
function writeStore(data) { const tmp = DB_FILE + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(data, null, 2), { mode: 0o600 }); fs.renameSync(tmp, DB_FILE); }
function json(res, status, body) { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(JSON.stringify(body)); }
function secureEqual(a, b) { const aa=Buffer.from(a), bb=Buffer.from(b); return aa.length===bb.length && crypto.timingSafeEqual(aa,bb); }
function readBody(req) { return new Promise((resolve,reject)=>{ let raw=''; req.on('data',c=>{ raw+=c; if(raw.length>24_000){ reject(new Error('too_large')); req.destroy(); } }); req.on('end',()=>{ try { resolve(JSON.parse(raw || '{}')); } catch { reject(new Error('invalid_json')); } }); req.on('error',reject); }); }
function validPhone(v) { return /^251[79]\d{8}$/.test(String(v || '')); }
function text(v,max=300) { return String(v || '').trim().slice(0,max); }
function rateLimited(req) { const ip=(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim(); const now=Date.now(); const old=rate.get(ip) || {start:now,count:0}; if(now-old.start>RATE_WINDOW_MS){old.start=now;old.count=0;} old.count++; rate.set(ip,old); return old.count>RATE_LIMIT; }
function admin(req) { const value=(req.headers.authorization || '').replace(/^Bearer\s+/i,''); return !!ADMIN_TOKEN && secureEqual(value,ADMIN_TOKEN); }
const server = http.createServer(async (req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff'); res.setHeader('Referrer-Policy','strict-origin-when-cross-origin'); res.setHeader('X-Frame-Options','DENY');
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/api/health') return json(res,200,{ok:true});
  if (req.method === 'POST' && ['/api/requests','/api/suppliers'].includes(url.pathname)) {
    if (rateLimited(req)) return json(res,429,{error:'Too many submissions. Try again later.'});
    let item; try { item=await readBody(req); } catch(e) { return json(res,e.message==='too_large'?413:400,{error:'Invalid submission.'}); }
    if (url.pathname==='/api/requests') {
      if (!text(item.part,180) || !text(item.name,120) || !validPhone(item.phone) || !text(item.city,100) || !text(item.make,100)) return json(res,422,{error:'Please provide a part, name, valid Ethiopian mobile number, make, and city.'});
      const record={id:'MM-'+crypto.randomBytes(4).toString('hex').toUpperCase(),createdAt:new Date().toISOString(),category:text(item.category,30),make:text(item.make,100),model:text(item.model,100),year:text(item.year,4),part:text(item.part,180),condition:text(item.condition,30),notes:text(item.notes,1000),name:text(item.name,120),phone:item.phone,city:text(item.city,100),contactVia:text(item.contactVia,40),lang:text(item.lang,5)};
      const data=readStore(); data.requests.push(record); writeStore(data); return json(res,201,{ok:true,id:record.id});
    }
    if (!text(item.shop,160) || !text(item.contact,120) || !validPhone(item.phone) || !text(item.city,100) || !text(item.categories,300)) return json(res,422,{error:'Please provide shop, contact, valid Ethiopian mobile number, city, and categories.'});
    const record={id:'SUP-'+crypto.randomBytes(4).toString('hex').toUpperCase(),createdAt:new Date().toISOString(),shop:text(item.shop,160),contact:text(item.contact,120),phone:item.phone,city:text(item.city,100),categories:text(item.categories,300),makes:text(item.makes,300)};
    const data=readStore(); data.suppliers.push(record); writeStore(data); return json(res,201,{ok:true,id:record.id});
  }
  if (url.pathname.startsWith('/api/admin/')) {
    if (!ADMIN_TOKEN) return json(res,503,{error:'Admin access is not configured.'});
    if (!admin(req)) return json(res,401,{error:'Admin authorization required.'});
    const data=readStore();
    if (req.method==='GET' && url.pathname==='/api/admin/requests') return json(res,200,{requests:data.requests.slice().reverse()});
    if (req.method==='GET' && url.pathname==='/api/admin/suppliers') return json(res,200,{suppliers:data.suppliers.slice().reverse()});
    if (req.method==='GET' && url.pathname==='/api/admin/export.csv') {
      const cols=['id','createdAt','category','make','model','year','part','condition','notes','name','phone','city','contactVia','lang'];
      const esc=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
      const csv='\ufeff'+[cols.join(','),...data.requests.map(r=>cols.map(k=>esc(r[k])).join(','))].join('\r\n');
      res.writeHead(200,{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="mekina-market-requests.csv"','Cache-Control':'no-store'}); return res.end(csv);
    }
    return json(res,404,{error:'Not found.'});
  }
  if (req.method!=='GET' && req.method!=='HEAD') return json(res,405,{error:'Method not allowed.'});
  let pathname=decodeURIComponent(url.pathname); if(pathname==='/') pathname='/index.html';
  const file=path.resolve(ROOT,'.'+pathname); if(!file.startsWith(ROOT+path.sep)) return json(res,403,{error:'Forbidden.'});
  fs.stat(file,(err,st)=>{ if(err||!st.isFile()){res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});return res.end('Not found');}
    res.writeHead(200,{'Content-Type':mime[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':path.extname(file)==='.html'?'no-cache':'public, max-age=3600'});
    if(req.method==='HEAD')return res.end(); fs.createReadStream(file).pipe(res);
  });
});
server.listen(PORT,HOST,()=>console.log(`Mekina Market listening on ${HOST}:${PORT}`));
