# Hero Illustration — Design Spec

**Date:** 2026-06-19
**Status:** Approved

## Summary

Replace the score card widget in the hero's right column with a custom inline SVG illustration. The illustration uses a horizontal pipeline composition (CV → analysis → score) in a minimal line-art style that matches the site's dark, monospace, thin-stroke aesthetic.

## What Changes

Single file: `src/components/marketing/hero.tsx`

- Remove the `scoreCard` data object (lines 6–15)
- Replace the `<motion.div>` score card block (lines 177–266) with a `<motion.div>` wrapping an inline SVG illustration
- The wrapping `motion.div` keeps its existing entrance animation (`opacity: 0, x: 32 → opacity: 1, x: 0`), border, sizing, and `hero-score-card` class (which hides it below 860px)

## Illustration Spec

**Composition:** Horizontal pipeline — three stages reading left to right.

**Stage 1 — CV document**
- Rectangle outline, no fill
- Horizontal rule lines inside (document feel)
- Monospace label `CV` at top, `YOUR CV` below the shape
- Stroke: `var(--accent-dim)`

**Stage 2 — Analysis box**
- Rectangle outline, no fill
- Horizontal scan lines inside at low opacity
- Three blinking-dot decorations on a centre line (suggesting processing)
- Target role ("Head of Product") feeds in from above via a dashed line and downward arrow
- Monospace label `ANALYSIS` below the shape
- Stroke: `var(--accent-dim)` for box, `var(--muted)` for scan lines

**Stage 3 — Score circle**
- Circle outline, no fill
- Large score number (`78`) centred inside
- Tick marks at 12, 3, 6, 9 o'clock
- Monospace label `SCORE` below
- Stroke: `var(--accent)` (brighter, the payoff)
- Number: `var(--foreground)`

**Arrows**
- Solid horizontal line with a chevron polyline tip
- Arrow 1 (CV → analysis): `var(--accent-dim)`
- Arrow 2 (analysis → score): `var(--accent)` (brightens as we reach the result)

**Typography**
- All labels: `font-family: var(--font-mono)`, `font-size: 9px`, `letter-spacing: 0.14em`, `text-transform: uppercase`
- Score number: `font-family: var(--font-display)`, `font-size: 28px`

**SVG dimensions:** `viewBox="0 0 340 180"`, width fills the column, height auto.

**No animation** on the SVG itself — the wrapping `motion.div` slide-in handles the entrance.

## What Does Not Change

- Hero copy (headline, subheadline, body text)
- CTA buttons
- Bottom stats strip
- Responsive breakpoint (`hero-score-card` hidden below 860px)
- All other marketing components
