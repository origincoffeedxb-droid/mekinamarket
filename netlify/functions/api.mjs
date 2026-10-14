import { getStore } from "@netlify/blobs";
import { randomUUID, timingSafeEqual } from "node:crypto";

const store = () => getStore({ name: "mekina-market-submissions", consistency: "strong" });
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});
const text = (value, max = 300) => String(value || "").trim().slice(0, max);
const validPhone = value => /^251[79]\d{8}$/.test(String(value || ""));
const safeEqual = (left, right) => {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
};
const hasAdmin = request => {
  const expected = process.env.ADMIN_TOKEN || "";
  const provided = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return !!expected && safeEqual(provided, expected);
};
async function readRecords(prefix) {
  const db = store();
  const { blobs } = await db.list({ prefix });
  const rows = await Promise.all(blobs.map(async item => db.get(item.key, { type: "json", consistency: "strong" })));
  return rows.filter(Boolean).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
function csvCell(value) { return `"${String(value ?? "").replace(/"/g, '""')}"`; }

export default async request => {
  const url = new URL(request.url);
  let route = url.pathname;
  route = route.replace(/^\/.netlify\/functions\/api/, "/api");
  if (route.startsWith("/api/")) route = route.slice(4);
  if (route === "/health" && request.method === "GET") return json({ ok: true });

  if (route === "/requests" && request.method === "POST") {
    let input;
    try { input = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
    if (!text(input.part, 180) || !text(input.name, 120) || !validPhone(input.phone) || !text(input.city, 100) || !text(input.make, 100)) {
      return json({ error: "Please provide a part, name, valid Ethiopian mobile number, make, and city." }, 422);
    }
    const record = {
      id: `MM-${randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      category: text(input.category, 30), make: text(input.make, 100), model: text(input.model, 100),
      year: text(input.year, 4), part: text(input.part, 180), condition: text(input.condition, 30),
      notes: text(input.notes, 1000), name: text(input.name, 120), phone: input.phone,
      city: text(input.city, 100), contactVia: text(input.contactVia, 40), lang: text(input.lang, 5)
    };
    await store().set(`requests/${record.createdAt}/${record.id}`, JSON.stringify(record));
    return json({ ok: true, id: record.id }, 201);
  }

  if (route === "/suppliers" && request.method === "POST") {
    let input;
    try { input = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
    if (!text(input.shop, 160) || !text(input.contact, 120) || !validPhone(input.phone) || !text(input.city, 100) || !text(input.categories, 300)) {
      return json({ error: "Please provide shop, contact, valid Ethiopian mobile number, city, and categories." }, 422);
    }
    const record = {
      id: `SUP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, createdAt: new Date().toISOString(),
      shop: text(input.shop, 160), contact: text(input.contact, 120), phone: input.phone,
      city: text(input.city, 100), categories: text(input.categories, 300), makes: text(input.makes, 300)
    };
    await store().set(`suppliers/${record.createdAt}/${record.id}`, JSON.stringify(record));
    return json({ ok: true, id: record.id }, 201);
  }

  if (route.startsWith("/admin/")) {
    if (!process.env.ADMIN_TOKEN) return json({ error: "Admin access is not configured." }, 503);
    if (!hasAdmin(request)) return json({ error: "Admin authorization required." }, 401);
    if (route === "/admin/requests" && request.method === "GET") return json({ requests: await readRecords("requests/") });
    if (route === "/admin/suppliers" && request.method === "GET") return json({ suppliers: await readRecords("suppliers/") });
    if (route === "/admin/export.csv" && request.method === "GET") {
      const rows = await readRecords("requests/");
      const columns = ["id", "createdAt", "category", "make", "model", "year", "part", "condition", "notes", "name", "phone", "city", "contactVia", "lang"];
      const content = "\ufeff" + [columns.join(","), ...rows.map(row => columns.map(key => csvCell(row[key])).join(","))].join("\r\n");
      return new Response(content, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=mekina-market-requests.csv", "Cache-Control": "no-store" } });
    }
  }
  return json({ error: "Not found." }, 404);
};
