import test from "node:test";
import assert from "node:assert/strict";

import {
  addCartItem,
  decrementCartItem,
  getCartItemCount,
  getCartSubtotal,
  incrementCartItem,
  removeCartItem,
} from "./cart.ts";

const matcha = {
  imageSrc: "/mock/products/society-hinoki.png",
  productName: "Society Hinoki",
  size: 30,
  price: 745,
  currency: "SEK",
  formattedPrice: "745,00 kr",
};

test("addCartItem merges repeated products into one line with larger quantity", () => {
  const initialCart = addCartItem([], matcha);
  const updatedCart = addCartItem(initialCart, matcha);

  assert.equal(updatedCart.length, 1);
  assert.equal(updatedCart[0]?.quantity, 2);
  assert.equal(getCartItemCount(updatedCart), 2);
  assert.equal(getCartSubtotal(updatedCart), 1490);
});

test("addCartItem can add the selected quantity in one action", () => {
  const updatedCart = addCartItem([], matcha, 3);

  assert.equal(updatedCart.length, 1);
  assert.equal(updatedCart[0]?.quantity, 3);
  assert.equal(getCartItemCount(updatedCart), 3);
  assert.equal(getCartSubtotal(updatedCart), 2235);
});

test("incrementCartItem and decrementCartItem adjust quantity without duplicating rows", () => {
  const initialCart = addCartItem([], matcha);
  const incrementedCart = incrementCartItem(initialCart, matcha.productName);
  const decrementedCart = decrementCartItem(incrementedCart, matcha.productName);

  assert.equal(incrementedCart[0]?.quantity, 2);
  assert.equal(decrementedCart[0]?.quantity, 1);
  assert.equal(getCartItemCount(decrementedCart), 1);
});

test("decrementCartItem removes a line once quantity reaches zero", () => {
  const initialCart = addCartItem([], matcha);
  const updatedCart = decrementCartItem(initialCart, matcha.productName);

  assert.deepEqual(updatedCart, []);
});

test("removeCartItem clears only the targeted product row", () => {
  const hojicha = {
    ...matcha,
    productName: "Nami Hojicha",
    price: 750,
    formattedPrice: "750,00 kr",
  };

  const cart = addCartItem(addCartItem([], matcha), hojicha);
  const updatedCart = removeCartItem(cart, hojicha.productName);

  assert.equal(updatedCart.length, 1);
  assert.equal(updatedCart[0]?.productName, matcha.productName);
});
