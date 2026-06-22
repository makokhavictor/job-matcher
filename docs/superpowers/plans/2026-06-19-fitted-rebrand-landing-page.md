# Fitted — Rebrand & Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the product from "Pivot" to "Fitted" and rewrite the marketing landing page to lead with the tailored CV output rather than the readiness score.

**Architecture:** Pure copy and structure changes across 10 files — no new components, no logic changes. The visual design (typography, color, spacing, animations) stays unchanged. Backend data property names (`pivot_readiness_score`, etc.) are out of scope — this is marketing copy only.

**Tech Stack:** Next.js App Router, React, inline styles, Framer Motion (existing — no new dependencies)

---

## File map

| File | What changes |
|------|-------------|
| `src/app/page.tsx` | Title, description, keywords, og/twitter metadata |
| `src/components/layout/main-nav.tsx` | Logo wordmark: "Pivot" → "Fitted" |
| `src/components/marketing/hero.tsx` | Full copy rewrite + SVG pipeline illustration |
| `src/components/marketing/how-it-works.tsx` | All three step titles and body copy |
| `src/components/marketing/features.tsx` | Section label, H2, feature list (reordered + new item) |
| `src/components/marketing/cta.tsx` | Overline, H2, body, CTA button label |
| `src/components/marketing/pricing.tsx` | Feature list item: "Pivot Readiness Score" → "CV tailoring & match score" |
| `src/components/marketing/report-preview.tsx` | "Pivot Readiness" label → "Match score" |
| `src/app/(auth)/register/page.tsx` | Metadata title/description, brand panel wordmark + body copy |
| `src/app/(auth)/login/page.tsx` | Metadata title, brand panel wordmark |
| `src/app/(app)/dashboard/page.tsx` | Example placeholder copy on line 50 |

---

## Task 1: Page metadata

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update metadata**

Replace the entire `metadata` export:

```tsx
export const metadata: Metadata = {
  title: 'Fitted — A CV written for this exact job',
  description: 'Paste the job description. Upload your CV. Fitted rewrites your CV to match the role and shows you a precise 0–100 match score — in under a minute.',
  keywords: 'CV tailoring, job description match, tailored CV, CV rewrite, match score, skill gap mapping, career readiness, resume optimisation, job application tool',
  openGraph: {
    title: 'Fitted — A CV written for this exact job',
    description: 'Paste the job description. Upload your CV. Fitted rewrites your CV to match the role — in under a minute.',
    url: 'https://fitted.careers',
    siteName: 'Fitted',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fitted — CV matching and tailoring',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitted — A CV written for this exact job',
    description: 'Paste the job description. Upload your CV. Fitted rewrites your CV to match the role — in under a minute.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

- [ ] **Step 2: Verify**

```bash
grep -n "Pivot\|pivot" src/app/page.tsx
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: update page metadata for Fitted rebrand"
```

---

## Task 2: Nav wordmark

**Files:**
- Modify: `src/components/layout/main-nav.tsx`

- [ ] **Step 1: Update logo wordmark**

Find the logo `<Link>` block (around line 38). Replace the inner `<span>`:

```tsx
// Before
Pivot<span style={{ color: 'var(--accent)' }}>.</span>

// After
Fitted<span style={{ color: 'var(--accent)' }}>.</span>
```

- [ ] **Step 2: Verify**

```bash
grep -n "Pivot\|pivot" src/components/layout/main-nav.tsx
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/main-nav.tsx
git commit -m "feat: update nav wordmark to Fitted"
```

---

## Task 3: Hero copy

**Files:**
- Modify: `src/components/marketing/hero.tsx`

- [ ] **Step 1: Update overline label**

```tsx
// Before
Career Readiness Score

// After
CV matching & tailoring
```

- [ ] **Step 2: Update H1**

```tsx
// Before
<motion.h1 ...>
  You don&apos;t know
  <br />
  if you&apos;re ready to pivot.
</motion.h1>

// After
<motion.h1 ...>
  Your CV, rewritten
  <br />
  for this exact job.
</motion.h1>
```

- [ ] **Step 3: Update italic accent line**

```tsx
// Before
<em ...>Until now.</em>

