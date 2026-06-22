# Hero Illustration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the score card widget in the hero's right column with a custom inline SVG illustration showing a CV → analysis → score pipeline.

**Architecture:** Single file edit to `src/components/marketing/hero.tsx`. Remove the `scoreCard` data object and swap the score card `motion.div` for one wrapping an inline SVG. The wrapping `motion.div` keeps its entrance animation but loses its border/padding/background — the illustration provides its own visual weight.

**Tech Stack:** React, Next.js, Framer Motion, inline SVG, CSS custom properties

---

### Task 1: Remove the score card, add the SVG illustration

**Files:**
- Modify: `src/components/marketing/hero.tsx`

- [ ] **Step 1: Delete the `scoreCard` data object**

Remove lines 6–15 (the entire `const scoreCard = { ... }` block) from the top of the file.

- [ ] **Step 2: Replace the score card `motion.div` with the illustration**

Find this block (starts around line 177 after the data object is removed):

```tsx
        {/* Right: score card preview */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="hero-score-card"
          style={{
            border: '1px solid var(--accent-dim)',
            padding: '32px',
            background: 'var(--surface)',
            position: 'relative',
          }}
        >
```

Replace the entire block (from `{/* Right: score card preview */}` through the closing `</motion.div>` at line 266) with:

```tsx
        {/* Right: pipeline illustration */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="hero-score-card"
          style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
        >
          <svg
            viewBox="0 0 352 165"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto' }}
          >
            {/* Stage 1: CV document */}
            <rect x="10" y="46" width="56" height="74" rx="1" stroke="var(--accent-dim)" strokeWidth="1" />
            <text x="38" y="60" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--subtle)" letterSpacing="2">CV</text>
            <line x1="20" y1="68" x2="56" y2="68" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.5" />
            <line x1="20" y1="76" x2="56" y2="76" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.5" />
            <line x1="20" y1="84" x2="46" y2="84" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.5" />
            <line x1="20" y1="92" x2="54" y2="92" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.5" />
            <line x1="20" y1="100" x2="40" y2="100" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.5" />
            <text x="38" y="135" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--subtle)" letterSpacing="2">YOUR CV</text>

            {/* Arrow 1: CV → analysis */}
            <line x1="68" y1="83" x2="110" y2="83" stroke="var(--accent-dim)" strokeWidth="1" />
            <polyline points="106,79 110,83 106,87" stroke="var(--accent-dim)" strokeWidth="1" fill="none" />

            {/* Target role feeds in from above */}
            <rect x="124" y="18" width="80" height="22" rx="1" stroke="var(--accent-dim)" strokeWidth="0.75" strokeDasharray="2 2" />
            <text x="164" y="33" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--muted)" letterSpacing="0.5">Head of Product</text>
            <line x1="164" y1="40" x2="164" y2="54" stroke="var(--accent-dim)" strokeWidth="0.75" strokeDasharray="2 2" />
            <polyline points="160,50 164,54 168,50" stroke="var(--accent-dim)" strokeWidth="0.75" fill="none" />

            {/* Stage 2: Analysis box */}
            <rect x="112" y="56" width="104" height="56" rx="1" stroke="var(--muted)" strokeWidth="1" />
            <line x1="122" y1="68" x2="206" y2="68" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            <line x1="122" y1="76" x2="206" y2="76" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            <line x1="122" y1="84" x2="206" y2="84" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            <line x1="122" y1="92" x2="206" y2="92" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            <line x1="122" y1="100" x2="206" y2="100" stroke="var(--accent-dim)" strokeWidth="0.75" opacity="0.4" />
            {/* scanning highlight */}
            <line x1="122" y1="76" x2="172" y2="76" stroke="var(--muted)" strokeWidth="1" />
            {/* processing dots */}
            <circle cx="146" cy="84" r="2" fill="var(--accent-dim)" />
            <circle cx="164" cy="84" r="2" fill="var(--muted)" />
            <circle cx="182" cy="84" r="2" fill="var(--accent-dim)" />
            <text x="164" y="128" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--subtle)" letterSpacing="2">ANALYSIS</text>

            {/* Arrow 2: analysis → score (brighter) */}
            <line x1="218" y1="83" x2="244" y2="83" stroke="var(--accent)" strokeWidth="1" />
            <polyline points="240,79 244,83 240,87" stroke="var(--accent)" strokeWidth="1" fill="none" />

            {/* Stage 3: Score circle */}
            <circle cx="290" cy="83" r="48" stroke="var(--accent)" strokeWidth="1" />
            <text x="290" y="96" textAnchor="middle" fontFamily="var(--font-display)" fontSize="36" fill="var(--foreground)" letterSpacing="-2">78</text>
            {/* tick marks at 12 / 3 / 6 / 9 */}
            <line x1="290" y1="32" x2="290" y2="38" stroke="var(--accent-dim)" strokeWidth="0.75" />
            <line x1="290" y1="128" x2="290" y2="134" stroke="var(--accent-dim)" strokeWidth="0.75" />
            <line x1="339" y1="83" x2="345" y2="83" stroke="var(--accent-dim)" strokeWidth="0.75" />
            <line x1="235" y1="83" x2="241" y2="83" stroke="var(--accent-dim)" strokeWidth="0.75" />
            <text x="290" y="150" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--subtle)" letterSpacing="2">SCORE</text>
          </svg>
        </motion.div>
```

- [ ] **Step 3: Start the dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:3000` and check:
- The illustration appears in the hero's right column on desktop (≥ 860px wide)
- The illustration slides in from the right on load (same entrance as the old score card)
- The illustration is hidden on mobile (the `hero-score-card` class handles this)
- Colors match the rest of the hero — stroke colors feel consistent, the score circle accent matches the CTA and headline accent
- The `78` number uses the display font, labels use mono
- The dashed "Head of Product" role box sits above the analysis box and connects to it

- [ ] **Step 4: Commit**

```bash
git add src/components/marketing/hero.tsx
git commit -m "feat: replace hero score card with inline SVG pipeline illustration"
```
