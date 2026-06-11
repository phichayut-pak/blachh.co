import { notFound } from "next/navigation";

import { CartPageContent } from "@/components/cart/CartPageContent";
import { getRequestCartState } from "@/lib/shopify-cart-server";

export const dynamic = "force-dynamic";

interface LocalizedCartPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function LocalizedCartPage({
  params,
}: LocalizedCartPageProps) {
  const { lang } = await params;
  const { cart } = await getRequestCartState();

  if (!lang) {
    notFound();
  }

  return <CartPageContent lang={lang} initialCart={cart} />;
}
