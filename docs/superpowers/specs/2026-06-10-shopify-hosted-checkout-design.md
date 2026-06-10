# Shopify Hosted Checkout Design

## Goal

Add a multi-product cart flow to the storefront that uses Shopify as the source of truth for products, prices, market-aware currency, and checkout, while keeping the Blachh frontend responsible for cart UX and localized browsing.

## Requirements

- The storefront must support adding multiple products to a single cart and paying for them in one Shopify-hosted checkout.
- Checkout must remain guest-only for v1.
- Shopify must remain the source of truth for product data, variant availability, prices, and checkout totals.
- Cart pricing must stay aligned with the user's selected currency from the navbar.
- Same-browser cart persistence is required for v1.
- Customer email collection and order emails must be handled by Shopify checkout.
- The storefront must not implement a custom payment flow.

## Non-Goals

- Customer accounts or login.
- Cross-device cart recovery.
- Promo code handling inside the Blachh app.
- Custom app-side checkout forms.
- Frontend-owned currency conversion for cart or checkout totals.

## Current Context

The current storefront already has:

- currency selection and market resolution helpers in [lib/currency.ts](/home/pak/projects/blachh/frontend/lib/currency.ts:1) and [lib/currency-server.ts](/home/pak/projects/blachh/frontend/lib/currency-server.ts:1)
- Shopify product fetching in [lib/shopify.ts](/home/pak/projects/blachh/frontend/lib/shopify.ts:1)
- localized routes under `app/[lang]/`
- a local-only cart state model in [lib/cart.ts](/home/pak/projects/blachh/frontend/lib/cart.ts:1) and [components/cart/CartProvider.tsx](/home/pak/projects/blachh/frontend/components/cart/CartProvider.tsx:1)

That current cart model is appropriate for local UI state but not for a Shopify-backed checkout because it does not own real line IDs, checkout URLs, market context, or authoritative totals.

## Recommended Architecture

Use Shopify Storefront cart APIs as the cart system of record and keep the Next app as a thin layer over that cart.

- Shopify owns:
  - products
  - variants
  - prices
  - line totals
  - availability
  - checkout URL
  - guest checkout
  - customer email and order communication
- The Next app owns:
  - currency selection UX
  - cart drawer and cart page UI
  - add, update, and remove interactions
  - cart cookie lifecycle
  - localized route rendering

This split minimizes business logic duplication and ensures cart totals always reflect Shopify Markets rather than frontend assumptions.

## Data Boundaries

### Product data

Product listing and product detail pages should read products from Shopify and expose enough data to add a variant to cart. Product UI models should be expanded so add-to-cart actions use Shopify identifiers rather than display names.

Required product-to-cart fields:

- Shopify product ID
- Shopify merchandise or variant ID
- product title
- image URL
- selected size or option label
- price and currency as returned by Shopify

### Cart data

The app should adopt a dedicated Shopify cart model rather than reuse the current local `CartItem` shape.

Recommended UI-facing cart types:

- `ShopifyCart`
  - `id`
  - `checkoutUrl`
  - `currencyCode`
  - `subtotalAmount`
  - `totalAmount`
  - `totalQuantity`
  - `lines`
- `ShopifyCartLine`
  - `id`
  - `merchandiseId`
  - `productId`
  - `productTitle`
  - `variantTitle`
  - `imageUrl`
  - `quantity`
  - `unitAmount`
  - `lineAmount`
  - `currencyCode`

All formatted money displayed in cart UI should come from Shopify-returned amounts formatted through existing currency helpers, not local conversion logic.

## Route And API Surface

### New route

- `app/[lang]/cart/page.tsx`
  - server-rendered cart review page
  - reads current Shopify cart from cookie and market context
  - renders all lines, quantities, subtotal, and checkout button

### Cart API

Add `app/api/cart/route.ts` with method-based behavior:

- `GET`
  - fetch current cart from Shopify using cart cookie
  - return empty cart payload when no valid cart exists
- `POST`
  - create cart if missing
  - add one or more lines
  - persist cart cookie
- `PATCH`
  - update one or more line quantities
  - return refreshed cart payload
- `DELETE`
  - remove one or more lines, or clear cart completely
  - clear cookie if cart becomes invalid or is explicitly reset

If implementation ergonomics are better with separate route files such as `app/api/cart/lines/route.ts` and `app/api/cart/checkout/route.ts`, that is acceptable as long as the API remains narrow and cart ownership stays server-side.

