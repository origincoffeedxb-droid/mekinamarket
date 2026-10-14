(function(){
"use strict";

/* ====== SETTINGS: change these before you go live ====== */
const CONFIG = { whatsapp: "", telegram: "", email: "" };

/* ====== DATA ====== */
const ICONS = {
  cars:'<path d="M6 30v-8l5-9h22l7 9h3v8z"/><circle cx="15" cy="32" r="4.2"/><circle cx="34" cy="32" r="4.2"/><path d="M13 22h22"/>',
  trucks:'<path d="M3 13h24v19H3zM27 20h10l8 8v4H27z"/><circle cx="12" cy="34" r="4"/><circle cx="37" cy="34" r="4"/>',
  heavy:'<path d="M5 36h28v-6H5z"/><path d="M12 30v-9h10v9M22 24l12-13 9 6"/><path d="M43 17l-4 11h6"/>',
  farm:'<circle cx="14" cy="32" r="8"/><circle cx="38" cy="35" r="5"/><path d="M14 24h10V13h9l3 14M24 13V7h6"/>',
  power:'<rect x="6" y="10" width="36" height="28" rx="4"/><path d="M27 15l-9 12h7l-3 9 10-13h-7z"/>'
};
const CATS = {
  cars: {
    en:"Cars & SUVs", am:"መኪናዎች",
    ex:{en:"Engines, gearboxes, brakes, suspension, lights, body panels", am:"ሞተር፣ ጊርቦክስ፣ ፍሬን፣ ሾክ አብዞርበር፣ መብራት፣ የሰውነት ክፍሎች"},
    makes:["Toyota","Suzuki","Hyundai","Nissan","Mitsubishi","Isuzu","Honda","Mazda","Kia","Ford","Volkswagen","Mercedes-Benz","BMW","Peugeot","Renault","Fiat","Lada","Geely","BYD","Chery","Lifan","Land Rover","Subaru","Lexus"],
    parts:["Engine","Gearbox","Radiator","Alternator","Starter motor","Brake pads","Shock absorber","Headlight","Tail light","Bumper","Clutch kit","Turbocharger","Fuel pump","Injector","Water pump","AC compressor","Windscreen","Side mirror","Steering rack","Wheel bearing","ECU","Timing belt","CV joint","Alloy wheels"]
  },
  trucks: {
    en:"Trucks & buses", am:"ከባድ መኪናዎችና አውቶቡሶች",
    ex:{en:"Engines, turbochargers, clutches, axles, brake parts, cab parts", am:"ሞተር፣ ተርቦ፣ ክላች፣ አክሰል፣ የፍሬን ክፍሎች፣ የካቢን ክፍሎች"},
    makes:["Isuzu","Hino","Mitsubishi Fuso","Iveco","Sinotruk (Howo)","Shacman","FAW","Foton","Dongfeng","Mercedes-Benz","Volvo","Scania","MAN","Tata","Ashok Leyland","Eicher","Higer","Yutong","King Long"],
    parts:["Engine","Gearbox","Turbocharger","Clutch","Brake chamber","Air compressor","Differential","Leaf spring","Fuel injection pump","Radiator","Cab parts","Wheel hub","Propeller shaft","Fifth wheel","Starter motor","Alternator"]
  },
  heavy: {
    en:"Heavy equipment", am:"ከባድ ማሽኖች",
    ex:{en:"Hydraulic pumps and cylinders, track chains, bucket teeth, final drives", am:"ሀይድሮሊክ ፓምፖችና ሲሊንደሮች፣ ትራክ ቼይን፣ የባልዲ ጥርሶች፣ ፋይናል ድራይቭ"},
    makes:["Caterpillar","Komatsu","Volvo CE","Hitachi","JCB","Case","Liebherr","Doosan","Hyundai Construction","SANY","XCMG","Liugong","Shantui","Bobcat","Dynapac"],
    parts:["Hydraulic pump","Hydraulic cylinder","Track chain","Bucket teeth","Undercarriage roller","Swing motor","Final drive","Engine","Turbocharger","Filter kit","Control valve","Cab glass","Radiator","Boom pin and bush"]
  },
  farm: {
    en:"Farm machinery", am:"የእርሻ ማሽኖች",
    ex:{en:"Tractor engines, PTO shafts, clutches, hydraulics, plough parts", am:"የትራክተር ሞተር፣ ፒቲኦ ሻፍት፣ ክላች፣ ሀይድሮሊክ፣ የማረሻ ክፍሎች"},
    makes:["John Deere","New Holland","Massey Ferguson","Kubota","Belarus (MTZ)","Case IH","Ford","Yanmar","Fiat"],
    parts:["PTO shaft","Hydraulic pump","Clutch","Plough parts","Gearbox","Engine","Rear axle","Filter kit","Injector","Tyres","Seat"]
  },
  power: {
    en:"Generators & pumps", am:"ጄነሬተርና ፓምፖች",
    ex:{en:"Generator engines, alternators, control panels, water pump parts", am:"የጄነሬተር ሞተር፣ አልተርኔተር፣ ኮንትሮል ፓነል፣ የውሃ ፓምፕ ክፍሎች"},
    makes:["Cummins","Perkins","Caterpillar","FG Wilson","Kohler","Honda","Yamaha","Lister Petter","Deutz"],
    parts:["Alternator (AVR)","Control panel","Engine","Fuel injector","Water pump","Filter kit","Radiator","Starter motor","Pump head"]
  }
};
const MODELS = {
  "Toyota":["Corolla","Vitz","Yaris","Hilux","Land Cruiser","Hiace","RAV4","Camry","Prado","Avanza","Coaster"],
  "Suzuki":["Dzire","Swift","Alto","Maruti","Vitara","Carry"],
  "Hyundai":["i10","i20","Accent","Elantra","Tucson","H-1","County"],
  "Nissan":["Patrol","Navara","Sunny","X-Trail","Qashqai"],
  "Mitsubishi":["L200","Pajero","Canter","Lancer"],
  "Isuzu":["D-Max","NPR","NQR","FSR","FVR","FTR"],
  "Honda":["Civic","Accord","CR-V","Fit"],
  "Mazda":["Demio","Mazda 3","CX-5"],
  "Kia":["Picanto","Rio","Sportage","Sorento"],
  "Ford":["Ranger","Focus","Transit","Everest"],
  "Volkswagen":["Golf","Polo","Passat","Jetta"],
  "Mercedes-Benz":["Actros","Atego","Sprinter","C-Class","E-Class"],
  "Hino":["300","500","700"],
  "Iveco":["Daily","Eurocargo","Stralis"],
  "Caterpillar":["320","330","966","D6","140K"],
  "Komatsu":["PC200","PC300","WA320","D65"],
  "JCB":["3CX","4CX","JS200"],
  "John Deere":["5075","6120","6130"],
  "New Holland":["TD5","T7","TT75"],
  "Massey Ferguson":["MF 240","MF 375","MF 399"]
};
const CITIES = [["Addis Ababa","አዲስ አበባ"],["Adama (Nazret)","አዳማ"],["Dire Dawa","ድሬዳዋ"],["Bahir Dar","ባሕር ዳር"],["Hawassa","ሀዋሳ"],["Mekelle","መቀሌ"],["Gondar","ጎንደር"],["Jimma","ጅማ"],["Dessie","ደሴ"],["Bishoftu","ቢሾፍቱ"],["Harar","ሐረር"],["Arba Minch","አርባ ምንጭ"],["Other city","ሌላ ከተማ"]];
const QUICK = [
  {cat:"cars",part:"Engine",am:"ሞተር"},
  {cat:"cars",part:"Gearbox",am:"ጊርቦክስ"},
  {cat:"cars",part:"Radiator",am:"ራዲያተር"},
  {cat:"cars",part:"Alternator",am:"አልተርኔተር"},
  {cat:"trucks",part:"Turbocharger",am:"ተርቦ"},
  {cat:"heavy",part:"Hydraulic pump",am:"ሀይድሮሊክ ፓምፕ"}
];
const TW = {
  en:["radiator","gearbox","turbocharger","hydraulic pump","alternator","clutch kit","track chain","tractor engine"],
  am:["ራዲያተር","ጊርቦክስ","ተርቦ","ሀይድሮሊክ ፓምፕ","አልተርኔተር","ክላች","ትራክ ቼይን","የትራክተር ሞተር"]
};

/* ====== TRANSLATIONS (Amharic). English text lives in the HTML. ====== */
const AM = {
  nav_how:"እንዴት ይሰራል", nav_cats:"ምድቦች", nav_sup:"ለአቅራቢዎች", nav_faq:"ጥያቄዎች", btn_sup:"አቅራቢ ይሁኑ",
  tag:"በመላው ኢትዮጵያ ለገዢዎች ነፃ",
  h1:"ዕቃውን ይግለጹ። አቅራቢዎች ዋጋ ይልካሉ።",
  tw_pre:"", tw_post:" ያስፈልግዎታል?",
  lead:"ለመኪና፣ ለከባድ መኪና፣ ለእርሻ ወይም ለከባድ ማሽን መለዋወጫ አንድ ጥያቄ ያስገቡ። በአዲስ አበባና በመላው ኢትዮጵያ ያሉ አቅራቢዎች ዋጋና ክምችት ይዘው ያገኙዎታል።",
  quick:"በተለመደ ዕቃ ይጀምሩ",
  t_title:"የዕቃ ጥያቄ", t_free:"ለገዢዎች ነፃ",
  g_part:"ዕቃው", g_you:"አቅራቢዎች የሚያገኙዎት እንዴት ነው?",
  lbl_cat:"የመኪና ወይም የማሽን ዓይነት", lbl_make:"አምራች", lbl_model:"ሞዴል", opt:"(አማራጭ)", lbl_year:"የተመረተበት ዓመት",
  lbl_cond:"ሁኔታ", c_used:"ያገለገለ", c_new:"አዲስ", c_any:"ማንኛውም",
  lbl_part:"የሚፈልጉት ዕቃ", ph_part:"ይጻፉ ወይም ይምረጡ፣ ለምሳሌ ራዲያተር",
  lbl_notes:"የዕቃ ቁጥር ወይም ተጨማሪ መረጃ", ph_notes:"የዕቃ ቁጥር፣ የሞተር መጠን፣ ግራ ወይም ቀኝ…",
  lbl_name:"ስምዎ", lbl_phone:"ሞባይል ቁጥር", lbl_city:"ከተማ", lbl_via:"በዚህ ያግኙኝ", v_call:"ስልክ ጥሪ",
  btn_send:"ዋጋ ጠይቅ", fine:"ከየትኛው አቅራቢ እንደሚገዙ እርስዎ ይወስናሉ። የመግዛት ግዴታ የለም።",
  done_h:"ጥያቄዎ ተልኳል", done_id:"የጥያቄ ቁጥር", done_p:"ዕቃው ያላቸው አቅራቢዎች ያገኙዎታል። ስልክዎን ያቅርቡ።",
  done_wa:"ለቡድናችን በዋትስአፕ ደግሞ ላክ", done_copy:"ጥያቄውን ቅዳ", done_again:"አዲስ ጥያቄ",
  st_cats:"የዕቃ ምድቦች", st_makes:"የሚመርጡባቸው አምራቾች", st_parts:"በዝርዝሩ ያሉ የተለመዱ ዕቃዎች", st_free_v:"ነፃ", st_free_l:"ጥያቄ ለማስገባት",
  how_h:"ከ“ዕቃ ያስፈልገኛል” እስከ ዋጋ በሦስት ደረጃ",
  s1_h:"ዕቃውን ይግለጹ", s1_p:"አምራቹን፣ ሞዴሉንና ዓመቱን ከዚያም ዕቃውን ይምረጡ። የዕቃ ቁጥር ካለዎት ይጨምሩ።",
  s2_h:"አቅራቢዎች ይመልሳሉ", s2_p:"ዕቃው ያላቸው አቅራቢዎች ዋጋ፣ ሁኔታና ክምችት ይዘው ያገኙዎታል።",
  s3_h:"ያወዳድሩና ይግዙ", s3_p:"የሚስማማዎትን ዋጋ ይምረጡና ከአቅራቢው ጋር በቀጥታ የመረከቢያ ወይም የማድረሻ ዝርዝር ይስማሙ።",
  cat_h:"መጠየቅ የሚችሉት ዕቃዎችና ማሽኖች",
  cat_p:"ከቪትዝ መብራት እስከ የኤክስካቫተር ሀይድሮሊክ ፓምፕ። ሞተር ያለው ወይም መሬት የሚቆፍር ከሆነ ይጠይቁ።",
  make_h:"በአምራች ይፈልጉ", make_p:"አምራች ይምረጡ፤ ጥያቄውን እኛ እንሞላለን።",
  sup_h:"የሚፈልጉትን ለሚያውቁ ገዢዎች ይሽጡ",
  sup_p:"የመለዋወጫ ሱቅ፣ የተበላሹ መኪናዎች ግቢ ወይም የማስመጣት ንግድ አለዎት? ይቀላቀሉና ካለዎት ክምችት ጋር የሚስማሙ ጥያቄዎችን ይመልሱ።",
  p1_h:"ገዢዎች የሚፈልጉትን በትክክል ይወቁ", p1_p:"እያንዳንዱ ጥያቄ አምራቹን፣ ሞዴሉን፣ ዓመቱንና ዕቃውን ይገልጻል፤ ስለዚህ ማቅረብ የሚችሉትን ብቻ ይመልሳሉ።",
  p2_h:"በፈለጉት መንገድ ይመልሱ", p2_p:"ገዢው በመረጠው መንገድ በስልክ፣ በቴሌግራም ወይም በዋትስአፕ ያግኙት።",
  p3_h:"ከሱቅዎ ባሻገር ይድረሱ", p3_p:"ከሌሎች ከተሞችና ክልሎች ያሉ ገዢዎች ያገኙዎታል፤ በሱቅዎ የሚመጡት ብቻ አይደሉም።",
  faq_h:"ገዢዎች የሚጠይቋቸው",
  q1:"ዕቃ መጠየቅ ክፍያ አለው?", a1:"የለውም። ጥያቄ ማስገባት ለገዢዎች ነፃ ነው።",
  q2:"ጥያቄ ከላኩ በኋላ ምን ይሆናል?", a2:"ዕቃው ያላቸው አቅራቢዎች በሰጡት ቁጥር ያገኙዎታል። ከመወሰንዎ በፊት ያወዳድሩ።",
  q3:"መኪና ማርኬት ዕቃዎቹን ይሸጣል?", a3:"አይሸጥም። ገዢዎችን ከአቅራቢዎች ጋር እናገናኛለን። ከመረጡት አቅራቢ ይገዛሉ።",
  q4:"ፎቶ ወይም የዕቃ ቁጥር ብቻ ቢኖረኝስ?", a4:"ይቻላል። የዕቃውን ቁጥር በዝርዝሩ ሳጥን ይጻፉ። አቅራቢው ሲያገኝዎት ፎቶውን በውይይቱ ይላኩ።",
  q5:"ሲከፍሉ እንዴት ይጠንቀቁ?", a5:"የዕቃውን ፎቶ ወይም ቪዲዮ ይጠይቁ፣ ይቻል ከሆነ በአካል ይመልከቱ፣ ሲረኩ ብቻ ይክፈሉ።",
  f_about:"በኢትዮጵያ ካሉ አቅራቢዎች የማሽንና የተሽከርካሪ መለዋወጫ።", f_contact:"ያግኙን", f_suppliers:"አቅራቢዎች", f_view:"የአቅራቢ የጥያቄ ዝርዝር",
  sd_h:"አቅራቢ ይሁኑ", close:"ዝጋ", sd_shop:"የሱቅ ወይም የድርጅት ስም", sd_name:"አግኙት ሰው", sd_sell:"ምን ይሸጣሉ?",
  sd_makes:"የሚያስቀምጡት አምራቾች", sd_send:"እንደ አቅራቢ ተቀላቀል", sd_ok:"እናመሰግናለን። መረጃዎ ደርሶናል፤ በቅርቡ እናገኝዎታለን።",
  vd_h:"የአቅራቢ የጥያቄ ዝርዝር", vd_csv:"CSV አውርድ"
};
const EXTRA = {ti:{nav_how:"ከመይ ይሰርሕ",nav_cats:"ዓይነታት",nav_sup:"ንኣቕረብቲ",nav_faq:"ሕቶታት",btn_sup:"ኣቕራቢ ኩኑ",tag:"ኣብ መላእ ኢትዮጵያ ንዓደግቲ ነፃ",h1:"እቲ መለዋወጢ ግለጹ። ኣቕረብቲ ዋጋ ይልእኩ።",lead:"ንመኪና፣ ከቢድ መኪና፣ ሕርሻ ወይ ከቢድ ማሽን መለዋወጢ ሓደ ሕቶ ኣቕርቡ። ኣቕረብቲ ዋጋን ክምችትን ሒዞም ይረኽቡኹም።",quick:"ብልሙድ መለዋወጢ ጀምሩ",t_title:"ሕቶ መለዋወጢ",g_part:"መለዋወጢ",g_you:"ኣቕረብቲ ብኸመይ ክረኽቡኹም?",lbl_cat:"ዓይነት ተሽከርካሪ ወይ ማሽን",lbl_make:"ኣፍራዪ",lbl_model:"ሞዴል",lbl_year:"ዓመት ምፍራይ",lbl_cond:"ኩነታት",lbl_part:"ዝደልይዎ መለዋወጢ",ph_part:"ጽሓፉ ወይ ምረጹ፣ ንኣብነት ሬድየተር",lbl_notes:"ቁጽሪ መለዋወጢ ወይ ተወሳኺ ሓበሬታ",lbl_name:"ስምኩም",lbl_phone:"ቁጽሪ ሞባይል",lbl_city:"ከተማ",btn_send:"ዋጋ ሕተቱ",done_h:"ሕቶኹም ተላኢኹ",how_h:"ካብ ሕቶ መለዋወጢ ክሳብ ዋጋ ብሰለስተ ስጉምቲ",cat_h:"ክትሓትዎም እትኽእሉ መለዋወጢታትን ማሽናትን",make_h:"ብኣፍራዪ ድለዩ",sup_h:"ንዝፈልጡ ገዛእቲ ሸይጡ",faq_h:"ገዛእቲ ዝሓትዎ ሕቶታት",makePh:"ኣፍራዪ ምረጹ",other:"ካልእ / ኣብ ዝርዝር የለን",yearPh:"ዝኾነ ዓመት",cityPh:"ከተማ ምረጹ",eMake:"ኣፍራዪ ምረጹ ወይ ካልእ ምረጹ።",ePart:"እቲ ዝደልይዎ መለዋወጢ ግለጹ።",eName:"ስምኩም ኣእትዉ።",ePhone:"ቁጽሪ ሞባይል ኣእትዉ።",eCity:"ከተማኹም ምረጹ።",eShop:"ስም ድኳን ወይ ትካል ኣእትዉ።",eCats:"ሓደ ዓይነት ብውሑዱ ምረጹ።",c_used:"ዝተጠቕመ",c_new:"ሓድሽ",c_any:"ዝኾነ",lbl_via:"ብዚ ተወከሱኒ",v_call:"ብስልኪ ደውሉ",fine:"ካብ ዝመረጽክምዎ ኣቕራቢ ትገዝኡ፤ ናይ ምግዛእ ግዴታ የለን።",done_id:"መለለዪ ሕቶ",done_p:"እቲ መለዋወጢ ዘለዎም ኣቕረብቲ ክረኽቡኹም እዮም።",done_wa:"ንጉጅለና ብዋትስኣፕ እውን ስደዱ",done_copy:"ሕቶ ቅዳሕ",done_again:"ሓድሽ ሕቶ",st_cats:"ዓይነታት መለዋወጢ",st_makes:"ኣፍረይቲ እትመርጹ",st_parts:"ልሙዳት መለዋወጢታት",st_free_v:"ነፃ",st_free_l:"ሕቶ ንምቕራብ",s1_h:"እቲ መለዋወጢ ግለጹ",s2_h:"ኣቕረብቲ ይምልሱ",s3_h:"ኣነጻጽሩን ይግዙን"},om:{nav_how:"Akkaataa itti hojjetu",nav_cats:"Ramaddii",nav_sup:"Dhiyeessitootaaf",nav_faq:"Gaaffii",btn_sup:"Dhiyeessaa ta'i",tag:"Itoophiyaa guutuu keessatti bitattootaaf bilisaa",h1:"Meeshaa barbaaddan ibsaa. Dhiyeessitoonni gatii isiniif ergu.",lead:"Meeshaalee konkolaataa, konkolaataa fe'umsaa, qonnaa ykn maashinii ulfaataa barbaaddan gaafadhaa. Dhiyeessitoonni gatii fi argama meeshaa isin beeksisu.",quick:"Meeshaa beekamaa irraa jalqabaa",t_title:"Gaaffii meeshaa",g_part:"Meeshaa",g_you:"Dhiyeessitoonni akkamitti isin quunnamu?",lbl_cat:"Gosa konkolaataa ykn maashinii",lbl_make:"Oomishtuu",lbl_model:"Moodeela",lbl_year:"Waggaa oomishame",lbl_cond:"Haala",lbl_part:"Meeshaa barbaaddan",ph_part:"Barreessaa ykn filadhaa, fakkeenyaaf raadiyeetarii",lbl_notes:"Lakkoofsa meeshaa ykn odeeffannoo dabalataa",lbl_name:"Maqaa keessan",lbl_phone:"Lakkoofsa bilbilaa",lbl_city:"Magaalaa",btn_send:"Gatii gaafadhaa",done_h:"Gaaffiin keessan ergameera",how_h:"Gaaffii meeshaa irraa gara gatii tarkaanfii sadiin",cat_h:"Meeshaalee fi maashiniiwwan gaafachuu dandeessan",make_h:"Oomishtuun barbaadaa",sup_h:"Bitattoota fedhii isaanii beekaniif gurguraa",faq_h:"Gaaffilee bitattoonni gaafatan",makePh:"Oomishtuu filadhaa",other:"Kan biraa / tarree keessa hin jiru",yearPh:"Waggaa kamiyyuu",cityPh:"Magaalaa filadhaa",eMake:"Oomishtuu filadhaa ykn kan biraa filadhaa.",ePart:"Meeshaa barbaaddan ibsaa.",eName:"Maqaa keessan galchaa.",ePhone:"Lakkoofsa bilbilaa seera qabeessa galchaa.",eCity:"Magaalaa keessan filadhaa.",eShop:"Maqaa dukkaanaa ykn dhaabbataa galchaa.",eCats:"Ramaddii tokko yoo xiqqaate filadhaa.",c_used:"Kan itti fayyadame",c_new:"Haaraa",c_any:"Kamiyyuu",lbl_via:"Akkanaan na quunnamaa",v_call:"Bilbila",fine:"Dhiyeessaa filattan irraa bitattu. Bitachuun dirqama miti.",done_id:"Lakkoofsa gaaffii",done_p:"Dhiyeessitoonni meeshaa qaban isin quunnamu.",done_wa:"Garee keenyaaf WhatsApp irratti ergaa",done_copy:"Gaaffii garagalchi",done_again:"Gaaffii haaraa",st_cats:"Ramaddii meeshaalee",st_makes:"Oomishtoota filannoo",st_parts:"Meeshaalee beekamoo",st_free_v:"Bilisaa",st_free_l:"gaaffii galchuuf",s1_h:"Meeshaa barbaaddan ibsaa",s2_h:"Dhiyeessitoonni deebisu",s3_h:"Wal bira qabaa fi bitadhaa"},so:{nav_how:"Sida uu u shaqeeyo",nav_cats:"Qaybaha",nav_sup:"Iibiyeyaasha",nav_faq:"Su'aalo",btn_sup:"Noqo iibiye",tag:"Iibsadayaasha Itoobiya oo dhan waa bilaash",h1:"Sheeg qaybta aad rabto. Iibiyeyaashu qiime ayay kuu soo diraan.",lead:"Soo gudbi hal codsi oo ku saabsan qaybaha baabuurta, gaadiidka culus, beeraha ama mashiinnada. Iibiyeyaashu waxay kuu soo diraan qiimaha iyo helitaanka.",quick:"Ka bilow qayb caadi ah",t_title:"Codsiga qaybta",g_part:"Qaybta",g_you:"Sidee ayay iibiyeyaashu kula soo xiriiraan?",lbl_cat:"Nooca gaadiidka ama mashiinka",lbl_make:"Soo saaraha",lbl_model:"Moodelka",lbl_year:"Sannadka la sameeyay",lbl_cond:"Xaaladda",lbl_part:"Qaybta aad rabto",ph_part:"Qor ama dooro, tusaale hiitarka",lbl_notes:"Lambarka qaybta ama faahfaahin dheeraad ah",lbl_name:"Magacaaga",lbl_phone:"Lambarka moobilka",lbl_city:"Magaalada",btn_send:"Hel qiimayaal",done_h:"Codsiga waa la diray",how_h:"Saddex tallaabo oo codsiga qaybta loogu helo qiime",cat_h:"Qaybaha iyo mashiinnada aad codsan karto",make_h:"Ku raadi soo saaraha",sup_h:"Ka iibso iibsadayaasha yaqaan waxa ay rabaan",faq_h:"Su'aalaha iibsadayaashu weydiiyaan",makePh:"Dooro soo saaraha",other:"Kale / kuma jiro liiska",yearPh:"Sannad kasta",cityPh:"Dooro magaalada",eMake:"Dooro soo saaraha ama dooro kale.",ePart:"Sheeg qaybta aad u baahan tahay.",eName:"Geli magacaaga.",ePhone:"Geli lambar moobil oo sax ah.",eCity:"Dooro magaaladaada.",eShop:"Geli magaca dukaanka ama shirkadda.",eCats:"Dooro ugu yaraan hal qayb.",c_used:"La isticmaalay",c_new:"Cusub",c_any:"Mid kasta",lbl_via:"Sidan igula soo xiriir",v_call:"Telefoon",fine:"Waxaad ka iibsanaysaa iibiyaha aad doorato. Iibsigu khasab ma aha.",done_id:"Lambarka codsiga",done_p:"Iibiyeyaasha haysta qaybta ayaa kula soo xiriiri doona.",done_wa:"Kooxdayada WhatsApp ugu dir",done_copy:"Nuqul ka samee codsiga",done_again:"Codsi cusub",st_cats:"Qaybaha qaybaha",st_makes:"Soo saarayaal la dooran karo",st_parts:"Qaybo caadi ah",st_free_v:"Bilaash",st_free_l:"in codsi la diro",s1_h:"Sheeg qaybta aad rabto",s2_h:"Iibiyeyaashu way kuu jawaabaan",s3_h:"Is barbar dhig oo iibso"}};
const D = {
  en:{makePh:"Select make",other:"Other / not listed",yearPh:"Any year",cityPh:"Select city",
      eMake:"Choose a make, or pick Other.",ePart:"Tell us which part you need.",eName:"Enter your name.",
      ePhone:"Enter a mobile number like 0911 23 45 67.",eCity:"Choose your city.",eShop:"Enter the shop or company name.",
      eCats:"Choose at least one category.",sending:"Sending…",btnSend:"Get prices",
      noReq:"No requests yet. New buyer requests will appear here.",copied:"Copied",
      lVehicle:"Vehicle",lPart:"Part",lCond:"Condition",lCity:"City",lContact:"Contact",
      reply:"Reply on WhatsApp",call:"Call",tg:"Telegram",req:"Request parts",
      Used:"Used",New:"New",Either:"Either",Phone:"Call"},
  am:{makePh:"አምራች ይምረጡ",other:"ሌላ / በዝርዝሩ የለም",yearPh:"ማንኛውም ዓመት",cityPh:"ከተማ ይምረጡ",
      eMake:"አምራች ይምረጡ ወይም “ሌላ” ይምረጡ።",ePart:"የሚፈልጉትን ዕቃ ይጻፉ።",eName:"ስምዎን ያስገቡ።",
      ePhone:"ሞባይል ቁጥር ያስገቡ፣ ለምሳሌ 0911 23 45 67።",eCity:"ከተማዎን ይምረጡ።",eShop:"የሱቁን ወይም የድርጅቱን ስም ያስገቡ።",
      eCats:"ቢያንስ አንድ ምድብ ይምረጡ።",sending:"በመላክ ላይ…",btnSend:"ዋጋ ጠይቅ",
      noReq:"እስካሁን ጥያቄ የለም። አዲስ የገዢ ጥያቄዎች እዚህ ይታያሉ።",copied:"ተቀድቷል",
      lVehicle:"ተሽከርካሪ",lPart:"ዕቃ",lCond:"ሁኔታ",lCity:"ከተማ",lContact:"መገናኛ",
      reply:"በዋትስአፕ መልስ",call:"ደውል",tg:"ቴሌግራም",req:"ዕቃ ጠይቅ",
      Used:"ያገለገለ",New:"አዲስ",Either:"ማንኛውም",Phone:"ስልክ ጥሪ"}
};

/* ====== HELPERS ====== */
const RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
function h(tag,attrs,...kids){
  const e=document.createElement(tag);
  for(const [k,v] of Object.entries(attrs||{})){
    if(k==="class") e.className=v; else if(k==="text") e.textContent=v; else e.setAttribute(k,v);
  }
  kids.flat().forEach(c=>e.append(c));
  return e;
}
function normPhone(v){
  let d=(v||"").replace(/[^\d]/g,"");
  if(d.startsWith("251")) d=d.slice(3); else if(d.startsWith("0")) d=d.slice(1);
  return /^[79]\d{8}$/.test(d) ? "251"+d : null;
}
function prettyPhone(p){ return "+"+p.slice(0,3)+" "+p.slice(3,5)+" "+p.slice(5,8)+" "+p.slice(8); }
function newId(){ return "MM-"+Date.now().toString(36).slice(-5).toUpperCase(); }
async function send(payload){
  const endpoint=payload.type==="supplier"?"/api/suppliers":"/api/requests";
  const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data.error||"Unable to submit right now.");
  return data;
}
function setErr(id,msg){
  const input=document.getElementById(id), e=document.getElementById("err-"+id);
  if(e) e.textContent=msg||"";
  if(input && input.setAttribute) input.setAttribute("aria-invalid",msg?"true":"false");
}

/* ====== STATE ====== */
let lang="en", cat="cars", lastReq=null;
try{ lang=localStorage.getItem("mm_lang")||"en"; }catch(_){}
if(!["en","am","ti","om","so"].includes(lang)) lang="en";
const t = k => EXTRA[lang]?.[k] || (D[lang] && D[lang][k]) || D.en[k] || k;
const CAT_LABELS = {cars:{en:"Cars & SUVs",am:"መኪናዎች",ti:"መካይን",om:"Konkolaataa fi SUV",so:"Baabuur iyo SUV"},trucks:{en:"Trucks & buses",am:"ከባድ መኪናዎችና አውቶቡሶች",ti:"ከበድቲ መካይንን ኣውቶቡሳትን",om:"Kamiyoottan fi otobusii",so:"Gaadiidka xamuulka iyo basaska"},heavy:{en:"Heavy equipment",am:"ከባድ ማሽኖች",ti:"ከበድቲ ማሽናት",om:"Meeshaalee ulfaatoo",so:"Qalabka culus"},farm:{en:"Farm machinery",am:"የእርሻ ማሽኖች",ti:"ናይ ሕርሻ ማሽናት",om:"Meeshaalee qonnaa",so:"Mashiinnada beeraha"},power:{en:"Generators & pumps",am:"ጄነሬተርና ፓምፖች",ti:"ጀነሬተራትን ፓምፕታትን",om:"Jenereetarii fi paampii",so:"Matoorrada korontada iyo bambooyinka"}};
const catName = c => CAT_LABELS[c]?.[lang] || CATS[c].en;
const ALL_MAKES=[...new Set(Object.values(CATS).flatMap(c=>c.makes))];
const ALL_PARTS=[...new Set(Object.values(CATS).flatMap(c=>c.parts))];

/* ====== FORM CONTROLS ====== */
function renderCatSeg(){
  const seg=$("#catSeg"); seg.innerHTML="";
  Object.keys(CATS).forEach(c=>{
    const input=h("input",{type:"radio",name:"cat",value:c}); if(c===cat) input.checked=true;
    input.addEventListener("change",()=>setCat(c));
    seg.append(h("label",{},input,h("span",{text:catName(c)})));
  });
}
function fillMakes(keep){
  const sel=$("#make"), prev=keep??sel.value;
  sel.innerHTML=""; sel.append(new Option(t("makePh"),""));
  CATS[cat].makes.forEach(m=>sel.append(new Option(m,m)));
  sel.append(new Option(t("other"),"Other"));
  if([...sel.options].some(o=>o.value===prev)) sel.value=prev;
}
function fillParts(){ const dl=$("#partList"); dl.innerHTML=""; CATS[cat].parts.forEach(p=>dl.append(new Option(p,p))); }
function fillModels(){ const dl=$("#modelList"); dl.innerHTML=""; (MODELS[$("#make").value]||[]).forEach(m=>dl.append(new Option(m,m))); }
function fillYears(){
  const sel=$("#year"), prev=sel.value; sel.innerHTML=""; sel.append(new Option(t("yearPh"),""));
  for(let y=2026;y>=1980;y--) sel.append(new Option(y,y));
  sel.value=prev;
}
function fillCities(sel){
  const prev=sel.value; sel.innerHTML=""; sel.append(new Option(t("cityPh"),""));
  CITIES.forEach(([en,am])=>sel.append(new Option(lang==="am"?am:en,en)));
  sel.value=prev;
}
function setCat(c){
  cat=c;
  $$("input[name=cat]").forEach(i=>{ i.checked=(i.value===c); });
  fillMakes(""); fillParts(); fillModels();
}
function renderQuick(){
  const box=$("#quickChips"); box.innerHTML="";
  QUICK.forEach(q=>{
    const b=h("button",{class:"chip",type:"button",text:lang==="am"?q.am:q.part});
    b.addEventListener("click",()=>{ setCat(q.cat); $("#part").value=q.part; goForm("#make"); });
    box.append(b);
  });
}
function renderCatList(){
  const ul=$("#catList"); ul.innerHTML="";
  Object.keys(CATS).forEach((c,i)=>{
    const ico=document.createElementNS("http://www.w3.org/2000/svg","svg");
    ico.setAttribute("viewBox","0 0 48 48"); ico.setAttribute("aria-hidden","true"); ico.innerHTML=ICONS[c];
    const b=h("button",{class:"btn btn-line btn-sm",type:"button",text:t("req")});
    b.addEventListener("click",()=>{ setCat(c); goForm("#make"); });
    ul.append(h("li",{class:"rv",style:"--d:"+(i*70)+"ms"},ico,h("h3",{text:catName(c)}),h("p",{text:CATS[c].ex[lang==="am"?"am":"en"]}),b));
  });
}
function renderMakeGroups(){
  const box=$("#makeGroups"); box.innerHTML="";
  Object.keys(CATS).forEach((c,i)=>{
    const wrap=h("div",{class:"chips"});
    CATS[c].makes.forEach(m=>{
      const b=h("button",{class:"chip",type:"button",text:m});
      b.addEventListener("click",()=>{ setCat(c); $("#make").value=m; fillModels(); goForm("#model"); });
      wrap.append(b);
    });
    box.append(h("div",{class:"rv",style:"--d:"+(i%2*100)+"ms"},h("h3",{text:catName(c)}),wrap));
  });
}
function renderMarquee(){
  const tr=$("#track"); tr.innerHTML="";
  for(let k=0;k<2;k++) ALL_MAKES.forEach(m=>tr.append(h("span",{text:m})));
}
function goForm(focusSel){
  if(!$("#done").hidden) resetForm();
  $("#request").scrollIntoView({block:"center"});
  setTimeout(()=>{ const f=$(focusSel); if(f) f.focus({preventScroll:true}); },450);
}

/* ====== ANIMATION HELPERS ====== */
function splitHeadline(){
  const el=$("#h1"); const text=el.textContent.trim();
  el.setAttribute("aria-label",text); el.textContent="";
  text.split(/\s+/).forEach((w,i)=>{
    const inner=h("span",{class:"wi",text:w,"aria-hidden":"true"});
    inner.style.animationDelay=(i*80+120)+"ms";
    el.append(h("span",{class:"w"},inner)," ");
  });
}
let twTimer;
function startTypewriter(){
  clearTimeout(twTimer);
  const el=$("#typed"), words=TW[lang==="am"?"am":"en"];
  if(RM){ el.textContent=words[0]; return; }
  let wi=0,ci=0,del=false;
  (function tick(){
    const w=words[wi]; ci+=del?-1:1; el.textContent=w.slice(0,ci);
    let delay=del?32:80;
    if(!del&&ci===w.length){ del=true; delay=1500; }
    else if(del&&ci===0){ del=false; wi=(wi+1)%words.length; delay=380; }
    twTimer=setTimeout(tick,delay);
  })();
}
let io=null;
function observeNew(){
  const els=$$(".rv:not([data-o])");
  if(RM||!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("in")); return; }
  if(!io) io=new IntersectionObserver(es=>es.forEach(en=>{
    if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
  }),{threshold:.12,rootMargin:"0px 0px -40px 0px"});
  els.forEach(e=>{ e.setAttribute("data-o","1"); io.observe(e); });
}
function initCounters(){
  const set=[["#cCats",Object.keys(CATS).length],["#cMakes",ALL_MAKES.length],["#cParts",ALL_PARTS.length]];
  set.forEach(([sel,to])=>{
    const el=$(sel); el.dataset.to=to;
    if(RM||!("IntersectionObserver" in window)){ el.textContent=to; return; }
    const o=new IntersectionObserver(es=>{
      if(!es[0].isIntersecting) return; o.disconnect();
      const t0=performance.now(), dur=1400;
      (function step(now){
        const p=Math.min((now-t0)/dur,1), e=1-Math.pow(1-p,3);
        el.textContent=Math.round(to*e);
        if(p<1) requestAnimationFrame(step);
      })(t0);
    },{threshold:.6});
    o.observe(el);
  });
}
function initSplash(){
  const s=$("#splash"); let seen=false;
  try{ seen=!!sessionStorage.getItem("mm_splash"); }catch(_){}
  if(!s) { document.body.classList.add("ready"); return; }
  if(RM||seen){ s.remove(); document.body.classList.add("ready"); return; }
  try{ sessionStorage.setItem("mm_splash","1"); }catch(_){}
  setTimeout(()=>{ s.classList.add("out"); document.body.classList.add("ready"); setTimeout(()=>s.remove(),700); },1900);
}
function initMotion(){
  // scroll progress + header state
  const top=$(".top"), prog=$("#prog");
  function onScroll(){
    const max=document.documentElement.scrollHeight-innerHeight;
    prog.style.transform="scaleX("+(max>0?Math.min(scrollY/max,1):0)+")";
    top.classList.toggle("scrolled",scrollY>12);
  }
  addEventListener("scroll",onScroll,{passive:true}); onScroll();
  // button ripple
  document.addEventListener("pointerdown",e=>{
    const b=e.target.closest&&e.target.closest(".btn"); if(!b||RM) return;
    const r=b.getBoundingClientRect(), d=Math.max(r.width,r.height)*2;
    const s=h("span",{class:"ripple"});
    s.style.cssText="width:"+d+"px;height:"+d+"px;left:"+(e.clientX-r.left-d/2)+"px;top:"+(e.clientY-r.top-d/2)+"px";
    b.append(s); setTimeout(()=>s.remove(),700);
  });
  if(RM||!FINE) return;
  // magnetic buttons
  document.addEventListener("pointermove",e=>{
    const b=e.target.closest&&e.target.closest(".btn-mag"); if(!b) return;
    const r=b.getBoundingClientRect();
    b.style.setProperty("--tx",((e.clientX-r.left-r.width/2)*.14).toFixed(1)+"px");
    b.style.setProperty("--ty",((e.clientY-r.top-r.height/2)*.22).toFixed(1)+"px");
  });
  document.addEventListener("pointerout",e=>{
    const b=e.target.closest&&e.target.closest(".btn-mag");
    if(b&&!b.contains(e.relatedTarget)){ b.style.removeProperty("--tx"); b.style.removeProperty("--ty"); }
  });
  // hero glow + parallax rings
  const hero=$("#hero");
  hero.addEventListener("pointermove",e=>{
    const r=hero.getBoundingClientRect();
    hero.style.setProperty("--mx",(e.clientX-r.left)+"px");
    hero.style.setProperty("--my",(e.clientY-r.top)+"px");
    hero.style.setProperty("--px",((e.clientX-r.left)/r.width-.5).toFixed(3));
    hero.style.setProperty("--py",((e.clientY-r.top)/r.height-.5).toFixed(3));
  });
}

