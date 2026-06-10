export const locales = ["en", "th", "sv"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

const dictionaries = {
  en: {
    nav: {
      shop: "Shop",
      about: "About",
      contact: "Contact",
    },
    locale: {
      en: "English",
      th: "Thai",
      sv: "Swedish",
    },
    a11y: {
      openMenu: "Open menu",
      closeMenu: "Close menu",
      goHome: "Go to homepage",
      openShoppingBag: "Open shopping bag",
      openLanguageMenu: "Open language menu",
    },
  },
  th: {
    nav: {
      shop: "ร้านค้า",
      about: "เกี่ยวกับ",
      contact: "ติดต่อ",
    },
    locale: {
      en: "อังกฤษ",
      th: "ไทย",
      sv: "สวีเดน",
    },
    a11y: {
      openMenu: "เปิดเมนู",
      closeMenu: "ปิดเมนู",
      goHome: "ไปหน้าแรก",
      openShoppingBag: "เปิดถุงช้อปปิ้ง",
      openLanguageMenu: "เปิดเมนูภาษา",
    },
  },
  sv: {
    nav: {
      shop: "Butik",
      about: "Om",
      contact: "Kontakt",
    },
    locale: {
      en: "Engelska",
      th: "Thailändska",
      sv: "Svenska",
    },
    a11y: {
      openMenu: "Öppna meny",
      closeMenu: "Stäng meny",
      goHome: "Gå till startsidan",
      openShoppingBag: "Öppna shoppingväska",
      openLanguageMenu: "Öppna språkmeny",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale];
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
