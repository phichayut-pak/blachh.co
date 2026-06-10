import "server-only";

import { cookies, headers } from "next/headers";

import {
  getManualCountryForCurrency,
  type SupportedCurrencyCode,
  resolveCurrencyPreference,
} from "@/lib/currency";

export const currencyCookieName = "blachh-market-country";

export async function getCurrencyPreferenceFromRequest() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieCountryCode = cookieStore.get(currencyCookieName)?.value;
  const headerCountryCode =
    headerStore.get("x-vercel-ip-country") ??
    headerStore.get("cf-ipcountry") ??
    headerStore.get("x-country-code");

  return resolveCurrencyPreference({
    cookieCountryCode,
    headerCountryCode,
  });
}

export function getManualCurrencySelection(currencyCode: SupportedCurrencyCode) {
  const countryCode = getManualCountryForCurrency(currencyCode);

  return resolveCurrencyPreference({
    cookieCountryCode: countryCode,
  });
}
