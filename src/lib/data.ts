// Demo content for pitching. Swap `company` and `properties` for the agency's real details.
// Videos and posters in /public/media are free stock clips from Mixkit (mixkit.co, free licence).
// Every visitor-facing string is a `Text` ({ sq, en }) so the site reads in Albanian or English.

import { T, type Lang, type Text } from "./i18n";

export const media = (file: string) => `/media/${file}`;

export const company = {
  name: "Prona & Co.",
  short: "Prona",
  tagline: T("Agjenci imobiliare · Tiranë", "Real estate agency · Tirana"),
  phone: "+355 xx xxx xxxx",
  phoneHref: "tel:+355xxxxxxxxx",
  whatsapp: "xxx",
  email: "test@gmail.com",
  address: "Rruga Ismail Qemali, Blloku, Tiranë 1019",
  coords: { lat: 41.3189, lng: 19.8148 },
  hours: [
    { days: T("E hënë – E premte", "Monday – Friday"), time: T("09:00 – 19:00", "09:00 – 19:00") },
    { days: T("E shtunë", "Saturday"), time: T("10:00 – 15:00", "10:00 – 15:00") },
    { days: T("E diel", "Sunday"), time: T("Me takim", "By appointment") },
  ],
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  founded: 2014,
};

export const whatsappLink = (text: string) => `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;

/** A photo, or a muted looping video with its poster frame. */
export type Media = { image: string; video?: string };

const clip = (name: string): Media => ({ image: media(`${name}.jpg`), video: media(`${name}.mp4`) });

export type Purpose = "shitje" | "qira";
export type PropertyType = "Apartament" | "Penthouse" | "Vilë" | "Zyrë";

export const purposeLabels: Record<Purpose, Text> = {
  shitje: T("Në shitje", "For sale"),
  qira: T("Me qira", "For rent"),
};

export const typeLabels: Record<PropertyType, Text> = {
  Apartament: T("Apartament", "Apartment"),
  Penthouse: T("Penthouse", "Penthouse"),
  Vilë: T("Vilë", "Villa"),
  Zyrë: T("Zyrë", "Office"),
};

export type Property = {
  slug: string;
  ref: string;
  title: Text;
  zone: ZoneKey;
  purpose: Purpose;
  type: PropertyType;
  /** Euro; monthly when purpose is "qira". */
  price: number;
  area: number;
  /** Albanian layout notation, e.g. "2+1". */
  layout: string;
  bedrooms: number;
  bathrooms: number;
  floor?: string;
  year: number;
  land?: number;
  featured?: boolean;
  tag?: Text;
  cover: Media;
  gallery: Media[];
  summary: Text;
  description: Text[];
  features: Text[];
  agent: AgentKey;
};

export type ZoneKey =
  | "blloku"
  | "komuna-parisit"
  | "tirana-re"
  | "liqeni"
  | "qender"
  | "kodra-diellit"
  | "farke"
  | "lunder"
  | "sauk"
  | "petrele"
  | "golem";

export type Zone = { key: ZoneKey; name: Text; blurb: Text; lat: number; lng: number; image: string };

export const zones: Zone[] = [
  { key: "blloku", name: T("Blloku", "Blloku"), blurb: T("Kafene, jetë nate dhe adresat më të kërkuara", "Cafés, nightlife and the most sought-after addresses"), lat: 41.3189, lng: 19.8148, image: media("master-bedroom.jpg") },
  { key: "komuna-parisit", name: T("Komuna e Parisit", "Komuna e Parisit"), blurb: T("Familjare, e gjelbër, afër shkollave", "Family-friendly, green, close to schools"), lat: 41.317, lng: 19.799, image: media("kitchen.jpg") },
  { key: "tirana-re", name: T("Tirana e Re", "New Tirana"), blurb: T("Bulevarde të qeta pranë Parkut të Liqenit", "Quiet boulevards by the Lake Park"), lat: 41.315, lng: 19.812, image: media("minimal-room.jpg") },
  { key: "liqeni", name: T("Liqeni Artificial", "Grand Park Lake"), blurb: T("Pamje nga parku, ajër i pastër, rezidenca të reja", "Park views, clean air, new residences"), lat: 41.311, lng: 19.817, image: media("terrace-suite.jpg") },
  { key: "qender", name: T("Qendër", "City Centre"), blurb: T("Sheshi Skënderbej në këmbë, zyra dhe studio", "Walk to Skanderbeg Square, offices and studios"), lat: 41.3275, lng: 19.8187, image: media("office-tower.jpg") },
  { key: "kodra-diellit", name: T("Kodra e Diellit", "Kodra e Diellit"), blurb: T("Komplekse të mbyllura me pishinë dhe siguri 24/7", "Gated complexes with pools and 24/7 security"), lat: 41.2995, lng: 19.842, image: media("indoor-pool.jpg") },
  { key: "farke", name: T("Farkë", "Farkë"), blurb: T("Vila buzë liqenit, 10 minuta nga qendra", "Lakeside villas, 10 minutes from the centre"), lat: 41.289, lng: 19.865, image: media("garden-villa.jpg") },
  { key: "lunder", name: T("Lundër", "Lundër"), blurb: T("Vila në komplekse me gjelbërim", "Villas in leafy complexes"), lat: 41.293, lng: 19.86, image: media("edge-houses.jpg") },
  { key: "sauk", name: T("Sauk", "Sauk"), blurb: T("Kodra, oborre të mëdha dhe qetësi", "Hills, big gardens and quiet"), lat: 41.292, lng: 19.845, image: media("pool-villa.jpg") },
  { key: "petrele", name: T("Petrelë", "Petrelë"), blurb: T("Ullishte dhe pamje mbi Tiranën", "Olive groves and views over Tirana"), lat: 41.263, lng: 19.875, image: media("manor-house.jpg") },
  { key: "golem", name: T("Golem, Durrës", "Golem, Durrës"), blurb: T("Bregdeti, 40 minuta nga Tirana", "The coast, 40 minutes from Tirana"), lat: 41.244, lng: 19.516, image: media("beach-villa.jpg") },
];

export const zoneByKey = Object.fromEntries(zones.map((z) => [z.key, z])) as Record<ZoneKey, Zone>;

export type AgentKey = "elira" | "arben" | "sara";

export const agents: Record<AgentKey, { name: string; role: Text; phone: string; whatsapp: string; initials: string }> = {
  elira: { name: "Elira Hoxha", role: T("Agjente e lartë · Shitje", "Senior agent · Sales"), phone: "+355 xx xxx xxxx", whatsapp: "xxx", initials: "EH" },
  arben: { name: "Arben Kola", role: T("Vila & prona luksoze", "Villas & luxury homes"), phone: "+355 xx xxx xxxx", whatsapp: "xxx", initials: "AK" },
  sara: { name: "Sara Dervishi", role: T("Qira & zyra", "Rentals & offices"), phone: "+355 xx xxx xxxx", whatsapp: "xxx", initials: "SD" },
};

export const properties: Property[] = [
  {
    slug: "penthouse-blloku-tarrace-panoramike",
    ref: "PC-1042",
    title: T("Penthouse me tarracë panoramike", "Penthouse with panoramic terrace"),
    zone: "blloku",
    purpose: "shitje",
    type: "Penthouse",
    price: 685000,
    area: 210,
    layout: "3+1",
    bedrooms: 3,
    bathrooms: 3,
    floor: "12 / 12",
    year: 2023,
    featured: true,
    tag: T("Ekskluzive", "Exclusive"),
    cover: clip("master-bedroom"),
    gallery: [clip("living-room"), clip("kitchen"), clip("closet")],
    summary: T(
      "Kati i fundit mbi Bllok, me 60 m² tarracë dhe pamje nga Dajti deri te Liqeni.",
      "The top floor above Blloku, with a 60 m² terrace and views from Mount Dajti to the Lake.",
    ),
    description: [
      T(
        "Një nga penthouse-t e rralla në zemër të Bllokut, në një ndërtim të ri të përfunduar në 2023. Hapësira e ditës është e hapur, me xhama nga dyshemeja në tavan që dalin drejt në tarracën 60 m².",
        "One of the rare penthouses in the heart of Blloku, in a new building completed in 2023. The living area is open-plan, with floor-to-ceiling glass opening straight onto the 60 m² terrace.",
      ),
      T(
        "Tre dhoma gjumi me banjo më vete, garderobë e veshur në dhomën kryesore dhe kuzhinë e pajisur me elektroshtëpiake Miele. Dy vende parkimi në garazh dhe depo në nëntokë janë të përfshira në çmim.",
        "Three en-suite bedrooms, a fitted walk-in wardrobe in the master and a kitchen equipped with Miele appliances. Two garage parking spaces and a basement storage room are included in the price.",
      ),
    ],
    features: [
      T("Tarracë 60 m²", "60 m² terrace"),
      T("2 vende parkimi", "2 parking spaces"),
      T("Ngrohje qendrore me dysheme", "Underfloor heating"),
      T("Ashensor direkt në apartament", "Lift straight into the flat"),
      T("Dokumentacion i plotë (AMTP)", "Full title deeds (AMTP)"),
      T("Kuzhinë Miele", "Miele kitchen"),
    ],
    agent: "elira",
  },
  {
    slug: "vile-moderne-me-pishine-farke",
    ref: "PC-1038",
    title: T("Vilë moderne me pishinë dhe kopsht", "Modern villa with pool and garden"),
    zone: "farke",
    purpose: "shitje",
    type: "Vilë",
    price: 890000,
    area: 420,
    layout: "5+1",
    bedrooms: 5,
    bathrooms: 4,
    year: 2021,
    land: 950,
    featured: true,
    tag: T("E re në treg", "New on the market"),
    cover: clip("garden-villa"),
    gallery: [clip("pool-villa"), clip("kitchen"), clip("terrace-suite")],
    summary: T(
      "Kopsht mesdhetar, pishinë 12 m dhe veranda e mbuluar, 10 minuta nga Liqeni i Farkës.",
      "A Mediterranean garden, 12 m pool and covered veranda, 10 minutes from Farka Lake.",
    ),
    description: [
      T(
        "Vilë dykatëshe e ndërtuar në 2021, e vendosur në një truall 950 m² me kopsht të mirëmbajtur, ullinj dhe pishinë 12 × 4 m. Kati i parë hapet tërësisht drejt verandës dhe kopshtit.",
        "A two-storey villa built in 2021 on a 950 m² plot with a well-kept garden, olive trees and a 12 × 4 m pool. The ground floor opens fully onto the veranda and garden.",
      ),
      T(
        "Pesë dhoma gjumi, studio pune, bodrum me kantinë vere dhe garazh për dy makina. Rruga është e asfaltuar deri te porta dhe zona ka ndriçim publik dhe ujë 24 orë.",
        "Five bedrooms, a study, a basement with wine cellar and a two-car garage. The road is paved to the gate and the area has street lighting and 24-hour water.",
      ),
    ],
    features: [
      T("Pishinë 12 × 4 m", "12 × 4 m pool"),
      T("Truall 950 m²", "950 m² plot"),
      T("Garazh për 2 makina", "Two-car garage"),
      T("Panele diellore", "Solar panels"),
      T("Sistem alarmi & kamera", "Alarm & CCTV"),
      T("Hipotekë e lirë", "Mortgage-free"),
    ],
    agent: "arben",
  },
  {
    slug: "apartament-2-1-komuna-parisit",
    ref: "PC-1051",
    title: T("Apartament 2+1 i rikonstruktuar", "Renovated 2-bedroom apartment"),
    zone: "komuna-parisit",
    purpose: "shitje",
    type: "Apartament",
    price: 265000,
    area: 108,
    layout: "2+1",
    bedrooms: 2,
    bathrooms: 2,
    floor: "6 / 9",
    year: 2016,
    featured: true,
    cover: clip("kitchen"),
    gallery: [clip("living-room"), clip("master-bedroom")],
    summary: T(
      "Rikonstruksion i plotë në 2025, kuzhinë e hapur me ishull dhe dy ballkone.",
      "Fully renovated in 2025, open kitchen with an island and two balconies.",
    ),
    description: [
      T(
        "Apartament i ndriçuar me orientim lindje–perëndim, i rikonstruktuar plotësisht në 2025 me materiale cilësore: parket lisi, dritare alumini me xham të trefishtë dhe kuzhinë me ishull.",
        "A bright east–west apartment, fully renovated in 2025 with quality materials: oak parquet, triple-glazed aluminium windows and a kitchen island.",
      ),
      T(
        "Dy dhoma gjumi, dy banjo dhe dy ballkone. Pallati ka ashensor të ri dhe është 3 minuta në këmbë nga Parku i Komunës së Parisit dhe shkollat e zonës.",
        "Two bedrooms, two bathrooms and two balconies. The building has a new lift and is a 3-minute walk from Komuna e Parisit park and the local schools.",
      ),
    ],
    features: [
      T("Rikonstruksion 2025", "Renovated 2025"),
      T("2 ballkone", "2 balconies"),
      T("Xham i trefishtë", "Triple glazing"),
      T("Kondicionerë inverter", "Inverter air-con"),
      T("Afër shkollave", "Near schools"),
      T("Gati për banim", "Ready to move in"),
    ],
    agent: "elira",
  },
  {
    slug: "dupleks-me-pishine-kodra-diellit",
    ref: "PC-1029",
    title: T("Dupleks me pishinë të brendshme", "Duplex with indoor pool"),
    zone: "kodra-diellit",
    purpose: "shitje",
    type: "Penthouse",
    price: 1150000,
    area: 320,
    layout: "4+1",
    bedrooms: 4,
    bathrooms: 4,
    floor: "9–10 / 10",
    year: 2022,
    featured: true,
    tag: T("Luksoze", "Luxury"),
    cover: clip("indoor-pool"),
    gallery: [clip("living-room"), clip("hotel-stairs"), clip("master-bedroom")],
    summary: T(
      "Dy kate në majë të kompleksit, pishinë e brendshme dhe pamje 270° mbi qytetin.",
      "Two floors at the top of the complex, an indoor pool and 270° views over the city.",
    ),
    description: [
      T(
        "Dupleks unik në kompleksin rezidencial të Kodrës së Diellit, me pishinë të brendshme të ngrohur, spa dhe xhama panoramikë në tre anë.",
        "A one-of-a-kind duplex in the Kodra e Diellit residential complex, with a heated indoor pool, spa and panoramic glazing on three sides.",
      ),
      T(
        "Kompleksi ofron siguri 24/7, palestër, kënd lojërash dhe shkollë ndërkombëtare në afërsi. Shitet i mobiluar me mobilie italiane.",
        "The complex offers 24/7 security, a gym, a playground and an international school nearby. Sold furnished with Italian furniture.",
      ),
    ],
    features: [
      T("Pishinë e ngrohur", "Heated pool"),
      T("Pamje 270°", "270° views"),
      T("Siguri 24/7", "24/7 security"),
      T("I mobiluar", "Furnished"),
      T("3 vende parkimi", "3 parking spaces"),
      T("Shtëpi inteligjente", "Smart home"),
    ],
    agent: "arben",
  },
  {
    slug: "apartament-3-1-liqeni-artificial",
    ref: "PC-1047",
    title: T("Apartament 3+1 me pamje nga Liqeni", "3-bedroom apartment with lake views"),
    zone: "liqeni",
    purpose: "shitje",
    type: "Apartament",
    price: 410000,
    area: 145,
    layout: "3+1",
    bedrooms: 3,
    bathrooms: 2,
    floor: "8 / 14",
    year: 2020,
    cover: clip("terrace-suite"),
    gallery: [clip("living-room"), clip("kitchen")],
    summary: T("Ballkon 18 m² mbi parkun, 2 minuta nga shëtitorja e Liqenit.", "An 18 m² balcony over the park, 2 minutes from the lakeside promenade."),
    description: [
      T(
        "Apartament i gjerë me sallon 40 m² dhe ballkon të gjatë me pamje direkt nga Parku i Liqenit. Ndërtim 2020 me izolim termik dhe ashensorë të shpejtë.",
        "A spacious apartment with a 40 m² living room and a long balcony looking straight onto the Lake Park. Built in 2020 with thermal insulation and fast lifts.",
      ),
      T(
        "Tre dhoma gjumi, dy banjo, depo dhe vend parkimi i përfshirë. Ideal për familje që duan qetësinë e parkut pa u larguar nga qyteti.",
        "Three bedrooms, two bathrooms, storage and a parking space included. Ideal for families who want the calm of the park without leaving the city.",
      ),
    ],
    features: [
      T("Pamje nga parku", "Park views"),
      T("Ballkon 18 m²", "18 m² balcony"),
      T("Parkim i përfshirë", "Parking included"),
      T("Depo", "Storage room"),
      T("Izolim termik", "Thermal insulation"),
      T("Portier", "Concierge"),
    ],
    agent: "elira",
  },
  {
    slug: "vile-me-ullishte-petrele",
    ref: "PC-1019",
    title: T("Vilë me ullishte në kodrat e Petrelës", "Villa with olive grove in the Petrelë hills"),
    zone: "petrele",
    purpose: "shitje",
    type: "Vilë",
    price: 540000,
    area: 280,
    layout: "4+1",
    bedrooms: 4,
    bathrooms: 3,
    year: 2018,
    land: 6000,
    cover: clip("manor-house"),
    gallery: [clip("pool-villa"), clip("terrace-suite")],
    summary: T("6,000 m² tokë me 120 rrënjë ulliri dhe pamje mbi të gjithë Tiranën.", "6,000 m² of land with 120 olive trees and views over all of Tirana."),
    description: [
      T(
        "Vilë guri e restauruar me kujdes, në majë të një kodre në Petrelë. Toka prej 6,000 m² ka 120 rrënjë ulliri në prodhim dhe vresht të vogël.",
        "A carefully restored stone villa on a hilltop in Petrelë. The 6,000 m² of land has 120 producing olive trees and a small vineyard.",
      ),
      T(
        "Ideale si shtëpi familjare, agroturizëm ose bujtinë. 20 minuta nga qendra e Tiranës dhe 30 minuta nga aeroporti.",
        "Ideal as a family home, agritourism venture or guesthouse. 20 minutes from central Tirana and 30 minutes from the airport.",
      ),
    ],
    features: [
      T("Tokë 6,000 m²", "6,000 m² of land"),
      T("120 rrënjë ulliri", "120 olive trees"),
      T("Pus uji", "Water well"),
      T("Oxhak druri", "Wood fireplace"),
      T("Potencial agroturizmi", "Agritourism potential"),
      T("Pamje mbi Tiranën", "Views over Tirana"),
    ],
    agent: "arben",
  },
  {
    slug: "vile-buze-detit-golem",
    ref: "PC-1033",
    title: T("Vilë moderne buzë detit", "Modern beachfront villa"),
    zone: "golem",
    purpose: "shitje",
    type: "Vilë",
    price: 720000,
    area: 260,
    layout: "4+1",
    bedrooms: 4,
    bathrooms: 3,
    year: 2022,
    land: 600,
    tag: T("Bregdet", "Coastal"),
    cover: clip("beach-villa"),
    gallery: [clip("pool-villa"), clip("studio-white")],
    summary: T("Arkitekturë minimaliste, 80 metra nga rëra dhe tarracë mbi çati.", "Minimalist architecture, 80 metres from the sand, with a rooftop terrace."),
    description: [
      T(
        "Vilë bashkëkohore me fasadë druri dhe beton të lëmuar, 80 metra nga plazhi i Golemit. Tarraca mbi çati ka pamje nga deti dhe perëndimi i diellit.",
        "A contemporary villa with a timber and polished-concrete façade, 80 metres from Golem beach. The rooftop terrace looks out to sea and the sunset.",
      ),
      T(
        "Katër dhoma gjumi, kuzhinë e hapur dhe garazh. Mund të shitet bashkë me licencën për qira afatshkurtër.",
        "Four bedrooms, an open kitchen and a garage. Can be sold together with its short-term rental licence.",
      ),
    ],
    features: [
      T("80 m nga plazhi", "80 m from the beach"),
      T("Tarracë mbi çati", "Rooftop terrace"),
      T("Garazh", "Garage"),
      T("Gati për Airbnb", "Airbnb-ready"),
      T("Kopsht 600 m²", "600 m² garden"),
      T("Kondicionim qendror", "Central air-con"),
    ],
    agent: "arben",
  },
  {
    slug: "vile-dykateshe-lunder",
    ref: "PC-1055",
    title: T("Vilë dykatëshe në kompleks të mbyllur", "Two-storey villa in a gated complex"),
    zone: "lunder",
    purpose: "shitje",
    type: "Vilë",
    price: 460000,
    area: 230,
    layout: "4+1",
    bedrooms: 4,
    bathrooms: 3,
    year: 2024,
    land: 400,
    cover: clip("edge-houses"),
    gallery: [clip("kitchen"), clip("master-bedroom")],
    summary: T(
      "Ndërtim 2024 në kompleks me roje, kopsht privat dhe dy vende parkimi.",
      "Built in 2024 in a guarded complex, with a private garden and two parking spaces.",
    ),
    description: [
      T(
        "Vilë e re në një kompleks të mbyllur në Lundër, me rrugë të brendshme, ndriçim dhe roje 24 orë. Kopshti privat 400 m² është i rrethuar dhe i gjelbëruar.",
        "A new villa in a gated complex in Lundër, with private roads, lighting and 24-hour guards. The 400 m² private garden is fenced and landscaped.",
      ),
      T(
        "Planimetri praktike: dita në katin përdhes, katër dhoma gjumi lart. Dorëzohet e përfunduar plotësisht.",
        "A practical layout: living spaces on the ground floor, four bedrooms upstairs. Handed over fully finished.",
      ),
    ],
    features: [
      T("Ndërtim 2024", "Built 2024"),
      T("Kompleks me roje", "Guarded complex"),
      T("Kopsht 400 m²", "400 m² garden"),
      T("2 vende parkimi", "2 parking spaces"),
      T("Dorëzim i menjëhershëm", "Immediate handover"),
      T("Hipotekë e mundshme", "Mortgage available"),
    ],
    agent: "arben",
  },
  {
    slug: "vile-me-pishine-sauk",
    ref: "PC-1060",
    title: T("Vilë mesdhetare me pishinë", "Mediterranean villa with pool"),
    zone: "sauk",
    purpose: "qira",
    type: "Vilë",
    price: 4200,
    area: 350,
    layout: "5+1",
    bedrooms: 5,
    bathrooms: 4,
    year: 2017,
    land: 1200,
    cover: clip("pool-villa"),
    gallery: [clip("garden-villa"), clip("terrace-suite")],
    summary: T(
      "E mobiluar plotësisht, ideale për familje diplomatike ose rezidencë ambasade.",
      "Fully furnished, ideal for a diplomatic family or an embassy residence.",
    ),
    description: [
      T(
        "Vilë e gjerë me pishinë, pergola dhe kopsht 1,200 m² në zonën e qetë të Saukut, pranë shkollave ndërkombëtare.",
        "A spacious villa with a pool, pergola and 1,200 m² garden in quiet Sauk, close to the international schools.",
      ),
      T(
        "Jepet me qira e mobiluar, me mirëmbajtje të kopshtit dhe pishinës të përfshira. Kontratë minimumi 12 muaj.",
        "Let furnished, with garden and pool maintenance included. Minimum 12-month contract.",
      ),
    ],
    features: [
      T("Pishinë", "Pool"),
      T("E mobiluar", "Furnished"),
      T("Mirëmbajtje e përfshirë", "Maintenance included"),
      T("Afër shkollave ndërkombëtare", "Near international schools"),
      T("Kontratë 12+ muaj", "12+ month contract"),
      T("Gjenerator", "Generator"),
    ],
    agent: "sara",
  },
  {
    slug: "apartament-penthouse-blloku-qira",
    ref: "PC-1063",
    title: T("Apartament 2+1 me tarracë në Bllok", "2-bedroom flat with terrace in Blloku"),
    zone: "blloku",
    purpose: "qira",
    type: "Apartament",
    price: 1400,
    area: 115,
    layout: "2+1",
    bedrooms: 2,
    bathrooms: 2,
    floor: "7 / 8",
    year: 2019,
    featured: true,
    cover: clip("terrace-room"),
    gallery: [clip("living-room"), clip("kitchen")],
    summary: T("I mobiluar me shije, tarracë 25 m² dhe pamje nga Piramida.", "Tastefully furnished, with a 25 m² terrace and views of the Pyramid."),
    description: [
      T(
        "Apartament me qira në rrugën më të gjallë të Bllokut, i mobiluar plotësisht dhe gati për t'u banuar. Tarraca 25 m² ka pamje nga Piramida dhe Bulevardi.",
        "A rental on Blloku's liveliest street, fully furnished and ready to move into. The 25 m² terrace overlooks the Pyramid and the Boulevard.",
      ),
      T(
        "Dy dhoma gjumi, dy banjo, makinë larëse dhe tharëse. Lejohen kafshët shtëpiake.",
        "Two bedrooms, two bathrooms, washing machine and dryer. Pets allowed.",
      ),
    ],
    features: [
      T("I mobiluar", "Furnished"),
      T("Tarracë 25 m²", "25 m² terrace"),
      T("Lejohen kafshët", "Pets allowed"),
      T("Internet fibër", "Fibre internet"),
      T("Ngrohje qendrore", "Central heating"),
      T("Kontratë fleksibël", "Flexible contract"),
    ],
    agent: "sara",
  },
  {
    slug: "studio-e-mobiluar-qender",
    ref: "PC-1066",
    title: T("Studio e mobiluar në qendër", "Furnished studio in the centre"),
    zone: "qender",
    purpose: "qira",
    type: "Apartament",
    price: 650,
    area: 48,
    layout: "1+0",
    bedrooms: 1,
    bathrooms: 1,
    floor: "4 / 10",
    year: 2018,
    cover: clip("studio-white"),
    gallery: [clip("minimal-room")],
    summary: T("5 minuta nga Sheshi Skënderbej, ideale për profesionistë.", "5 minutes from Skanderbeg Square, ideal for professionals."),
    description: [
      T(
        "Studio moderne e mobiluar, me kuzhinë të pajisur dhe ballkon. Ndërtesa ka ashensor dhe portier.",
        "A modern furnished studio with an equipped kitchen and balcony. The building has a lift and concierge.",
      ),
      T(
        "Shpenzimet e pallatit janë të përfshira në qira. Ideale për profesionistë ose studentë master.",
        "Building fees are included in the rent. Ideal for professionals or postgraduate students.",
      ),
    ],
    features: [
      T("I mobiluar", "Furnished"),
      T("Ballkon", "Balcony"),
      T("Shpenzimet e përfshira", "Bills included"),
      T("Portier", "Concierge"),
      T("Afër Sheshit", "Near the Square"),
      T("Gati për banim", "Ready to move in"),
    ],
    agent: "sara",
  },
  {
    slug: "apartament-1-1-tirana-e-re",
    ref: "PC-1068",
    title: T("Apartament 1+1 modern në Tiranën e Re", "Modern 1-bedroom flat in New Tirana"),
    zone: "tirana-re",
    purpose: "qira",
    type: "Apartament",
    price: 850,
    area: 68,
    layout: "1+1",
    bedrooms: 1,
    bathrooms: 1,
    floor: "5 / 9",
    year: 2021,
    cover: clip("minimal-room"),
    gallery: [clip("studio-white"), clip("kitchen")],
    summary: T(
      "Dizajn minimalist, dritare të mëdha dhe 3 minuta nga Parku i Liqenit.",
      "Minimalist design, large windows and 3 minutes from the Lake Park.",
    ),
    description: [
      T(
        "Apartament 1+1 i mobiluar në stil minimalist, me dritare nga dyshemeja në tavan dhe kuzhinë të hapur.",
        "A furnished one-bedroom flat in a minimalist style, with floor-to-ceiling windows and an open kitchen.",
      ),
      T(
        "Pallat i ri me ashensor, garazh opsional dhe 3 minuta në këmbë nga hyrja e Parkut të Liqenit.",
        "A new building with a lift, optional garage and a 3-minute walk to the Lake Park entrance.",
      ),
    ],
    features: [
      T("I mobiluar", "Furnished"),
      T("Ndërtim 2021", "Built 2021"),
      T("Garazh opsional", "Optional garage"),
      T("Afër parkut", "Near the park"),
      T("Kondicioner inverter", "Inverter air-con"),
      T("Kontratë 6+ muaj", "6+ month contract"),
    ],
    agent: "sara",
  },
  {
    slug: "zyre-ne-kulle-biznesi-qender",
    ref: "PC-1070",
    title: T("Zyrë në kullë biznesi", "Office in a business tower"),
    zone: "qender",
    purpose: "qira",
    type: "Zyrë",
    price: 3200,
    area: 180,
    layout: "Open space",
    bedrooms: 0,
    bathrooms: 2,
    floor: "14 / 22",
    year: 2020,
    tag: T("Biznes", "Business"),
    cover: clip("office-tower"),
    gallery: [clip("hotel-stairs")],
    summary: T(
      "Open space 180 m², sallë mbledhjesh dhe pamje mbi Bulevardin.",
      "180 m² open-plan space, a meeting room and views over the Boulevard.",
    ),
    description: [
      T(
        "Zyrë klasi A në një nga kullat më të reja të qendrës, me open space, sallë mbledhjesh dhe kuzhinë stafi.",
        "A Grade A office in one of the centre's newest towers, with open-plan space, a meeting room and a staff kitchen.",
      ),
      T(
        "Recepsion 24 orë, parkim nëntokësor dhe fibër optike e dedikuar. Gati për t'u përdorur.",
        "24-hour reception, underground parking and dedicated fibre. Ready to use.",
      ),
    ],
    features: [
      T("Klasi A", "Grade A"),
      T("Sallë mbledhjesh", "Meeting room"),
      T("Parkim nëntokësor", "Underground parking"),
      T("Recepsion 24h", "24h reception"),
      T("Fibër e dedikuar", "Dedicated fibre"),
      T("Gati për përdorim", "Ready to use"),
    ],
    agent: "sara",
  },
];

export const propertyBySlug = (slug: string) => properties.find((p) => p.slug === slug);

const numberFormats: Record<Lang, Intl.NumberFormat> = {
  sq: new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }),
  en: new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }),
};

export const formatNumber = (n: number, lang: Lang) => numberFormats[lang].format(Math.round(n));

export const formatEuro = (n: number, lang: Lang) => `${formatNumber(n, lang)} €`;

export const formatPrice = (p: Pick<Property, "price" | "purpose">, lang: Lang) =>
  `${formatEuro(p.price, lang)}${p.purpose === "qira" ? (lang === "en" ? " / month" : " / muaj") : ""}`;

export const propertyTypes: PropertyType[] = ["Apartament", "Penthouse", "Vilë", "Zyrë"];

export const showreel = media("hero-city.mp4");

export const services = [
  {
    title: T("Blerje", "Buying"),
    text: T(
      "Ju dërgojmë vetëm prona të verifikuara që përputhen me buxhetin dhe stilin tuaj — me video tour para çdo vizite.",
      "We only send you verified homes that match your budget and style — with a video tour before every viewing.",
    ),
  },
  {
    title: T("Shitje", "Selling"),
    text: T(
      "Fotografi profesionale, video me dron dhe publikim në të gjitha portalet. Shesim më shpejt, me çmimin e duhur.",
      "Professional photography, drone video and listings on every portal. We sell faster, at the right price.",
    ),
  },
  {
    title: T("Qira", "Renting"),
    text: T(
      "Gjejmë qiramarrës të besueshëm, hartojmë kontratën dhe kujdesemi për dorëzimin e pronës.",
      "We find reliable tenants, draft the contract and take care of the handover.",
    ),
  },
  {
    title: T("Vlerësim falas", "Free valuation"),
    text: T(
      "Vlerësim i pronës brenda 48 orëve, bazuar në shitjet reale të zonës — jo në hamendësime.",
      "A valuation within 48 hours, based on real sales in your area — not guesswork.",
    ),
  },
  {
    title: T("Asistencë ligjore", "Legal support"),
    text: T(
      "Kontrollojmë dokumentacionin në ASHK, hipotekat dhe ju shoqërojmë deri te noteri.",
      "We check the title at the land registry (ASHK) and any mortgages, and go with you all the way to the notary.",
    ),
  },
  {
    title: T("Menaxhim prone", "Property management"),
    text: T(
      "Për pronarët jashtë vendit: mirëmbajtje, pagesa, qiramarrës dhe raport mujor me foto.",
      "For owners living abroad: upkeep, payments, tenants and a monthly report with photos.",
    ),
  },
];

export const stats = [
  { value: 12, suffix: "", label: T("vite në tregun e Tiranës", "years in the Tirana market") },
  { value: 850, suffix: "+", label: T("prona të shitura dhe dhëna me qira", "homes sold and let") },
  { value: 48, suffix: "h", label: T("për një vlerësim falas", "for a free valuation") },
  { value: 98, suffix: "%", label: T("klientë që na rekomandojnë", "of clients recommend us") },
];

export const steps = [
  {
    title: T("Na tregoni çfarë kërkoni", "Tell us what you need"),
    text: T(
      "Një telefonatë ose mesazh në WhatsApp — zonën, buxhetin dhe çfarë ka rëndësi për ju.",
      "A call or a WhatsApp message — the area, your budget and what matters to you.",
    ),
  },
  {
    title: T("Shikoni pronat në video", "Watch the homes on video"),
    text: T(
      "Ju dërgojmë video tour për çdo pronë, që të vizitoni vetëm ato që ju pëlqejnë vërtet.",
      "We send a video tour of every home, so you only visit the ones you really like.",
    ),
  },
  {
    title: T("Vizita & negocim", "Viewings & negotiation"),
    text: T("Ju shoqërojmë në çdo vizitë dhe negociojmë çmimin në emrin tuaj.", "We join you at every viewing and negotiate the price on your behalf."),
  },
  {
    title: T("Noteri & çelësat", "Notary & keys"),
    text: T("Kontrollojmë çdo dokument dhe jemi me ju deri në dorëzimin e çelësave.", "We check every document and stay with you until the keys are in your hand."),
  },
];

export type ReviewSource = "Google" | "Facebook" | "Website";

export type Review = {
  name: string;
  rating: number;
  /** ISO date. */
  date: string;
  /** Visitor-written reviews keep the language they were written in. */
  text: Text | string;
  detail?: Text;
  source: ReviewSource;
};

export const reviews: Review[] = [
  {
    name: "Klaudia & Erion",
    rating: 5,
    date: "2026-09-18",
    source: "Google",
    text: T(
      "Na dërguan video për çdo apartament, kështu që vizituam vetëm tre. I treti ishte shtëpia jonë.",
      "They sent us a video of every apartment, so we only visited three. The third one was our home.",
    ),
    detail: T("Blenë një 2+1 në Komunën e Parisit", "Bought a 2-bed in Komuna e Parisit"),
  },
  {
    name: "Gentian M.",
    rating: 5,
    date: "2026-08-02",
    source: "Facebook",
    text: T(
      "Jetoj në Itali dhe kisha frikë ta shisja nga larg. U kujdesën për gjithçka, edhe për noterin.",
      "I live in Italy and was worried about selling from abroad. They handled everything, even the notary.",
    ),
    detail: T("Shiti një vilë në Lundër", "Sold a villa in Lundër"),
  },
  {
    name: "Mirela T.",
    rating: 5,
    date: "2026-07-14",
    source: "Google",
    text: T("Vlerësimi ishte i saktë deri në 3%. Prona u shit për 5 javë.", "The valuation was accurate to within 3%. The flat sold in 5 weeks."),
    detail: T("Shiti një penthouse në Bllok", "Sold a penthouse in Blloku"),
  },
  {
    name: "James & Olivia R.",
    rating: 5,
    date: "2026-06-27",
    source: "Google",
    text: T(
      "Erdhëm në Tiranë për punë pa njohur askënd. Sara na gjeti një apartament me qira brenda një jave dhe na shpjegoi çdo rresht të kontratës.",
      "We moved to Tirana for work knowing no one. Sara found us a rental within a week and explained every line of the contract.",
    ),
    detail: T("Morën me qira në Tiranën e Re", "Rented in New Tirana"),
  },
  {
    name: "Arta K.",
    rating: 4,
    date: "2026-05-30",
    source: "Website",
    text: T(
      "Shërbim shumë profesional. Procesi zgjati pak më shumë se sa prisja për shkak të bankës, por agjentja na mbajti të informuar çdo ditë.",
      "Very professional service. It took a little longer than I expected because of the bank, but our agent kept us updated every day.",
    ),
    detail: T("Bleu një apartament pranë Liqenit", "Bought a flat near the Lake"),
  },
  {
    name: "Besnik H.",
    rating: 5,
    date: "2026-04-11",
    source: "Facebook",
    text: T(
      "Arbeni e njeh çdo vilë në Farkë. Na kurseu muaj kërkimi dhe negocioi 40 mijë euro më pak.",
      "Arben knows every villa in Farkë. He saved us months of searching and negotiated €40k off the price.",
    ),
    detail: T("Bleu një vilë në Farkë", "Bought a villa in Farkë"),
  },
  {
    name: "Luca B.",
    rating: 5,
    date: "2026-03-08",
    source: "Google",
    text: T(
      "Zyra jonë e re në qendër ishte gati ditën që hymë. Kontratë e qartë, pa kosto të fshehura.",
      "Our new office in the centre was ready the day we moved in. Clear contract, no hidden costs.",
    ),
    detail: T("Mori me qira një zyrë", "Leased an office"),
  },
  {
    name: "Elona & Driton",
    rating: 5,
    date: "2026-02-19",
    source: "Google",
    text: T(
      "Videot me dron e shitën vilën tonë në Golem para se ta vizitonte kush. Rekomandoj pa mëdyshje.",
      "The drone videos sold our villa in Golem before anyone even visited. Recommended without hesitation.",
    ),
    detail: T("Shitën një vilë buzë detit", "Sold a beachfront villa"),
  },
];