/* ====== LANGUAGE ====== */
function applyLang(){
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach(el=>{
    if(!("en" in el.dataset)) el.dataset.en=el.textContent;
    el.textContent = (lang==="am" ? AM[el.dataset.i18n] : EXTRA[lang]?.[el.dataset.i18n]) || el.dataset.en;
  });
  $$("[data-i18n-ph]").forEach(el=>{
    if(!("en" in el.dataset)) el.dataset.en=el.getAttribute("placeholder")||"";
    el.setAttribute("placeholder",(lang==="am" ? AM[el.dataset.i18nPh] : EXTRA[lang]?.[el.dataset.i18nPh]) || el.dataset.en);
  });
  $("#langSelect").value = lang;
  splitHeadline(); startTypewriter();
  renderCatSeg(); fillMakes(); fillYears(); fillCities($("#city")); fillCities($("#sCity"));
  renderQuick(); renderCatList(); renderMakeGroups(); renderSupCats();
  document.title = lang==="am" ? "መኪና ማርኬት – በኢትዮጵያ የመኪናና ማሽን መለዋወጫ" : lang==="ti" ? "Mekina Market – መለዋወጢታት ኣብ ኢትዮጵያ" : lang==="om" ? "Mekina Market – Meeshaalee Itoophiyaa keessatti" : lang==="so" ? "Mekina Market – Qaybaha baabuurta ee Itoobiya" : "Mekina Market – Find vehicle and machine parts in Ethiopia";
  if($("#viewDlg").hasAttribute("open")) renderRequests();
  observeNew();
}
$("#langSelect").addEventListener("change",e=>{
  lang = e.target.value;
  try{ localStorage.setItem("mm_lang",lang); }catch(_){}
  applyLang();
  $$(".wi").forEach(w=>{ w.style.animationPlayState="running"; });
});

