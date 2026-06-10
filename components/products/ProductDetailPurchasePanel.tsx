"use client";

import { useState } from "react";

import { useCart } from "@/components/cart/CartProvider";
import { ProductQuantityStepper } from "@/components/products/ProductQuantityStepper";
import type { Product } from "@/components/products/productsData";

interface ProductDetailPurchasePanelProps {
  product: Product;
}

export function ProductDetailPurchasePanel({
  product,
}: ProductDetailPurchasePanelProps) {
  const { addItem, isPending } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    await addItem(product, quantity);
  };

  return (
    <div className="flex flex-col items-stretch justify-start gap-3 md:flex-row md:items-center md:gap-4">
      <ProductQuantityStepper
        quantity={quantity}
        onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
        onIncrease={() => setQuantity((current) => current + 1)}
      />
      <button
        type="button"
        onClick={() => void handleAddToCart()}
        disabled={isPending}
        className="flex h-[48px] w-full cursor-pointer items-center justify-center gap-1 bg-[#FFCAD4] px-4 transition-colors duration-200 hover:bg-[#f7b7c5] md:h-auto"
      >
        <span className="font-libre text-[14px] font-normal leading-[31px] text-[#1C1C1A]">
          {isPending ? "Adding..." : "Add to cart"}
        </span>
        <span className="h-[3px] w-[3px] rounded-full bg-[#1C1C1A]" />
        <span className="font-libre text-[14px] font-normal leading-[31px] text-[#1C1C1A]">
          {product.formattedPrice}
        </span>
      </button>
    </div>
  );
}
