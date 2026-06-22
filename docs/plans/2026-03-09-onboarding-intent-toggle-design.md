# Onboarding Intent Toggle Design

**Date:** 2026-03-09
**Scope:** `src/components/career-position/TargetRoleStep.tsx`

## Problem

The current `TargetRoleStep` form uses pivot-centric language ("I want to become a..."), which feels wrong for users who want the same role at a better company or higher seniority — a common and valid use case.

## Solution

Add a two-option pill toggle (`Career Pivot` | `Better Opportunity`) that adapts the form's heading, labels, placeholders, and helper text. The data contract is unchanged.

## Toggle Options

- **Career Pivot** (default) — user is switching to a different role/industry
- **Better Opportunity** — user wants the same or similar role, better company/seniority

## Copy by Mode

| Element | Career Pivot | Better Opportunity |
|---|---|---|
| Heading | "Where do you want to go?" | "What are you targeting?" |
| Current role label | "I currently work as" | "I currently work as" |
| Target role label | "and I want to become a" | "I'm targeting the role of" |
| Target role placeholder | "e.g. Product Manager" | "e.g. Senior Sales Engineer" |
| Helper text | "Not sure of the exact title? Type your best guess — we'll help you find the right target." | "Same title is fine. We'll show you how to position yourself for a better offer." |

## Constraints

- Toggle state is local to the component — not passed to `onSubmit`
- No backend or API changes required
- Existing `savedTarget` prefill behaviour unchanged
- Visual style follows existing pill/button patterns in the codebase
