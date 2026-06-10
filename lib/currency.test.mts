import test from "node:test";
import assert from "node:assert/strict";

import {
  convertPriceFromSek,
  formatMoney,
  getManualCountryForCurrency,
  getPriceFilterConfig,
  resolveCurrencyPreference,
} from "./currency.ts";

test("resolveCurrencyPreference prioritizes cookie country over geo headers", () => {
  const preference = resolveCurrencyPreference({
    cookieCountryCode: "SE",
    headerCountryCode: "US",
  });

  assert.deepEqual(preference, {
    countryCode: "SE",
    currencyCode: "SEK",
    source: "cookie",
  });
});

test("resolveCurrencyPreference maps eurozone countries to EUR", () => {
  const preference = resolveCurrencyPreference({
    headerCountryCode: "DE",
  });

  assert.deepEqual(preference, {
    countryCode: "DE",
    currencyCode: "EUR",
    source: "geo",
  });
});

test("resolveCurrencyPreference falls back to USD when no signal is available", () => {
  const preference = resolveCurrencyPreference({});

  assert.deepEqual(preference, {
    countryCode: "US",
    currencyCode: "USD",
    source: "fallback",
  });
});

test("getManualCountryForCurrency returns the representative market country", () => {
  assert.equal(getManualCountryForCurrency("SEK"), "SE");
  assert.equal(getManualCountryForCurrency("EUR"), "DE");
  assert.equal(getManualCountryForCurrency("USD"), "US");
});

test("formatMoney renders localized currency output", () => {
  assert.equal(formatMoney(745, "SEK"), "745,00 kr");
  assert.equal(formatMoney(49, "USD"), "$49.00");
  assert.match(formatMoney(42, "EUR"), /42,00/);
});

test("convertPriceFromSek converts mock prices into the selected currency", () => {
  assert.equal(convertPriceFromSek(745, "SEK"), 745);
  assert.equal(convertPriceFromSek(745, "USD"), 71);
  assert.equal(convertPriceFromSek(745, "EUR"), 67);
});

test("getPriceFilterConfig returns currency-aware filter labels", () => {
  assert.deepEqual(getPriceFilterConfig("USD"), [
    { value: "all", label: "All prices" },
    { value: "under-350", label: "Under $35" },
    { value: "350-500", label: "$35 - $50" },
    { value: "500-plus", label: "$50 and above" },
  ]);
});
