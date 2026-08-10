# Kirant Hotel

Luxury hotel marketing site for **Kirant**, built from the design system tokens in `.cursor/design.md` and the live page structure at [kirant.webxnepal.com](https://kirant.webxnepal.com/).

## Pages

- `/` — Home
- `/rooms` — Rooms & suites
- `/dining` — Dining
- `/wellness` — Wellness & spa
- `/about` — Brand story

## Design tokens

Semantic CSS variables live in `src/styles/tokens.css` (Jost body, black/white/forest green surfaces, spacing & motion scales). Display headings use Cormorant Garamond with gold brand accents from the visual system.

## Accessibility

- Skip link, semantic landmarks, focus-visible styles
- Keyboard-operable menu, booking form, and carousel controls
- Button states: default, hover, focus-visible, active, disabled, loading, error

## Develop

```bash
cd kirant
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
