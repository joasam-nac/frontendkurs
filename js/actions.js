import {
  incrementItem,
  decrementItem,
  removeItem,
  setItem,
} from "./cart/cart.js";
export const actions = {
  increment: (id) => incrementItem(id),
  decrement: (id) => decrementItem(id),
  remove: (id) => removeItem(id),
  set: (id, number) => setItem(id, number),
};