// After — wrap in motion.p as before, same styles
<em ...>In under a minute.</em>
```

- [ ] **Step 4: Update body copy**

```tsx
// Before
Upload your CV. Name your target role. Get a precise 0–100 score
measuring exactly how ready you are to make that career move.

// After
Paste the job description. Upload your CV. Fitted matches your
experience to the role — then rewrites your CV to give you the
best shot at it.
```

- [ ] **Step 5: Update CTA buttons**

```tsx
// Primary CTA — before
Get my score

// Primary CTA — after
Tailor my CV

// Secondary CTA stays the same: "See a sample report"
```

- [ ] **Step 6: Update stats strip**

```tsx
// Before
{ label: '~40 sec', desc: 'analysis time' },
{ label: '0–100', desc: 'readiness score' },
{ label: 'free', desc: 'to start' },

// After
{ label: '~60 sec', desc: 'analysis & rewrite' },
{ label: '0–100', desc: 'match score' },
{ label: 'free', desc: 'to start' },
```

- [ ] **Step 7: Verify no stale copy remains**

```bash
grep -n "Pivot\|pivot\|ready to pivot\|Name your target\|readiness" src/components/marketing/hero.tsx
```

Expected: no output (except possibly in SVG comments — those will be cleaned in Task 4).

- [ ] **Step 8: Commit**

```bash
git add src/components/marketing/hero.tsx
git commit -m "feat: rewrite hero copy to lead with tailored CV output"
```

---

## Task 4: Hero SVG pipeline illustration

**Files:**
- Modify: `src/components/marketing/hero.tsx`

The current SVG shows: `CV → Analysis → Score`. Replace the entire SVG with a version showing: `JD + CV → Analysis → Tailored CV + Score`.

- [ ] **Step 1: Replace the SVG in the right column of the hero grid**

Find the `<svg viewBox="0 0 352 165" ...>` block and replace it entirely:

```tsx
<svg
  viewBox="0 0 352 165"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  style={{ width: '100%', height: 'auto' }}
