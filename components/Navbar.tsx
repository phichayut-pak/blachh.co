"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCart } from "@/components/cart/CartProvider";
import { CurrencySelector } from "@/components/CurrencySelector";
import type { SupportedCurrencyCode } from "@/lib/currency";
import {
  type Dictionary,
  type Locale,
  locales,
  replaceLocaleInPathname,
} from "@/lib/i18n";

interface NavbarProps {
  currentCurrency: SupportedCurrencyCode;
  lang: Locale;
  dictionary: Dictionary;
}

function BagButton({
  ariaLabel,
  itemCount,
  onClick,
}: {
  ariaLabel: string;
  itemCount: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center text-[#2B211B]"
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 ? (
        <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1C1C1A] px-1 font-hanken text-[11px] text-[#F5F0E8]">
          {itemCount}
        </span>
      ) : null}
    </button>
  );
}

export function Navbar({ currentCurrency, lang, dictionary }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopLanguageMenuOpen, setIsDesktopLanguageMenuOpen] = useState(false);
  const [isMobileLanguageMenuOpen, setIsMobileLanguageMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cartItemCount, openCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMobileLanguageMenuOpen(false);
  };
  const openCartFromMenu = () => {
    closeMenu();
    openCart();
  };
  const currentPathname = pathname ?? `/${lang}`;

  const navItems = useMemo(
    () => [
      { href: `/${lang}/products`, label: dictionary.nav.shop },
      { href: `/${lang}/about`, label: dictionary.nav.about },
      { href: `/${lang}/contact`, label: dictionary.nav.contact },
    ],
    [dictionary.nav.about, dictionary.nav.contact, dictionary.nav.shop, lang],
  );

  const languageItems = useMemo(
    () =>
      locales.map((locale) => ({
        locale,
        href: replaceLocaleInPathname(currentPathname, locale),
        label: locale.toUpperCase(),
        title: dictionary.locale[locale],
      })),
    [currentPathname, dictionary.locale,],
  );

  return (
    <>
      <nav>
        <div className="grid h-16 grid-cols-[40px_1fr_40px] items-center px-5 md:hidden">
          <BagButton
            ariaLabel={dictionary.a11y.openShoppingBag}
            itemCount={cartItemCount}
            onClick={openCart}
          />

          <div className="justify-self-center">
            <Link href={`/${lang}`} className="block" aria-label={dictionary.a11y.goHome}>
              <Image
                src="/logo/logo.png"
                width={176}
                height={32}
                alt="Blachh Logo"
                className="h-auto w-[144px]"
              />
            </Link>
          </div>

          <button
            type="button"
            aria-label={isMenuOpen ? dictionary.a11y.closeMenu : dictionary.a11y.openMenu}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center justify-self-end text-[#2B211B]"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className="hidden h-18 grid-cols-[1fr_auto_1fr] items-center px-12 md:grid">
          <div className="flex items-center gap-10 text-sm font-cormorant text-[#2B211B]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="justify-self-center">
            <Link href={`/${lang}`} className="block" aria-label={dictionary.a11y.goHome}>
              <Image
                src="/logo/logo.png"
                width={176}
                height={32}
                alt="Blachh Logo"
                className="h-auto w-[176px]"
              />
            </Link>
          </div>

          <div className="flex items-center justify-self-end gap-6">
            <div className="flex items-center gap-3">
              <CurrencySelector
                currentCurrency={currentCurrency}
                buttonClassName="cursor-pointer"
                labelClassName="font-cormorant text-sm text-[#2B211B]"
              />
              <div className="relative">
                <button
                  type="button"
                  aria-label={dictionary.a11y.openLanguageMenu}
                  aria-expanded={isDesktopLanguageMenuOpen}
                  onClick={() =>
                    setIsDesktopLanguageMenuOpen((open) => !open)
                  }
                  className="flex cursor-pointer items-center gap-1"
                >
                  <p className="font-cormorant text-sm text-[#2B211B]">
                    {lang.toUpperCase()}
                  </p>
                  <ChevronDown
                    className={`h-4 w-4 text-[#2B211B] transition-transform ${
                      isDesktopLanguageMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDesktopLanguageMenuOpen ? (
                  <div className="absolute right-0 top-full z-20 mt-2 min-w-[88px] rounded-sm border border-[#E2DDD5] bg-[#FBF9F6] py-2 shadow-[0_8px_24px_rgba(28,28,26,0.08)]">
                    {languageItems.map((item) => (
                      <Link
                        key={item.locale}
                        href={item.href}
                        title={item.title}
                        onClick={() => setIsDesktopLanguageMenuOpen(false)}
                        className={`block px-3 py-1.5 font-cormorant text-sm ${
                          item.locale === lang
                            ? "text-[#2B211B]"
                            : "text-[#2B211B80]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <BagButton
              ariaLabel={dictionary.a11y.openShoppingBag}
              itemCount={cartItemCount}
              onClick={openCart}
            />
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-50 bg-[#F7F3EE] transition-transform duration-300 ease-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex h-full flex-col px-5 pb-8 pt-4">
          <div className="grid grid-cols-[40px_1fr_40px] items-center">
            <BagButton
              ariaLabel={dictionary.a11y.openShoppingBag}
              itemCount={cartItemCount}
              onClick={openCartFromMenu}
            />

            <Link
              href={`/${lang}`}
              aria-label={dictionary.a11y.goHome}
              className="justify-self-center"
              onClick={closeMenu}
            >
              <Image
                src="/logo/logo.png"
                width={176}
                height={32}
                alt="Blachh Logo"
                className="h-auto w-[144px]"
              />
            </Link>

            <button
              type="button"
              aria-label={dictionary.a11y.closeMenu}
              onClick={closeMenu}
              className="flex h-10 w-10 items-center justify-center justify-self-end text-[#2B211B]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onClick={closeMenu}
                className="font-cormorant text-4xl leading-none tracking-[0.08em] text-[#2B211B]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 pb-6">
            <div className="flex items-center gap-6">
              <CurrencySelector
                currentCurrency={currentCurrency}
                buttonClassName="font-cormorant text-sm tracking-[0.12em] text-[#2B211B]"
                menuClassName="left-1/2 right-auto min-w-[200px] -translate-x-1/2"
                labelClassName="font-cormorant text-sm tracking-[0.12em] text-[#2B211B]"
              />
              <div className="relative">
                <button
                  type="button"
                  aria-label={dictionary.a11y.openLanguageMenu}
                  aria-expanded={isMobileLanguageMenuOpen}
                  onClick={() =>
                    setIsMobileLanguageMenuOpen((open) => !open)
                  }
                  className="flex items-center gap-1 font-cormorant text-sm tracking-[0.12em] text-[#2B211B]"
                >
                  {lang.toUpperCase()}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isMobileLanguageMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMobileLanguageMenuOpen ? (
                  <div className="absolute bottom-full left-1/2 mb-3 min-w-[88px] -translate-x-1/2 rounded-sm border border-[#E2DDD5] bg-[#FBF9F6] py-2 shadow-[0_8px_24px_rgba(28,28,26,0.08)]">
                    {languageItems.map((item) => (
                      <Link
                        key={item.locale}
                        href={item.href}
                        title={item.title}
                        onClick={closeMenu}
                        className={`block px-3 py-1.5 text-center font-cormorant text-sm ${
                          item.locale === lang
                            ? "text-[#2B211B]"
                            : "text-[#2B211B80]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartDrawer />
    </>
  );
}
