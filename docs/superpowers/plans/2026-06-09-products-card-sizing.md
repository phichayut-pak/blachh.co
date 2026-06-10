# Products Card Sizing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tighten the product cards on the products page by reducing the title and image sizing while keeping the overall card footprint unchanged.

**Architecture:** Adjust only the Tailwind sizing and spacing classes in the existing products catalog card markup. Preserve the current grid and card structure so the page layout remains stable while the content inside each card gets more breathing room.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS

---

### Task 1: Tighten the existing product card layout

**Files:**
- Modify: `components/products/ProductsCatalog.tsx`

- [ ] Reduce the product image dimensions inside each card.
- [ ] Reduce the product title size slightly.
- [ ] Rebalance internal gap and padding so the card stays the same size but reads less crowded.

### Task 2: Verify the change

**Files:**
- Modify: `components/products/ProductsCatalog.tsx`

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Review the diff to confirm only the intended card layout changed.
