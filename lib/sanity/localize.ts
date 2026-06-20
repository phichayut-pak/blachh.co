import type { Locale } from "@/lib/i18n";

const SANITY_SYSTEM_KEYS = new Set(["_id", "_type", "_key", "_rev", "_createdAt", "_updatedAt"]);

function isLocaleLeaf(value: Record<string, unknown>): value is Record<Locale, string> {
  const keys = Object.keys(value).filter((key) => !SANITY_SYSTEM_KEYS.has(key));
  return keys.length > 0 && keys.every((key) => key === "en" || key === "th" || key === "sv");
}

// Walks an arbitrarily nested Sanity document and collapses every
// `{ en, th, sv }` leaf into the string for `locale`, falling back to `en`
// when that locale's translation is blank. Strips Sanity's system fields
// (_id, _type, _key, ...) along the way so the result matches the shape of
// the static JSON dictionaries.
export function resolveLocale(value: unknown, locale: Locale): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => resolveLocale(item, locale));
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;

    if (isLocaleLeaf(obj)) {
      const localized = obj[locale];
      return typeof localized === "string" && localized.length > 0 ? localized : obj.en;
    }

    const result: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(obj)) {
      if (SANITY_SYSTEM_KEYS.has(key)) continue;
      result[key] = resolveLocale(nested, locale);
    }
    return result;
  }

  return value;
}

export function mergeContent<T>(base: T, overlay: unknown): T {
  if (overlay === undefined || overlay === null) {
    return base;
  }

  if (Array.isArray(base)) {
    return (Array.isArray(overlay) ? overlay : base) as T;
  }

  if (
    base &&
    typeof base === "object" &&
    !Array.isArray(base) &&
    overlay &&
    typeof overlay === "object" &&
    !Array.isArray(overlay)
  ) {
    const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };

    for (const [key, value] of Object.entries(overlay)) {
      result[key] = key in result ? mergeContent(result[key], value) : value;
    }

    return result as T;
  }

  return overlay as T;
}
