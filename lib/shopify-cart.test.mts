import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCartCookieOptions,
  cartCookieName,
  createEmptyCart,
  hasCartCurrencyMismatch,
  mapProductToCartLineInput,
  mapShopifyCart,
  parseCartRequestBody,
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

test("parseCartRequestBody normalizes cart mutation payloads", () => {
  const parsed = parseCartRequestBody({
    lines: [{ merchandiseId: "gid://shopify/ProductVariant/1", quantity: 2 }],
  });

  assert.deepEqual(parsed.lines, [
    { merchandiseId: "gid://shopify/ProductVariant/1", quantity: 2 },
  ]);
});

test("parseCartRequestBody does not invent a merchandiseId for line updates", () => {
  const parsed = parseCartRequestBody({
    lines: [{ cartLineId: "gid://shopify/CartLine/1", quantity: 3 }],
  });

  assert.deepEqual(parsed.lines, [
    { cartLineId: "gid://shopify/CartLine/1", quantity: 3 },
  ]);
});

test("mapProductToCartLineInput uses Shopify merchandise IDs", () => {
  const line = mapProductToCartLineInput({
    id: "gid://shopify/Product/1",
    merchandiseId: "gid://shopify/ProductVariant/1",
  }, 3);

  assert.deepEqual(line, {
    merchandiseId: "gid://shopify/ProductVariant/1",
    quantity: 3,
  });
});
