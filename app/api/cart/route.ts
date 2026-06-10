import { NextResponse } from "next/server";

import {
  buildCartCookieOptions,
  cartCookieName,
  createEmptyCart,
  parseCartRequestBody,
} from "@/lib/shopify-cart";
import { getRequestCartState } from "@/lib/shopify-cart-server";
import { mapShopifyCart } from "@/lib/shopify-cart";
import {
  addCartLines,
  createCart,
  removeCartLines,
  updateCartLines,
} from "@/lib/shopify";

export const dynamic = "force-dynamic";

interface DeleteCartRequestBody {
  lineIds?: string[];
}

function withCartCookie(
  response: NextResponse,
  cartId: string | null,
) {
  if (cartId) {
    response.cookies.set(cartCookieName, cartId, buildCartCookieOptions());
  } else {
    response.cookies.delete(cartCookieName);
  }

  return response;
}

export async function GET() {
  const { cart, stale } = await getRequestCartState();
  const response = NextResponse.json({ cart });

  if (stale) {
    response.cookies.delete(cartCookieName);
  }

  return response;
}

export async function POST(request: Request) {
  try {
    const { lines } = parseCartRequestBody(await request.json());
    const addLines = lines.map((line) => {
      if (!line.merchandiseId) {
        throw new Error("merchandiseId is required.");
      }

      return {
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
      };
    });
    const state = await getRequestCartState();
    const shopifyCart = state.cartId && !state.stale
      ? await addCartLines(state.cartId, addLines, { countryCode: state.countryCode })
      : await createCart(addLines, { countryCode: state.countryCode });
    const cart = mapShopifyCart(shopifyCart);

    return withCartCookie(
      NextResponse.json({ cart }),
      cart.id,
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to add items to cart.",
      },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const state = await getRequestCartState();

    if (!state.cartId || state.stale) {
      return withCartCookie(
        NextResponse.json({ cart: createEmptyCart(state.currencyCode) }),
        null,
      );
    }

    const { lines } = parseCartRequestBody(await request.json());
    const cart = mapShopifyCart(
      await updateCartLines(
        state.cartId,
        lines.map((line) => ({
          id: line.cartLineId ?? "",
          quantity: line.quantity,
          ...(line.merchandiseId ? { merchandiseId: line.merchandiseId } : {}),
        })),
        { countryCode: state.countryCode },
      ),
    );

    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update cart.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const state = await getRequestCartState();

    if (!state.cartId || state.stale) {
      return withCartCookie(
        NextResponse.json({ cart: createEmptyCart(state.currencyCode) }),
        null,
      );
    }

    const body = (await request.json()) as DeleteCartRequestBody;
    const lineIds = Array.isArray(body.lineIds) ? body.lineIds.filter(Boolean) : [];

    if (lineIds.length === 0) {
      return NextResponse.json({ error: "lineIds are required." }, { status: 400 });
    }

    const cart = mapShopifyCart(
      await removeCartLines(state.cartId, lineIds, { countryCode: state.countryCode }),
    );

    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to remove cart items.",
      },
      { status: 400 },
    );
  }
}
