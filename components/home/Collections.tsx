"use client";

import Image from "next/image";
import { ArrowRight, MoveRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import { LocalizedLink } from "@/components/LocalizedLink";
import type { Product } from "@/components/products/productsData";

import "swiper/css";

const highlightedProductNames = [
  "Society Hinoki",
  "Society Izumo",
  "Society Hiyori",
  "Society Shizen",
  "Society Natsukashi",
  "Society Uji Hojicha",
  "Nami Yame",
  "Nami Dark Hojicha",
  "Nami Hojicha",
  "Nami Kana",
  "Nami Okumidori",
  "Nami Strawberry",
] as const;

interface CollectionsProps {
  products: Product[];
}

export function Collections({ products }: CollectionsProps) {
  const highlightedProducts = highlightedProductNames
    .map((productName) =>
      products.find((product) => product.productName === productName),
    )
    .filter((product): product is Product => product !== undefined);

  const renderProductCard = (product: (typeof highlightedProducts)[number]) => (
    <LocalizedLink
      key={`${product.productName}-${product.size}`}
      href="/product-detail"
      prefetch={false}
      className="flex w-full flex-col gap-0 md:w-[150px]"
    >
      <div className="flex justify-center">
        <Image
          src={product.imageSrc}
          alt={product.productName}
          width={150}
          height={200}
          className="h-[200px] w-[150px] object-cover"
        />
      </div>

      <p className="mt-4 font-libre text-[16px] leading-[27px] font-normal text-[#1C1C1A]">
        {product.productName}
      </p>

      <p className="mt-1 font-hanken text-[12px] leading-[27px] font-light text-[#9A9A94]">
        {product.size}g
      </p>

      <div className="flex items-center justify-between">
        <p className="font-hanken text-[12px] leading-[27px] font-normal text-[#6F8B5E]">
          {product.formattedPrice}
        </p>

        <MoveRight className="h-6 w-6 text-black" />
      </div>
    </LocalizedLink>
  );

  return (
    <section className="bg-[#F7F3EE]">
      <div className="flex flex-col px-5 py-14 sm:px-6 md:px-[64px] md:py-[80px]">
        <p className="font-hanken text-[11px] leading-[31px] font-normal uppercase text-[#9A9A94]">
          BROWSE PRODUCTS
        </p>

        <h2 className="mt-3 max-w-[480px] font-libre text-[2rem] leading-tight font-normal text-[#1C1C1A] sm:text-[2.5rem] md:text-[52px] md:leading-[60px]">
          Find what speaks to your ritual.
        </h2>

        <LocalizedLink
          href="/products"
          prefetch={false}
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-sm px-1 py-1.5"
        >
          <span className="font-hanken text-[13px] leading-[27px] font-normal uppercase text-black underline">
            VIEW ALL
          </span>

          <ArrowRight
            className="h-[12px] w-[12px] shrink-0 stroke-black"
            strokeWidth={1.25}
          />
        </LocalizedLink>

        <div className="mt-10 w-full md:hidden">
          <Swiper slidesPerView={1.15} spaceBetween={16} className="w-full">
            {highlightedProducts.map((product) => (
              <SwiperSlide key={`${product.productName}-${product.size}`} className="pb-1">
                {renderProductCard(product)}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-10 hidden flex-wrap items-start gap-x-8 gap-y-10 md:flex">
          {highlightedProducts.map((product) => renderProductCard(product))}
        </div>
      </div>
    </section>
  );
}
