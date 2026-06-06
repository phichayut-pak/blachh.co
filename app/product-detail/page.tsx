import { ProductDetailTabs } from "@/components/products/ProductDetailTabs";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ProductQuantityStepper } from "@/components/products/ProductQuantityStepper";
import { ProductReviewCarousel } from "@/components/products/ProductReviewCarousel";
import { products } from "@/components/products/productsData";
import { ChevronDown, Star, Truck } from "lucide-react";

const featuredProduct = products[0];
const reviewCounts = 128;
const rating = 4.9;
const ratingBreakdown = [
  { rating: 5, fillPercent: 84, reviewsCount: 4_142 },
  { rating: 4, fillPercent: 10, reviewsCount: 493 },
  { rating: 3, fillPercent: 4, reviewsCount: 197 },
  { rating: 2, fillPercent: 1.5, reviewsCount: 74 },
  { rating: 1, fillPercent: 0.5, reviewsCount: 28 },
] as const;

export default function ProductDetailPage() {
  return (
    <>
      <div className="bg-[#F5F0E8]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 pb-12 pt-8 md:flex-row md:gap-[72px] md:px-[64px] md:pb-[120px] md:pt-[80px]">
          <ProductImageGallery product={featuredProduct} />

          <section className="flex min-w-0 flex-1 flex-col gap-4 md:gap-3">
            <p className="font-libre text-[12px] font-normal leading-5 text-[#9A9C9D] md:leading-none">
              CEREMONIAL GRADE · KAGOSHIMA JAPAN · FIRST HARVEST
            </p>
            <div className="flex flex-col gap-2">
              <h1 className="font-libre text-[30px] font-normal leading-[1.05] text-[#1F1A17] md:text-[36px] md:leading-none">
                Hinoki <span className="italic">Organic</span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-[#79994D] text-[#79994D]"
                    />
                  ))}
                </div>
                <p className="font-hanken text-[16px] font-normal leading-none text-[#5D5E5B]">
                  {reviewCounts} reviews
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="font-libre text-[14px] leading-[31px] font-normal text-[#000]">
                Weight
              </p>
              <button
                type="button"
                className="flex h-[44px] cursor-pointer items-center justify-between rounded-[2px] border border-[rgba(28,28,26,0.50)] px-4"
              >
                <span className="font-libre text-[14px] font-normal leading-[31px] text-[#1C1C1A]">
                  10g
                </span>
                <ChevronDown className="h-5 w-5 text-[#1C1C1A]" />
              </button>
            </div>
            <div className="flex flex-col items-stretch justify-start gap-3 md:flex-row md:items-center md:gap-4">
              <ProductQuantityStepper />
              <button
                type="button"
                className="flex h-[48px] w-full cursor-pointer items-center justify-center gap-1 bg-[#FFCAD4] px-4 transition-colors duration-200 hover:bg-[#f7b7c5] md:h-auto"
              >
                <span className="font-libre text-[14px] font-normal leading-[31px] text-[#1C1C1A]">
                  Add to cart
                </span>
                <span className="h-[3px] w-[3px] rounded-full bg-[#1C1C1A]" />
                <span className="font-libre text-[14px] font-normal leading-[31px] text-[#1C1C1A]">
                  {featuredProduct.price} {featuredProduct.currency}
                </span>
              </button>
            </div>
            <div className="flex items-start justify-start gap-3 md:items-center md:gap-4">
              <Truck className="mt-1 h-6 w-6 shrink-0 text-[#5E554D] md:mt-0" />
              <p className="font-libre text-[14px] font-normal leading-6 text-[#5E554D] md:leading-[31px]">
                Free shipping on orders over 500 SEK
              </p>
            </div>
            <div className="my-[22px] w-full border-t border-black" />
            <ProductDetailTabs />
          </section>
        </div>
      </div>

      <section className="flex flex-col border-t border-[#DCD0C3] bg-[#FAF1EA] px-5 py-10 md:px-[96px] md:py-[60px]">
        <h2 className="font-libre text-[30px] italic font-medium leading-[1.05] text-[#000] md:text-[36px] md:leading-[31px]">
          Customer Reviews
        </h2>
        <div className="mt-8 flex flex-col items-start justify-start gap-8 md:mt-9 md:flex-row md:items-center md:gap-[72px]">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <p className="font-libre text-[42px] font-medium leading-[1] text-[#000] md:text-[48px] md:leading-[31px]">
                {rating}
              </p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={`review-star-${index}`}
                    className="h-4 w-4 fill-[#79994D] text-[#79994D]"
                  />
                ))}
              </div>
            </div>
            <p className="font-libre text-[14px] font-medium leading-[31px] text-[#020000]">
              Based on 4,934 reviews
            </p>
          </div>
          <div className="flex w-full flex-col md:w-auto">
            {ratingBreakdown.map((item) => (
              <div
                key={item.rating}
                className="flex w-full items-center gap-3 md:gap-5"
              >
                <div className="flex items-center gap-2">
                  <p className="font-libre text-[14px] font-medium leading-[31px] text-[#5D5E5B]">
                    {item.rating}
                  </p>
                  <Star className="h-4 w-4 fill-[#79994D] text-[#79994D]" />
                </div>
                <div className="h-2 flex-1 rounded-full bg-[#F0E8E0] md:w-[240px] md:flex-none">
                  <div
                    className="h-2 min-w-2 rounded-full bg-[#79994D]"
                    style={{ width: `${item.fillPercent}%` }}
                  />
                </div>
                <p className="font-libre text-[14px] font-medium leading-[31px] text-[#5D5E5B]">
                  {item.reviewsCount.toLocaleString("en-US")}
                </p>
              </div>
            ))}
          </div>
        </div>
        <ProductReviewCarousel />
      </section>
    </>
  );
}
