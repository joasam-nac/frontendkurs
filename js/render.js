import {
  $,
  formatPrice,
  getCart,
  getCartCount,
  getCartTotal,
  getCategories,
  getFilteredProducts,
} from "./shared.js";

export const ui = {
  categoryList: $("category-list"),
  productList: $("product-list"),
  cartToggle: $("cart-toggle"),
  cartDropdown: $("cart-dropdown"),
  cartItems: $("cart-items"),
  cartTotal: $("cart-total"),
  cartCount: $("cart-count"),
  clearCartBtn: $("clear-cart-btn"),
  checkoutLink: $("checkout-link"),
};

const CATEGORY_THEMES = [
  {
    activeButton: "bg-yellow-300 text-black",
    inactiveButton: "bg-yellow-200 text-black",
    card: "bg-yellow-200",
  },
  {
    activeButton: "bg-blue-500 text-white",
    inactiveButton: "bg-blue-300 text-black",
    card: "bg-blue-200",
  },
  {
    activeButton: "bg-pink-500 text-white",
    inactiveButton: "bg-pink-300 text-black",
    card: "bg-pink-200",
  },
  {
    activeButton: "bg-green-500 text-white",
    inactiveButton: "bg-green-300 text-black",
    card: "bg-green-200",
  },
  {
    activeButton: "bg-purple-500 text-white",
    inactiveButton: "bg-purple-300 text-black",
    card: "bg-purple-200",
  },
  {
    activeButton: "bg-cyan-500 text-white",
    inactiveButton: "bg-cyan-300 text-black",
    card: "bg-cyan-200",
  },
];

const FALLBACK_THEME = {
  activeButton: "bg-gray-400 text-black",
  inactiveButton: "bg-gray-200 text-black",
  card: "bg-gray-100",
};

const getCategoryTheme = (category, categories) => {
  const index = categories.indexOf(category);

  if (index === -1) {
    return FALLBACK_THEME;
  }

  return CATEGORY_THEMES[index % CATEGORY_THEMES.length];
};

const createCategoryButton = (category, isActive, categories) => {
  const button = document.createElement("button");
  const theme = getCategoryTheme(category, categories);

  button.type = "button";
  button.dataset.category = category;
  button.className = [
    "rounded-2xl border-4 border-black px-4 py-2 text-sm font-black",
    isActive ? theme.activeButton : theme.inactiveButton,
    isActive
      ? "translate-x-[1px] translate-y-[1px] shadow-[2px_2px_0_0_#000]"
      : "shadow-[4px_4px_0_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
  ].join(" ");
  button.textContent = category;

  return button;
};

const createProductCard = (product, categories) => {
  const article = document.createElement("article");
  const theme = getCategoryTheme(product.category, categories);

  article.className = [
    "flex flex-col rounded-3xl border-4 border-black p-5",
    theme.card,
    "shadow-[6px_6px_0_0_#000]",
  ].join(" ");

  const link = document.createElement("a");
  link.href = `./product.html?id=${product.id}`;
  link.className = "block";

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.title;
  img.className = "mb-4 h-48 w-full object-contain";

  const category = document.createElement("p");
  category.className = "text-xs font-black uppercase text-red-600";
  category.textContent = product.category;

  const title = document.createElement("h3");
  title.className = "mt-2 text-lg font-black";
  title.textContent = product.title;

  const description = document.createElement("p");
  description.className = "mt-2 text-sm text-gray-700";
  description.textContent = product.description;

  link.appendChild(img);
  link.appendChild(category);
  link.appendChild(title);
  link.appendChild(description);

  const footer = document.createElement("div");
  footer.className = "mt-4 flex items-center justify-between gap-3";

  const price = document.createElement("strong");
  price.className = "text-lg font-black text-blue-700";
  price.textContent = formatPrice(product.price);

  const button = document.createElement("button");
  button.type = "button";
  button.dataset.add = product.id;
  button.className =
    "inline-flex items-center rounded-2xl border-4 border-black bg-blue-500 px-4 py-2 text-sm font-black text-white shadow-[4px_4px_0_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none";
  button.textContent = "Lägg i kundvagn";

  footer.appendChild(price);
  footer.appendChild(button);

  article.appendChild(link);
  article.appendChild(footer);

  return article;
};

