# Islamona design handoff

This folder is the pre-implementation design source for the Islamona redesign.
The SVG frames can be dragged directly into Figma and edited as vectors.

## Files

- `assets/islamona-visual-direction.png`: generated visual-direction moodboard.
- `tokens.json`: portable color, type, spacing, radius, and shadow tokens.
- `foundations.md`: brand idea, typography, color, layout, and accessibility.
- `components.md`: reusable component inventory and interaction states.
- `flows.md`: core user journeys and navigation model.
- `local-storage.md`: browser-only persistence contract and versioning.
- `mobile-runtime.md`: shared web/PWA/native shell and safe-area behavior.
- `target-structure.md`: proposed production file structure and migration order.
- `api-research.md`: evaluated Quran and Islamic data services.
- `pages/*.svg`: 1440px desktop page frames, ready to import into Figma.

## Figma setup

1. Create a Figma page named `00 Foundations` and copy the styles from
   `foundations.md` and `tokens.json`.
2. Create `01 Components` from `components.md` using Auto Layout and variants.
3. Create `02 Desktop` and drag every SVG in `pages/` into it.
4. Create mobile frames at 360px width with a 16px gutter, the same component
   names and tokens, and the safe areas described in `mobile-runtime.md`.
5. Keep layer and component names in English; keep product copy in Arabic.

## Status

This is a design baseline, not production code. No file under `src/` is changed
by the initial design phase. Implementation work starts from the approved
frames on the `redesign/v2` branch.

The moodboard was generated with the built-in image generation tool using a
`ui-mockup` brief. It intentionally contains no readable text; the SVG frames
are the authoritative source for Arabic copy and layout.
