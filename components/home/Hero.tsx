"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { Dictionary } from "@/lib/i18n";

const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const heroItem = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

interface HeroProps {
  dictionary: Dictionary["home"]["hero"];
}

export function Hero({ dictionary }: HeroProps) {
  const heroImageSrc = dictionary.imageUrl || "/hero-background.png";
  const heroImageAlt = dictionary.imageAlt || "Hero background";
  const hasSplitTitle = Boolean(dictionary.titleLineOne && dictionary.titleLineTwo);

  return (
    <section className="relative min-h-[72svh] w-full overflow-hidden md:min-h-[45rem]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <ImageWithFallback
          src={heroImageSrc}
          fallbackSrc="/hero-background.png"
          alt={heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div className="absolute inset-0 bg-linear-to-r from-white/80 via-white/45 to-white/10 md:from-white/35 md:via-white/10 md:to-white/0" />

      <div className="relative z-10 flex min-h-[72svh] w-full items-center justify-center md:min-h-[45rem] md:justify-start">
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="visible"
          className="flex max-w-[20rem] flex-col items-center px-5 py-10 text-center sm:max-w-md sm:px-6 md:max-w-xl md:items-start md:px-10 md:text-left lg:px-16"
        >
          <motion.p
            variants={heroItem}
            className="font-hanken text-xs leading-6 uppercase tracking-[0.18em] text-[#8E847B] sm:text-sm sm:leading-7"
          >
            {dictionary.eyebrow}
          </motion.p>

          <motion.h1
            variants={heroItem}
            className="mt-3 font-libre text-4xl leading-tight font-normal text-[#1C1C1A] sm:mt-4 sm:text-5xl md:text-[58px] md:leading-[1.02]"
          >
            {hasSplitTitle ? (
              <>
                {dictionary.titleLineOne}
                <span className="block italic text-[#7C9360]">
                  {dictionary.titleLineTwo}
                </span>
              </>
            ) : (
              dictionary.title
            )}
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mt-3 max-w-sm font-hanken text-sm leading-6 text-[#5C534D] md:leading-7"
          >
            {dictionary.description}
          </motion.p>

          <motion.div
            variants={heroItem}
            className="mt-4 font-hanken text-sm leading-6 text-[#6B625C] md:mt-5 md:leading-7"
          >
            {dictionary.rating}
          </motion.div>

          <motion.button
            variants={heroItem}
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-1 rounded-sm bg-[#FFCAD4] px-5 py-3 sm:w-fit"
          >
            <p className="font-hanken text-base leading-7 text-[#2B211B]">{dictionary.cta}</p>
            <ArrowRight className="h-4 w-4 text-[#2B211B]" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
