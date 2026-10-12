const ARABIC_MARKS =
  /[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed]/g;

export const stripArabicMarks = (value) =>
  String(value ?? "")
    .normalize("NFC")
    .replace(ARABIC_MARKS, "")
    .replace(/ـ/g, "")
    .replace(/\s+/g, " ")
    .trim();

const normalizeArabicText = (value) =>
  stripArabicMarks(value)
    .normalize("NFKD")
    .replace(ARABIC_MARKS, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .toLowerCase()
    .trim();

export default normalizeArabicText;
