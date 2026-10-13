# Navigation and core flows

## Information architecture

Primary: Home, Quran, Tafsir, Adhkar, Hadith, Prayer Times.

Global utilities: Search, theme, reading settings, and device-local favorites.

Every internal route or URL-state transition starts at the top of the new page.
This intentionally favors predictable mobile/WebView navigation over restoring
the previous scroll position.

## Favorites

Quran, tafsir, or hadith -> save a surah, reciter, hadith, or tafsir reference
-> open Favorites -> filter by content type -> return to the exact saved route.
Removing an item updates every mounted save button. Favorites stay on the
current browser or installed-app device and do not require an account.

## Quran reading

Home/Quran list -> select or search surah -> reader -> choose reciter -> play ->
open tafsir for a verse -> return without losing reading position.

URL owns the selected surah and verse. Local preference owns reciter, volume,
playback speed, font size, and theme.

## Adhkar

Adhkar -> select time/category -> open dhikr -> tap count target -> complete ->
move to next item. Completion is supportive, never competitive.

## Hadith

Hadith -> run a global title/body search or browse a category -> scan cards ->
open detail -> view explanation, benefits, reference, and source. The query and
pagination stay in the URL so results survive refresh and browser navigation.

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

## Daily session

Home -> choose 2, 5, or 10 minutes -> select a random surah from all 114 -> fetch
its sourced ayahs -> calculate a contiguous range from the actual word count ->
open a guided session containing those Quran ayahs -> show one independently
random HadeethEnc hadith -> show the sourced simplified tafsir for each selected
ayah.

The browser stores the selected passage and duration. Randomness happens on a
new day, an explicit duration change, or `جلسة أخرى`; never on an ordinary
render or refresh. A short random surah is skipped when it cannot fill the
chosen duration. No account or server is required.

The Quran passage and random hadith remain stable on refresh. Requesting another
session changes both. A failure in the hadith service never hides the Quran or
tafsir steps; each remote section has its own retry action.
