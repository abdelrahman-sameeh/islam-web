# Browser-only persistence

The current product has no server. Personal choices and lightweight progress
stay on the user's current device and must work without an account.

- Web and installed PWA builds retain the existing `localStorage` keys so
  current users do not lose their choices.
- `src/lib/browserStorage.js` is the storage boundary. Features must not access
  `localStorage` directly.

## Daily session

Storage key: `islamona.daily-session.v3`

```json
{
  "date": "YYYY-MM-DD",
  "duration": 5,
  "passage": {
    "surahId": "18",
    "surahName": "سورة الكهف",
    "fromAyah": 1,
    "toAyah": 10,
    "wordCount": 325
  },
  "isStarted": false
}
```

- Select a surah randomly from all 114 surahs, fetch its sourced Arabic ayahs,
  then calculate a contiguous range near the chosen reading time. There are no
  fixed duration-to-passage lists.
- Estimate the range from its real word count at 65 words per minute. Retry with
  another random surah when the selected surah is too short for the duration.
- Keep that passage stable across refreshes for the rest of the day.
- Avoid the exact previous surah/range when another session is requested.
- `جلسة أخرى` selects another passage for the same duration and resets
  `isStarted`.
- Changing 2/5/10 minutes calculates a fresh random passage for that duration
  and persists the successful result.
- Invalid or unknown stored data falls back safely to a new session.
- Religious text is fetched unchanged from QuranEnc. The app only counts words
  and chooses ayah boundaries; it never generates or rewrites Quran text.

`islamona.daily-session.v1` and `islamona.daily-session.v2` are intentionally
left untouched and ignored. The v3 key stores the calculated passage rather
than an ID from the removed fixed list.

## Session content

Storage key: `islamona.session-content.v1`

```json
{
  "signature": "18:1-10",
  "hadith": {
    "id": "66511",
    "title": "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى",
    "text": "...",
    "grade": "صحيح",
    "attribution": "..."
  }
}
```

- The signature links the random hadith to the current Quran passage.
- Keep the same sourced hadith on refresh; a new passage gets a new random
  hadith.
- Quran and tafsir text are fetched from QuranEnc and are not duplicated in
  storage.

## Theme

Storage key: `islamona.theme.v1`; allowed values are `light` and `dark`.

## Prayer location

Storage key: `islamona.prayer-location.v2`; value format is an ISO country code
and local city key such as `EG:cairo` or `SA:makkah`.

- The country controls the AlAdhan calculation method; the city controls the
  geocoded location and timezone returned by the API.
- If v2 is missing, a recognized value from `islamona.prayer-city.v1` migrates
  to the matching Egyptian governorate. The legacy key remains untouched.
- Invalid or removed locations fall back to `EG:monufia`. A valid saved choice
  always wins, so existing users keep their selected location.

## Favorites

Storage key: `islamona.favorites.v1`

```json
{
  "items": [
    {
      "key": "tafsir:2:255",
      "type": "tafsir",
      "entityId": "2:255",
      "title": "سورة البقرة · الآية ٢٥٥",
      "href": "/tafseer?surah=2&ayah=255",
      "savedAt": "ISO-8601 timestamp"
    }
  ]
}
```

- Allowed types are `surah`, `reciter`, `hadith`, and `tafsir`.
- Store stable IDs, display labels, and internal links; do not duplicate Quran,
  tafsir, or hadith bodies in browser storage.
- The same localStorage boundary works in the web build and the installed
  Android WebView. Data is device-local and may be removed when site/app data
  is cleared or the app is uninstalled.
- Newest items appear first. Adding the same `type + entityId` twice removes it
  rather than creating a duplicate.

## Privacy copy

The home page should state: `اختياراتك محفوظة على هذا الجهاز فقط`.

Future storage migrations create a new versioned key or include an explicit
migration. Do not silently change the meaning of existing stored fields.
