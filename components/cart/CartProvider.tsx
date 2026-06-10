"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "@/components/products/productsData";
import type { ShopifyCart } from "@/lib/shopify-cart";

interface CartContextValue {
  cart: ShopifyCart;
  cartItemCount: number;
  isCartOpen: boolean;
  isPending: boolean;
  errorMessage: string | null;
  openCart: () => void;
  closeCart: () => void;
  refreshCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  incrementItem: (lineId: string, quantity: number) => Promise<void>;
  decrementItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

const defaultCart: ShopifyCart = {
  id: null,
  checkoutUrl: null,
  currencyCode: "USD",
  subtotalAmount: 0,
  totalAmount: 0,
  totalQuantity: 0,
  lines: [],
};

const CartContext = createContext<CartContextValue | null>(null);

async function requestCart(method: "GET" | "POST" | "PATCH" | "DELETE", body?: unknown) {
  const response = await fetch("/api/cart", {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = (await response.json()) as { cart?: ShopifyCart; error?: string };

  if (!response.ok || !payload.cart) {
    throw new Error(payload.error ?? "Cart request failed.");
  }

  return payload.cart;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart>(defaultCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function refreshCart() {
    setIsPending(true);

    try {
      const nextCart = await requestCart("GET");
      setCart(nextCart);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to refresh cart.",
      );
    } finally {
      setIsPending(false);
    }
  }

  useEffect(() => {
    async function loadInitialCart() {
      try {
        const nextCart = await requestCart("GET");
        setCart(nextCart);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to refresh cart.",
        );
      } finally {
        setIsPending(false);
      }
    }

    void loadInitialCart();
  }, []);

  async function mutateCart(method: "POST" | "PATCH" | "DELETE", body: unknown) {
    setIsPending(true);

    try {
      const nextCart = await requestCart(method, body);
      setCart(nextCart);
      setErrorMessage(null);
      return nextCart;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Cart update failed.",
      );
      throw error;
    } finally {
      setIsPending(false);
    }
  }

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      cartItemCount: cart.totalQuantity,
      isCartOpen,
      isPending,
      errorMessage,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      refreshCart,
      addItem: async (product, quantity = 1) => {
        await mutateCart("POST", {
          lines: [{ merchandiseId: product.merchandiseId, quantity }],
        });
        setIsCartOpen(true);
      },
      incrementItem: async (lineId, quantity) => {
        await mutateCart("PATCH", {
          lines: [{ cartLineId: lineId, quantity: quantity + 1 }],
        });
      },
      decrementItem: async (lineId, quantity) => {
        if (quantity <= 1) {
          await mutateCart("DELETE", { lineIds: [lineId] });
          return;
        }

        await mutateCart("PATCH", {
          lines: [{ cartLineId: lineId, quantity: quantity - 1 }],
        });
      },
      removeItem: async (lineId) => {
        await mutateCart("DELETE", { lineIds: [lineId] });
      },
    }),
    [cart, errorMessage, isCartOpen, isPending],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
