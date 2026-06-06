"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

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

const communityCards = [
  {
    title: "Morning pour",
    caption: "Whisked slow, sipped warm",
    className:
      "md:min-h-64 bg-linear-to-b from-[#D7E3C2] via-[#EDE3D6] to-[#C9B6A6]",
  },
  {
    title: "Cafe corner",
    caption: "Soft light and ceremonial green",
    className:
      "md:min-h-80 bg-linear-to-b from-[#F4D9D9] via-[#EEDFCF] to-[#BFA38C] md:mt-10",
  },
  {
    title: "Daily ritual",
    caption: "Bowls, bamboo, and quiet starts",
    className:
      "md:min-h-80 bg-linear-to-b from-[#D9E5D4] via-[#F1EAE0] to-[#CAB6A3] md:mt-0",
  },
  {
    title: "Slow living",
    caption: "Little scenes from the community",
    className:
      "md:min-h-64 bg-linear-to-b from-[#E9D7C3] via-[#F5EEE6] to-[#D5C3B5] md:mt-10",
  },
];

export function OurCommuninity() {
  const router = useRouter();
  const onClickFollowButton = () => {
    router.push("https://instagram.com/blachh.co");
  };

  const renderCard = (
    card: (typeof communityCards)[number],
    index: number,
    extraClassName = "",
  ) => (
    <div
      className={`relative aspect-[3/4] overflow-hidden rounded-2xl p-4 md:aspect-auto md:rounded-md md:p-5 ${card.className} ${extraClassName}`}
    >
      <div className="absolute inset-0 bg-linear-to-t from-[#2B211B1A] via-transparent to-white/35" />
      <div className="absolute right-3 top-3 h-16 w-16 rounded-full border border-white/45 bg-white/20 blur-xl" />

      <div className="relative flex h-full flex-col justify-between">
        <span className="w-fit rounded-full border border-white/60 bg-white/70 px-3 py-1 font-hanken text-[11px] uppercase tracking-[0.18em] text-[#6D625A] backdrop-blur-sm">
          Community
        </span>

        <div>
          <p className="font-libre text-[26px] leading-none text-[#2B211B]">
            {String(index + 1).padStart(2, "0")}
          </p>
          <p className="mt-3 font-hanken text-base leading-5 text-[#2B211B]">
            {card.title}
          </p>
          <p className="mt-1 max-w-[12rem] font-hanken text-xs leading-5 text-[#5A5A55]">
            {card.caption}
          </p>
        </div>
      </div>
    </div>
  );

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
          OUR COMMUNITY
        </motion.p>

        <motion.h1 variants={fadeUp} className="mt-3 text-center font-libre text-[2rem] leading-tight text-[#2B211B] sm:text-[2.5rem] md:mt-2.5 md:text-[52px] md:leading-[1.08]">
          Join the Blachh Community
        </motion.h1>

        <motion.h2 variants={fadeUp} className="mt-3 max-w-xl text-center font-hanken text-sm leading-6 text-[#5A5A55] sm:text-[15px] md:mt-3.5 md:leading-7">
          Snapshots of matcha rituals and slow living moments from our
          community
        </motion.h2>

        <motion.div variants={fadeUp} className="mt-8 w-full md:hidden">
          <Swiper
            slidesPerView={1}
            spaceBetween={12}
            className="w-full"
          >
            {communityCards.map((card, index) => (
              <SwiperSlide key={card.title} className="pb-1">
                {renderCard(card, index, "min-w-0")}
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8 hidden w-full md:mt-6 md:grid md:grid-cols-4 md:gap-2.5">
          {communityCards.map((card, index) => (
            <div key={card.title}>
              {renderCard(card, index, index % 2 === 1 ? "mt-8 md:mt-0" : "")}
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div variants={fadeUp} className="mx-auto mt-10 w-full max-w-md rounded-3xl border border-[#E7DDD3] bg-[#FBF7F2] px-5 py-5 md:mt-14 md:max-w-none md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0">
        <div className="flex flex-col items-center justify-center gap-4 md:mb-6 md:flex-row md:gap-2.5">
          <Image
            src="/mascots/BLACHH-02.png"
            alt="Blachh Mascot"
            width={84}
            height={80}
            className="h-auto w-16 shrink-0 md:w-[84px]"
          />

          <p className="text-center font-hanken text-sm leading-6 text-[#5A5A55] md:text-left md:leading-6.75">
            Follow us on Instagram{" "}
            <span className="font-medium text-[#2D4A2A]">@blachh.co</span>
          </p>

          <button
            className="h-11 w-full cursor-pointer rounded-sm border-[1.5px] border-[#FFCAD4] bg-[#FFCAD4B2] px-5 text-sm text-[#2B211B] sm:w-auto md:h-6.75 md:min-w-20 md:px-4"
            onClick={onClickFollowButton}
          >
            Follow
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}
