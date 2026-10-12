# Browser-only persistence

The current product has no server. Personal choices and lightweight progress
stay in the browser and must work without an account.

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

## Privacy copy

The home page should state: `اختياراتك محفوظة على هذا الجهاز فقط`.

Future storage migrations create a new versioned key or include an explicit
migration. Do not silently change the meaning of existing stored fields.
