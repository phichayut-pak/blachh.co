"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { Dictionary } from "@/lib/i18n";

import "swiper/css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface OurCommuninityProps {
  dictionary: Dictionary["home"]["community"];
}

export function OurCommuninity({ dictionary }: OurCommuninityProps) {
  const router = useRouter();
  const onClickFollowButton = () => {
    router.push("https://instagram.com/blachh.co");
  };
  const communityCards = dictionary.cards;
  const mascotImageSrc = dictionary.mascotImageUrl || "/mascots/BLACHH-02.png";

  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  type CommunityCard = (typeof communityCards)[number] & {
    imageAlt?: string;
    imageUrl?: string;
  };

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

  const renderCard = (
    card: CommunityCard,
    index: number,
  ) => {
    const isActive = index === activeIndex;
    const hasVideo = typeof card.videoUrl === "string" && card.videoUrl.length > 0;
    const hasImage = typeof card.imageUrl === "string" && card.imageUrl.length > 0;

    return (
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
            src={card.imageUrl as string}
            fallbackSrc={card.imageUrl as string}
            alt={card.imageAlt || card.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 300px, 380px"
          />
        ) : null}
      </div>
    );
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className="bg-[#F7F3EE] px-5 py-14 sm:px-6 md:px-12 md:py-20 lg:px-18"
    >
      <motion.div
        variants={stagger}
        className="mx-auto flex w-full max-w-7xl flex-col items-center"
      >
        <motion.p variants={fadeUp} className="font-hanken text-xs leading-6 uppercase tracking-[0.18em] text-[#9A9A94] sm:text-sm">
          {dictionary.eyebrow}
        </motion.p>

        <motion.h1 variants={fadeUp} className="mt-3 text-center font-libre text-[2rem] leading-tight text-[#2B211B] sm:text-[2.5rem] md:mt-2.5 md:text-[52px] md:leading-[1.08]">
          {dictionary.title}
        </motion.h1>

        <motion.h2 variants={fadeUp} className="mt-3 max-w-xl text-center font-hanken text-sm leading-6 text-[#5A5A55] sm:text-[15px] md:mt-3.5 md:leading-7">
          {dictionary.description}
        </motion.h2>

        <motion.div variants={fadeUp} className="mt-8 w-full md:mt-6">
          <Swiper
            modules={[Mousewheel]}
            slidesPerView="auto"
            spaceBetween={12}
            className="w-full"
            mousewheel={{ forceToAxis: true }}
          >
            {communityCards.map((card, index) => (
              <SwiperSlide key={index} className="!w-auto pb-1">
                {renderCard(card, index)}
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </motion.div>

      <motion.div variants={fadeUp} className="mx-auto mt-10 w-full max-w-md rounded-3xl border border-[#E7DDD3] bg-[#FBF7F2] px-5 py-5 md:mt-14 md:max-w-none md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0">
        <div className="flex flex-col items-center justify-center gap-4 md:mb-6 md:flex-row md:gap-2.5">
          <ImageWithFallback
            src={mascotImageSrc}
            fallbackSrc="/mascots/BLACHH-02.png"
            alt={dictionary.mascotAlt}
            width={84}
            height={80}
            className="h-auto w-16 shrink-0 md:w-[84px]"
          />

          <p className="text-center font-hanken text-sm leading-6 text-[#5A5A55] md:text-left md:leading-6.75">
            {dictionary.followText}{" "}
            <span className="font-medium text-[#2D4A2A]">{dictionary.instagramHandle}</span>
          </p>

          <button
            className="h-11 w-full cursor-pointer rounded-sm border-[1.5px] border-[#FFCAD4] bg-[#FFCAD4B2] px-5 text-sm text-[#2B211B] sm:w-auto md:h-6.75 md:min-w-20 md:px-4"
            onClick={onClickFollowButton}
          >
            {dictionary.followCta}
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}
