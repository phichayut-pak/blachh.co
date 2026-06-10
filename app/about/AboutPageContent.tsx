"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { LocalizedLink } from "@/components/LocalizedLink";

const highlights = [
  "Ceremonial-grade matcha chosen for a smooth, rounded finish.",
  "Stone-milled tradition and a flavor profile made for everyday rituals.",
  "A visual world inspired by quiet mornings, ceramics, and slow living.",
];

const heroImage =
  "https://images.unsplash.com/photo-1753009712810-3f72c3f72548?auto=format&fit=crop&w=1200&q=80";
const craftImage =
  "https://images.unsplash.com/photo-1724709162826-2793827d6418?auto=format&fit=crop&w=1200&q=80";

const pageContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

const sectionFade = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const heroText = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function AboutPageContent() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageContainer}
      className="bg-[#FCF8F3] text-[#2B211B]"
    >
      <motion.section
        variants={sectionFade}
        className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,202,212,0.42),_transparent_28%),linear-gradient(180deg,_#FCF8F3_0%,_#F7F3EE_100%)] px-5 pb-16 pt-12 sm:px-6 md:px-12 md:pb-24 md:pt-18 lg:px-18"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:items-center xl:gap-20">
          <motion.div
            variants={heroText}
            className="max-w-2xl lg:pr-6 xl:pr-10"
          >
            <motion.p
              variants={heroItem}
              className="font-hanken text-xs uppercase tracking-[0.22em] text-[#8E847B] sm:text-sm"
            >
              Our Story
            </motion.p>

            <motion.h1
              variants={heroItem}
              className="mt-4 font-libre text-[2.7rem] leading-[0.98] text-[#1C1C1A] sm:text-6xl md:text-[72px]"
            >
              A calmer start,
              <span className="block italic text-[#7C9360]">
                shaped by matcha.
              </span>
            </motion.h1>

            <motion.p
              variants={heroItem}
              className="mt-5 max-w-xl font-hanken text-sm leading-7 text-[#5C534D] md:text-[15px]"
            >
              Blachh is built around the feeling that a daily ritual can be both
              beautiful and useful. We care about calm flavor, soft design, and
              the kind of product you reach for without thinking twice.
            </motion.p>

            <motion.div
              variants={heroItem}
              className="mt-7 flex flex-wrap gap-3"
            >
              <div className="rounded-full border border-[#E4D7CB] bg-white/80 px-4 py-2 font-hanken text-xs uppercase tracking-[0.18em] text-[#6B625C]">
                Ceremonial Grade
              </div>
              <div className="rounded-full border border-[#E4D7CB] bg-white/80 px-4 py-2 font-hanken text-xs uppercase tracking-[0.18em] text-[#6B625C]">
                Stone-Milled in Japan
              </div>
              <div className="rounded-full border border-[#E4D7CB] bg-white/80 px-4 py-2 font-hanken text-xs uppercase tracking-[0.18em] text-[#6B625C]">
                Quiet Daily Ritual
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#EFE5DB] shadow-[0_30px_80px_rgba(55,37,24,0.12)]">
              <Image
                src={heroImage}
                alt="Matcha bowl prepared as part of a calm morning ritual"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionFade}
        className="px-5 py-16 sm:px-6 md:px-12 md:py-24 lg:px-18"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-10 rounded-[2rem] bg-[#F7F3EE] p-6 md:grid-cols-[0.9fr_1.1fr] md:p-10 lg:p-14">
          <div>
            <p className="font-hanken text-xs uppercase tracking-[0.18em] text-[#9A9189]">
              Why Blachh
            </p>
            <h2 className="mt-3 max-w-sm font-libre text-[2rem] leading-tight text-[#1C1C1A] md:text-[2.7rem]">
              A softer approach to product and routine.
            </h2>
          </div>

          <div className="space-y-5 font-hanken text-sm leading-7 text-[#5C534D] md:text-[15px]">
            <p>
              Blachh starts from a simple idea: small rituals shape the tone of
              the day. Matcha is the center of that ritual, but the experience
              around it matters too, the color, the pace, the bowl, the moment
              of pause before everything else starts.
            </p>
            <p>
              We wanted the brand to feel refined without being distant. Clean
              taste, quiet visuals, and a mood that sits somewhere between a
              Japanese tea ritual and a very modern slow morning at home.
            </p>
            <p className="border-l-2 border-[#D8C7B8] pl-4 font-libre text-xl leading-8 text-[#3A2D25] md:text-2xl">
              “The goal is not just good matcha. It is a better feeling around
              the moment you make it.”
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionFade}
        className="px-5 py-16 sm:px-6 md:px-12 md:py-24 lg:px-18"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#EDE1D6]">
            <Image
              src={craftImage}
              alt="Ceramic bowls and tea ware arranged on a wooden table"
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#2B211B99] via-[#2B211B26] to-transparent p-6">
              <p className="font-hanken text-xs uppercase tracking-[0.2em] text-white/80">
                Craft & sourcing
              </p>
              <p className="mt-2 max-w-sm font-libre text-2xl leading-7 text-white">
                Matcha chosen for flavor, texture, and a cup you want again
                tomorrow.
              </p>
            </div>
          </div>

          <div>
            <p className="font-hanken text-xs uppercase tracking-[0.18em] text-[#9A9189]">
              The product
            </p>
            <h2 className="mt-3 max-w-xl font-libre text-[2rem] leading-tight text-[#1C1C1A] md:text-[2.8rem]">
              Quality matters most when the ritual becomes daily.
            </h2>
            <p className="mt-5 max-w-2xl font-hanken text-sm leading-7 text-[#5C534D] md:text-[15px]">
              A beautiful ritual does not last if the cup disappoints. Blachh is
              shaped around matcha that feels smooth, vibrant, and easy to keep
              returning to, whether it is whisked traditionally or folded into a
              quieter modern routine.
            </p>

            <div className="mt-8 space-y-4">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.42 + index * 0.08,
                  }}
                  className="flex gap-4 rounded-[1.5rem] border border-[#E8DCD1] bg-[#F7F3EE] px-5 py-5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFCAD4] font-hanken text-xs font-medium text-[#2B211B]">
                    0{index + 1}
                  </div>
                  <p className="font-hanken text-sm leading-7 text-[#4F463F]">
                    {highlight}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionFade}
        className="px-5 py-16 sm:px-6 md:px-12 md:py-24 lg:px-18"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-10 text-center md:px-10 md:py-14">
          <p className="font-hanken text-xs uppercase tracking-[0.18em] text-[#8E847B]">
            Begin the ritual
          </p>
          <h2 className="mt-4 max-w-2xl font-libre text-[2.2rem] leading-tight text-[#1C1C1A] md:text-[3rem]">
            Explore the matcha made for slow mornings.
          </h2>
          <p className="mt-4 max-w-xl font-hanken text-sm leading-7 text-[#5C534D] md:text-[15px]">
            Start with the product, then make the routine your own.
          </p>

          <LocalizedLink
            href="/products"
            prefetch={false}
            className="mt-7 inline-flex items-center rounded-sm bg-[#FFCAD4] px-6 py-3 font-hanken text-sm text-[#2B211B] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Shop the collection
          </LocalizedLink>
        </div>
      </motion.section>
    </motion.div>
  );
}
