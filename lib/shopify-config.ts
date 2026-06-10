export function buildShopifyStorefrontEndpoint(storeDomain: string): string {
  const normalizedDomain = normalizeShopifyStoreDomain(storeDomain);
  return `https://${normalizedDomain}/api/2025-01/graphql.json`;
}

export function buildOperationQuery(query: string, countryCode?: string): string {
  if (!countryCode) {
    return query;
  }

  return query.replace(
    /^query\s+([A-Za-z0-9_]+)/,
    (_match, operationName) => `query ${operationName} @inContext(country: ${countryCode})`,
  );
}

function normalizeShopifyStoreDomain(storeDomain: string): string {
  const trimmedDomain = storeDomain.trim();

  if (trimmedDomain.startsWith("http://") || trimmedDomain.startsWith("https://")) {
    return new URL(trimmedDomain).host;
  }

  return trimmedDomain.replace(/^\/+/, "").replace(/\/.*$/, "");
}