/* ====== SUBMIT A REQUEST ====== */
function reqText(r){
  return ["Mekina Market request "+r.id,
    "Part: "+r.part,
    "For: "+([r.make,r.model,r.year].filter(Boolean).join(" ")||"-")+" ("+CATS[r.category].en+")",
    "Condition: "+r.condition,
    r.notes?("Details: "+r.notes):null,
    "City: "+r.city,
    "Name: "+r.name,
    "Phone: +"+r.phone+" ("+r.contactVia+")"].filter(Boolean).join("\n");
}
function resetForm(){ $("#reqForm").hidden=false; $("#done").hidden=true; }
$("#make").addEventListener("change",fillModels);
$("#reqForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const v={
    make:$("#make").value, model:$("#model").value.trim(), year:$("#year").value,
    part:$("#part").value.trim(), notes:$("#notes").value.trim(),
    name:$("#name").value.trim(), phone:normPhone($("#phone").value), city:$("#city").value,
    cond:($("input[name=cond]:checked")||{}).value||"Either",
    via:($("input[name=via]:checked")||{}).value||"Phone call"
  };
  const errs={make:!v.make&&t("eMake"), part:!v.part&&t("ePart"), name:!v.name&&t("eName"), phone:!v.phone&&t("ePhone"), city:!v.city&&t("eCity")};
  Object.entries(errs).forEach(([k,m])=>setErr(k,m||""));
  const firstBad=Object.keys(errs).find(k=>errs[k]);
  if(firstBad){ document.getElementById(firstBad).focus(); return; }
  const btn=$("#sendBtn"); btn.disabled=true; btn.textContent=t("sending");
  const req={type:"request",id:newId(),createdAt:new Date().toISOString(),category:cat,make:v.make,model:v.model,year:v.year,
    part:v.part,condition:v.cond,notes:v.notes,name:v.name,phone:v.phone,city:v.city,contactVia:v.via,lang};
  let saved=false; try { const result=await send(req); req.id=result.id; saved=true; } catch(err) { alert(err.message); }
  btn.disabled=false; btn.textContent=t("btnSend");
  if(saved) showDone(req);
});
function showDone(r){
  lastReq=r;
  $("#doneId").textContent=r.id;
  const dl=$("#doneSummary"); dl.innerHTML="";
  [[t("lVehicle"),[r.make,r.model,r.year].filter(Boolean).join(" ")||"-"],
   [t("lPart"),r.part],[t("lCond"),t(r.condition)],[t("lCity"),r.city],
   [t("lContact"),prettyPhone(r.phone)+" · "+(r.contactVia==="Phone call"?t("Phone"):r.contactVia)]
  ].forEach(([k,val])=>dl.append(h("div",{},h("dt",{text:k}),h("dd",{text:val}))));
  const wa=$("#waTeam"); if(CONFIG.whatsapp){wa.href="https://wa.me/"+CONFIG.whatsapp+"?text="+encodeURIComponent(reqText(r));wa.hidden=false;}else{wa.hidden=true;}
  $("#reqForm").hidden=true;
  const done=$("#done"); done.hidden=false; done.focus({preventScroll:true});
  $("#request").scrollIntoView({block:"center"});
}
$("#copyReq").addEventListener("click",async()=>{
  if(!lastReq) return;
  const b=$("#copyReq"), old=b.textContent;
  try{ await navigator.clipboard.writeText(reqText(lastReq)); b.textContent=t("copied"); setTimeout(()=>{b.textContent=old;},1600); }catch(_){}
});
$("#again").addEventListener("click",()=>{
  $("#reqForm").reset(); $$("#reqForm [aria-invalid]").forEach(n=>n.setAttribute("aria-invalid","false"));
  setCat(cat); resetForm(); $("#make").focus();
});

