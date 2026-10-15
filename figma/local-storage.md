# Device-only persistence

The current product has no server. Personal choices and lightweight progress
stay on the user's current device and must work without an account.

The visible product name is `دقائق نور`. Existing `islamona.*` storage keys
remain unchanged as stable technical identifiers so the rename never discards
saved preferences, sessions, or favorites.

- Web and desktop PWA builds retain the existing `localStorage` keys so current
  users do not lose their choices.
- Android builds store the same keys through Capacitor Preferences,
  backed by the platform's native lightweight preferences store.
- `src/lib/deviceStorage.js` is the only platform boundary. Features must not
  access either storage implementation directly.
- Larger sourced content uses the versioned IndexedDB database
  `daqaeq-noor-offline-v1`. Web audio uses the same database; Android audio uses
  private native app storage so saving can continue while the screen is locked.
  Cached records are bounded by content group and are never treated as a
  different religious source. Quran audio explicitly downloaded by the user is
  kept separately and is removed only by the user or when app data is cleared.

## Last-opened views

- `islamona.quran-reader.v1`: the last explicitly selected reciter ID. A direct
  URL still wins over the saved value. Opening the Quran from the main
  navigation always starts at Al-Fatihah; surah selections are intentionally
  not persisted. Random daily-session passages never replace the saved
  reciter.
- `islamona.tafsir-view.v1`: last surah, ayah, and active verse-search phrase.
- `islamona.hadith-view.v1`: last category/page, search phrase, or direct
  hadith ID, plus the last expanded hadith in a list.
- `islamona.adhkar-view.v1`: last category and counter progress.

The preferences above are small device-local values and use the existing
storage boundary. Invalid stored choices fall back to the current safe
defaults.

## Offline content

IndexedDB records keep their original normalized API models and source
attribution. The cache is network-first and falls back only after the remote
request fails. Groups have explicit limits: recent Quran surahs, hadith lists,
searches and details, the current adhkar collection, reciter metadata, and the
three most recently played recitations. Audio is saved unchanged after
playback begins: as a blob on web and as a private native file on Android.

An explicit `حفظ على الجهاز` action promotes that recitation out of the
three-item playback cache into the downloaded-recitation library. Downloads
have no silent item-count eviction: the user can review their total size, open
the matching surah and reciter, or remove an individual download.

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
    "explanation": "...",
    "grade": "صحيح",
    "attribution": "..."
  }
}
```

- The signature links the random hadith to the current Quran passage.
- Keep the same sourced hadith on refresh; a new passage gets a new random
  hadith.
- Quran and tafsir text are fetched from QuranEnc. Recently opened surahs are
  duplicated in the bounded offline-content cache so their text and sourced
  tafsir can be reopened without a connection.

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
  tafsir, or hadith bodies in device storage.
- The shared device-storage boundary uses localStorage on web and Capacitor
  Preferences on Android. Data remains device-local and may be removed when
  site/app data is cleared or the app is uninstalled.
- Newest items appear first. Adding the same `type + entityId` twice removes it
  rather than creating a duplicate.

## Privacy copy

The home page should state: `اختياراتك محفوظة على هذا الجهاز فقط`.

Future storage migrations create a new versioned key or include an explicit
migration. Do not silently change the meaning of existing stored fields.
