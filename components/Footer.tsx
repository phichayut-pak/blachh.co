import Link from "next/link";
import InstagramIcon from "./icons/Instagram";
import { ChevronDown, Mail } from "lucide-react";
import TiktokIcon from "./icons/Tiktok";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="flex w-full flex-col gap-8 border-t border-[#E2DDD5] bg-[#FBF9F6] px-5 py-10 md:h-89.25 md:flex-row md:items-center md:justify-center md:gap-3 md:px-16 md:py-20">
      {/* LEFT */}
      <div className="flex w-full flex-col gap-8 md:h-full md:justify-between md:px-5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-hanken text-sm font-light text-[#6D625A] sm:grid-cols-3 md:flex md:flex-wrap md:items-center md:justify-between md:gap-3">
          <p>About Us</p>
          <p>Shopping Policy</p>
          <p>Privacy</p>
          <p>Cancellation Policy</p>
          <p>Terms of Service</p>
          <p>FAQs</p>
        </div>

        <div className="font-hanken text-sm font-light text-[#9A9A9494]">
          © 2025 Blachh Matcha
        </div>
      </div>

      {/* DIVIDER */}
      <div className="hidden h-58.25 border-r border-[#E2DDD5] md:block" />


      {/* RIGHT */}
      <div className="flex w-full flex-col gap-8 md:h-full md:justify-between md:px-5">
        <div className="flex flex-col gap-1">
          <Link
            href="mailto:hello@blach.co"
            className="font-hanken text-sm font-light text-black underline"
          >
            hello@blach.co
          </Link>
          <Link
            href="mailto:hello@blach.co"
            className="font-hanken text-sm font-light text-black underline"
          >
            wholesale@blach.co
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <InstagramIcon />
          <TiktokIcon />
          <Mail className="w-5.5 h-5.5" />
        </div>

        <div className="flex flex-col items-start md:self-end md:items-center">
          <Image
            src={"/mascots/BLACHH-04-1.png"}
            alt="Footer mascot"
            width={101}
            height={65}
          />
          <button className="rounded-[8px] border border-[#1C1C1A] flex justify-center items-center p-2 gap-1">
            <p className="text-[#1C1C1A] font-cormorant text-sm">Sweden (SEK)</p>
            <ChevronDown className="w-6 h-6 text-[#1C1C1A] stroke-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}
