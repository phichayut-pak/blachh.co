import type { ShopifyCart } from "./shopify-cart";

export function resolveCartPageCart(
  clientCart: ShopifyCart,
  serverCart: ShopifyCart,
) {
  if (clientCart.totalQuantity === 0 && serverCart.totalQuantity > 0) {
    return serverCart;
  }

  if (!clientCart.id && serverCart.id) {
    return serverCart;
  }

  return clientCart;
}
