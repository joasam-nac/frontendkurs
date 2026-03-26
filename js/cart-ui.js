import { clearCart, changeCartQuantity } from "./cart.js";
import { getCart } from "./shared.js";
import { renderCart, setCartOpen, ui } from "./render.js";

let isInitialized = false;

export const initCartUi = () => {
  if (
    !ui.cartItems ||
    !ui.clearCartBtn ||
    !ui.checkoutLink ||
    !ui.cartToggle ||
    !ui.cartDropdown
  ) {
    return;
  }

  renderCart(getCart());

  if (isInitialized) {
    return;
  }

  isInitialized = true;

  ui.cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("[data-change]");

    if (!button) {
      return;
    }

    const updatedCart = changeCartQuantity(
      Number(button.dataset.id),
      Number(button.dataset.change)
    );

    renderCart(updatedCart);
  });

  ui.clearCartBtn.addEventListener("click", () => {
    renderCart(clearCart());
  });

  ui.checkoutLink.addEventListener("click", (event) => {
    if (!getCart().length) {
      event.preventDefault();
    }
  });

  ui.cartToggle.addEventListener("click", (event) => {
    event.stopPropagation();

    const isHidden = ui.cartDropdown.classList.contains("hidden");
    setCartOpen(isHidden);
  });

  ui.cartDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    setCartOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setCartOpen(false);
    }
  });
};