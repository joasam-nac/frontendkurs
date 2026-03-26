import { getCart, saveCart } from "./shared.js";

export const addToCart = (product) => {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  return cart;
};

export const changeCartQuantity = (id, delta) => {
  const cart = getCart();
  const item = cart.find((product) => product.id === id);

  if (!item) {
    return cart;
  }

  item.quantity += delta;

  const updatedCart = cart.filter((product) => product.quantity > 0);

  saveCart(updatedCart);
  return updatedCart;
};

export const removeFromCart = (id) => {
  const updatedCart = getCart().filter((item) => item.id !== id);

  saveCart(updatedCart);
  return updatedCart;
};

export const clearCart = () => {
  saveCart([]);
  return [];
};