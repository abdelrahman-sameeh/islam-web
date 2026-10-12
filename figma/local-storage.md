# Browser-only persistence

The current product has no server. Personal choices and lightweight progress
stay in the browser and must work without an account.

## Daily session

Storage key: `islamona.daily-session.v2`

```json
{
  "date": "YYYY-MM-DD",
  "passageId": "al-kahf-1-10",
  "duration": 5,
  "isStarted": false
}
```

- Select a random approved Quran passage for the chosen duration. A passage is
  a surah ID plus a bounded `from`/`to` ayah range, never the whole surah unless
  that short surah is itself the approved passage.
- Keep that passage stable across refreshes for the rest of the day.
- Avoid the previous passage when more than one option is available.
- `جلسة أخرى` selects another passage for the same duration and resets
  `isStarted`.
- Changing 2/5/10 minutes immediately chooses a random passage from that
  duration's pool and persists the new choice.
- Invalid or unknown stored data falls back safely to a new session.
- Religious content comes from the versioned local dataset; randomness selects
  an approved item and never generates or rewrites religious text.

`islamona.daily-session.v1` is intentionally left untouched and ignored. The v2
key changes the stored meaning from a whole-surah session to a bounded passage.

## Theme

Storage key: `islamona.theme.v1`; allowed values are `light` and `dark`.

## Privacy copy

The home page should state: `اختياراتك محفوظة على هذا الجهاز فقط`.

Future storage migrations create a new versioned key or include an explicit
migration. Do not silently change the meaning of existing stored fields.
