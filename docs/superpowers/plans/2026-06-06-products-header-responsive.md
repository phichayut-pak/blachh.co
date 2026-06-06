# Products Header Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive products header with a smaller mobile title, swipeable category row, a pinned filter icon trigger, a mobile bottom sheet, and a desktop popover.

**Architecture:** Keep `app/products/page.tsx` as a server route and move the interactive header/filter behavior into a focused client component inside `components/products`. Reuse one filter-content rendering path across mobile and desktop while preserving immediate category switching and staged advanced filters.

**Tech Stack:** Next.js App Router, React 19 client components, Tailwind CSS, Swiper, Framer Motion, Lucide, Base UI Popover

---

### Task 1: Define interactive products header boundary

**Files:**
- Modify: `components/products/ProductsPage.tsx`
- Create: `components/products/ProductsHeader.tsx`

- [ ] Extract header interactivity into a client component so the page route can stay server-rendered.
- [ ] Pass static category data and the active category into the client component.
- [ ] Remove the fixed-height mobile header layout in favor of content-driven spacing.

### Task 2: Add responsive category row and filter state

**Files:**
- Modify: `components/products/ProductsPage.tsx`
- Modify: `components/products/ProductsHeader.tsx`

- [ ] Add category tabs that switch immediately when tapped.
- [ ] Render mobile categories in a horizontal Swiper lane with reserved trailing space for the pinned filter button.
- [ ] Add staged advanced filter state that resets on close and commits only on apply.

### Task 3: Implement mobile sheet and desktop popover

**Files:**
- Modify: `components/products/ProductsHeader.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] Use `framer-motion` for the mobile bottom sheet enter/exit animation and backdrop.
- [ ] Keep the mobile `Apply` button sticky at the bottom of the sheet and full width.
- [ ] Use `@base-ui/react` popover for the desktop filter panel anchored below the trigger.

### Task 4: Wire filtering into product rendering

**Files:**
- Modify: `components/products/ProductsPage.tsx`

- [ ] Extend product data with categories/tags that support the new UI.
- [ ] Filter the rendered product grid from the applied category and advanced filter state.
- [ ] Preserve the current grid layout while making the filtering behavior deterministic.

### Task 5: Verify and review

**Files:**
- Modify: `components/products/ProductsPage.tsx`
- Modify: `components/products/ProductsHeader.tsx`

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Review the final diff for responsive layout regressions and unused code.
