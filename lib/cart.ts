export interface CartProductSnapshot {
  imageSrc: string;
  productName: string;
  size: number;
  price: number;
  currency: string;
  formattedPrice: string;
}

export interface CartItem extends CartProductSnapshot {
  quantity: number;
}

function updateCartItem(
  cartItems: CartItem[],
  productName: string,
  updater: (item: CartItem) => CartItem | null,
) {
  return cartItems.flatMap((item) => {
    if (item.productName !== productName) {
      return [item];
    }

    const updatedItem = updater(item);
    return updatedItem ? [updatedItem] : [];
  });
}

export function addCartItem(
  cartItems: CartItem[],
  product: CartProductSnapshot,
  quantity = 1,
): CartItem[] {
  if (quantity <= 0) {
    return cartItems;
  }

  const existingItem = cartItems.find(
    (item) => item.productName === product.productName,
  );

  if (!existingItem) {
    return [...cartItems, { ...product, quantity }];
  }

  return updateCartItem(cartItems, product.productName, (item) => ({
    ...item,
    quantity: item.quantity + quantity,
  }));
}

export function incrementCartItem(
  cartItems: CartItem[],
  productName: string,
): CartItem[] {
  return updateCartItem(cartItems, productName, (item) => ({
    ...item,
    quantity: item.quantity + 1,
  }));
}

export function decrementCartItem(
  cartItems: CartItem[],
  productName: string,
): CartItem[] {
  return updateCartItem(cartItems, productName, (item) =>
    item.quantity <= 1 ? null : { ...item, quantity: item.quantity - 1 },
  );
}

export function removeCartItem(
  cartItems: CartItem[],
  productName: string,
): CartItem[] {
  return cartItems.filter((item) => item.productName !== productName);
}

export function getCartItemCount(cartItems: CartItem[]): number {
  return cartItems.reduce((count, item) => count + item.quantity, 0);
}

export function getCartSubtotal(cartItems: CartItem[]): number {
  return cartItems.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
}
