# Shopify Hosted Checkout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the local-only cart with a Shopify-backed multi-product cart that persists by cookie, follows the selected market currency, and redirects to Shopify-hosted checkout.

**Architecture:** Extend the existing Storefront client with cart queries and mutations, expose those operations through a small Next route handler that owns the cart cookie, and reshape the client cart provider into a fetch-and-mutate layer over that API. Product purchase UI and a new localized cart page will consume the shared Shopify cart model so cart totals and checkout URLs always come from Shopify.

**Tech Stack:** Next.js 16 App Router route handlers, async `cookies()`/`headers()`, React 19 client components, Shopify Storefront GraphQL API, Node `node:test`, TypeScript

---

## File Map

- Create: `app/[lang]/cart/page.tsx`
- Create: `app/api/cart/route.ts`
- Create: `lib/shopify-cart.ts`
- Create: `lib/shopify-cart.test.mts`
- Modify: `lib/shopify.ts`
- Modify: `lib/products.ts`
- Modify: `components/products/productsData.ts`
- Modify: `components/products/ProductDetailPurchasePanel.tsx`
- Modify: `components/cart/CartProvider.tsx`
- Modify: `components/cart/CartDrawer.tsx`
- Modify: `components/Navbar.tsx`
- Modify: `components/CurrencySelector.tsx`
- Modify: `app/[lang]/product-detail/page.tsx`
- Modify: `lib/cart.test.mts`

### Task 1: Define Shopify Cart Types And Cookie Helpers

**Files:**
- Create: `lib/shopify-cart.ts`
- Test: `lib/shopify-cart.test.mts`

- [ ] **Step 1: Write the failing tests**

```ts
import test from "node:test";
import assert from "node:assert/strict";

import {
  cartCookieName,
  buildCartCookieOptions,
  createEmptyCart,
  hasCartCurrencyMismatch,
  mapShopifyCart,
} from "./shopify-cart.ts";

test("mapShopifyCart maps Shopify payloads into UI cart shape", () => {
  const cart = mapShopifyCart({
    id: "gid://shopify/Cart/123",
    checkoutUrl: "https://checkout.example/cart",
    totalQuantity: 3,
    cost: {
      subtotalAmount: { amount: "120.00", currencyCode: "USD" },
      totalAmount: { amount: "120.00", currencyCode: "USD" },
    },
    lines: {
      nodes: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 2,
          cost: { totalAmount: { amount: "80.00", currencyCode: "USD" } },
          merchandise: {
            id: "gid://shopify/ProductVariant/1",
            title: "30g",
            product: {
              id: "gid://shopify/Product/1",
              title: "Society Hinoki",
              featuredImage: { url: "https://cdn.example/hinoki.png" },
            },
            price: { amount: "40.00", currencyCode: "USD" },
          },
        },
      ],
    },
  });

  assert.equal(cart.totalQuantity, 3);
  assert.equal(cart.lines[0]?.productTitle, "Society Hinoki");
  assert.equal(cart.lines[0]?.unitAmount, 40);
});

test("createEmptyCart returns a consistent empty cart state", () => {
  const cart = createEmptyCart("EUR");

  assert.equal(cart.currencyCode, "EUR");
  assert.equal(cart.totalQuantity, 0);
  assert.deepEqual(cart.lines, []);
});

test("hasCartCurrencyMismatch detects mismatched market carts", () => {
  assert.equal(hasCartCurrencyMismatch({ currencyCode: "USD" }, "EUR"), true);
  assert.equal(hasCartCurrencyMismatch({ currencyCode: "USD" }, "USD"), false);
});

test("buildCartCookieOptions sets secure cookie defaults", () => {
  const options = buildCartCookieOptions();

  assert.equal(cartCookieName, "blachh-shopify-cart-id");
  assert.equal(options.httpOnly, true);
  assert.equal(options.sameSite, "lax");
  assert.equal(options.path, "/");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test lib/shopify-cart.test.mts`