## Shopify Client Changes

Extend [lib/shopify.ts](/home/pak/projects/blachh/frontend/lib/shopify.ts:1) with Storefront cart operations:

- `createCart`
- `getCart`
- `addCartLines`
- `updateCartLines`
- `removeCartLines`

Each operation must support market-aware execution using the request country code so prices and checkout URLs reflect the selected market. The implementation should continue using a single Storefront endpoint and inject `@inContext(country: ...)` for both product and cart operations.

## Cart Persistence

Add a new cookie such as `blachh-shopify-cart-id`.

Cookie requirements:

- `httpOnly`
- `sameSite=lax`
- `secure` in production
- path `/`

This cookie is the only cart persistence mechanism for v1. The frontend should not mirror Shopify line items in local storage as a source of truth.

## Currency And Market Rules

The user's navbar currency selection maps to market country selection through existing helpers. The cart must always be created and fetched in that same context.

Rules:

- a cart created in `USD` must not continue to be used after the user switches to `EUR` or `SEK`
- frontend display currency must not diverge from Shopify cart currency
- cart totals must be derived from Shopify, not recalculated from locally converted prices

Recommended v1 behavior on currency switch:

- invalidate the existing cart cookie
- create a new cart in the new market only when the user adds an item again
- show a brief user-facing notice that the bag was refreshed for the selected currency

This is stricter than attempting cross-market cart migration, but it avoids mixed-currency bugs and unexpected checkout pricing.

## UI Changes

### Product detail and product listing

Current add-to-cart controls should stop writing directly to local cart arrays. Instead they should call a server endpoint or server action with:

- merchandise ID
- quantity
- current market or country context when needed

After a successful mutation, the cart drawer should refresh from Shopify and open.

### Cart drawer

The existing drawer in [components/cart/CartDrawer.tsx](/home/pak/projects/blachh/frontend/components/cart/CartDrawer.tsx:1) should become a live cart summary:

- render Shopify-backed lines
- update quantity through server mutations
- remove lines through server mutations
- display Shopify subtotal
- include navigation to the dedicated cart page
- optionally keep a direct checkout button for convenience

### Cart provider

The current provider in [components/cart/CartProvider.tsx](/home/pak/projects/blachh/frontend/components/cart/CartProvider.tsx:1) should be reshaped from local cart ownership into a client cache and mutation coordinator around server-backed cart data. It may keep UI state such as drawer visibility, loading flags, optimistic UI state, and error messages, but it should not be the authoritative source of cart contents.

## Error Handling

- If Shopify returns an invalid or expired cart, clear the cart cookie and return an empty cart state.
- If add, update, or remove mutations fail, preserve the previously rendered cart state and surface a user-facing error.
- If a product variant is unavailable in the selected market, reject the mutation with a clear message.
- If Shopify returns a cart without a checkout URL, disable checkout and show a retry message.
- If the request currency and Shopify cart currency do not match, treat the cart as stale and reset it.

## Testing Scope

### Unit tests

- cart cookie read and write helpers
- Shopify cart response mapping
- cart request builders and mutation payloads
- stale-cart and currency-mismatch helpers

### Route tests

- `GET /api/cart` with no cookie
- `GET /api/cart` with stale or invalid cart ID
- `POST /api/cart` creating a new cart
- `PATCH /api/cart` updating quantities
- `DELETE /api/cart` removing a line or clearing the cart
- currency switch invalidating prior cart usage

### UI verification

- add to cart from product detail
- add multiple products before checkout
- increment and decrement quantities
- remove items from drawer and cart page
- redirect to Shopify checkout using cart checkout URL
- currency switch resetting cart state cleanly

## Implementation Notes

- The current mock conversion path in [lib/products.ts](/home/pak/projects/blachh/frontend/lib/products.ts:1) should not be used for cart totals once checkout is Shopify-backed.
- Product models should carry Shopify variant identifiers all the way to the UI boundary.
- Cart rendering should prefer server-fetched data on first load so the cart page is accurate on refresh.
- Client-side cart refresh should be explicit after each mutation rather than relying on stale local arrays.

## Verification

- A user can add multiple products and see them together in one cart.
- The cart persists across refreshes in the same browser.
- Shopify cart pricing matches the selected navbar currency.
- Changing currency invalidates the previous market cart.
- Checkout redirects to Shopify-hosted checkout for the active cart.
