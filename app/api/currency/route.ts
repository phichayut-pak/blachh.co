import { NextResponse } from "next/server";

import { supportedCurrencyOptions, type SupportedCurrencyCode } from "@/lib/currency";
import { cartCookieName } from "@/lib/shopify-cart";
import {
  currencyCookieName,
  getManualCurrencySelection,
} from "@/lib/currency-server";

interface CurrencyRequestBody {
  currencyCode?: SupportedCurrencyCode;
}

export async function POST(request: Request) {
  const body = (await request.json()) as CurrencyRequestBody;

  if (!body.currencyCode) {
    return NextResponse.json(
      { error: "currencyCode is required." },
      { status: 400 },
    );
  }

  const option = supportedCurrencyOptions.find(
    (currencyOption) => currencyOption.currencyCode === body.currencyCode,
  );

  if (!option) {
    return NextResponse.json(
      { error: "Unsupported currencyCode." },
      { status: 400 },
    );
  }

  const selection = getManualCurrencySelection(body.currencyCode);
  const response = NextResponse.json({ ok: true, selection });

  response.cookies.set(currencyCookieName, selection.countryCode, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  response.cookies.delete(cartCookieName);

  return response;
}
