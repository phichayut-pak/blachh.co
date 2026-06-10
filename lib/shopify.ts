import "server-only";

import {
  buildOperationQuery,
  buildShopifyStorefrontEndpoint,
} from "@/lib/shopify-config";

interface ShopifyFetchOptions {
  countryCode?: string;
}

export interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

interface ShopifyImage {
  url: string;
}

interface ShopifyProductVariantNode {
  id: string;
  title: string;
  price: ShopifyMoneyV2;
}

export interface ShopifyProductNode {
  id: string;
  title: string;
  description: string;
  productType: string;
  featuredImage: ShopifyImage | null;
  variants: {
    nodes: ShopifyProductVariantNode[];
  };
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
  };
}

interface ShopifyCartLineNode {
  id: string;
  quantity: number;
  cost: {
    totalAmount: ShopifyMoneyV2;
  };
  merchandise: ShopifyProductVariantNode & {
    product: {
      id: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
  };
}

export interface ShopifyCartNode {
  id: string;
  checkoutUrl: string | null;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoneyV2;
    totalAmount: ShopifyMoneyV2;
  };
  lines: {
    nodes: ShopifyCartLineNode[];
  };
}

interface ShopifyProductsResponse {
  products: {
    nodes: ShopifyProductNode[];
  };
}

interface ShopifyCartResponse {
  cart: ShopifyCartNode | null;
}

interface ShopifyCartCreateResponse {
  cartCreate: {
    cart: ShopifyCartNode | null;
    userErrors: Array<{ message: string }>;
  };
}

interface ShopifyCartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCartNode | null;
    userErrors: Array<{ message: string }>;
  };
}

interface ShopifyCartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCartNode | null;
    userErrors: Array<{ message: string }>;
  };
}

interface ShopifyCartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCartNode | null;
    userErrors: Array<{ message: string }>;
  };
}

interface ShopifyCartLineInput {
  merchandiseId: string;
  quantity: number;
}

interface ShopifyCartLineUpdateInput {
  id: string;
  quantity: number;
  merchandiseId?: string;
}

function getShopifyConfig() {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_TOKEN;

  if (!storeDomain || !storefrontToken) {
    throw new Error(
      "Missing Shopify configuration. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN when MOCK_ENABLED is not true.",
    );
  }

  return {
    endpoint: buildShopifyStorefrontEndpoint(storeDomain),
    storefrontToken,
  };
}

function getUserErrorsMessage(userErrors: Array<{ message: string }>) {
  return userErrors.map((error) => error.message).join(", ");
}

async function shopifyFetch<T>(
  query: string,
  options: ShopifyFetchOptions = {},
  variables?: Record<string, unknown>,
): Promise<T> {
  const { endpoint, storefrontToken } = getShopifyConfig();
  const localizedQuery = buildOperationQuery(query, options.countryCode);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({ query: localizedQuery, variables }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(", "));
  }

  if (!payload.data) {
    throw new Error("Shopify response did not include data.");
  }

  return payload.data;
}

export async function getShopifyProducts(
  options: ShopifyFetchOptions = {},
): Promise<ShopifyProductNode[]> {
  const data = await shopifyFetch<ShopifyProductsResponse>(`
    query GetProducts {
      products(first: 12) {
        nodes {
          id
          title
          description
          productType
          featuredImage {
            url
          }
          variants(first: 10) {
            nodes {
              id
              title
              price {
                amount
                currencyCode
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `, options);

  return data.products.nodes;
}

const cartFields = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 50) {
    nodes {
      id
      quantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
      merchandise {
        ... on ProductVariant {
          id
          title
          price {
            amount
            currencyCode
          }
          product {
            id
            title
            featuredImage {
              url
            }
          }
        }
      }
    }
  }
`;

export async function getCart(
  cartId: string,
  options: ShopifyFetchOptions = {},
): Promise<ShopifyCartNode | null> {
  const data = await shopifyFetch<ShopifyCartResponse>(
    `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          ${cartFields}
        }
      }
    `,
    options,
    { cartId },
  );

  return data.cart;
}

export async function createCart(
  lines: ShopifyCartLineInput[],
  options: ShopifyFetchOptions = {},
): Promise<ShopifyCartNode> {
  const data = await shopifyFetch<ShopifyCartCreateResponse>(
    `
      mutation CreateCart($input: CartInput) {
        cartCreate(input: $input) {
          cart {
            ${cartFields}
          }
          userErrors {
            message
          }
        }
      }
    `,
    options,
    { input: { lines } },
  );

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(getUserErrorsMessage(data.cartCreate.userErrors));
  }

  if (!data.cartCreate.cart) {
    throw new Error("Shopify cartCreate did not return a cart.");
  }

  return data.cartCreate.cart;
}

export async function addCartLines(
  cartId: string,
  lines: ShopifyCartLineInput[],
  options: ShopifyFetchOptions = {},
): Promise<ShopifyCartNode> {
  const data = await shopifyFetch<ShopifyCartLinesAddResponse>(
    `
      mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ${cartFields}
          }
          userErrors {
            message
          }
        }
      }
    `,
    options,
    { cartId, lines },
  );

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(getUserErrorsMessage(data.cartLinesAdd.userErrors));
  }

  if (!data.cartLinesAdd.cart) {
    throw new Error("Shopify cartLinesAdd did not return a cart.");
  }

  return data.cartLinesAdd.cart;
}

export async function updateCartLines(
  cartId: string,
  lines: ShopifyCartLineUpdateInput[],
  options: ShopifyFetchOptions = {},
): Promise<ShopifyCartNode> {
  const data = await shopifyFetch<ShopifyCartLinesUpdateResponse>(
    `
      mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ${cartFields}
          }
          userErrors {
            message
          }
        }
      }
    `,
    options,
    { cartId, lines },
  );

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(getUserErrorsMessage(data.cartLinesUpdate.userErrors));
  }

  if (!data.cartLinesUpdate.cart) {
    throw new Error("Shopify cartLinesUpdate did not return a cart.");
  }

  return data.cartLinesUpdate.cart;
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[],
  options: ShopifyFetchOptions = {},
): Promise<ShopifyCartNode> {
  const data = await shopifyFetch<ShopifyCartLinesRemoveResponse>(
    `
      mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ${cartFields}
          }
          userErrors {
            message
          }
        }
      }
    `,
    options,
    { cartId, lineIds },
  );

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(getUserErrorsMessage(data.cartLinesRemove.userErrors));
  }

  if (!data.cartLinesRemove.cart) {
    throw new Error("Shopify cartLinesRemove did not return a cart.");
  }

  return data.cartLinesRemove.cart;
}
