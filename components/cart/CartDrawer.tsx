"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, X } from "lucide-react";

import { ProductQuantityStepper } from "@/components/products/ProductQuantityStepper";
import { formatMoney } from "@/lib/currency";
import { localizeHref } from "@/lib/i18n";

import { useCart } from "./CartProvider";

export function CartDrawer() {
  const {
    cart,
    closeCart,
    decrementItem,
    errorMessage,
    incrementItem,
    isCartOpen,
    isPending,
    removeItem,
  } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [closeCart, isCartOpen]);

  const formattedSubtotal = formatMoney(cart.subtotalAmount, cart.currencyCode);
  const checkoutUrl = cart.checkoutUrl;
  const localizedCartHref = localizeHref("/cart", pathname ?? "/");

  return (
    <AnimatePresence>
      {isCartOpen ? (
        <motion.div
          key="cart-drawer"
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close shopping bag"
            className="absolute inset-0 bg-[#1C1C1A]/35"
            onClick={closeCart}
          />

          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-[#FBF7F2] shadow-[-18px_0_48px_rgba(28,28,26,0.18)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-[#E6DED5] px-5 py-5">
              <div className="space-y-1">
                <p className="font-hanken text-[13px] uppercase tracking-[0.2em] text-[#7D746D]">
                  Shopping bag
                </p>
                <p className="font-libre text-[28px] leading-none text-[#1C1C1A]">
                  {cart.lines.length === 0
                    ? "Your bag is empty"
                    : `${cart.lines.length} product${cart.lines.length === 1 ? "" : "s"}`}
                </p>
              </div>

              <button
                type="button"
                onClick={closeCart}
                aria-label="Close shopping bag"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD3C9] text-[#1C1C1A]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {cart.lines.length === 0 ? (
                <div className="flex h-full flex-col items-start justify-center gap-3">
                  <p className="font-libre text-[22px] leading-tight text-[#1C1C1A]">
                    Add a few products to see them here.
                  </p>
                  <p className="font-hanken text-sm text-[#6F675F]">
                    Your selected matcha and accessories will appear in this drawer.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.lines.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-[24px] border border-[#E6DED5] bg-white/60 p-4"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-[116px] w-[104px] shrink-0 items-center justify-center rounded-[18px] bg-[#F4EDE4]">
                          <Image
                            src={item.imageUrl || "/mock/products/society-hinoki.png"}
                            alt={item.productTitle}
                            width={80}
                            height={104}
                            className="h-[104px] w-[80px] object-contain"
                          />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-3">
                          <div className="space-y-1">
                            <p className="font-hanken text-[12px] uppercase tracking-[0.14em] text-[#8D837B]">
                              {item.variantTitle || "Default size"}
                            </p>
                            <p className="font-hanken text-[20px] font-bold uppercase leading-tight text-[#1C1C1A]">
                              {item.productTitle}
                            </p>
                            <p className="font-hanken text-base text-[#4C463F]">
                              {formatMoney(item.unitAmount, item.currencyCode)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <ProductQuantityStepper
                              quantity={item.quantity}
                              onDecrease={() => void decrementItem(item.id, item.quantity)}
                              onIncrease={() => void incrementItem(item.id, item.quantity)}
                              minQuantity={0}
                            />

                            <button
                              type="button"
                              onClick={() => void removeItem(item.id)}
                              aria-label={`Remove ${item.productTitle} from shopping bag`}
                              className="flex h-10 w-10 cursor-pointer items-center justify-center text-[#C94F4F] transition-colors hover:text-[#A53A3A]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-[#E6DED5] bg-[#FBF7F2] px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
              {errorMessage ? (
                <p className="mb-3 font-hanken text-sm text-[#A53A3A]">
                  {errorMessage}
                </p>
              ) : null}
              <div className="mb-4 flex items-center justify-between">
                <p className="font-hanken text-[13px] uppercase tracking-[0.18em] text-[#7D746D]">
                  Subtotal
                </p>
                <p className="font-libre text-[24px] leading-none text-[#1C1C1A]">
                  {formattedSubtotal}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href={localizedCartHref}
                  onClick={closeCart}
                  className="w-full rounded-full border border-[#1C1C1A] px-4 py-3 text-center font-hanken text-sm uppercase tracking-[0.16em] text-[#1C1C1A]"
                >
                  View bag
                </Link>
                <button
                  type="button"
                  disabled={cart.lines.length === 0 || !checkoutUrl || isPending}
                  onClick={() => {
                    if (!checkoutUrl) {
                      return;
                    }

                    window.location.href = checkoutUrl;
                  }}
                  className="w-full rounded-full bg-[#1C1C1A] px-4 py-3 font-hanken text-sm uppercase tracking-[0.16em] text-[#F5F0E8] transition-opacity disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {isPending ? "Updating..." : "Checkout"}
                </button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