>
  {/* === LEFT: Two input docs (JD + CV stacked) === */}
  {/* JD doc (back) */}
  <rect x="4" y="32" width="42" height="56" rx="1" stroke="var(--subtle)" strokeWidth="1" />
  <text x="25" y="46" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="var(--muted)" letterSpacing="1.5px">JD</text>
  <line x1="12" y1="53" x2="38" y2="53" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />
  <line x1="12" y1="60" x2="38" y2="60" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />
  <line x1="12" y1="67" x2="34" y2="67" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />
  <line x1="12" y1="74" x2="38" y2="74" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />

  {/* CV doc (front, offset — fill occludes back doc) */}
  <rect x="14" y="42" width="42" height="56" rx="1" stroke="var(--muted)" strokeWidth="1" fill="var(--background)" />
  <text x="35" y="56" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="var(--muted)" letterSpacing="1.5px">CV</text>
  <line x1="22" y1="63" x2="48" y2="63" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />
  <line x1="22" y1="70" x2="48" y2="70" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />
  <line x1="22" y1="77" x2="44" y2="77" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />
  <line x1="22" y1="84" x2="48" y2="84" stroke="var(--subtle)" strokeWidth="0.75" opacity="0.5" />
  <text x="28" y="116" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--muted)" letterSpacing="2px">JD + CV</text>

  {/* Arrow 1: inputs → analysis */}
  <line x1="58" y1="70" x2="96" y2="70" stroke="var(--subtle)" strokeWidth="1" />
  <polyline points="92,66 96,70 92,74" stroke="var(--subtle)" strokeWidth="1" fill="none" />

  {/* === ANALYSIS box === */}
  <rect x="98" y="42" width="96" height="56" rx="1" stroke="var(--muted)" strokeWidth="1" />
  <line x1="108" y1="54" x2="184" y2="54" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
  <line x1="108" y1="62" x2="184" y2="62" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
  <line x1="108" y1="70" x2="184" y2="70" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
  <line x1="108" y1="78" x2="184" y2="78" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
  <line x1="108" y1="86" x2="184" y2="86" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
  {/* scanning highlight */}
  <line x1="108" y1="62" x2="148" y2="62" stroke="var(--muted)" strokeWidth="1" />
  {/* processing dots */}
  <circle cx="136" cy="70" r="2" fill="var(--subtle)" />
  <circle cx="146" cy="70" r="2" fill="var(--muted)" />
  <circle cx="156" cy="70" r="2" fill="var(--subtle)" />
  <text x="146" y="116" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--muted)" letterSpacing="2px">ANALYSIS</text>

  {/* === FORK: analysis → two outputs === */}
  {/* Main stem */}
  <line x1="196" y1="70" x2="214" y2="70" stroke="var(--accent)" strokeWidth="1" />
  {/* Vertical splitter */}
  <line x1="214" y1="44" x2="214" y2="108" stroke="var(--accent)" strokeWidth="1" />
  {/* Upper branch → tailored CV */}
  <line x1="214" y1="44" x2="228" y2="44" stroke="var(--accent)" strokeWidth="1" />
  <polyline points="224,40 228,44 224,48" stroke="var(--accent)" strokeWidth="1" fill="none" />
  {/* Lower branch → score */}
  <line x1="214" y1="108" x2="228" y2="108" stroke="var(--accent)" strokeWidth="1" />
  <polyline points="224,104 228,108 224,112" stroke="var(--accent)" strokeWidth="1" fill="none" />

  {/* === OUTPUT 1: Tailored CV doc (upper right) === */}
  <rect x="230" y="22" width="42" height="50" rx="1" stroke="var(--accent)" strokeWidth="1" />
  <text x="251" y="36" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill="var(--accent)" letterSpacing="1px">FITTED</text>
  <text x="251" y="45" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill="var(--accent)" letterSpacing="1.5px">CV</text>
  <line x1="238" y1="51" x2="264" y2="51" stroke="var(--accent)" strokeWidth="0.75" opacity="0.5" />
  <line x1="238" y1="57" x2="264" y2="57" stroke="var(--accent)" strokeWidth="0.75" opacity="0.5" />
  <line x1="238" y1="63" x2="258" y2="63" stroke="var(--accent)" strokeWidth="0.75" opacity="0.5" />

  {/* === OUTPUT 2: Score circle (lower right) === */}
  <circle cx="258" cy="114" r="28" stroke="var(--accent)" strokeWidth="1" />
  <text x="258" y="122" textAnchor="middle" fontFamily="var(--font-display)" fontSize="26" fill="var(--foreground)" letterSpacing="-1px">82</text>
  {/* tick marks */}
  <line x1="258" y1="83" x2="258" y2="88" stroke="var(--accent-dim)" strokeWidth="0.75" />
  <line x1="258" y1="140" x2="258" y2="145" stroke="var(--accent-dim)" strokeWidth="0.75" />
  <line x1="287" y1="114" x2="292" y2="114" stroke="var(--accent-dim)" strokeWidth="0.75" />
  <line x1="224" y1="114" x2="229" y2="114" stroke="var(--accent-dim)" strokeWidth="0.75" />
  <text x="258" y="155" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--muted)" letterSpacing="2px">SCORE</text>
</svg>
```

- [ ] **Step 2: Verify SVG renders without errors**

Run the dev server and check the hero visually:

```bash
pnpm dev
```

Open `http://localhost:3000` and confirm:
- Two overlapping docs on the left (JD behind, CV in front)
- Analysis box in the centre
- Fork branching to "FITTED CV" doc (upper right) and score circle (lower right)
- No layout overflow or clipping

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/hero.tsx
git commit -m "feat: update hero SVG to show JD+CV inputs and tailored CV+score outputs"
```

---

## Task 5: How It Works copy

**Files:**
- Modify: `src/components/marketing/how-it-works.tsx`

- [ ] **Step 1: Update section H2**

```tsx
// Before
Three steps.<br />
<em ...>Forty seconds.</em>

// After
Three steps.<br />
<em ...>Sixty seconds.</em>
```

- [ ] **Step 2: Replace the steps array**

```tsx
const steps = [
  {
    num: '01',
    title: 'Paste the job description',
    body: 'Drop in the full JD from any job board. Fitted extracts exactly what the role requires — skills, experience, language, priorities.',
  },
  {
    num: '02',
    title: 'Upload your CV',
    body: "We read what you've actually done, not just your titles. Your experience is mapped against the role's real requirements.",
  },
  {
    num: '03',
    title: 'Get your tailored CV',
    body: 'A complete rewrite, ready to download. Plus a 0–100 match score so you know exactly where you stood — and how much ground you gained.',
  },
]
```

- [ ] **Step 3: Verify**

```bash
grep -n "Pivot\|pivot\|target role\|ready to" src/components/marketing/how-it-works.tsx
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/components/marketing/how-it-works.tsx
git commit -m "feat: rewrite How It Works steps to show JD→CV→tailored CV flow"
```

---

## Task 6: Features section

**Files:**
- Modify: `src/components/marketing/features.tsx`

- [ ] **Step 1: Update section overline**

```tsx
// Before
What Pivot measures

