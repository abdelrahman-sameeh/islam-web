export const BISMILLAH = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ";

export const shouldShowStandaloneBismillah = (
  surahId,
  isPartialPassage = false
) => {
  const normalizedSurahId = String(surahId);

  if (normalizedSurahId === "9") return false;
  return normalizedSurahId !== "1" || isPartialPassage;
};
