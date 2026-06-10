import { ProductsPage } from "@/components/products/ProductsPage";
import { getCurrencyPreferenceFromRequest } from "@/lib/currency-server";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function LocalizedProductsPage() {
  const currencyPreference = await getCurrencyPreferenceFromRequest();
  const products = await getProducts(currencyPreference);

  return <ProductsPage products={products} />;
}
