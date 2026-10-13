# Visual identity: Daqaeq Noor

## Brand idea

**Quiet guidance.** Daqaeq Noor should feel like a calm reading place, not a busy
content portal. The product supports focused worship and study through reliable
content, legible Arabic, and predictable navigation.

Personality: calm, trustworthy, warm, contemporary, restrained.

Avoid: visual noise, saturated gradients, ornamental overload, generic mosque
clip art, tiny religious text, and gamification that creates guilt.

## Logo direction

Use a simple geometric mark derived from an open book and a mihrab arch. Keep it
flat and recognizable at 24px. Do not use generated calligraphy as a final logo.
The wordmark is `دقائق نور` in Cairo SemiBold. A vector logo should be drawn and
approved separately before production replacement.

## Color roles

| Token | Use |
| --- | --- |
| Brand 900 | Navigation, strong headings, dark theme surfaces |
| Brand 700 | Primary action and active state |
| Brand 100 | Selected rows and quiet information backgrounds |
| Neutral 100 | Default warm page background |
| Neutral 0 | Cards and reading surfaces |
| Accent 400 | Verse markers and rare emphasis only |
| Semantic colors | Status messages; always pair with text/icon |

Body text on warm backgrounds uses Neutral 900. Primary buttons use Brand 700
with white text. Gold is never used for body text because its contrast is too
weak.

### Dark theme

Dark mode uses a near-black neutral page (`#0B1211`) and charcoal-green cards
(`#141C1A`) instead of covering every surface in green. Elevated reading cards
use `#1A2421`, borders use `#2A3834`, primary text uses `#F1F5F3`, and muted
text uses `#9EACA7`. The brighter green (`#7BC8AD`) is reserved for actions and
active states; gold (`#DCB36B`) remains rare emphasis. The session and prayer
heroes use the deeper `#102A25` so they remain visually distinct from cards.

## Typography

- UI and explanatory content: Cairo, 400/600/700.
- Quran text: Scheherazade New, 400/600.
- Reading size: 26-30px desktop, 24-28px mobile, line-height 2.1.
- Tafsir and hadith body: 18px desktop, 17px mobile, line-height 1.9.
- Never place Quran text in all-purpose UI cards smaller than 20px.

## Layout

- RTL grid, max width 1200px, desktop gutter 32px.
- Reading column max width 720px and centered.
- Default vertical rhythm uses 8px multiples.
- Desktop app shell: 88px top header. Mobile: 64px header and optional bottom
  navigation for the five primary destinations.
- Cards use 18px radius and one subtle border. Shadows are limited to floating
  controls and the persistent audio player.

## Iconography and pattern

Use one rounded outline icon family at 20/24px with a consistent 1.75px stroke.
Filled icons indicate the active navigation item only. The geometric pattern is
allowed at 4-7% opacity in hero or empty-state backgrounds; never behind Quran
text.

## Motion

- Micro-interactions: 120-180ms.
- Page/overlay transitions: no more than 240ms.
- Do not animate Quran text or move content while a user is reading.
- Disable non-essential motion under `prefers-reduced-motion`.

## Accessibility baseline

- WCAG AA contrast for UI text and controls.
- 44px minimum interactive target.
- Visible 2px focus ring with 2px offset.
- Logical heading order and landmarks.
- Loading is announced with `aria-live`; errors receive focus when appropriate.
- Icon-only actions have Arabic labels and tooltips.
