# Hero Section Clarity — Design Spec

**Date:** 2026-06-18  
**Scope:** `src/components/marketing/hero.tsx` — copy only, no layout or style changes

## Problem

The hero headline carries all the visual weight but gives no category signal. A first-time visitor sees "You don't know where you stand. Until now." and cannot determine whether this is a finance, fitness, or career product. The eyebrow label "Pivot Readiness" reads as an internal product name rather than a category descriptor.

## Solution

Two copy changes to the hero, no structural or styling changes:

| Element | Before | After |
|---|---|---|
| Eyebrow | `Pivot Readiness` | `Career Readiness Score` |
| H1 | `You don't know where you stand.` | `You don't know if you're ready to pivot.` |

Everything else — italic "Until now.", body copy, CTAs, score card, bottom stats — stays exactly as-is.

## Rationale

- The eyebrow is the first thing readers scan. Changing it to "Career Readiness Score" immediately anchors the product category before the headline lands.
- Tweaking the H1 to include "ready to pivot" makes the career-transition subject explicit while preserving the provocative problem-framing structure.
- The body copy ("Upload your CV. Name your target role. Get a precise 0–100 score...") is already clear and requires no changes.

## Out of scope

- Layout, grid, animations, colors
- Score card content
- Any section below the hero
