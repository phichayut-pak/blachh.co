import test from "node:test";
import assert from "node:assert/strict";

import { resolveCartPageCart } from "./cart-page-state.ts";
import type { ShopifyCart } from "./shopify-cart.ts";

function createCart(overrides: Partial<ShopifyCart>): ShopifyCart {
  return {
    id: null,
    checkoutUrl: null,
    currencyCode: "USD",
    subtotalAmount: 0,
    totalAmount: 0,
    totalQuantity: 0,
    lines: [],
    ...overrides,
  };
}

test("resolveCartPageCart keeps the server cart during initial client hydration", () => {
  const serverCart = createCart({
    id: "gid://shopify/Cart/server",
    totalQuantity: 2,
    lines: [
      {
        id: "line-1",
        merchandiseId: "variant-1",
        productId: "product-1",
        productTitle: "Society Hinoki",
        variantTitle: "30g",
        imageUrl: "",
        quantity: 2,
        unitAmount: 40,
        lineAmount: 80,
        currencyCode: "USD",
      },
    ],
  });
  const clientCart = createCart({});

  assert.equal(resolveCartPageCart(clientCart, serverCart), serverCart);
});

test("resolveCartPageCart prefers the live client cart when the server page is stale", () => {
  const serverCart = createCart({});
  const clientCart = createCart({
    id: "gid://shopify/Cart/client",
    totalQuantity: 1,
    lines: [
      {
        id: "line-2",
        merchandiseId: "variant-2",
        productId: "product-2",
        productTitle: "Nami Hojicha",
        variantTitle: "Default",
        imageUrl: "",
        quantity: 1,
        unitAmount: 22,
        lineAmount: 22,
        currencyCode: "USD",
      },
    ],
  });

  assert.equal(resolveCartPageCart(clientCart, serverCart), clientCart);
});
