import en from "@/messages/en.json";
import sv from "@/messages/sv.json";
import th from "@/messages/th.json";
import { getSiteContent } from "@/lib/sanity/queries";
import { mergeContent, resolveLocale } from "@/lib/sanity/localize";

export const locales = ["en", "th", "sv"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

const dictionaries = { en, th, sv } as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

// Sections editable in Sanity are overlaid on top of the static dictionary;
// anything not yet created in the CMS (or if Sanity isn't configured at all)
// falls back to the JSON value untouched, so this never throws.
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const base = dictionaries[locale];
  const cms = await getSiteContent();

  if (!cms) return base;

  return {
    ...base,
    site: mergeContent(
      base.site,
      cms.site ? (resolveLocale(cms.site, locale) as Dictionary["site"]) : null,
    ),
    banner: mergeContent(
      base.banner,
      cms.banner ? (resolveLocale(cms.banner, locale) as Dictionary["banner"]) : null,
    ),
    footer: mergeContent(
      base.footer,
      cms.footer ? (resolveLocale(cms.footer, locale) as Dictionary["footer"]) : null,
    ),
    emailFooter: mergeContent(
      base.emailFooter,
      cms.emailFooter
        ? (resolveLocale(cms.emailFooter, locale) as Dictionary["emailFooter"])
        : null,
    ),
    home: mergeContent(
      base.home,
      cms.home ? (resolveLocale(cms.home, locale) as Dictionary["home"]) : null,
    ),
    about: mergeContent(
      base.about,
      cms.about ? (resolveLocale(cms.about, locale) as Dictionary["about"]) : null,
    ),
    contact: mergeContent(
      base.contact,
      cms.contact ? (resolveLocale(cms.contact, locale) as Dictionary["contact"]) : null,
    ),
    products: mergeContent(
      base.products,
      cms.productCopy
        ? (resolveLocale(cms.productCopy, locale) as { catalog?: Dictionary["products"] })
            .catalog ?? null
        : null,
    ),
    product: mergeContent(
      base.product,
      cms.productCopy
        ? (() => {
            const localized = resolveLocale(cms.productCopy, locale) as {
              purchase?: Pick<
                Dictionary["product"],
                "emptyState" | "freeShippingPrefix" | "freeShippingThresholds"
              >;
              rating?: Dictionary["product"]["rating"];
              reviewSummary?: Dictionary["product"]["reviewSummary"];
              tabs?: Dictionary["product"]["tabs"];
              reviewCarousel?: Dictionary["product"]["reviewCarousel"];
            };

            return {
              ...(localized.purchase ?? {}),
              rating: localized.rating,
              reviewSummary: localized.reviewSummary,
              tabs: localized.tabs,
              reviewCarousel: localized.reviewCarousel,
            };
          })()
        : null,
    ),
  };
}

export function replaceLocaleInPathname(pathname: string, locale: Locale) {
  if (pathname === "/") {
    return `/${locale}`;
  }

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${locale}`;
  }

  if (isValidLocale(segments[0] ?? "")) {
    segments[0] = locale;
    return `/${segments.join("/")}`;
  }

  return `/${locale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function getLocalizedPathname(locale: Locale, pathname = "/") {
  return replaceLocaleInPathname(pathname, locale);
}

export function localizeHref(href: string, pathname = "/") {
  if (!href.startsWith("/")) {
    return href;
  }

  const segments = href.split("/").filter(Boolean);

  if (isValidLocale(segments[0] ?? "")) {
    return href;
  }

  const pathnameSegments = pathname.split("/").filter(Boolean);
  const activeLocale = isValidLocale(pathnameSegments[0] ?? "")
    ? pathnameSegments[0]
    : defaultLocale;

  return href === "/" ? `/${activeLocale}` : `/${activeLocale}${href}`;
}
