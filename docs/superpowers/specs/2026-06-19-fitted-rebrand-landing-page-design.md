# Fitted — rebrand & landing page redesign

**Date:** 2026-06-19
**Status:** Approved

---

## Context

The app is currently named "Pivot" and positioned as a career readiness scoring tool. The actual product does three things: matches a CV to a Job Description, rewrites the CV to maximise fit, and surfaces skill gaps and career positioning signals. The landing page only communicates the score — it does not mention the tailored CV output (the primary value), and it asks users to "name a target role" rather than paste a JD.

This spec covers the rename to **Fitted** and the copy/structure redesign of the landing page to lead with the right output.

---

## Core decisions

**Primary user:** Someone who has a specific job in hand and wants to maximise their application — not someone figuring out which career direction to take.

**Primary output to lead with:** The tailored CV (a full rewrite, ready to download). The match score is secondary — it's proof the rewrite worked.

**Brand vibe:** Friendly and approachable. Anyone can use this, not just polished professionals.

**Name:** Fitted. Tailoring metaphor built in. Works as a past-tense promise ("your CV is fitted to this role") and as an action ("get fitted"). No AI clichés. Plain, active, specific language throughout.

---

## Brand & name

- Name: **Fitted**
- Tagline: **A CV written for this exact job.**
- Visual identity: unchanged. The existing dark editorial theme, mono/display font pairing, and grid layout are already strong.
- Voice: active voice, sentence case headers, no clichés ("seamless", "elevate", "next-gen", "game-changer", "unleash").
- All instances of "Pivot" → "Fitted" across the codebase and metadata.

---

## Landing page structure

```
Hero
How it works
Report preview
Features
Pricing
CTA
```

Structure unchanged from current. Copy and feature ordering updated throughout.

---

## Section designs

### Hero

**Overline:** CV matching & tailoring

**H1:**
```
Your CV, rewritten
for this exact job.
```

**Italic accent line:** In under a minute.

**Body:**
Paste the job description. Upload your CV. Fitted matches your experience to the role — then rewrites your CV to give you the best shot at it.

**Primary CTA:** Tailor my CV →
**Secondary CTA:** See a sample report

**SVG pipeline illustration:** Update from `CV → Analysis → Score` to `JD + CV → Analysis → Tailored CV + Score`. Two inputs shown (JD document + CV document), two outputs shown (tailored CV + score circle).

**Stats strip:**
- `~60 sec` · analysis & rewrite
- `0–100` · match score
- `free` · to start

---

### How it works

**Section label:** How it works

**H2:**
```
Three steps.
Sixty seconds.
```

**Step 01 — Paste the job description**
Drop in the full JD from any job board. Fitted extracts exactly what the role requires — skills, experience, language, priorities.

**Step 02 — Upload your CV**
We read what you've actually done, not just your titles. Your experience is mapped against the role's real requirements.

**Step 03 — Get your tailored CV**
A complete rewrite, ready to download. Plus a 0–100 match score so you know exactly where you stood — and how much ground you gained.

---

### Features

**Section label:** What Fitted delivers

**H2:**
```
Seven outputs.
One application.
```

Features in order:

| # | Name | Description |
|---|------|-------------|
| 01 | Tailored CV | A complete rewrite of your CV, optimised for this specific role. Download and send. |
| 02 | Match score | A precise 0–100 measure of fit between your experience and the role. Not vague feedback — a defensible number. |
| 03 | Skill gap mapping | Every gap between your CV and the JD, named clearly. No euphemisms. |
| 04 | Transferable skills | Hidden leverage in your existing experience, surfaced and ranked by relevance to this role. |
| 05 | Entry point discovery | The adjacent roles that accelerate your path if this one isn't quite ready yet. |
| 06 | Strongest narrative | Your career story, extracted and structured for this application. |
| 07 | Progress tracking | Retake the analysis as you update your CV. Watch your score move. Know what's working. |

Layout: 2-column grid (existing). 7 items = 3 full rows + 1 remainder. Last item spans full width or pairs with a pull quote — decision deferred to implementation.

---

### Report preview

No structural change. Update section label to "See what you get." Ensure the sample shown includes the tailored CV output alongside the match score, not just the score report.

---

### Pricing

No structural change. Update any references from "Pivot" to "Fitted." Lead with "tailored CV" as the primary per-tier benefit where copy currently leads with "readiness score."

---

### CTA

**H2:**
```
The job is open now.
Your CV should say the right things.
```

**CTA:** Tailor my CV →

---

### Navigation

- Logo/wordmark: Pivot → Fitted
- Nav links: unchanged

---

## Page metadata

```
title: Fitted — A CV written for this exact job
description: Paste the job description. Upload your CV. Fitted rewrites your CV to match the role and shows you a precise 0–100 match score — in under a minute.
keywords: CV tailoring, job description match, tailored CV, CV rewrite, match score, skill gap, career readiness, resume optimisation
og:title: Fitted — A CV written for this exact job
og:description: Paste the job description. Upload your CV. Fitted rewrites your CV to match the role — in under a minute.
twitter:title: Fitted — A CV written for this exact job
twitter:description: Paste the job description. Upload your CV. Fitted rewrites your CV to match the role — in under a minute.
```

---

## Files to change

| File | Change |
|------|--------|
| `src/app/page.tsx` | Update metadata (title, description, keywords, og, twitter) |
| `src/components/marketing/hero.tsx` | Full copy rewrite + SVG pipeline update |
| `src/components/marketing/how-it-works.tsx` | Step copy rewrite |
| `src/components/marketing/features.tsx` | Reorder features, add tailored CV as #01, update section label and H2 |
| `src/components/marketing/cta.tsx` | Update headline and CTA copy |
| `src/components/marketing/pricing.tsx` | Replace "Pivot" with "Fitted", lead with tailored CV benefit |
| `src/components/marketing/report-preview.tsx` | Update section label |
| Any nav/header component | Logo wordmark: Pivot → Fitted |

---

## Out of scope

- Visual redesign (typography, color, spacing, animations are already strong)
- New pages or routes
- App-side copy (dashboard, onboarding) — separate effort
- Domain change (cvjobmatcher.com stays for now)