/* ====== SUPPLIER SIGN-UP ====== */
function renderSupCats(){
  const box=$("#sCats"); const checked=$$("input",box).filter(i=>i.checked).map(i=>i.value);
  box.innerHTML="";
  Object.keys(CATS).forEach(c=>{
    const i=h("input",{type:"checkbox",value:c}); if(checked.includes(c)) i.checked=true;
    box.append(h("label",{},i,h("span",{text:catName(c)})));
  });
}
function openDlg(d){ if(typeof d.showModal==="function") d.showModal(); else d.setAttribute("open",""); }
$("#openSupplier").addEventListener("click",()=>openDlg($("#supDlg")));
$("#openSupplier2").addEventListener("click",()=>openDlg($("#supDlg")));
$("#fJoin").addEventListener("click",e=>{ e.preventDefault(); openDlg($("#supDlg")); });
$$("dialog").forEach(d=>{
  d.addEventListener("click",e=>{ if(e.target===d) d.close(); });
  $$("[data-close]",d).forEach(b=>b.addEventListener("click",()=>d.close()));
});
$("#supForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const v={shop:$("#sShop").value.trim(),name:$("#sName").value.trim(),phone:normPhone($("#sPhone").value),city:$("#sCity").value,
    cats:$$("#sCats input").filter(i=>i.checked).map(i=>i.value),makes:$("#sMakes").value.trim()};
  const errs={sShop:!v.shop&&t("eShop"),sName:!v.name&&t("eName"),sPhone:!v.phone&&t("ePhone"),sCity:!v.city&&t("eCity")};
  Object.entries(errs).forEach(([k,m])=>setErr(k,m||""));
  $("#err-sCats").textContent = v.cats.length?"":t("eCats");
  const bad=Object.keys(errs).find(k=>errs[k]);
  if(bad){ document.getElementById(bad).focus(); return; }
  if(!v.cats.length){ $("#sCats input").focus(); return; }
  const sup={type:"supplier",id:"SUP-"+newId().slice(3),createdAt:new Date().toISOString(),shop:v.shop,contact:v.name,phone:v.phone,city:v.city,categories:v.cats.join(", "),makes:v.makes};
  try { await send(sup); $("#supOk").hidden=false; $("#supForm").reset(); renderSupCats(); } catch(err) { alert(err.message); }
});