const createCartItem = (item) => {
  const row = document.createElement("div");
  row.className =
    "rounded-2xl border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]";

  const top = document.createElement("div");
  top.className = "flex items-start justify-between gap-3";

  const info = document.createElement("div");
  info.className = "min-w-0";

  const title = document.createElement("h3");
  title.className = "truncate text-sm font-black text-black";
  title.textContent = item.title;

  const price = document.createElement("p");
  price.className = "mt-1 text-sm font-bold text-blue-700";
  price.textContent = formatPrice(item.price);

  info.appendChild(title);
  info.appendChild(price);

  const lineTotal = document.createElement("strong");
  lineTotal.className = "text-sm font-black text-black";
  lineTotal.textContent = formatPrice(item.price * item.quantity);

  top.appendChild(info);
  top.appendChild(lineTotal);

  const controls = document.createElement("div");
  controls.className = "mt-3 flex items-center gap-2";

  const decrease = document.createElement("button");
  decrease.type = "button";
  decrease.dataset.id = item.id;
  decrease.dataset.change = "-1";
  decrease.className =
    "inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-white font-black text-black";
  decrease.textContent = "−";

  const quantity = document.createElement("span");
  quantity.className = "min-w-8 text-center text-sm font-black text-black";
  quantity.textContent = String(item.quantity);

  const increase = document.createElement("button");
  increase.type = "button";
  increase.dataset.id = item.id;
  increase.dataset.change = "1";
  increase.className =
    "inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-white font-black text-black";
  increase.textContent = "+";

  const remove = document.createElement("button");
  remove.type = "button";
  remove.dataset.id = item.id;
  remove.dataset.change = String(-item.quantity);
  remove.className =
    "ml-auto inline-flex items-center rounded-xl border-2 border-black bg-red-500 px-3 py-1 text-xs font-black text-white";
  remove.textContent = "Ta bort";

  controls.appendChild(decrease);
  controls.appendChild(quantity);
  controls.appendChild(increase);
  controls.appendChild(remove);

  row.appendChild(top);
  row.appendChild(controls);

  return row;
};

export const renderCategories = (state) => {
  if (!ui.categoryList) {
    return;
  }

  ui.categoryList.replaceChildren();

  const categories = getCategories(state.products);

  categories.forEach((category) => {
    ui.categoryList.appendChild(
      createCategoryButton(
        category,
        category === state.selectedCategory,
        categories
      )
    );
  });
};

export const renderProducts = (state) => {
  if (!ui.productList) {
    return;
  }

  ui.productList.replaceChildren();

  const categories = getCategories(state.products);
  const filteredProducts = getFilteredProducts(
    state.products,
    state.selectedCategory
  );

  if (!filteredProducts.length) {
    const empty = document.createElement("p");
    empty.className =
      "rounded-2xl border-4 border-black bg-white p-4 font-bold shadow-[4px_4px_0_0_#000]";
    empty.textContent = "Inga produkter hittades.";
    ui.productList.appendChild(empty);
    return;
  }

  filteredProducts.forEach((product) => {
    ui.productList.appendChild(createProductCard(product, categories));
  });
};

export const renderCart = (cart) => {
  if (!ui.cartItems || !ui.cartTotal || !ui.cartCount) {
    return;
  }

  const count = getCartCount(cart);

  ui.cartCount.textContent = String(count);
  ui.cartCount.classList.toggle("hidden", count === 0);

  ui.cartItems.replaceChildren();

  if (!cart.length) {
    const empty = document.createElement("p");
    empty.className = "text-sm font-bold text-gray-700";
    empty.textContent = "Kundvagnen är tom.";
    ui.cartItems.appendChild(empty);
  } else {
    cart.forEach((item) => {
      ui.cartItems.appendChild(createCartItem(item));
    });
  }

  ui.cartTotal.textContent = formatPrice(getCartTotal(cart));
};

export const setCartOpen = (open) => {
  if (!ui.cartToggle || !ui.cartDropdown) {
    return;
  }

  ui.cartDropdown.classList.toggle("hidden", !open);
  ui.cartToggle.setAttribute("aria-expanded", String(open));
};

export const render = (state) => {
  renderCategories(state);
  renderProducts(state);
  renderCart(getCart());
};