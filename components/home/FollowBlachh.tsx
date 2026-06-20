"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import InstagramIcon from "@/components/icons/Instagram";
import TiktokIcon from "@/components/icons/Tiktok";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { Dictionary } from "@/lib/i18n";

import "swiper/css";

interface FollowBlachhProps {
  dictionary: Dictionary["home"]["followBlachh"];
  a11y: Dictionary["a11y"];
}

export function FollowBlachh({ dictionary, a11y }: FollowBlachhProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const cards = dictionary.cards;

  const playVideo = (index: number) => {
    setActiveIndex(index);
    videoRefs.current.forEach((video, videoIndex) => {
      if (!video) return;
      if (videoIndex === index) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  const resetActiveCard = () => {
    playVideo(0);
  };

  return (
    <section className="border-t border-[#E7DDD3] bg-[#F6F1EA] px-5 py-12 sm:px-6 md:px-12 md:py-16 lg:px-18">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <h2 className="font-libre text-[1.25rem] leading-tight text-[#2B211B] sm:text-[1.4rem] md:text-[24px] md:leading-[1.1]">
            {dictionary.title}
          </h2>

          <div className="flex items-center gap-4 text-[#2B211B]">
            <Link
              href={dictionary.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={a11y.visitInstagram}
              className="transition-opacity hover:opacity-70"
            >
              <InstagramIcon />
            </Link>
            <Link
              href={dictionary.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={a11y.visitTiktok}
              className="transition-opacity hover:opacity-70"
            >
              <TiktokIcon />
            </Link>
          </div>
        </div>

        <Swiper
          modules={[Mousewheel]}
          slidesPerView="auto"
          spaceBetween={12}
          className="w-full"
          mousewheel={{ forceToAxis: true }}
        >
          {cards.map((card, index) => {
            const isActive = index === activeIndex;
            const hasVideo =
              typeof card.videoUrl === "string" && card.videoUrl.length > 0;
            const hasImage =
              typeof card.imageUrl === "string" && card.imageUrl.length > 0;

            return (
              <SwiperSlide key={`${card.title}-${index}`} className="!w-auto pb-1">
                <div
                  className={`relative aspect-[3/4] shrink-0 overflow-hidden rounded-2xl bg-[#EDE3D6] transition-[width,opacity] duration-500 ease-out md:aspect-[4/5] md:rounded-md ${
                    isActive
                      ? "w-[240px] opacity-100 sm:w-[272px] md:w-[300px] lg:w-[328px]"
                      : "w-[216px] opacity-60 sm:w-[244px] md:w-[270px] lg:w-[296px]"
                  }`}
                  aria-label={card.title}
                  onMouseEnter={() => playVideo(index)}
                  onMouseLeave={resetActiveCard}
                  onFocus={() => playVideo(index)}
                  onBlur={resetActiveCard}
                  tabIndex={0}
                >
                  {hasVideo ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                      autoPlay={isActive}
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    >
                      <source src={card.videoUrl} type="video/mp4" />
                    </video>
                  ) : hasImage ? (
                    <ImageWithFallback
                      src={card.imageUrl}
                      fallbackSrc={card.imageUrl}
                      alt={card.imageAlt || card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 300px, 328px"
                    />
                  ) : null}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
