import "server-only";

import {
  products as mockProducts,
  type Product,
  type ProductCategory,
} from "@/components/products/productsData";
import {
  convertPriceFromSek,
  formatMoney,
  type SupportedCurrencyCode,
} from "@/lib/currency";
import { getShopifyProducts } from "@/lib/shopify";

const isMockEnabled = process.env.MOCK_ENABLED === "true";

interface ProductQueryOptions {
  countryCode?: string;
  currencyCode?: SupportedCurrencyCode;
}

function toProductCategory(value: string): ProductCategory {
  if (value === "Matcha" || value === "Books" || value === "Toys") {
    return value;
  }

  return "Matcha";
}

function mapShopifyProduct(product: Awaited<ReturnType<typeof getShopifyProducts>>[number]): Product {
  const price = Number(product.priceRange.minVariantPrice.amount);
  const currency = product.priceRange.minVariantPrice.currencyCode;
  const firstVariant = product.variants.nodes[0];

  return {
    id: product.id,
    merchandiseId: firstVariant?.id ?? product.id,
    imageSrc: product.featuredImage?.url ?? "/mock/products/society-hinoki.png",
    productName: product.title,
    size: getProductSizeFromVariantTitle(firstVariant?.title),
    price,
    currency,
    formattedPrice: formatMoney(price, currency as SupportedCurrencyCode),
    category: toProductCategory(product.productType),
    eyebrow: product.productType || "Shopify product",
    description: product.description,
    tastingNotes: [],
  };
}

function mapMockProduct(product: Product, currencyCode: SupportedCurrencyCode): Product {
  const price = convertPriceFromSek(product.price, currencyCode);

  return {
    ...product,
    price,
    currency: currencyCode,
    formattedPrice: formatMoney(price, currencyCode),
  };
}

function getProductSizeFromVariantTitle(variantTitle?: string): number {
  if (!variantTitle) {
    return 0;
  }

  const match = variantTitle.match(/(\d+)\s*g/i);
  return match ? Number(match[1]) : 0;
}

export async function getProducts(
  options: ProductQueryOptions = {},
): Promise<Product[]> {
  const currencyCode = options.currencyCode ?? "USD";

  if (isMockEnabled) {
    return mockProducts.map((product) => mapMockProduct(product, currencyCode));
  }

  const shopifyProducts = await getShopifyProducts({
    countryCode: options.countryCode,
  });
  return shopifyProducts.map(mapShopifyProduct);
}

export async function getFeaturedProduct(
  options: ProductQueryOptions = {},
): Promise<Product | null> {
  const products = await getProducts(options);
  return products[0] ?? null;
}
