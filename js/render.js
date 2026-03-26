import {
  $,
  formatPrice,
  getCategories,
  getFilteredProducts,
} from "./shared.js";

const truncateWords = (text = "", maxLength = 80) => {
  if (text.length <= maxLength) return text;

  const shortened = text.slice(0, maxLength);
  const lastSpace = shortened.lastIndexOf(" ");

  return `${(lastSpace > 0
    ? shortened.slice(0, lastSpace)
    : shortened
  ).trim()}...`;
};

export const ui = {
  categoryList: $("category-list"),
  productList: $("product-list"),
  cartItems: $("cart-items"),
  cartTotal: $("cart-total"),
  cartCount: $("cart-count"),
  clearCartBtn: $("clear-cart-btn"),
  checkoutLink: $("checkout-link"),
  cartToggle: $("cart-toggle"),
  cartDropdown: $("cart-dropdown"),
};

const pillColors = [
  "bg-red-400 text-white",
  "bg-blue-400 text-white",
  "bg-green-400 text-black",
  "bg-pink-400 text-black",
  "bg-orange-400 text-black",
  "bg-cyan-400 text-black",
];

const cardColors = [
  "bg-pink-200",
  "bg-cyan-200",
  "bg-yellow-200",
  "bg-green-200",
  "bg-orange-200",
  "bg-rose-200",
];

const createCategoryButton = (category, selectedCategory, index) => {
  const button = document.createElement("button");

  button.type = "button";
  button.dataset.category = category;
  button.textContent = category;
  button.className = `${
    selectedCategory === category
      ? "bg-black text-white"
      : pillColors[index % pillColors.length]
  } rounded-full border-4 border-black px-4 py-2 text-sm font-black shadow-[4px_4px_0_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none`;

  return button;
};

const createProductCard = (product, index, hasCartItem) => {
  const article = document.createElement("article");
  article.className = `flex h-full flex-col overflow-hidden rounded-3xl border-4 border-black ${
    cardColors[index % cardColors.length]
  } shadow-[8px_8px_0_0_#000]`;

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "border-b-4 border-black bg-white";

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;
  img.className = "h-56 w-full object-contain p-6";

  imageWrapper.appendChild(img);

  const content = document.createElement("div");
  content.className = "flex flex-1 flex-col p-5";

  const categories = document.createElement("p");
  categories.className =
    "text-xs font-black uppercase tracking-wide text-red-600";
  categories.textContent = (product.categories ?? []).join(", ");

  const title = document.createElement("h3");
  title.className = "mt-2 text-lg font-black text-black";
  title.textContent = product.name;

  const description = document.createElement("p");
  description.className = "mt-3 flex-grow text-sm leading-6 text-gray-800";
  description.textContent = truncateWords(product.description, 80);

  const footer = document.createElement("div");
  footer.className = "mt-5 flex items-center justify-between gap-4";

  const price = document.createElement("p");
  price.className = "text-base font-black text-blue-700";
  price.textContent = formatPrice(product.price);

  const button = document.createElement("button");
  button.type = "button";
  button.dataset.add = product.id;
  button.disabled = hasCartItem;
  button.className = hasCartItem
    ? "inline-flex items-center rounded-2xl border-4 border-black bg-gray-400 px-4 py-2 text-sm font-black text-white opacity-60"
    : "inline-flex items-center rounded-2xl border-4 border-black bg-blue-500 px-4 py-2 text-sm font-black text-white shadow-[4px_4px_0_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none";
  button.textContent = hasCartItem ? "Redan vald" : "Lägg i kundvagn";

  footer.appendChild(price);
  footer.appendChild(button);

  content.appendChild(categories);
  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(footer);

  article.appendChild(imageWrapper);
  article.appendChild(content);

  return article;
};

const createCartItem = (item) => {
  const wrapper = document.createElement("div");
  wrapper.className =
    "flex items-center gap-3 rounded-2xl border-4 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]";

  const img = document.createElement("img");
  img.src = item.image;
  img.alt = item.name;
  img.className =
    "h-16 w-16 rounded-xl border-2 border-black bg-yellow-100 object-cover";

  const content = document.createElement("div");
  content.className = "min-w-0 flex-1";

  const name = document.createElement("div");
  name.className = "truncate text-sm font-black text-black";
  name.textContent = item.name;

  const meta = document.createElement("div");
  meta.className = "mt-1 text-sm text-gray-700";
  meta.textContent = formatPrice(item.price);

  content.appendChild(name);
  content.appendChild(meta);

  const controls = document.createElement("div");
  controls.className = "flex items-center gap-2";

  wrapper.appendChild(img);
  wrapper.appendChild(content);
  wrapper.appendChild(controls);

  return wrapper;
};

const createEmptyMessage = (text, className) => {
  const p = document.createElement("p");
  p.className = className;
  p.textContent = text;
  return p;
};

export const setCartOpen = (open) => {
  ui.cartDropdown.classList.toggle("hidden", !open);
  ui.cartToggle.setAttribute("aria-expanded", String(open));
};

export const renderCategories = (state) => {
  ui.categoryList.replaceChildren();

  const categories = getCategories(state.products);

  categories.forEach((category, index) => {
    ui.categoryList.appendChild(
      createCategoryButton(category, state.selectedCategory, index)
    );
  });
};

export const renderProducts = (state) => {
  ui.productList.replaceChildren();

  const products = getFilteredProducts(
    state.products,
    state.selectedCategory
  );

  if (!products.length) {
    ui.productList.appendChild(
      createEmptyMessage(
        "Inga produkter hittades i denna kategori.",
        "rounded-2xl border-4 border-black bg-white p-4 text-sm font-bold italic text-gray-700 shadow-[4px_4px_0_0_#000]"
      )
    );
    return;
  }

  const hasCartItem = state.cart.length > 0;

  products.forEach((product, index) => {
    ui.productList.appendChild(
      createProductCard(product, index, hasCartItem)
    );
  });
};

export const renderCart = (cart) => {
  ui.cartItems.replaceChildren();

  const item = cart[0];

  if (!item) {
    ui.cartItems.appendChild(
      createEmptyMessage(
        "Kundvagnen är tom.",
        "rounded-2xl border-4 border-black bg-yellow-100 p-4 text-sm font-bold italic text-gray-800 shadow-[4px_4px_0_0_#000]"
      )
    );
  } else {
    ui.cartItems.appendChild(createCartItem(item));
  }

  ui.cartTotal.textContent = item ? formatPrice(item.price) : formatPrice(0);
  ui.cartCount.textContent = item ? "1" : "0";

  const isEmpty = !item;

  ui.checkoutLink.classList.toggle("pointer-events-none", isEmpty);
  ui.checkoutLink.classList.toggle("opacity-50", isEmpty);
  ui.cartCount.classList.toggle("hidden", isEmpty);
};

export const render = (state) => {
  renderCategories(state);
  renderProducts(state);
  renderCart(state.cart);
};