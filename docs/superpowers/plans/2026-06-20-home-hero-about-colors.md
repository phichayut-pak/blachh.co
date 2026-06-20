# Home Hero About-Color Alignment Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the About page hero text color treatment to the Home page hero so both pages share the same premium editorial palette.

**Architecture:** Keep the change scoped to the existing Home hero component. Reuse the exact color values already shipping in the About hero rather than introducing new approximations. If the palette may be reused again, consolidate the repeated hex values into named theme tokens after the visual match is confirmed.

**Tech Stack:** Next.js App Router, React, Tailwind CSS v4, Framer Motion

---

### Extracted source palette

**About hero text colors currently in use:**
- Eyebrow: `#8E847B`
- Main heading: `#1C1C1A`
- Accent line: `#7C9360`
- Body copy: `#5C534D`
- Badge text: `#6B625C`

**Current Home hero text colors to replace:**
- Eyebrow: `#1C1C1A80`
- Main heading: `#1C1C1A`
- Body copy: `#1C1C1AB2`
- Rating line: `#1C1C1A99`

**Relevant implementation files:**
- Source palette: `app/about/AboutPageContent.tsx`
- Target hero: `components/home/Hero.tsx`
- Optional token consolidation: `app/globals.css`

---

### Task 1: Match Home hero text colors to the About hero

**Files:**
- Modify: `components/home/Hero.tsx`

- [ ] **Step 1: Update the eyebrow color**

Replace the Home hero eyebrow color `#1C1C1A80` with the About hero eyebrow color `#8E847B`.

- [ ] **Step 2: Keep the main heading base color aligned**

Retain the Home hero main heading color as `#1C1C1A`, since it already matches the About hero heading.

- [ ] **Step 3: Update paragraph color**

Replace the Home hero description color `#1C1C1AB2` with the About hero body color `#5C534D`.

- [ ] **Step 4: Update the supporting rating line**

Replace the Home hero rating color `#1C1C1A99` with either:
- `#6B625C` if the rating should behave like secondary supporting text
- `#5C534D` if the rating should visually sit with the main body copy

Default recommendation: use `#6B625C` to preserve hierarchy between description and rating.

- [ ] **Step 5: Decide whether to add an accent text treatment**

If the customer specifically wants the About hero’s standout green text moment, split the Home `h1` into two styled segments and apply `#7C9360` to the emphasized phrase. If the request is only about general text color mood, leave the Home heading structure unchanged.

### Task 2: Optionally centralize repeated palette values

**Files:**
- Modify: `app/globals.css`
- Modify: `components/home/Hero.tsx`
- Modify: `app/about/AboutPageContent.tsx`

- [ ] **Step 1: Introduce semantic color variables only if reuse is expected**

Add names such as:
- `--color-editorial-heading: #1C1C1A`
- `--color-editorial-eyebrow: #8E847B`
- `--color-editorial-body: #5C534D`
- `--color-editorial-supporting: #6B625C`
- `--color-editorial-accent: #7C9360`

- [ ] **Step 2: Swap component hex literals to the shared tokens**

Only do this if the color treatment is now considered a reusable site pattern, not a one-off Home page tweak.

### Task 3: Verify the match in context

**Files:**
- Verify: `components/home/Hero.tsx`
- Verify: `app/about/AboutPageContent.tsx`

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: no errors

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: successful production build

- [ ] **Step 3: Visual comparison**

Check the Home and About heroes side-by-side and confirm:
- eyebrow color is visually identical
- body copy tone matches
- rating/supporting text sits below body copy in hierarchy
- heading still has enough contrast over the Home hero image overlay

- [ ] **Step 4: Mobile verification**

Confirm the updated colors remain readable at small sizes on the Home hero image, especially where the background is brightest.