// After
What Fitted delivers
```

- [ ] **Step 2: Update section H2**

```tsx
// Before
Six signals.<br />
<em ...>One number.</em>

// After
Seven outputs.<br />
<em ...>One application.</em>
```

- [ ] **Step 3: Replace the signals array**

```tsx
const signals = [
  {
    num: '01',
    name: 'Tailored CV',
    description: 'A complete rewrite of your CV, optimised for this specific role. Download and send.',
  },
  {
    num: '02',
    name: 'Match score',
    description: 'A precise 0–100 measure of fit between your experience and the role. Not vague feedback — a defensible number.',
  },
  {
    num: '03',
    name: 'Skill gap mapping',
    description: 'Every gap between your CV and the JD, named clearly. No euphemisms.',
  },
  {
    num: '04',
    name: 'Transferable skills',
    description: 'Hidden leverage in your existing experience, surfaced and ranked by relevance to this role.',
  },
  {
    num: '05',
    name: 'Entry point discovery',
    description: "The adjacent roles that accelerate your path if this one isn't quite ready yet.",
  },
  {
    num: '06',
    name: 'Strongest narrative',
    description: 'Your career story, extracted and structured for this application.',
  },
  {
    num: '07',
    name: 'Progress tracking',
    description: "Retake the analysis as you update your CV. Watch your score move. Know what's working.",
  },
]
```

Note: 7 items in a 2-column grid produces a last row with one item. The grid CSS uses `border-left` and `border-top` on the container and `border-right`/`border-bottom` on each cell. The 7th cell will span one column — this is acceptable visually; no layout change needed.

- [ ] **Step 4: Verify**

```bash
grep -n "Pivot\|pivot\|Six signals\|One number" src/components/marketing/features.tsx
```

Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/features.tsx
git commit -m "feat: reorder features to lead with tailored CV, add 7th output"
```

---

## Task 7: CTA section

**Files:**
- Modify: `src/components/marketing/cta.tsx`

- [ ] **Step 1: Update overline**

```tsx
// Before
Your first score

// After
Ready when you are
```

- [ ] **Step 2: Update H2**

```tsx
// Before
You&apos;ve been applying
<br />
without a number.
<br />
<em style={{ fontStyle: 'italic', opacity: 0.55 }}>Now you can have one.</em>

// After
The job is open now.
<br />
Your CV should say
<br />
<em style={{ fontStyle: 'italic', opacity: 0.55 }}>the right things.</em>
```

- [ ] **Step 3: Update body copy**

```tsx
// Before
Takes 40 seconds. Costs nothing to start.

// After
Takes 60 seconds. Costs nothing to start.
```

- [ ] **Step 4: Update primary CTA button**

```tsx
// Before
Get my score →

// After
Tailor my CV →
```

- [ ] **Step 5: Verify**

```bash
grep -n "Pivot\|pivot\|Get my score\|without a number\|first score" src/components/marketing/cta.tsx
```

Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add src/components/marketing/cta.tsx
git commit -m "feat: rewrite CTA section copy for Fitted rebrand"
```

---

## Task 8: Pricing copy

**Files:**
- Modify: `src/components/marketing/pricing.tsx`

- [ ] **Step 1: Update feature item**

```tsx
// Before (line 15)
'Pivot Readiness Score (0–100)',

// After
'CV tailoring & match score (0–100)',
```

- [ ] **Step 2: Verify**

```bash
grep -n "Pivot\|pivot" src/components/marketing/pricing.tsx
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/pricing.tsx
git commit -m "feat: update pricing feature copy for Fitted rebrand"
```

---

## Task 9: Report preview labels

**Files:**
- Modify: `src/components/marketing/report-preview.tsx`

- [ ] **Step 1: Find and replace "Pivot Readiness" label**

Around line 120, there is a "Pivot Readiness" text label inside the score preview block. Replace:

```tsx
// Before
Pivot Readiness

