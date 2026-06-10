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
    <>
      <Banner />
      <Navbar
        currentCurrency={currencyPreference.currencyCode}
        lang={lang}
        dictionary={dictionary}
      />
      <main className="flex-1">{children}</main>
      <Footer currentCurrency={currencyPreference.currencyCode} />
    </>
  );
}
