# Products Cart Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a functional shopping bag flow with add-to-cart actions, a live bag count, a right-side drawer, quantity controls, and a checkout call to action.

**Architecture:** Keep product data fetching in server components and introduce a focused client cart state layer that wraps the shared storefront UI. Reuse that state in the shared navbar for the bag trigger and drawer, and in the products catalog for add-to-bag actions and product-aware line items.

**Tech Stack:** Next.js App Router, React 19 client components, TypeScript, Tailwind CSS, Framer Motion, node:test

---

### Task 1: Add pure cart state helpers with regression tests

**Files:**
- Create: `lib/cart.ts`
- Create: `lib/cart.test.mts`

- [ ] Add reducer-style helpers for add, increment, decrement, remove, count, and subtotal.
- [ ] Cover merged quantities and subtotal math with `node:test`.

### Task 2: Add a cart provider and drawer shell

**Files:**
- Create: `components/cart/CartProvider.tsx`
- Create: `components/cart/CartDrawer.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/Navbar.tsx`

- [ ] Wrap the app body in a client cart provider.
- [ ] Wire the navbar shopping bag buttons to open the drawer and show the live item count.
- [ ] Render cart items, quantity stepper, subtotal, and checkout button inside a right-side drawer.

### Task 3: Connect product cards to the cart

**Files:**
- Modify: `components/products/ProductsCatalog.tsx`

- [ ] Add a product card action that adds the selected product to the cart without breaking the existing product-detail link.
- [ ] Keep filtering behavior intact while exposing the correct product info to the cart.

### Task 4: Verify integration

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `components/products/ProductsCatalog.tsx`

- [ ] Run `node --test lib/cart.test.mts`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
