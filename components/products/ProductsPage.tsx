import { ProductsCatalog } from "@/components/products/ProductsCatalog";
import { products } from "@/components/products/productsData";

export function ProductsPage() {
  return <ProductsCatalog products={products} />;
}
