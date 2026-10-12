export const PRAYER_COUNTRIES = [
  {
    id: "EG",
    name: "مصر",
    method: 5,
    cities: [
      { id: "cairo", name: "القاهرة", apiName: "Cairo" },
      { id: "giza", name: "الجيزة", apiName: "Giza" },
      { id: "alexandria", name: "الإسكندرية", apiName: "Alexandria" },
      { id: "dakahlia", name: "الدقهلية", apiName: "Mansoura" },
      { id: "red-sea", name: "البحر الأحمر", apiName: "Hurghada" },
      { id: "beheira", name: "البحيرة", apiName: "Damanhur" },
      { id: "fayoum", name: "الفيوم", apiName: "Fayoum" },
      { id: "gharbia", name: "الغربية", apiName: "Tanta" },
      { id: "ismailia", name: "الإسماعيلية", apiName: "Ismailia" },
      { id: "monufia", name: "المنوفية", apiName: "Shibin El Kom" },
      { id: "minya", name: "المنيا", apiName: "Minya" },
      { id: "qalyubia", name: "القليوبية", apiName: "Benha" },
      { id: "new-valley", name: "الوادي الجديد", apiName: "Kharga" },
      { id: "suez", name: "السويس", apiName: "Suez" },
      { id: "aswan", name: "أسوان", apiName: "Aswan" },
      { id: "asyut", name: "أسيوط", apiName: "Asyut" },
      { id: "beni-suef", name: "بني سويف", apiName: "Beni Suef" },
      { id: "port-said", name: "بورسعيد", apiName: "Port Said" },
      { id: "damietta", name: "دمياط", apiName: "Damietta" },
      { id: "sharqia", name: "الشرقية", apiName: "Zagazig" },
      { id: "south-sinai", name: "جنوب سيناء", apiName: "El Tor" },
      { id: "kafr-el-sheikh", name: "كفر الشيخ", apiName: "Kafr El Sheikh" },
      { id: "matrouh", name: "مطروح", apiName: "Marsa Matruh" },
      { id: "luxor", name: "الأقصر", apiName: "Luxor" },
      { id: "qena", name: "قنا", apiName: "Qena" },
      { id: "north-sinai", name: "شمال سيناء", apiName: "Arish" },
      { id: "sohag", name: "سوهاج", apiName: "Sohag" },
    ],
  },
  {
    id: "SA",
    name: "السعودية",
    method: 4,
    cities: [
      { id: "makkah", name: "مكة المكرمة", apiName: "Makkah" },
      { id: "madinah", name: "المدينة المنورة", apiName: "Madinah" },
      { id: "riyadh", name: "الرياض", apiName: "Riyadh" },
      { id: "jeddah", name: "جدة", apiName: "Jeddah" },
      { id: "dammam", name: "الدمام", apiName: "Dammam" },
      { id: "abha", name: "أبها", apiName: "Abha" },
      { id: "tabuk", name: "تبوك", apiName: "Tabuk" },
      { id: "buraydah", name: "بريدة", apiName: "Buraydah" },
    ],
  },
  {
    id: "AE",
    name: "الإمارات",
    method: 8,
    cities: [
      { id: "abu-dhabi", name: "أبوظبي", apiName: "Abu Dhabi" },
      { id: "dubai", name: "دبي", apiName: "Dubai" },
      { id: "sharjah", name: "الشارقة", apiName: "Sharjah" },
      { id: "al-ain", name: "العين", apiName: "Al Ain" },
      { id: "ras-al-khaimah", name: "رأس الخيمة", apiName: "Ras Al Khaimah" },
    ],
  },
  {
    id: "KW",
    name: "الكويت",
    method: 9,
    cities: [
      { id: "kuwait-city", name: "مدينة الكويت", apiName: "Kuwait City" },
      { id: "al-ahmadi", name: "الأحمدي", apiName: "Al Ahmadi" },
    ],
  },
  {
    id: "QA",
    name: "قطر",
    method: 10,
    cities: [
      { id: "doha", name: "الدوحة", apiName: "Doha" },
      { id: "al-rayyan", name: "الريان", apiName: "Al Rayyan" },
    ],
  },
  {
    id: "BH",
    name: "البحرين",
    method: 8,
    cities: [
      { id: "manama", name: "المنامة", apiName: "Manama" },
      { id: "muharraq", name: "المحرق", apiName: "Muharraq" },
    ],
  },
  {
    id: "OM",
    name: "عُمان",
    method: 8,
    cities: [
      { id: "muscat", name: "مسقط", apiName: "Muscat" },
      { id: "salalah", name: "صلالة", apiName: "Salalah" },
      { id: "sohar", name: "صحار", apiName: "Sohar" },
    ],
  },
  {
    id: "JO",
    name: "الأردن",
    method: 23,
    cities: [
      { id: "amman", name: "عمّان", apiName: "Amman" },
      { id: "zarqa", name: "الزرقاء", apiName: "Zarqa" },
      { id: "irbid", name: "إربد", apiName: "Irbid" },
      { id: "aqaba", name: "العقبة", apiName: "Aqaba" },
    ],
  },
  {
    id: "PS",
    name: "فلسطين",
    method: 23,
    cities: [
      { id: "jerusalem", name: "القدس", apiName: "Jerusalem" },
      { id: "gaza", name: "غزة", apiName: "Gaza" },
      { id: "ramallah", name: "رام الله", apiName: "Ramallah" },
      { id: "nablus", name: "نابلس", apiName: "Nablus" },
    ],
  },
  {
    id: "IQ",
    name: "العراق",
    method: 3,
    cities: [
      { id: "baghdad", name: "بغداد", apiName: "Baghdad" },
      { id: "basra", name: "البصرة", apiName: "Basra" },
      { id: "mosul", name: "الموصل", apiName: "Mosul" },
      { id: "erbil", name: "أربيل", apiName: "Erbil" },
      { id: "najaf", name: "النجف", apiName: "Najaf" },
    ],
  },
  {
    id: "LB",
    name: "لبنان",
    method: 3,
    cities: [
      { id: "beirut", name: "بيروت", apiName: "Beirut" },
      { id: "tripoli", name: "طرابلس", apiName: "Tripoli" },
      { id: "sidon", name: "صيدا", apiName: "Sidon" },
    ],
  },
  {
    id: "SY",
    name: "سوريا",
    method: 3,
    cities: [
      { id: "damascus", name: "دمشق", apiName: "Damascus" },
      { id: "aleppo", name: "حلب", apiName: "Aleppo" },
      { id: "homs", name: "حمص", apiName: "Homs" },
    ],
  },
  {
    id: "MA",
    name: "المغرب",
    method: 21,
    cities: [
      { id: "rabat", name: "الرباط", apiName: "Rabat" },
      { id: "casablanca", name: "الدار البيضاء", apiName: "Casablanca" },
      { id: "marrakesh", name: "مراكش", apiName: "Marrakesh" },
      { id: "fes", name: "فاس", apiName: "Fes" },
      { id: "tangier", name: "طنجة", apiName: "Tangier" },
    ],
  },
  {
    id: "DZ",
    name: "الجزائر",
    method: 19,
    cities: [
      { id: "algiers", name: "الجزائر", apiName: "Algiers" },
      { id: "oran", name: "وهران", apiName: "Oran" },
      { id: "constantine", name: "قسنطينة", apiName: "Constantine" },
    ],
  },
  {
    id: "TN",
    name: "تونس",
    method: 18,
    cities: [
      { id: "tunis", name: "تونس", apiName: "Tunis" },
      { id: "sfax", name: "صفاقس", apiName: "Sfax" },
      { id: "sousse", name: "سوسة", apiName: "Sousse" },
    ],
  },
  {
    id: "LY",
    name: "ليبيا",
    method: 3,
    cities: [
      { id: "tripoli", name: "طرابلس", apiName: "Tripoli" },
      { id: "benghazi", name: "بنغازي", apiName: "Benghazi" },
      { id: "misrata", name: "مصراتة", apiName: "Misrata" },
    ],
  },
  {
    id: "SD",
    name: "السودان",
    method: 3,
    cities: [
      { id: "khartoum", name: "الخرطوم", apiName: "Khartoum" },
      { id: "omdurman", name: "أم درمان", apiName: "Omdurman" },
      { id: "port-sudan", name: "بورتسودان", apiName: "Port Sudan" },
    ],
  },
  {
    id: "YE",
    name: "اليمن",
    method: 3,
    cities: [
      { id: "sanaa", name: "صنعاء", apiName: "Sanaa" },
      { id: "aden", name: "عدن", apiName: "Aden" },
      { id: "taiz", name: "تعز", apiName: "Taizz" },
    ],
  },
];

export const DEFAULT_LOCATION_ID = "EG:cairo";

export const getLocationId = (countryId, cityId) => `${countryId}:${cityId}`;

export const getPrayerLocation = (locationId) => {
  const [countryId, cityId] = String(locationId).split(":");
  const country = PRAYER_COUNTRIES.find(({ id }) => id === countryId);
  const city = country?.cities.find(({ id }) => id === cityId);

  return country && city ? { country, city } : null;
};

export const getLegacyEgyptLocation = (legacyCity) => {
  const country = PRAYER_COUNTRIES[0];
  const city = country.cities.find(({ apiName }) => apiName === legacyCity);
  return city ? getLocationId(country.id, city.id) : null;
};
