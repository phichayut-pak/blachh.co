import { notFound } from "next/navigation";

import { Banner } from "@/components/Banner";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getCurrencyPreferenceFromRequest } from "@/lib/currency-server";
import { getDictionary, isValidLocale, locales } from "@/lib/i18n";

interface LocalizedLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lang: string;
  }>;
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocalizedLayout({
  children,
  params,
}: LocalizedLayoutProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const [currencyPreference, dictionary] = await Promise.all([
    getCurrencyPreferenceFromRequest(),
    getDictionary(lang),
  ]);

  return (
    <div
      className={
        lang === "th"
          ? "[--font-app-sans:var(--font-fallback-thai)] [--font-app-cormorant:var(--font-fallback-thai)] [--font-app-hanken:var(--font-fallback-thai)] [--font-app-libre:var(--font-fallback-thai)] [--font-app-heading:var(--font-fallback-thai)]"
          : undefined
      }
    >
      <Banner dictionary={dictionary.banner} />
      <Navbar
        key={`navbar-${currencyPreference.currencyCode}`}
        currentCurrency={currencyPreference.currencyCode}
        lang={lang}
        dictionary={dictionary}
      />
      <main key={`content-${currencyPreference.currencyCode}`} className="flex-1">
        {children}
      </main>
      <Footer
        key={`footer-${currencyPreference.currencyCode}`}
        currentCurrency={currencyPreference.currencyCode}
        dictionary={dictionary.footer}
      />
    </div>
  );
}
