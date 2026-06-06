"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import type { Product } from "@/components/products/productsData";

import "swiper/css";

interface ProductImageGalleryProps {
  product: Product;
}

const galleryImages = Array.from({ length: 4 }, () => "/mock/mock-product.png");

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);

  return (
    <section className="flex w-full shrink-0 flex-col gap-5 md:w-[460px] md:gap-8">
      <div className="flex items-center justify-center">
        <Image
          src={selectedImage}
          alt={product.productName}
          width={460}
          height={570}
          className="h-auto w-full max-w-[460px] object-contain md:h-[570px] md:w-[460px]"
          priority
        />
      </div>

      <Swiper
        slidesPerView="auto"
        spaceBetween={16}
        className="w-full md:w-[460px]"
        breakpoints={{
          768: {
            spaceBetween: 32,
          },
        }}
      >
        {galleryImages.map((imageSrc, index) => {
          const isSelected = selectedImage === imageSrc;

          return (
            <SwiperSlide key={`${imageSrc}-${index}`} className="!w-auto">
              <button
                type="button"
                onClick={() => setSelectedImage(imageSrc)}
                className={`transition-opacity ${
                  isSelected ? "opacity-100" : "opacity-75 hover:opacity-100"
                }`}
                aria-label={`Show product image ${index + 1}`}
                aria-pressed={isSelected}
              >
                <Image
                  src={imageSrc}
                  alt={`${product.productName} thumbnail ${index + 1}`}
                  width={100}
                  height={130}
                  className="h-[104px] w-[80px] object-contain md:h-[130px] md:w-[100px]"
                />
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
