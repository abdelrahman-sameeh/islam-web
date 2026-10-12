# Mobile runtime handoff

Islamona ships from one responsive React source. The desktop website and
installable PWA remain first-class surfaces; Capacitor adds the current Android
shell around the same production build and keeps an iOS shell possible later.

## Shell

- App name: `إسلامنا`
- App identifier: `com.islamona.app`
- Web output: `build/`
- Default orientation: any
- Reading direction: RTL
- Theme color: brand 900 (`#123B35`)
- Launch background: neutral 100 (`#F7F3EA`)

The document body respects all four CSS safe-area insets. Existing responsive
breakpoints and the 1200px desktop container remain unchanged.

## Icon

The source artwork lives in `resources/logo.svg`. It uses the established
crescent and star mark without text so it stays legible at small sizes.

- Background: brand 900
- Border: brand 500
- Crescent: neutral 50
- Star: accent 400
- Maskable artwork keeps the mark inside the central safe zone.

Generated web assets live in `public/icons/`; native platform assets are
generated from the same source to prevent visual drift.

## Offline behavior

The web build precaches the app shell, icon, and manifest. Successfully loaded
Quran, hadith, adhkar, prayer-time, reciter, and font responses are cached by
exact request URL for later use. Audio is intentionally not cached because it
can consume significant device storage.

The native shell always contains the built interface. Remote religious content
still needs a first successful network request; no bundled copy may silently
replace or alter the named upstream source.
