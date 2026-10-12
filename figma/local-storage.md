# Browser-only persistence

The current product has no server. Personal choices and lightweight progress
stay in the browser and must work without an account.

## Daily session

Storage key: `islamona.daily-session.v1`

```json
{
  "date": "YYYY-MM-DD",
  "sessionId": "calm-heart",
  "duration": 5,
  "isStarted": false
}
```

- Select a random session on the first visit of each local calendar day.
- Keep that session stable across refreshes for the rest of the day.
- Avoid yesterday's session when more than one option is available.
- `جلسة أخرى` selects another random session and resets `isStarted`.
- Duration supports 2, 5, and 10 minutes and persists with the daily record.
- Invalid or unknown stored data falls back safely to a new session.
- Religious content comes from the versioned local dataset; randomness selects
  an approved item and never generates or rewrites religious text.

## Theme

Storage key: `islamona.theme.v1`; allowed values are `light` and `dark`.

## Privacy copy

The home page should state: `اختياراتك محفوظة على هذا الجهاز فقط`.

Future storage migrations create a new versioned key or include an explicit
migration. Do not silently change the meaning of existing stored fields.