/* ====== SUPPLIER REQUEST LIST ====== */
async function adminHeaders(){
  let token=sessionStorage.getItem("mm_admin_token")||"";
  if(!token){ token=prompt("Admin access token"); if(!token) return null; sessionStorage.setItem("mm_admin_token",token); }
  return {Authorization:"Bearer "+token};
}
async function renderRequests(){
  const box=$("#reqList"); box.innerHTML="";
  const headers=await adminHeaders(); if(!headers) return;
  let list=[]; try { const res=await fetch("/api/admin/requests",{headers}); if(res.status===401){sessionStorage.removeItem("mm_admin_token");box.append(h("p",{class:"empty",text:"Access denied. Reopen the list and enter the correct admin token."}));return;} const data=await res.json(); list=data.requests||[]; } catch { box.append(h("p",{class:"empty",text:"Could not load requests."})); return; }
  $("#reqActions").hidden=!list.length;
  if(!list.length){ box.append(h("p",{class:"empty",text:t("noReq")})); return; }
  list.forEach(r=>{
    const veh=[r.make,r.model,r.year].filter(Boolean).join(" ");
    const reply="Hello "+r.name+", this is about your request "+r.id+" for "+r.part+(veh?" ("+veh+")":"")+" on Mekina Market.\nPrice: ETB ____\nCondition: ____\nIn stock: ____";
    box.append(h("div",{class:"reqrow"},
      h("h3",{text:r.part+(veh?" · "+veh:"")}),
      h("p",{text:r.id+" · "+t(r.condition)+" · "+r.city+" · "+r.name+" · +"+r.phone}),
      h("div",{class:"actions",style:"margin-top:0"},
        h("a",{class:"btn btn-sm",href:"https://wa.me/"+r.phone+"?text="+encodeURIComponent(reply),target:"_blank",rel:"noopener",text:t("reply")}),
        h("a",{class:"btn btn-ghost btn-sm",href:"tel:+"+r.phone,text:t("call")}),
        h("a",{class:"btn btn-ghost btn-sm",href:"https://t.me/+"+r.phone,target:"_blank",rel:"noopener",text:t("tg")})
      )));
  });
}
function openView(){ openDlg($("#viewDlg")); renderRequests(); }
$("#fView").addEventListener("click",e=>{ e.preventDefault(); openView(); });
$("#csvBtn").addEventListener("click",async()=>{
  const headers=await adminHeaders(); if(!headers) return;
  const res=await fetch("/api/admin/export.csv",{headers}); if(!res.ok){alert("Could not export requests.");return;}
  const a=h("a",{href:URL.createObjectURL(await res.blob()),download:"mekina-market-requests.csv"}); document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
});

/* ====== INIT ====== */
if(CONFIG.whatsapp) $("#fWa").href="https://wa.me/"+CONFIG.whatsapp; else $("#fWa").parentElement.hidden=true;
if(CONFIG.telegram) $("#fTg").href="https://t.me/"+CONFIG.telegram; else $("#fTg").parentElement.hidden=true;
if(CONFIG.email){$("#fMail").href="mailto:"+CONFIG.email; $("#fMail").textContent=CONFIG.email;}else $("#fMail").parentElement.hidden=true;

setCat("cars");
renderMarquee();
applyLang();
initCounters();
initMotion();
initSplash();
if(location.hash==="#supplier-view") openView();
})();