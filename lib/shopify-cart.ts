import {
  convertPrice,
  type CurrencyRates,
  type SupportedCurrencyCode,
} from "./currency";

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

interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

interface ShopifyCartLineNode {
  id: string;
  quantity: number;
  cost: {
    totalAmount: ShopifyMoneyV2;
  };
  merchandise: {
    id: string;
    title: string;
    price: ShopifyMoneyV2;
    product: {
      id: string;
      title: string;
      featuredImage: {
        url: string;
      } | null;
    };
  };
}

interface ShopifyCartNode {
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

export interface CartMutationLineInput {
  merchandiseId?: string;
  quantity: number;
  cartLineId?: string;
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

export function mapShopifyCart(cart: ShopifyCartNode): ShopifyCart {
  const currencyCode = cart.cost.subtotalAmount.currencyCode as SupportedCurrencyCode;

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    currencyCode,
    subtotalAmount: Number(cart.cost.subtotalAmount.amount),
    totalAmount: Number(cart.cost.totalAmount.amount),
    totalQuantity: cart.totalQuantity,
    lines: cart.lines.nodes.map((line) => ({
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

export function localizeShopifyCart(
  cart: ShopifyCart,
  currencyCode: SupportedCurrencyCode,
  exchangeRatesByBaseCurrency: Partial<
    Record<SupportedCurrencyCode, CurrencyRates>
  > = {},
): ShopifyCart {
  if (cart.currencyCode === currencyCode) {
    return cart;
  }

  const nextSubtotalAmount = convertPrice(
    cart.subtotalAmount,
    cart.currencyCode,
    currencyCode,
    exchangeRatesByBaseCurrency[cart.currencyCode],
  );
  const nextTotalAmount = convertPrice(
    cart.totalAmount,
    cart.currencyCode,
    currencyCode,
    exchangeRatesByBaseCurrency[cart.currencyCode],
  );

  return {
    ...cart,
    currencyCode,
    subtotalAmount: nextSubtotalAmount,
    totalAmount: nextTotalAmount,
    lines: cart.lines.map((line) => ({
      ...line,
      unitAmount: convertPrice(
        line.unitAmount,
        line.currencyCode,
        currencyCode,
        exchangeRatesByBaseCurrency[line.currencyCode],
      ),
      lineAmount: convertPrice(
        line.lineAmount,
        line.currencyCode,
        currencyCode,
        exchangeRatesByBaseCurrency[line.currencyCode],
      ),
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

export function parseCartRequestBody(body: unknown): { lines: CartMutationLineInput[] } {
  if (!body || typeof body !== "object" || !Array.isArray((body as { lines?: unknown }).lines)) {
    throw new Error("lines are required");
  }

  return {
    lines: (body as { lines: Array<Record<string, unknown>> }).lines.map((line) => {
      const cartLineId =
        typeof line.cartLineId === "string" ? line.cartLineId : undefined;
      const merchandiseId =
        typeof line.merchandiseId === "string" ? line.merchandiseId : undefined;

      return {
        quantity: Number(line.quantity ?? 1),
        ...(merchandiseId ? { merchandiseId } : {}),
        ...(cartLineId ? { cartLineId } : {}),
      };
    }),
  };
}

export function mapProductToCartLineInput(
  product: { merchandiseId: string },
  quantity: number,
): CartMutationLineInput {
  return {
    merchandiseId: product.merchandiseId,
    quantity,
  };
}
