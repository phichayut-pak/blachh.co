"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import type { Product, ProductCategory } from "@/components/products/productsData";
import {
  getPriceFilterConfig,
  getPriceFilterThresholds,
  type SupportedCurrencyCode,
} from "@/lib/currency";
import { localizeHref } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import "swiper/css";

type CategoryOption = "All products" | ProductCategory;
type SizeFilter = "all" | "small" | "medium" | "large";
type PriceFilter = "all" | "under-350" | "350-500" | "500-plus";

interface ProductsCatalogProps {
  products: Product[];
}

interface FilterState {
  size: SizeFilter;
  price: PriceFilter;
}

const categoryOrder: CategoryOption[] = ["All products", "Matcha", "Books", "Toys"];

const filterSections = {
  size: [
    { value: "all" as const, label: "All sizes" },
    { value: "small" as const, label: "Up to 30g" },
    { value: "medium" as const, label: "31g - 50g" },
    { value: "large" as const, label: "Above 50g" },
  ],
};

const defaultFilters: FilterState = {
  size: "all",
  price: "all",
};

const MotionLink = motion.create(Link);
const revealEase = [0.22, 1, 0.36, 1] as const;

function getSizeBucket(size: number): Exclude<SizeFilter, "all"> {
  if (size <= 30) {
    return "small";
  }

  if (size <= 50) {
    return "medium";
  }

  return "large";
}

function getPriceBucket(
  price: number,
  currencyCode: SupportedCurrencyCode,
): Exclude<PriceFilter, "all"> {
  const thresholds = getPriceFilterThresholds(currencyCode);

  if (price < thresholds.under) {
    return "under-350";
  }

  if (price <= thresholds.upper) {
    return "350-500";
  }

  return "500-plus";
}

