import { saveStoredProducts, formatPrice } from "./shared.js";
import { render, ui } from "./render.js";
import { actions } from "./actions.js";

const state = {
  products: [],
  selectedCategory: "allt",
};

const PRODUCTS_API = "https://fakestoreapi.samuelsson.sh/products";

async function loadItems() {
  if (ui.productList) {
    ui.productList.innerHTML =
      '<p class="border-2 border-black bg-white p-4 font-bold ">Laddar produkter...</p>';
  }

  try {
    const response = await fetch(PRODUCTS_API);

    if (!response.ok) {
      throw new Error("Could not load products");
    }

    const result = await response.json();

    const products = Array.isArray(result)
      ? result
      : Array.isArray(result.data)
        ? result.data
        : [];

    state.products = products.map((product) => ({
      ...product,
      price: formatPrice(product.price),
    }));

    saveStoredProducts(state.products);
    render(state);
  } catch (error) {
    console.error("Error loading items:", error);

    if (ui.productList) {
      ui.productList.innerHTML =
        '<p class="border-2 border-black bg-white p-4 font-bold ">Could not load products.</p>';
    }
  }
}

function setupPageEvents() {
  ui.categoryList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");

    if (!button) {
      return;
    }

    state.selectedCategory = button.dataset.category;
    render(state);
  });
  ui.productList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    const { action, id } = button.dataset;

    if (!button) return;

    actions[action]?.(id);
  });
}

setupPageEvents();
loadItems();
