# Onboarding Intent Toggle Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Career Pivot / Better Opportunity" pill toggle to `TargetRoleStep` so the form's language adapts to both pivot and same-role-advancement use cases.

**Architecture:** Single-component change. Add a local `intent` state (`'pivot' | 'opportunity'`), derive all copy from it, and render a two-pill toggle UI above the heading. No data contract changes.

**Tech Stack:** React, TypeScript, CSS-in-JS via inline styles (matching existing patterns)

---

### Task 1: Add intent state and derived copy to TargetRoleStep

**Files:**
- Modify: `src/components/career-position/TargetRoleStep.tsx`

**Step 1: Add intent state**

At the top of the component, after existing `useState` calls, add:

```tsx
const [intent, setIntent] = useState<'pivot' | 'opportunity'>('pivot')
```

**Step 2: Derive copy from intent**

Add this block immediately after the `intent` state declaration:

```tsx
const copy = intent === 'pivot'
  ? {
      heading: 'Where do you want to go?',
      targetLabel: 'and I want to become a',
      targetPlaceholder: 'e.g. Product Manager',
      helperText: "Not sure of the exact title? Type your best guess — we'll help you find the right target.",
    }
  : {
      heading: 'What are you targeting?',
      targetLabel: "I'm targeting the role of",
      targetPlaceholder: 'e.g. Senior Sales Engineer',
      helperText: "Same title is fine. We'll show you how to position yourself for a better offer.",
    }
```

**Step 3: Replace hardcoded heading and copy in JSX**

Replace the `<h1>` content:
```tsx
// Before
Where do you want to go?

// After
{copy.heading}
```

Replace the target role label:
```tsx
// Before
<p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 8 }}>and I want to become a</p>

// After
<p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 8 }}>{copy.targetLabel}</p>
```

Replace the target role placeholder:
```tsx
// Before
placeholder="e.g. Product Manager"

// After
placeholder={copy.targetPlaceholder}
```

Replace the helper text:
```tsx
// Before
Not sure of the exact title? Type your best guess — we&apos;ll help you find the right target.

// After
{copy.helperText}
```

**Step 4: Commit**

```bash
git add src/components/career-position/TargetRoleStep.tsx
git commit -m "feat: add intent-driven copy to TargetRoleStep"
```

---

### Task 2: Render the pill toggle UI

**Files:**
- Modify: `src/components/career-position/TargetRoleStep.tsx`

**Step 1: Add pill toggle JSX between the step indicator divider and the heading**

Insert this block after the `<div style={{ width: 32, height: 1 ... }} />` divider and before the `<h1>`:

```tsx
<div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
  {(['pivot', 'opportunity'] as const).map((opt) => {
    const label = opt === 'pivot' ? 'Career Pivot' : 'Better Opportunity'
    const active = intent === opt
    return (
      <button
        key={opt}
        onClick={() => setIntent(opt)}
        style={{
          padding: '6px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          border: '1px solid',
          borderColor: active ? 'var(--foreground)' : 'var(--accent-dim)',
          borderRadius: 'var(--radius)',
          background: active ? 'var(--foreground)' : 'transparent',
          color: active ? 'var(--background)' : 'var(--muted)',
          cursor: 'pointer',
          transition: 'all 150ms',
        }}
      >
        {label}
      </button>
    )
  })}
</div>
```

**Step 2: Verify visually**

Run the dev server:
```bash
pnpm dev
```

Navigate to `/dashboard/career-position/onboarding` (step 2 — you'll need to complete CV upload first, or temporarily stub step 1).

Verify:
- Two pills render: "Career Pivot" (active/filled) and "Better Opportunity" (outline)
- Clicking "Better Opportunity" fills that pill and updates the heading, target label, placeholder, and helper text
- Switching back to "Career Pivot" restores original copy
- Form submission still works normally with either mode selected

**Step 3: Commit**

```bash
git add src/components/career-position/TargetRoleStep.tsx
git commit -m "feat: add intent toggle pill UI to onboarding step 2"
```
