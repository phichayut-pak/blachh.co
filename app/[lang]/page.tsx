import { Collections } from "@/components/home/Collections";
import { Hero } from "@/components/home/Hero";
import { OurCommuninity } from "@/components/home/OurCommuninity";
import { Testimonials } from "@/components/home/Testimonials";
import { getCurrencyPreferenceFromRequest } from "@/lib/currency-server";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function LocalizedHome() {
  const currencyPreference = await getCurrencyPreferenceFromRequest();
  const products = await getProducts(currencyPreference);

  return (
    <>
      <Hero />
      <Collections products={products} />
      <OurCommuninity />
      <Testimonials />
    </>
  );
}