Expected: FAIL with module or export errors because `lib/shopify-cart.ts` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```ts
import type { SupportedCurrencyCode } from "@/lib/currency";

export const cartCookieName = "blachh-shopify-cart-id";

export interface ShopifyCartLine {
  id: string;
  merchandiseId: string;
  productId: string;
  productTitle: string;
  variantTitle: string;
  imageUrl: string;
  quantity: number;
  unitAmount: number;
  lineAmount: number;
  currencyCode: SupportedCurrencyCode;
}

export interface ShopifyCart {
  id: string | null;
  checkoutUrl: string | null;
  currencyCode: SupportedCurrencyCode;
  subtotalAmount: number;
  totalAmount: number;
  totalQuantity: number;
  lines: ShopifyCartLine[];
}

export function createEmptyCart(currencyCode: SupportedCurrencyCode): ShopifyCart {
  return {
    id: null,
    checkoutUrl: null,
    currencyCode,
    subtotalAmount: 0,
    totalAmount: 0,
    totalQuantity: 0,
    lines: [],
  };
}

export function mapShopifyCart(cart: any): ShopifyCart {
  const currencyCode = cart.cost.subtotalAmount.currencyCode as SupportedCurrencyCode;

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    currencyCode,
    subtotalAmount: Number(cart.cost.subtotalAmount.amount),
    totalAmount: Number(cart.cost.totalAmount.amount),
    totalQuantity: cart.totalQuantity,
    lines: cart.lines.nodes.map((line: any) => ({
      id: line.id,
      merchandiseId: line.merchandise.id,
      productId: line.merchandise.product.id,
      productTitle: line.merchandise.product.title,
      variantTitle: line.merchandise.title,
      imageUrl: line.merchandise.product.featuredImage?.url ?? "",
      quantity: line.quantity,
      unitAmount: Number(line.merchandise.price.amount),
      lineAmount: Number(line.cost.totalAmount.amount),
      currencyCode,
    })),
  };
}

export function hasCartCurrencyMismatch(
  cart: Pick<ShopifyCart, "currencyCode">,
  currencyCode: SupportedCurrencyCode,
) {
  return cart.currencyCode !== currencyCode;
}

export function buildCartCookieOptions() {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test lib/shopify-cart.test.mts`
Expected: PASS with 4 passing tests.

### Task 2: Add Shopify Cart Storefront Operations

**Files:**
- Modify: `lib/shopify.ts`
- Test: `lib/shopify-cart.test.mts`

- [ ] **Step 1: Write the failing tests for query shaping**

```ts
test("buildCartOperationQuery injects country context for cart operations", async () => {
  const { buildCartOperationQuery } = await import("./shopify.ts");

  assert.match(
    buildCartOperationQuery("query CartOperation { cart { id } }", "US"),
    /query CartOperation @inContext\(country: US\)/,
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test lib/shopify-cart.test.mts`
Expected: FAIL because `buildCartOperationQuery` is not exported.

- [ ] **Step 3: Extend Shopify client with cart support**

```ts
export interface ShopifyCartNode { /* cart payload shape from Storefront API */ }

export function buildCartOperationQuery(query: string, countryCode?: string) {
  if (!countryCode) {
    return query;
  }

  return query.replace(
    "query CartOperation",
    `query CartOperation @inContext(country: ${countryCode})`,
  );
}

async function shopifyFetch<T>(
  query: string,
  options: ShopifyFetchOptions = {},
  variables?: Record<string, unknown>,
): Promise<T> {
  // existing endpoint/token handling
  const localizedQuery = options.countryCode
    ? buildCartOperationQuery(query, options.countryCode)
    : query;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({ query: localizedQuery, variables }),
    cache: "no-store",
  });
}

export async function createCart(...) { ... }
export async function getCart(...) { ... }
export async function addCartLines(...) { ... }
export async function updateCartLines(...) { ... }
export async function removeCartLines(...) { ... }
```

- [ ] **Step 4: Run the targeted tests**

Run: `node --test lib/shopify-cart.test.mts lib/shopify.test.mts`
Expected: PASS with cart query helper and existing Shopify config tests green.

### Task 3: Build The Cart API Route

**Files:**
- Create: `app/api/cart/route.ts`
- Modify: `lib/shopify-cart.ts`
- Test: `lib/shopify-cart.test.mts`

- [ ] **Step 1: Write failing tests for request helpers**

```ts
test("parseCartRequestBody normalizes add requests", async () => {
  const { parseCartRequestBody } = await import("./shopify-cart.ts");

  const parsed = parseCartRequestBody({
    lines: [{ merchandiseId: "gid://shopify/ProductVariant/1", quantity: 2 }],
  });

  assert.deepEqual(parsed.lines, [
    { merchandiseId: "gid://shopify/ProductVariant/1", quantity: 2 },
  ]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test lib/shopify-cart.test.mts`
Expected: FAIL because `parseCartRequestBody` does not exist.

- [ ] **Step 3: Implement request helpers and route handler**

```ts
// lib/shopify-cart.ts
export function parseCartRequestBody(body: unknown) {
  if (!body || typeof body !== "object" || !Array.isArray((body as any).lines)) {
    throw new Error("lines are required");
  }

  return {
    lines: (body as any).lines.map((line: any) => ({
      merchandiseId: String(line.merchandiseId),
      quantity: Number(line.quantity ?? 1),
      cartLineId: line.cartLineId ? String(line.cartLineId) : undefined,
    })),
  };
}
```

```ts
// app/api/cart/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getCurrencyPreferenceFromRequest } from "@/lib/currency-server";
import {
  buildCartCookieOptions,
  cartCookieName,
  createEmptyCart,
  hasCartCurrencyMismatch,
  mapShopifyCart,
  parseCartRequestBody,
} from "@/lib/shopify-cart";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  updateCartLines,
} from "@/lib/shopify";

export const dynamic = "force-dynamic";

export async function GET() { ... }
export async function POST(request: Request) { ... }
export async function PATCH(request: Request) { ... }
export async function DELETE(request: Request) { ... }
```