function FilterSection({
  title,
  value,
  options,
  onChange,
}: {
  title: string;
  value: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  onChange: (nextValue: string) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-hanken text-[13px] uppercase tracking-[0.2em] text-[#7D746D]">
          {title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-full border px-3 py-2 font-hanken text-sm transition-colors",
                isActive
                  ? "border-[#1C1C1A] bg-[#1C1C1A] text-[#F5F0E8]"
                  : "border-[#D9D1C8] bg-[#FBF7F2] text-[#4C463F]",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FilterPanel({
  draftFilters,
  setDraftFilters,
  onReset,
  onApply,
  footerClassName,
  priceOptions,
}: {
  draftFilters: FilterState;
  setDraftFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  onApply: () => void;
  footerClassName?: string;
  priceOptions: ReadonlyArray<{ value: string; label: string }>;
}) {
  return (
    <>
      <div className="space-y-6 px-5 py-5">
        <FilterSection
          title="Size"
          value={draftFilters.size}
          options={filterSections.size}
          onChange={(nextValue) =>
            setDraftFilters((current) => ({
              ...current,
              size: nextValue as SizeFilter,
            }))
          }
        />

        <FilterSection
          title="Price"
          value={draftFilters.price}
          options={priceOptions}
          onChange={(nextValue) =>
            setDraftFilters((current) => ({
              ...current,
              price: nextValue as PriceFilter,
            }))
          }
        />
      </div>

      <div className={footerClassName}>
        <button
          type="button"
          onClick={onReset}
          className="font-hanken text-sm uppercase tracking-[0.16em] text-[#6F675F] underline underline-offset-4"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={onApply}
          className="w-full rounded-full bg-[#1C1C1A] px-4 py-3 font-hanken text-sm uppercase tracking-[0.16em] text-[#F5F0E8]"
        >
          Apply
        </button>
      </div>
    </>
  );
}

function FilterTrigger({
  activeCount,
  labelId,
}: {
  activeCount: number;
  labelId: string;
}) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#D9D1C8] bg-[#FBF7F2] text-[#1C1C1A] shadow-[0_6px_18px_rgba(28,28,26,0.08)]">
      <SlidersHorizontal className="h-4 w-4" />
      <span id={labelId} className="sr-only">
        Open filters
      </span>
      {activeCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1C1C1A] px-1 font-hanken text-[11px] text-[#F5F0E8]">
          {activeCount}
        </span>
      ) : null}
    </div>
  );
}

export function ProductsCatalog({ products }: ProductsCatalogProps) {
  const pathname = usePathname();
  const currentCurrency = (products[0]?.currency ?? "USD") as SupportedCurrencyCode;
  const [activeCategory, setActiveCategory] =
    useState<CategoryOption>("All products");
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(defaultFilters);
  const [draftFilters, setDraftFilters] = useState<FilterState>(defaultFilters);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const desktopFilterLabelId = useId();
  const prefersReducedMotion = useReducedMotion();
  const priceOptions = getPriceFilterConfig(currentCurrency);

  const revealSection = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0.18 }
        : { duration: 0.3, ease: revealEase, staggerChildren: 0.08 },
    },
  };

  const revealItem = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0.18 }
        : { duration: 0.55, ease: revealEase },
    },
  };

  const revealGrid = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: prefersReducedMotion
        ? { staggerChildren: 0.02 }
        : { staggerChildren: 0.05, delayChildren: 0.14 },
    },
  };

  const revealCard = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0.18 }
        : { duration: 0.45, ease: revealEase },
    },
  };

  const revealImage = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: prefersReducedMotion
        ? { duration: 0.18 }
        : { duration: 0.6, ease: revealEase },
    },
  };

  useEffect(() => {
    if (!isMobileFilterOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileFilterOpen]);

  const activeFilterCount =
    Number(appliedFilters.size !== "all") + Number(appliedFilters.price !== "all");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All products" || product.category === activeCategory;
    const matchesSize =
      appliedFilters.size === "all" ||
      getSizeBucket(product.size) === appliedFilters.size;
    const matchesPrice =
      appliedFilters.price === "all" ||
      getPriceBucket(product.price, currentCurrency) === appliedFilters.price;

    return matchesCategory && matchesSize && matchesPrice;
  });

  const openMobileFilter = () => {
    setDraftFilters(appliedFilters);
    setIsMobileFilterOpen(true);
  };

  const closeMobileFilter = () => {
    setDraftFilters(appliedFilters);
    setIsMobileFilterOpen(false);
  };

  const applyMobileFilters = () => {
    setAppliedFilters(draftFilters);
    setIsMobileFilterOpen(false);
  };

  const renderCategoryButton = (category: CategoryOption) => {
    const isActive = activeCategory === category;

    return (
      <button
        key={category}
        type="button"
        onClick={() => setActiveCategory(category)}
        className={cn(
          "rounded-full border px-4 py-2 font-hanken text-sm whitespace-nowrap transition-colors",
          isActive
            ? "border-[#1C1C1A] bg-[#1C1C1A] text-[#F5F0E8]"
            : "border-[#D9D1C8] bg-transparent text-[#6F675F]",
        )}
      >
        {category}
      </button>
    );
  };

  return (
    <div aria-label="Products page" className="bg-[#F5F0E8]">
      <motion.section
        className="flex flex-col gap-4 px-5 pb-6 pt-8 sm:px-6 md:h-[195px] md:justify-between md:px-[48px] md:pb-[20px] md:pt-[48px]"
        initial="hidden"
        animate="visible"
        variants={revealSection}
      >
        <motion.h1
          className="font-libre text-[2.25rem] leading-[0.95] text-[#1C1C1A] md:text-5xl md:leading-[31px]"
          variants={revealItem}
        >
          All Products
        </motion.h1>

        <motion.div className="md:hidden" variants={revealItem}>
          <div className="relative">
            <div className="pr-16">
              <Swiper slidesPerView="auto" spaceBetween={10} className="w-full">
                {categoryOrder.map((category) => (
                  <SwiperSlide key={category} className="!w-auto">
                    {renderCategoryButton(category)}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="pointer-events-none absolute inset-y-0 right-10 w-8 bg-linear-to-l from-[#F5F0E8] to-transparent" />

            <button
              type="button"
              onClick={openMobileFilter}
              aria-label="Open filters"
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <FilterTrigger
                activeCount={activeFilterCount}
                labelId={`${desktopFilterLabelId}-mobile`}
              />
            </button>
          </div>
        </motion.div>

        <motion.div
          className="hidden items-center justify-between md:flex"
          variants={revealItem}
        >
          <div className="flex items-center gap-5">
            <p className="font-hanken text-base text-[#1C1C1A]">All products</p>
            <p className="font-hanken text-base text-[#1C1C1A99]">Matcha</p>
            <p className="font-hanken text-base text-[#1C1C1A99]">Books</p>
            <p className="font-hanken text-base text-[#1C1C1A99]">Toys</p>
          </div>

          <button
            type="button"
            className="font-hanken text-[16px] uppercase text-black underline"
          >
            Filter
          </button>
        </motion.div>
      </motion.section>

      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={revealGrid}
      >
        {filteredProducts.map((product) => (
          <MotionLink
            key={`${product.productName}-${product.size}`}
            href={localizeHref("/product-detail", pathname ?? "/")}
            prefetch={false}
            className="flex flex-col gap-4 border border-[#E8E3DC] px-4 py-3 transition-[background-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#EFE8DE]"
            variants={revealCard}
          >
            <motion.div className="flex justify-center" variants={revealImage}>
              <Image
                src={product.imageSrc}
                alt={product.productName}
                width={196}
                height={268}
                className="h-[268px] w-[196px] object-contain"
              />
            </motion.div>

            <div className="flex flex-col gap-1">
              <p className="font-hanken text-[24px] font-bold uppercase leading-tight text-[#1C1C1A]">
                {product.productName}
              </p>
              <p className="font-hanken text-[22px] leading-snug text-[#1C1C1A]">
                {product.size}g - {product.formattedPrice}
              </p>
            </div>

          </MotionLink>
        ))}
      </motion.section>

      <AnimatePresence>
        {isMobileFilterOpen ? (
          <motion.div
            key="mobile-filter"
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              aria-label="Close filters"
              className="absolute inset-0 bg-[#1C1C1A]/30"
              onClick={closeMobileFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="absolute inset-x-0 bottom-0 flex max-h-[84vh] flex-col overflow-hidden rounded-t-[32px] bg-[#F8F4EE] shadow-[0_-12px_40px_rgba(28,28,26,0.18)]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-[#E7DDD3] px-5 py-4">
                <div>
                  <p className="font-hanken text-[13px] uppercase tracking-[0.18em] text-[#7D746D]">
                    Filters
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeMobileFilter}
                  aria-label="Close filters"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD3C9] text-[#1C1C1A]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pb-28">
                <FilterPanel
                  draftFilters={draftFilters}
                  setDraftFilters={setDraftFilters}
                  onReset={() => setDraftFilters(defaultFilters)}
                  onApply={applyMobileFilters}
                  priceOptions={priceOptions}
                  footerClassName="fixed inset-x-0 bottom-0 space-y-3 border-t border-[#E7DDD3] bg-[#F8F4EE] px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4"
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
