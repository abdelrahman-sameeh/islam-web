# Page frames

All frames are 1440 × 1024 SVG files and can be dragged into Figma.

| File | Primary UX decision |
| --- | --- |
| `01-home.svg` | Saved-location prayer times plus a fresh random verse and dhikr appear before discovery cards |
| `02-quran-reader.svg` | Compact reader padding and a calm text measure keep reading focused |
| `03-adhkar.svg` | Category, progress, source, and count action stay explicit |
| `04-hadith.svg` | Debounced general search, category filters, and source quality replace blind pagination |
| `05-tafsir.svg` | Verse context remains visible beside the explanation |
| `06-prayer-times.svg` | Next prayer, country/city selectors, and local calculation method are always visible |
| `07-daily-session.svg` | A local-first 2/5/10-minute guided session with explicit sources |
| `08-session-content.svg` | Quran, a sourced random hadith with collapsible explanation, then collapsed verse-and-tafsir rows |
| `09-favorites.svg` | One local-only library groups saved surahs, reciters, hadiths, and tafsir references |
| `10-tafsir-search.svg` | Debounced verse-text search ignores tashkeel, then opens the selected sourced tafsir |
| `11-quran-downloads.svg` | Explicit Quran downloads stay until removal, show storage use, and remain separate from the three-item playback cache |

## Required states during implementation

Each remote-data page needs matching skeleton, retryable error, empty, and
success states. These state variants belong in Figma components rather than
duplicating four full page frames. The designs intentionally avoid full-page
spinners.

## Responsive rule

At widths below 768px, convert sidebars to sheets or top selectors, stack cards,
and keep the primary action reachable near the bottom thumb zone. The Quran
audio player remains above the mobile bottom navigation.
