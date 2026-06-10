"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { useCart } from "@/components/cart/CartProvider";
import {
  supportedCurrencyOptions,
  type SupportedCurrencyCode,
} from "@/lib/currency";
import { cn } from "@/lib/utils";

interface CurrencySelectorProps {
  currentCurrency: SupportedCurrencyCode;
  buttonClassName?: string;
  menuClassName?: string;
  labelClassName?: string;
  showLongLabel?: boolean;
}

export function CurrencySelector({
  currentCurrency,
  buttonClassName,
  menuClassName,
  labelClassName,
  showLongLabel = false,
}: CurrencySelectorProps) {
  const router = useRouter();
  const { refreshCart } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCurrency, setPendingCurrency] =
    useState<SupportedCurrencyCode | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  const currentOption =
    supportedCurrencyOptions.find((option) => option.currencyCode === currentCurrency) ??
    supportedCurrencyOptions[0];

  async function handleSelect(currencyCode: SupportedCurrencyCode) {
    setPendingCurrency(currencyCode);

    try {
      const response = await fetch("/api/currency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currencyCode }),
      });

      if (!response.ok) {
        throw new Error("Failed to update currency.");
      }

      setIsOpen(false);
      await refreshCart();
      startTransition(() => {
        router.refresh();
      });
    } finally {
      setPendingCurrency(null);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        className={cn("flex items-center gap-1", buttonClassName)}
      >
        <span className={cn(labelClassName)}>
          {showLongLabel ? currentOption.label : currentOption.shortLabel}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen ? "rotate-180" : "",
          )}
        />
      </button>

      {isOpen ? (
        <div
          className={cn(
            "absolute right-0 top-full z-50 mt-2 min-w-[88px] rounded-sm border border-[#E2DDD5] bg-[#FBF9F6] py-2 shadow-[0_8px_24px_rgba(28,28,26,0.08)]",
            menuClassName,
          )}
          role="menu"
        >
          {supportedCurrencyOptions.map((option) => {
            const isActive = option.currencyCode === currentCurrency;
            const isPending = option.currencyCode === pendingCurrency;

            return (
              <button
                key={option.currencyCode}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                disabled={isPending}
                onClick={() => handleSelect(option.currencyCode)}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-1.5 text-left transition-colors",
                  isActive
                    ? "text-[#2B211B]"
                    : "text-[#2B211B80] hover:text-[#2B211B]",
                  isPending ? "opacity-70" : "",
                )}
              >
                <span className="font-cormorant text-sm">
                  {showLongLabel ? option.label : option.shortLabel}
                </span>
                {showLongLabel ? (
                  <span className="font-hanken text-[11px] uppercase tracking-[0.16em] text-[#2B211B66]">
                    {isPending ? "..." : option.shortLabel}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
