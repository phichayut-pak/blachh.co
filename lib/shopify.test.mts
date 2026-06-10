import test from "node:test";
import assert from "node:assert/strict";

test("buildShopifyStorefrontEndpoint strips the protocol from SHOPIFY_STORE_DOMAIN", async () => {
  const { buildShopifyStorefrontEndpoint } = await import("./shopify-config.ts");

  assert.equal(
    buildShopifyStorefrontEndpoint("https://example.myshopify.com"),
    "https://example.myshopify.com/api/2025-01/graphql.json",
  );
});

test("buildOperationQuery injects country context for storefront operations", async () => {
  const { buildOperationQuery } = await import("./shopify-config.ts");

  assert.match(
    buildOperationQuery("query CartOperation { cart { id } }", "US"),
    /query CartOperation @inContext\(country: US\)/,
  );
  assert.equal(
    buildOperationQuery("query CartOperation { cart { id } }"),
    "query CartOperation { cart { id } }",
  );
});
