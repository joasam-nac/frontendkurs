import { addToCart } from "./cart.js";
import { initCartUi } from "./cart-ui.js";
import { normalizeProduct, saveStoredProducts } from "./shared.js";
import {
  render,
  renderCart,
  renderCategories,
  renderProducts,
  ui,
} from "./render.js";

const state = {
  products: [],
  selectedCategory: "allt",
};

async function loadItems() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");

    if (!response.ok) {
      throw new Error("Could not load products from Fake Store API");
    }

    const products = await response.json();

    state.products = products.map(normalizeProduct);

    saveStoredProducts(state.products);
    render(state);
  } catch (error) {
    console.error("Error loading items:", error);

    if (ui.productList) {
      ui.productList.innerHTML =
        '<p class="rounded-2xl border-4 border-black bg-white p-4 font-bold shadow-[4px_4px_0_0_#000]">Could not load products.</p>';
    }
  }
}

function setupPageEvents() {
  if (ui.categoryList) {
    ui.categoryList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");

      if (!button) {
        return;
      }

      state.selectedCategory = button.dataset.category;
      renderCategories(state);
      renderProducts(state);
    });
  }

  if (ui.productList) {
    ui.productList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-add]");

      if (!button) {
        return;
      }

      const productId = Number(button.dataset.add);
      const product = state.products.find((item) => item.id === productId);

      if (!product) {
        return;
      }

      const updatedCart = addToCart(product);
      renderCart(updatedCart);
    });
  }
}

initCartUi();
setupPageEvents();
loadItems();