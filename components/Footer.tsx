import Link from "next/link";
import { Mail } from "lucide-react";
import { CurrencySelector } from "@/components/CurrencySelector";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { SupportedCurrencyCode } from "@/lib/currency";
import type { Dictionary } from "@/lib/i18n";
import InstagramIcon from "./icons/Instagram";
import TiktokIcon from "./icons/Tiktok";

interface FooterProps {
  currentCurrency: SupportedCurrencyCode;
  dictionary: Dictionary["footer"];
}

export function Footer({ currentCurrency, dictionary }: FooterProps) {
  const mascotImageSrc = "/mascots/BLACHH-04-1.png";
  const mascotAlt = dictionary.mascotAlt || "Footer mascot";

  return (
    <footer className="flex w-full flex-col gap-8 border-t border-[#E2DDD5] bg-[#FBF9F6] px-5 py-10 md:h-89.25 md:flex-row md:items-center md:justify-center md:gap-3 md:px-16 md:py-20">
      {/* LEFT */}
      <div className="flex w-full flex-col gap-8 md:h-full md:justify-between md:px-5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-hanken text-sm font-light text-[#6D625A] sm:grid-cols-3 md:flex md:flex-wrap md:items-center md:justify-between md:gap-3">
          {dictionary.links.map((label) => (
            <p key={label}>{label}</p>
          ))}
        </div>

        <div className="font-hanken text-sm font-light text-[#9A9A9494]">
          {dictionary.copyright}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="hidden h-58.25 border-r border-[#E2DDD5] md:block" />


      {/* RIGHT */}
      <div className="flex w-full flex-col gap-8 md:h-full md:justify-between md:px-5">
        <div className="flex flex-col gap-1">
          <Link
            href="mailto:hello@blachh.co"
            className="font-hanken text-sm font-light text-black underline"
          >
            hello@blachh.co
          </Link>
          <Link
            href="mailto:wholesale@blachh.co"
            className="font-hanken text-sm font-light text-black underline"
          >
            wholesale@blachh.co
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://www.instagram.com/blachh.co/"
            aria-label="Visit Blachh on Instagram"
          >
            <InstagramIcon />
          </Link>
          <Link
            href="https://www.tiktok.com/@blachh.co"
            aria-label="Visit Blachh on TikTok"
          >
            <TiktokIcon />
          </Link>
          <Link
            href="mailto:hello@blachh.co"
            aria-label="Email Blachh"
          >
            <Mail className="w-5.5 h-5.5" />
          </Link>
        </div>

        <div className="flex flex-col items-start md:self-end md:items-center">
          <ImageWithFallback
            src={mascotImageSrc}
            fallbackSrc="/mascots/BLACHH-04-1.png"
            alt={mascotAlt}
            width={101}
            height={65}
          />
          <CurrencySelector
            currentCurrency={currentCurrency}
            showLongLabel
            buttonClassName="rounded-[8px] border border-[#1C1C1A] p-2"
            labelClassName="text-[#1C1C1A] font-cormorant text-sm"
          />
        </div>
      </div>
    </footer>
  );
}
