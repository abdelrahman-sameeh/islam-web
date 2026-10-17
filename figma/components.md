# Component inventory

Build these in Figma with Auto Layout and mirror the same vocabulary in React.

## App shell

- `AppHeader`: logo, primary navigation, global search, theme action.
- `MobileBottomNav`: Home, Quran, Adhkar, Hadith, Prayer Times.
- `Breadcrumbs`: optional on deep desktop routes, omitted from home.
- `PageHeader`: title, short description, optional primary action.
- `SiteFooter`: content sources, privacy, product note.

## Inputs

- `SearchField`: default, focused, populated, loading, no-results. Tafsir and
  hadith search wait 500 ms after typing before requesting results; Enter keeps
  an immediate-search path for keyboard users.
- `SelectField`: label always visible; do not depend on placeholder alone.
- `SegmentedControl`: compact choices such as text/tafsir.
- `FilterChip`: default, selected, disabled.
- `IconButton`: default, hover, focus, pressed, disabled.
- `PrimaryButton` and `SecondaryButton`: include loading and disabled variants.

## Content

- `FeatureCard`: icon, title, short description, link affordance.
- `Verse`: verse text, verse marker, action menu; actions appear on focus/hover
  but remain available to keyboard and touch users.
- `TafsirPanel`: source title, verse key, explanation, source attribution.
- `HadithCard`: title, text preview/full text, grade/reference/source.
- `DhikrCard`: content, remaining-count button, reset action, source.
- `PrayerRow`: prayer name, time, current/next status.
- `SourceBadge`: publisher/source and edition where applicable.
- `SessionStep`: numbered stage, source badge, religious content, and an
  independent loading/error state. The fixed order is Quran, random hadith,
  then sourced tafsir. Hadith explanation is collapsed by default. Each tafsir
  summary shows the sourced verse text, not only its number, and expands to the
  corresponding explanation.

## Audio

- `AudioPlayer`: play/pause, a large touch-friendly seek track, elapsed/remaining
  time, 10-second rewind/forward actions, reciter, explicit download, and a
  direct link to saved recitations. Android volume stays with the system
  controls.
- Desktop: sticky bottom card within content width.
- Mobile: persistent mini-player above bottom navigation; expands to a sheet.
- Preserve playback when navigating between Quran routes.
- Web may cache a bounded number of recent recitations after playback starts.
  Android never caches audio automatically: only the explicit download action
  writes an audio file, and the saved-recitation page owns removal.
- Android uses native media controls and a foreground playback notification so
  recitation continues when the screen is locked. Play/pause and seeking remain
  available from the app and the system media surface.

## Feedback states

- `Skeleton`: matches the final layout; no generic full-page spinner.
- `InlineError`: concise Arabic message, retry action, optional support detail.
- `EmptyState`: explains why the view is empty and gives one useful next action.
- `Toast`: only for background confirmation, never for blocking errors.
- `FavoriteButton`: explicit saved/not-saved label with a bookmark icon and
  `aria-pressed`; never rely on icon color alone.
- `FavoriteCard`: type label, title, short context, open action, and a separate
  remove action. Cards are grouped by type on the favorites page.

## Behavior rules

- A card is clickable only if the entire card has one destination. If it has
  multiple actions, keep the container static and expose explicit actions.
- Do not hide core actions behind hover-only behavior.
- Use `aria-current` for active navigation and current prayer/verse where useful.
- Keep religious text immutable; counters and highlights are separate UI layers.
- Keep the Quran reader card aligned with the 1200px app container, while its
  text column stays near 860px with compact card padding and a calm line height.
