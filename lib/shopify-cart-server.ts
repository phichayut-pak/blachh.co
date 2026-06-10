import "server-only";

import { cookies } from "next/headers";

import { getCurrencyPreferenceFromRequest } from "@/lib/currency-server";
import {
  cartCookieName,
  createEmptyCart,
  hasCartCurrencyMismatch,
  mapShopifyCart,
} from "@/lib/shopify-cart";
import { getCart } from "@/lib/shopify";

export async function getRequestCartState() {
  const { countryCode, currencyCode } = await getCurrencyPreferenceFromRequest();
  const cookieStore = await cookies();
  const cartId = cookieStore.get(cartCookieName)?.value ?? null;

  if (!cartId) {
    return {
      countryCode,
      currencyCode,
      cartId: null,
      cart: createEmptyCart(currencyCode),
      stale: false,
    };
  }

  try {
    const shopifyCart = await getCart(cartId, { countryCode });

    if (!shopifyCart) {
      return {
        countryCode,
        currencyCode,
        cartId,
        cart: createEmptyCart(currencyCode),
        stale: true,
      };
    }

    const cart = mapShopifyCart(shopifyCart);

    if (hasCartCurrencyMismatch(cart, currencyCode)) {
      return {
        countryCode,
        currencyCode,
        cartId,
        cart: createEmptyCart(currencyCode),
        stale: true,
      };
    }

    return {
      countryCode,
      currencyCode,
      cartId,
      cart,
      stale: false,
    };
  } catch {
    return {
      countryCode,
      currencyCode,
      cartId,
      cart: createEmptyCart(currencyCode),
      stale: true,
    };
  }
}
