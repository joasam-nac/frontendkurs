import { getCart, saveCart } from "./shared.js";
import {
  render,
  renderCart,
  renderCategories,
  renderProducts,
  setCartOpen,
  ui,
} from "./render.js";

const state = {
  products: [],
  selectedCategory: "allt",
  cart: getCart(),
};

async function loadItems() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    

    if (!response.ok) {
      throw new Error("Could not load products from Fake Store API");
    }

    const products = await response.json();
    console.log(products);

    state.products = products.map((item) => ({
    id: item.id,
    title: item.title,
    name: item.title,
    price: item.price,
    description: item.description,
    category: item.category,
    categories: [item.category],
    image: item.image,
    rating: {
        rate: item.rating?.rate ?? 0,
        count: item.rating?.count ?? 0,
    },
    }));

    render(state);
  } catch (error) {
    console.error("Error loading items:", error);
    ui.productList.innerHTML =
      '<p class="empty-state">Could not load products.</p>';
  }
}

function addToCart(id) {
  const product = state.products.find((p) => p.id === id);

  if (!product) {
    return;
  }

  const item = state.cart.find((p) => p.id === id);

  if (item) {
    item.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  //kundvagn läggs i localStorage
  saveCart(state.cart);
  renderCart(state.cart);
}

function changeQuantity(id, delta) {
  const item = state.cart.find((p) => p.id === id);

  if (!item) {
    return;
  }

  item.quantity += delta;

  //tar bort produkter som har kvantitet 0
  state.cart = state.cart.filter((p) => p.quantity > 0);

  saveCart(state.cart);
  renderCart(state.cart);
}

function clearCart() {
  state.cart = [];
  saveCart(state.cart);
  renderCart(state.cart);
}

function setupEvents() {
  ui.categoryList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");

    if (!button) {
      return;
    }

    state.selectedCategory = button.dataset.category;
    renderCategories(state);
    renderProducts(state);
  });

  ui.productList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");

    if (!button) {
      return;
    }

    addToCart(Number(button.dataset.add));
  });

  ui.cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("[data-change]");

    if (!button) {
      return;
    }

    changeQuantity(Number(button.dataset.id), Number(button.dataset.change));
  });

  ui.clearCartBtn.addEventListener("click", clearCart);

  ui.checkoutLink.addEventListener("click", (event) => {
    //man kan bara komma åt checkout om man har något i kundvagnen
    if (!state.cart.length) {
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
    //gömmer kundvagnen om man klickar utanför den
    setCartOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setCartOpen(false);
    }
  });
}

setupEvents();
loadItems();