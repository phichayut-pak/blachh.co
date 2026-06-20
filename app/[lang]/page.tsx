import { Collections } from "@/components/home/Collections";
import { FollowBlachh } from "@/components/home/FollowBlachh";
import { Hero } from "@/components/home/Hero";
import { OurCommuninity } from "@/components/home/OurCommuninity";
import { Testimonials } from "@/components/home/Testimonials";
import { getCurrencyPreferenceFromRequest } from "@/lib/currency-server";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { getProducts } from "@/lib/products";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface LocalizedHomeProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function LocalizedHome({ params }: LocalizedHomeProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const currencyPreference = await getCurrencyPreferenceFromRequest();
  const [products, dictionary] = await Promise.all([
    getProducts(currencyPreference),
    getDictionary(lang),
  ]);

  return (
    <>
      <Hero dictionary={dictionary.home.hero} />
      <Collections products={products} dictionary={dictionary.home.collections} />
      <OurCommuninity dictionary={dictionary.home.community} />
      <Testimonials
        dictionary={dictionary.home.testimonials}
        previousLabel={dictionary.a11y.showPreviousTestimonials}
        nextLabel={dictionary.a11y.showMoreTestimonials}
      />
      <FollowBlachh
        dictionary={dictionary.home.followBlachh}
        a11y={dictionary.a11y}
      />
    </>
  );
}
