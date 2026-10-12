# Islamic data API research

Research date: 2026-10-12. Re-check terms, access, and response formats before
implementation because third-party services can change.

## Recommendation

Use a small source-per-domain strategy instead of one unofficial all-in-one API:

| Domain | Recommended source | Why | Integration note |
| --- | --- | --- | --- |
| Quran text, verses, tafsir, word data, search | Quran Foundation | Broadest verified feature set; powers Quran.com | Requires registered credentials and a backend/serverless proxy; never expose the secret |
| Simple public Quran and search fallback | AlQuran Cloud | Public GET API with editions, text/audio, and search endpoints | Useful for a frontend-only release; pass an explicit Arabic edition and verify attribution |
| Arabic tafsir/translations | QuranEnc | Existing integration; focused translation/tafsir catalog | Keep source/translation key visible and handle failures |
| Reciter catalog and full-surah audio | MP3Quran | Existing official reciter/moshaf catalog | Keep it for reciters; validate `surah_list` before changing selection |
| Hadith with explanation and categories | HadeethEnc | Official multilingual API; Arabic includes explanation, benefits, meanings, and references | Replace the current Indonesian Abu Dawud endpoint; show HadeethEnc attribution and follow reuse terms |
| Prayer times, Hijri dates, Qibla | AlAdhan | Official OpenAPI covers daily/monthly times, calendars, methods, and Qibla | Prefer coordinates, show calculation method, and format dates as documented |
| Adhkar | Curated local dataset with named source | Current raw GitHub data has weak product-level provenance | Review and version a sourced dataset; do not silently clean or rewrite religious text |

## 1. Quran Foundation

Official documentation: https://api-docs.quran.com/

Capabilities include chapters, verses, Quran text fields, translations, tafsir,
audio/recitations, juz/hizb/page structures, search, and user features such as
bookmarks, notes, reading sessions, goals, and preferences.

Best product uses:

- global Quran search and search-as-you-type;
- word-by-word or Mushaf-style reading later;
- verse audio and tafsir resources;
- synced bookmarks and reading progress in a future account experience.

Constraint: Content/Search use OAuth2 client credentials and required headers.
The client secret belongs on a backend. New pre-live access is limited for
content testing, and production access needs approval. The official JS/TS SDK is
`@quranjs/api`.

## 2. AlQuran Cloud

Official documentation: https://legacy.alquran.cloud/api

Provides public GET endpoints for surahs, ayahs, editions, text/audio editions,
and Quran text search. It is a reasonable low-complexity fallback while the
application is frontend-only. Prefer Uthmani Arabic by explicit edition
identifier rather than depending on an implicit default. A candidate search
shape is `/v1/search/{encodedKeyword}/all/quran-uthmani`; validate Arabic search
quality and response limits with real queries before making it the global
search provider.

## 3. QuranEnc

Official documentation: https://quranenc.com/en/home/api/

The project already uses its `translation/sura/{translation_key}/{sura_number}`
endpoint. Retain it for Arabic simplified tafsir if its catalog and terms meet
the product need. Isolate it behind `tafsirApi.js` so a translation key or
provider change does not affect components.

## 4. MP3Quran

Official developer page: https://www.mp3quran.net/eng/api

Keep the v3 reciters endpoint for reader names, available moshafs, server URLs,
and supported surah lists. The UI must reset or warn when the current surah is
not available in the newly selected moshaf.

## 5. HadeethEnc

Official API repository: https://github.com/islamhouse-dev/hadith-api

The API exposes languages, categories, category trees, hadith lists, and hadith
details. Arabic responses can include the text, explanation, benefits, word
meanings, and references. This is more useful and better sourced than the
current `hadis-api-id.vercel.app` dependency.

Content reuse conditions require preserving content, naming HadeethEnc as the
source, and tracking version updates. Confirm the current terms before shipping.

## 6. AlAdhan

Official documentation:

- Prayer times: https://aladhan.com/prayer-times-api
- Hijri calendar: https://aladhan.com/islamic-calendar-api

Useful additions beyond the current daily city view:

- coordinates-based prayer times;
- next prayer and monthly calendar;
- calculation-method selector and disclosure;
- Gregorian/Hijri conversion and Islamic special days;
- Qibla direction;
- Asma al-Husna as a separate, sourced educational feature if it fits scope.

The documented date path format is `DD-MM-YYYY`; do not pass JavaScript's
locale-dependent `Date.toDateString()` output. Results can differ from local
authorities, so the chosen calculation method must be visible.

## Adoption plan

1. Keep MP3Quran, QuranEnc, and AlAdhan but place them behind feature API files.
2. Replace the hadith provider with HadeethEnc and add source/reference UI.
3. Review and freeze a sourced adhkar dataset locally with version metadata.
4. Add public Quran search through AlQuran Cloud only after Arabic result
   quality is reviewed; keep navigation search local and instant.
5. Add a small backend/serverless layer, then evaluate Quran Foundation for
   advanced search, richer reading data, and future accounts.
6. Define a provider-neutral app model and an optional fallback per critical
   reading surface. Never mix verse data from providers without explicit
   identifiers and validation.
