# Navigation and core flows

## Information architecture

Primary: Home, Quran, Tafsir, Adhkar, Hadith, Prayer Times.

Global utilities: Search, theme, reading settings, saved items (future).

## Quran reading

Home/Quran list -> select or search surah -> reader -> choose reciter -> play ->
open tafsir for a verse -> return without losing reading position.

URL owns the selected surah and verse. Local preference owns reciter, volume,
playback speed, font size, and theme.

## Adhkar

Adhkar -> select time/category -> open dhikr -> tap count target -> complete ->
move to next item. Completion is supportive, never competitive.

## Hadith

Hadith -> search/filter category -> scan cards -> open detail -> view explanation,
benefits, reference, and source. Pagination should preserve filters in the URL.

## Prayer times

Prayer Times -> use location or select city -> see today and next prayer -> open
monthly calendar or Qibla (future). Always show calculation method and allow a
manual location choice when geolocation is denied.

## Global search roadmap

Phase 1 searches surah names and local navigation instantly. A frontend-only
release can add Quran verse search through AlQuran Cloud with an explicit Arabic
edition. Phase 2 moves advanced Quran search to Quran Foundation through a
backend proxy. Phase 3 can add sourced hadith results as a separate, clearly
labelled content type.
