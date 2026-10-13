# Islamona project rules

These rules apply to the entire repository. The product is an Arabic-first,
RTL Islamic reading and worship companion. Correct content, calm reading, and
accessibility are more important than decorative UI.

## Current phase

- Treat `figma/` as the approved design source before changing production UI.
- Do not redesign a production page unless its matching page spec exists in
  `figma/pages/` and the change follows the design tokens.
- Automated tests are deferred for this phase. Do not add a testing framework
  unless the user asks. Still run the production build and relevant static
  checks after implementation changes.
- Preserve user work and unrelated changes. Never rewrite files just to match a
  personal formatting preference.

## Product and UX

- Arabic is the default language and every product surface must work in RTL.
- Keep Quran text visually distinct from UI text. Use the Quran typeface only
  for Quran content, never for controls or long explanatory text.
- Every remote-data view must define loading, error, empty, and success states.
- Never leave an endless spinner. Error states must explain what happened and
  offer a retry action when retrying is useful.
- Preserve reading position and user choices such as theme, reciter, surah,
  city, and font size when practical.
- Prefer progressive disclosure: show the primary reading or worship task
  first, and secondary settings in a sheet, popover, or compact toolbar.
- Touch targets must be at least 44 by 44 CSS pixels. Keyboard focus must be
  visible. Do not use color as the only way to communicate state.
- Use semantic HTML before ARIA. All icon-only actions need an Arabic accessible
  name. Respect `prefers-reduced-motion`.
- Quran text must be protected from browser translation with `translate="no"`.
- Do not present generated religious rulings or unattributed religious content.
  Show the content source and edition where the upstream service provides it.

## Architecture

Use a feature-first structure when refactoring:

```text
src/
  app/                 # router, providers, app shell
  assets/              # local fonts and static images
  components/          # truly shared UI components
  features/
    quran/
      api/             # remote calls and response mapping
      components/      # Quran-only UI
      hooks/            # Quran-only stateful behavior
      pages/            # route-level screens
      utils/            # pure feature helpers
    tafsir/
    adhkar/
    hadith/
    prayer-times/
  lib/                 # configured HTTP client and generic helpers
  styles/              # tokens, globals, utilities
```

- Keep route components thin: compose the page and coordinate state; do not put
  parsing, request construction, and large markup trees in the same file.
- A feature owns its API adapter and data mapping. UI components must consume a
  stable app model rather than raw third-party response shapes.
- Shared code must be used by at least two features. Do not create speculative
  abstractions.
- Keep one source of truth for surah metadata, navigation items, cities, and
  design tokens.
- Prefer composition over configuration-heavy components. Avoid components
  with many boolean props.
- Keep side effects in hooks or API modules. Do not register global document
  listeners from imported utility files.
- Use React state for UI state and URL state for shareable/navigation state.
  Keep both synchronized for browser Back and Forward behavior.

## KISS and DRY

- Implement the smallest readable solution that satisfies the current UX.
- Extract repeated behavior, data, or markup after a real second use; do not
  abstract one-off code.
- Prefer small pure functions and early returns over deep nesting.
- Avoid clever one-liners, hidden mutation, and unnecessary dependencies.
- Do not duplicate API URLs, query keys, surah lists, or label maps.
- Comments explain decisions and constraints, not obvious syntax.

## Naming

- React components and their files use `PascalCase`, for example
  `QuranReaderPage.jsx` and `VerseCard.jsx`.
- Hooks use `camelCase` and start with `use`, for example `usePrayerTimes.js`.
- Utilities and API modules use descriptive `camelCase`, for example
  `formatHijriDate.js` and `quranApi.js`.
- Constants use `UPPER_SNAKE_CASE`. Boolean names start with `is`, `has`,
  `can`, or `should`.
- Event handlers start with `handle`; callback props start with `on`.
- Route page names end with `Page`; reusable visual units describe their role,
  such as `AudioPlayer`, not vague names such as `QuranPageComp`.
- Folder names use lowercase kebab-case. Avoid generic files such as
  `functions.js`, `helpers.js`, or `utils.js` when a precise name is possible.
- Use English identifiers and file names. User-facing copy remains Arabic.

## API and religious-content safety

- Use only documented HTTPS endpoints from a named source.
- Record source, attribution requirements, authentication model, and fallback
  behavior before adopting a service. Research notes live in
  `figma/api-research.md` until an architecture-docs folder is introduced.
- Never expose a client secret in the browser. Services requiring confidential
  credentials must be called through a backend or serverless proxy.
- Add request cancellation for views that can change quickly, such as surah,
  reciter, category, city, or pagination changes.
- Normalize remote errors into user-safe Arabic messages; log diagnostic detail
  separately and never log secrets.
- Use bounded retries only for transient failures. Do not blindly retry 4xx
  responses.
- Validate route params and third-party payloads before rendering them.
- Quran, tafsir, hadith, and adhkar content must retain source attribution and
  must not be silently edited. UI cleanup must not change the religious text.

## Styling

- Use the tokens defined in `figma/tokens.json`; do not scatter new hex values,
  radii, or shadows through components.
- Prefer CSS classes and variants over inline style objects.
- Build mobile-first and verify at 360, 768, 1024, and 1440 CSS pixels.
- The default content width is 1200px; long reading text uses a narrower measure
  of about 720px.
- Avoid selectors tied to generated library class names.

## Completion checklist

- The implementation matches the relevant `figma/pages/` design and its states.
- RTL, keyboard navigation, focus, mobile layout, loading, error, and empty
  states were reviewed.
- No religious text was modified during formatting or mapping.
- `npm run build` succeeds. Existing warnings introduced by untouched code may
  be reported, but new warnings must be resolved.
- User-visible changes and any remaining API limitations are summarized in the
  handoff.
