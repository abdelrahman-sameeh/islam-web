# Mobile runtime handoff

Daqaeq Noor ships from one responsive React source. The desktop website and
installable PWA remain first-class surfaces; Capacitor adds the current Android
shell around the same production build and keeps an iOS shell possible later.

## Shell

- App name: `دقائق نور`
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

The native shell always contains the built interface. Recently opened Quran,
hadith, tafsir-search, adhkar, and reciter data is stored in a bounded IndexedDB
cache shared by the React code, so Android can reopen the same sourced content
without relying on a service worker.

A Quran recitation is cached after playback starts only on web, which keeps the
three most recent audio blobs in IndexedDB. Android streams playback without an
automatic audio cache and uses private app storage only when the user presses
`حفظ على الجهاز`. Explicit downloads are used before the remote URL. Remote
religious content still needs one successful request before it becomes
available offline; no bundled copy may silently replace or alter the named
upstream source.

## Android background audio

Android Quran audio runs through a native Media3 `MediaSessionService`, not the
WebView audio element. The foreground media notification exposes play/pause and
seek controls and keeps network playback active when the app is backgrounded or
the device is locked. The service uses audio focus, reacts to unplugged
headphones, and holds only the wake mode needed for network playback.
