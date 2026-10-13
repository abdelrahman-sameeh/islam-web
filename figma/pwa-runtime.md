# Web and PWA runtime handoff

Daqaeq Noor ships as one responsive React website. Desktop, mobile browsers, and
the installable Progressive Web App all use the same production build.

## Shell

- App name: `دقائق نور`
- Web output: `build/`
- Default orientation: any
- Reading direction: RTL
- Theme color: brand 900 (`#123B35`)
- Launch background: neutral 100 (`#F7F3EA`)

The document body respects all four CSS safe-area insets. Existing responsive
breakpoints and the 1200px desktop container remain unchanged.

## Icon

Generated PWA assets live in `public/icons/`. The maskable artwork keeps the
mark inside the central safe zone so it remains legible on supported launchers.

## Offline behavior

The web build precaches the app shell, icon, and manifest. Successfully loaded
Quran, hadith, adhkar, prayer-time, reciter, and font responses are cached by
exact request URL for later use. Audio is intentionally not cached because it
can consume significant browser storage.

Remote religious content needs a first successful network request. No bundled
copy may silently replace or alter the named upstream source.
