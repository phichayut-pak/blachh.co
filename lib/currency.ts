export type SupportedCurrencyCode = "SEK" | "EUR" | "USD";
export type CurrencySource = "cookie" | "geo" | "fallback";
export type PriceFilterValue = "all" | "under-350" | "350-500" | "500-plus";
export interface CurrencyOption {
  countryCode: string;
  currencyCode: SupportedCurrencyCode;
  label: string;
  shortLabel: string;
}

interface PriceFilterThresholds {
  under: number;
  upper: number;
}

interface ResolveCurrencyPreferenceInput {
  cookieCountryCode?: string | null;
  headerCountryCode?: string | null;
}

interface CurrencyPreference {
  countryCode: string;
  currencyCode: SupportedCurrencyCode;
  source: CurrencySource;
}

const eurozoneCountryCodes = new Set([
  "AT",
  "BE",
  "CY",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PT",
  "SI",
  "SK",
]);

const currencyFormatLocales: Record<SupportedCurrencyCode, string> = {
  SEK: "sv-SE",
  EUR: "de-DE",
  USD: "en-US",
};

const priceFilterLabels: Record<
  SupportedCurrencyCode,
  Array<{ value: PriceFilterValue; label: string }>
> = {
  SEK: [
    { value: "all", label: "All prices" },
    { value: "under-350", label: "Under 350 kr" },
    { value: "350-500", label: "350 kr - 500 kr" },
    { value: "500-plus", label: "500 kr and above" },
  ],
  EUR: [
    { value: "all", label: "All prices" },
    { value: "under-350", label: "Under 30 €" },
    { value: "350-500", label: "30 € - 45 €" },
    { value: "500-plus", label: "45 € and above" },
  ],
  USD: [
    { value: "all", label: "All prices" },
    { value: "under-350", label: "Under $35" },
    { value: "350-500", label: "$35 - $50" },
    { value: "500-plus", label: "$50 and above" },
  ],
};

const manualMarketCountryByCurrency: Record<SupportedCurrencyCode, string> = {
  SEK: "SE",
  EUR: "DE",
  USD: "US",
};

const mockConversionRateFromSek: Record<SupportedCurrencyCode, number> = {
  SEK: 1,
  EUR: 0.09,
  USD: 0.095,
};

const freeShippingThresholdByCurrency: Record<SupportedCurrencyCode, number> = {
  SEK: 500,
  EUR: 45,
  USD: 50,
};

const priceFilterThresholdsByCurrency: Record<SupportedCurrencyCode, PriceFilterThresholds> = {
  SEK: { under: 350, upper: 500 },
  EUR: { under: 30, upper: 45 },
  USD: { under: 35, upper: 50 },
};

export const supportedCurrencyOptions: CurrencyOption[] = [
  {
    countryCode: "SE",
    currencyCode: "SEK",
    label: "Sweden (SEK)",
    shortLabel: "SEK",
  },
  {
    countryCode: "DE",
    currencyCode: "EUR",
    label: "Eurozone (EUR)",
    shortLabel: "EUR",
  },
  {
    countryCode: "US",
    currencyCode: "USD",
    label: "International (USD)",
    shortLabel: "USD",
  },
];

function normalizeCountryCode(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(normalized)) {
    return null;
  }

  return normalized;
}

export function getCurrencyCodeForCountry(countryCode: string): SupportedCurrencyCode {
  if (countryCode === "SE") {
    return "SEK";
  }

  if (eurozoneCountryCodes.has(countryCode)) {
    return "EUR";
  }

  return "USD";
}

export function resolveCurrencyPreference(
  input: ResolveCurrencyPreferenceInput,
): CurrencyPreference {
  const cookieCountryCode = normalizeCountryCode(input.cookieCountryCode);

  if (cookieCountryCode) {
    return {
      countryCode: cookieCountryCode,
      currencyCode: getCurrencyCodeForCountry(cookieCountryCode),
      source: "cookie",
    };
  }

  const headerCountryCode = normalizeCountryCode(input.headerCountryCode);

  if (headerCountryCode) {
    return {
      countryCode: headerCountryCode,
      currencyCode: getCurrencyCodeForCountry(headerCountryCode),
      source: "geo",
    };
  }

  return {
    countryCode: "US",
    currencyCode: "USD",
    source: "fallback",
  };
}

export function getManualCountryForCurrency(currencyCode: SupportedCurrencyCode): string {
  return manualMarketCountryByCurrency[currencyCode];
}

export function formatMoney(amount: number, currencyCode: SupportedCurrencyCode): string {
  return new Intl.NumberFormat(currencyFormatLocales[currencyCode], {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getPriceFilterConfig(currencyCode: SupportedCurrencyCode) {
  return priceFilterLabels[currencyCode];
}

export function convertPriceFromSek(
  amountInSek: number,
  currencyCode: SupportedCurrencyCode,
): number {
  return Math.round(amountInSek * mockConversionRateFromSek[currencyCode]);
}

export function getFreeShippingLabel(currencyCode: SupportedCurrencyCode): string {
  const threshold = freeShippingThresholdByCurrency[currencyCode];

  return `Free shipping on orders over ${formatMoney(threshold, currencyCode)}`;
}

export function getPriceFilterThresholds(currencyCode: SupportedCurrencyCode) {
  return priceFilterThresholdsByCurrency[currencyCode];
}