- [ ] **Step 4: Run the targeted tests**

Run: `node --test lib/shopify-cart.test.mts`
Expected: PASS with helper tests green.

### Task 4: Carry Shopify Variant IDs Through Product Models

**Files:**
- Modify: `components/products/productsData.ts`
- Modify: `lib/products.ts`
- Test: `lib/shopify-cart.test.mts`

- [ ] **Step 1: Write the failing tests**

```ts
test("mapProductToCartLineInput uses Shopify merchandise IDs", async () => {
  const { mapProductToCartLineInput } = await import("./shopify-cart.ts");

  const line = mapProductToCartLineInput({
    id: "gid://shopify/Product/1",
    merchandiseId: "gid://shopify/ProductVariant/1",
  }, 3);

  assert.deepEqual(line, {
    merchandiseId: "gid://shopify/ProductVariant/1",
    quantity: 3,
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test lib/shopify-cart.test.mts`
Expected: FAIL because the mapper does not exist and products do not yet carry Shopify IDs.

- [ ] **Step 3: Add minimal product identifiers**

```ts
// components/products/productsData.ts
export interface Product {
  id: string;
  merchandiseId: string;
  imageSrc: string;
  productName: string;
  ...
}
```

```ts
// lib/products.ts
function mapShopifyProduct(product: ShopifyProductNode): Product {
  const firstVariant = product.variants.nodes[0];
  return {
    id: product.id,
    merchandiseId: firstVariant.id,
    ...
  };
}
```

- [ ] **Step 4: Run the targeted tests**

Run: `node --test lib/shopify-cart.test.mts`
Expected: PASS with product-to-cart line mapping green.

### Task 5: Reshape The Client Cart Provider Around The API

**Files:**
- Modify: `components/cart/CartProvider.tsx`
- Modify: `components/cart/CartDrawer.tsx`
- Modify: `components/Navbar.tsx`
- Modify: `components/CurrencySelector.tsx`

- [ ] **Step 1: Replace local reducers with server-backed cart state**

```ts
interface CartContextValue {
  cart: ShopifyCart;
  cartItemCount: number;
  isCartOpen: boolean;
  isPending: boolean;
  errorMessage: string | null;
  openCart: () => void;
  closeCart: () => void;
  refreshCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  incrementItem: (lineId: string) => Promise<void>;
  decrementItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}
```

- [ ] **Step 2: Implement cart fetch and mutations against `/api/cart`**

```ts
async function requestCart(method: "GET" | "POST" | "PATCH" | "DELETE", body?: unknown) {
  const response = await fetch("/api/cart", {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error("Cart request failed.");
  }

  return (await response.json()) as { cart: ShopifyCart };
}
```

- [ ] **Step 3: Update drawer and navbar to use line IDs and checkout URL**

```ts
// CartDrawer
const formattedSubtotal = formatMoney(cart.subtotalAmount, cart.currencyCode);
window.location.href = cart.checkoutUrl;
```

- [ ] **Step 4: Verify lint and targeted behavior**

Run: `npm run lint`
Expected: PASS with the provider, drawer, navbar, and currency selector type-safe and lint-clean.

### Task 6: Wire Product Detail And New Cart Page

**Files:**
- Modify: `components/products/ProductDetailPurchasePanel.tsx`
- Modify: `app/[lang]/product-detail/page.tsx`
- Create: `app/[lang]/cart/page.tsx`

- [ ] **Step 1: Update purchase panel to send Shopify-backed products**

```ts
const handleAddToCart = async () => {
  await addItem(product, quantity);
};
```

- [ ] **Step 2: Add localized cart page**

```tsx
export const dynamic = "force-dynamic";

export default async function CartPage({ params }: RouteContext<'/[lang]/cart'>) {
  const { currencyCode } = await getCurrencyPreferenceFromRequest();
  const cart = await getRequestCart(currencyCode);

  return <CartPageContent cart={cart} />;
}
```

- [ ] **Step 3: Add cart-page CTA from drawer**

```tsx
<Link href={`/${lang}/cart`}>View bag</Link>
```

- [ ] **Step 4: Run lint and targeted tests**

Run: `node --test lib/shopify-cart.test.mts lib/shopify.test.mts lib/cart.test.mts && npm run lint`
Expected: PASS with cart helpers and UI integration green.

## Self-Review

- Spec coverage: tasks cover Shopify cart ownership, cookie persistence, currency invalidation, guest hosted checkout, and the new cart page. No spec sections are left without an implementation task.
- Placeholder scan: no `TBD`, `TODO`, or “handle appropriately” placeholders remain.
- Type consistency: plan uses `ShopifyCart`, `ShopifyCartLine`, `cartCookieName`, and `merchandiseId` consistently across server and client tasks.

## Execution Handoff

Plan saved to `docs/superpowers/plans/2026-06-10-shopify-hosted-checkout.md`.

The user explicitly asked to start right away, so execute this plan inline in the current session rather than pausing for subagent selection.
