# I18n Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add locale-prefixed routing for `en`, `th`, and `sv`, redirect `/` to `/en`, and translate only the navigation plus a basic language switcher.

**Architecture:** Use native App Router locale segments with `app/[lang]`, a small server-only dictionary module, and a locale-aware `Navbar`. Keep all translation data on the server and preserve the active locale in generated links.

**Tech Stack:** Next.js 16 App Router, TypeScript, React 19, node:test, ESLint

---

### Task 1: Add Minimal I18n Utilities

**Files:**
- Create: `lib/i18n.ts`
- Test: `lib/i18n.test.mts`

- [ ] **Step 1: Write the failing test**

```ts
import test from "node:test";
import assert from "node:assert/strict";

import {
  defaultLocale,
  getDictionary,
  isValidLocale,
  replaceLocaleInPathname,
} from "./i18n.ts";

test("isValidLocale only accepts supported locales", () => {
  assert.equal(isValidLocale("en"), true);
  assert.equal(isValidLocale("th"), true);
  assert.equal(isValidLocale("sv"), true);
  assert.equal(isValidLocale("de"), false);
});

test("replaceLocaleInPathname keeps the route suffix intact", () => {
  assert.equal(replaceLocaleInPathname("/en/about", "th"), "/th/about");
  assert.equal(replaceLocaleInPathname("/sv", "en"), "/en");
  assert.equal(replaceLocaleInPathname("/", "en"), "/en");
});

test("getDictionary returns translated navigation labels", async () => {
  const en = await getDictionary("en");
  const th = await getDictionary("th");
  const sv = await getDictionary("sv");

  assert.equal(defaultLocale, "en");
  assert.equal(en.nav.shop, "Shop");
  assert.equal(th.nav.about, "เกี่ยวกับ");
  assert.equal(sv.nav.contact, "Kontakt");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test lib/i18n.test.mts`
Expected: FAIL with module not found for `./i18n.ts`

- [ ] **Step 3: Write minimal implementation**

```ts
import "server-only";

export const locales = ["en", "th", "sv"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dictionaries = {
  en: {
    nav: { shop: "Shop", about: "About", contact: "Contact" },
    locale: { en: "English", th: "Thai", sv: "Swedish" },
    a11y: {
      openMenu: "Open menu",
      closeMenu: "Close menu",
      goHome: "Go to homepage",
      openShoppingBag: "Open shopping bag",
    },
  },
  th: {
    nav: { shop: "ร้านค้า", about: "เกี่ยวกับ", contact: "ติดต่อ" },
    locale: { en: "อังกฤษ", th: "ไทย", sv: "สวีเดน" },
    a11y: {
      openMenu: "เปิดเมนู",
      closeMenu: "ปิดเมนู",
      goHome: "ไปหน้าแรก",
      openShoppingBag: "เปิดถุงช้อปปิ้ง",
    },
  },
  sv: {
    nav: { shop: "Butik", about: "Om", contact: "Kontakt" },
    locale: { en: "Engelska", th: "Thailändska", sv: "Svenska" },
    a11y: {
      openMenu: "Öppna meny",
      closeMenu: "Stäng meny",
      goHome: "Gå till startsidan",
      openShoppingBag: "Öppna shoppingväska",
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test lib/i18n.test.mts`
Expected: PASS

### Task 2: Move Routes Under The Locale Segment

**Files:**
- Create: `app/[lang]/layout.tsx`
- Create: `app/[lang]/page.tsx`
- Create: `app/[lang]/about/page.tsx`
- Create: `app/[lang]/contact/page.tsx`
- Create: `app/[lang]/products/page.tsx`
- Create: `app/[lang]/product-detail/page.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write the failing test through route behavior verification**

Run: `npm run build`
Expected: existing build has no locale-prefixed route structure and will not satisfy the new route behavior

- [ ] **Step 2: Add the locale-aware layout and page wrappers**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Banner } from "@/components/Banner";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { defaultLocale, getDictionary, isValidLocale, locales } from "@/lib/i18n";
import "../globals.css";

export const metadata: Metadata = {
  title: "Frontend",
  description: "A shadcn-enabled Next.js app.",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body>
        <Banner />
        <Navbar lang={lang} dictionary={dictionary} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Redirect `/` to the default locale**

```tsx
import { redirect } from "next/navigation";

import { defaultLocale } from "@/lib/i18n";

export default function Home() {
  redirect(`/${defaultLocale}`);
}
```

- [ ] **Step 4: Recreate the existing page behavior under `app/[lang]`**

```tsx
import { Collections } from "@/components/home/Collections";
import { Hero } from "@/components/home/Hero";
import { OurCommuninity } from "@/components/home/OurCommuninity";
import { Testimonials } from "@/components/home/Testimonials";

export default function LocalizedHome() {
  return (
    <>
      <Hero />
      <Collections />
      <OurCommuninity />
      <Testimonials />
    </>
  );
}
```

- [ ] **Step 5: Run build to verify the locale routes compile**

Run: `npm run build`
Expected: PASS with `/[lang]` routes generated for `en`, `th`, and `sv`

### Task 3: Make Navbar Locale-Aware

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Write the failing test through type and build feedback**

Run: `npm run build`
Expected: FAIL once `Navbar` receives required locale props that the old component shape does not yet fully support

- [ ] **Step 2: Replace hardcoded links and labels with locale-aware props**

```tsx
interface NavbarProps {
  lang: Locale;
  dictionary: Dictionary;
}
```

```tsx
const navItems = [
  { href: `/${lang}/products`, label: dictionary.nav.shop },
  { href: `/${lang}/about`, label: dictionary.nav.about },
  { href: `/${lang}/contact`, label: dictionary.nav.contact },
];

const localeItems = locales.map((locale) => ({
  code: locale.toUpperCase(),
  href: replaceLocaleInPathname(pathname, locale),
  label: dictionary.locale[locale],
}));
```

- [ ] **Step 3: Use the current pathname to preserve the route on locale switch**

```tsx
const pathname = usePathname();
const currentPathname = pathname ?? "/";
```

- [ ] **Step 4: Run build to verify the locale-aware navbar compiles**

Run: `npm run build`
Expected: PASS

### Task 4: Final Verification

**Files:**
- None

- [ ] **Step 1: Run targeted tests**

Run: `node --test lib/i18n.test.mts`
Expected: PASS

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: PASS
