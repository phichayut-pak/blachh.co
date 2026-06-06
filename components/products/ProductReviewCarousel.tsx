"use client";

import { CircleCheck, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

const reviews = [
  {
    title: "The best daily matcha",
    body: "Smooth, vibrant, and naturally sweet with no bitterness. I drink it every morning and it sets the tone for a calm and focused day.",
    name: "Sophie L.",
  },
  {
    title: "Beautifully balanced",
    body: "The umami is deep and rounded, and the finish stays clean. It feels refined without being too delicate for everyday drinking.",
    name: "Marcus T.",
  },
  {
    title: "Soft and grounding",
    body: "There is a calm forest note in this that really stands out. The texture is silky and the sweetness comes through naturally.",
    name: "Elin R.",
  },
  {
    title: "Worth the ritual",
    body: "Whisks easily, looks vivid in the bowl, and stays smooth even when I make it slightly stronger. Easily one of my favorites.",
    name: "Daniel K.",
  },
  {
    title: "Very easy to love",
    body: "No harsh edge, just a steady umami and a mellow finish. It gives me a focused start without feeling too intense.",
    name: "Ava M.",
  },
];

export function ProductReviewCarousel() {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={20}
      className="mt-10 w-full md:mt-9"
      breakpoints={{
        768: {
          spaceBetween: 36,
        },
      }}
    >
      {reviews.map((review) => (
        <SwiperSlide
          key={`${review.name}-${review.title}`}
          className="!flex !h-auto !w-auto"
        >
          <article className="flex h-full w-[272px] flex-col rounded-sm border border-[#1C1C1A80] px-5 py-[28px] md:w-[304px]">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star
                  key={`${review.name}-star-${starIndex}`}
                  className="h-4 w-4 fill-[#79994D] text-[#79994D]"
                />
              ))}
            </div>
            <p className="mt-5 font-libre text-base italic font-medium leading-[31px] text-[#1C1C1A]">
              {review.title}
            </p>
            <p className="mt-5 font-libre text-[14px] font-medium leading-[31px] text-[#1C1C1A]">
              {review.body}
            </p>
            <div className="mt-6 flex flex-col">
              <p className="font-libre text-[16px] font-medium leading-[31px] text-[#1C1C1A]">
                {review.name}
              </p>
              <div className="flex items-center justify-start gap-1">
                <CircleCheck className="h-4 w-4 text-[#A49F9B]" />
                <p className="font-libre text-[12px] font-medium leading-[31px] text-[#A49F9B]">
                  Verified Purchase
                </p>
              </div>
            </div>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