// After
Match score
```

- [ ] **Step 2: Verify**

```bash
grep -n "Pivot\|pivot" src/components/marketing/report-preview.tsx
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/report-preview.tsx
git commit -m "feat: update report preview label for Fitted rebrand"
```

---

## Task 10: Auth pages — register and login

**Files:**
- Modify: `src/app/(auth)/register/page.tsx`
- Modify: `src/app/(auth)/login/page.tsx`

- [ ] **Step 1: Update register page metadata**

```tsx
// Before
export const metadata: Metadata = {
  title: 'Create Account | Pivot',
  description: 'Create an account to discover your Pivot Readiness Score and understand your career position.',
  ...
}

// After
export const metadata: Metadata = {
  title: 'Create account | Fitted',
  description: 'Create an account to tailor your CV to any job description and get a precise match score.',
  ...
}
```

- [ ] **Step 2: Update register page brand panel wordmark and body copy**

Find the brand panel on the left side (around line 59):

```tsx
// Before — wordmark
}}>Pivot</p>

// After
}}>Fitted</p>
```

Find the body copy (around line 89):

```tsx
// Before
Upload your CV, set a target role, and receive a Pivot Readiness Score

// After
Paste a job description, upload your CV, and get a tailored CV ready to send
```

- [ ] **Step 3: Update login page metadata**

```tsx
// Before
export const metadata: Metadata = {
  title: 'Login | Pivot',
  ...
}

// After
export const metadata: Metadata = {
  title: 'Sign in | Fitted',
  ...
}
```

- [ ] **Step 4: Update login page brand panel wordmark**

Find the brand panel wordmark (around line 59):

```tsx
// Before
}}>Pivot</p>

// After
}}>Fitted</p>
```

- [ ] **Step 5: Verify**

```bash
grep -rn "Pivot\|pivot" src/app/\(auth\)/
```

Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(auth\)/register/page.tsx src/app/\(auth\)/login/page.tsx
git commit -m "feat: update auth pages wordmark and copy for Fitted rebrand"
```

---

## Task 11: Dashboard example copy

**Files:**
- Modify: `src/app/(app)/dashboard/page.tsx`

- [ ] **Step 1: Update example placeholder copy (line 50)**

```tsx
// Before
Example: Sarah, 6 years in finance → Pivot Readiness 71 for Fintech PM

// After
Example: Sarah, 6 years in finance → Match score 71 for Fintech PM
```

Note: `r.pivot_readiness_score` on line 71 is a backend data property name — do NOT rename it.

- [ ] **Step 2: Verify no user-visible "Pivot" copy remains**

```bash
grep -n "Pivot\|pivot" src/app/\(app\)/dashboard/page.tsx
```

Expected: only the data property `pivot_readiness_score` — not copy strings.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(app\)/dashboard/page.tsx
git commit -m "feat: update dashboard example copy for Fitted rebrand"
```

---

## Task 12: Final sweep

- [ ] **Step 1: Check for any remaining "Pivot" references in marketing/app copy**

```bash
grep -rn "Pivot\|pivot" src/ --include="*.tsx" --include="*.ts" | grep -v "pivot_readiness_score\|pivot_score\|node_modules"
```

Expected: no output (or only backend property names like `pivot_readiness_score`).

- [ ] **Step 2: Smoke test the landing page**

```bash
pnpm dev
```

Open `http://localhost:3000` and verify:
- Nav shows "Fitted."
- Hero headline reads "Your CV, rewritten / for this exact job."
- SVG shows two inputs (JD + CV stack) and two outputs (tailored CV doc + score circle)
- How It Works step 01 reads "Paste the job description"
- Features section starts with "Tailored CV" as item 01
- CTA reads "The job is open now."

- [ ] **Step 3: Check register and login pages**

Open `http://localhost:3000/register` and `http://localhost:3000/login`. Confirm both brand panels show "Fitted" not "Pivot".

- [ ] **Step 4: Final commit if any stragglers found**

```bash
git add -p   # stage only copy files, not data model files
git commit -m "feat: clean up remaining Pivot references in marketing copy"
```
