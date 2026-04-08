import {
  $,
  formatPrice,
  getCategories,
  getFilteredProducts,
  getProductImage,
} from "./shared.js";

export const ui = {
  categoryList: $("category-list"),
  productList: $("product-list"),
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

const truncateText = (text, maxLength = 110) => {
  if (!text) {
    return "";
  }

  return text.length > maxLength
    ? `${text.slice(0, maxLength).trim()}...`
    : text;
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
  const categoryName = product.category ?? "okänd";
  const theme = getCategoryTheme(categoryName, categories);

  article.className = [
    "flex h-full flex-col rounded-3xl border-4 border-black p-5",
    theme.card,
    "shadow-[6px_6px_0_0_#000]",
  ].join(" ");

  const link = document.createElement("a");
  link.href = `./product.html?id=${product.id}`;
  link.className = "block flex-1";

  const imageUrl = getProductImage(product);

  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = product.title ?? "Produktbild";
    img.className = "mb-4 h-48 w-full object-contain";
    link.appendChild(img);
  }

  const category = document.createElement("p");
  category.className = "text-xs font-black uppercase text-red-600";
  category.textContent = categoryName;

  const title = document.createElement("h3");
  title.className = "mt-2 text-lg font-black";
  title.textContent = product.title ?? "Okänd produkt";

  const description = document.createElement("p");
  description.className = "mt-2 text-sm leading-5 text-gray-700";
  description.textContent = truncateText(product.description, 110);

  link.appendChild(category);
  link.appendChild(title);
  link.appendChild(description);

  const footer = document.createElement("div");
  footer.className = "mt-4 flex items-center justify-between gap-3";

  const price = document.createElement("strong");
  price.className = "text-lg font-black text-blue-700";
  price.textContent = product.price;

  const button = document.createElement("a");
  button.href = `./checkout.html?id=${product.id}`;
  button.className =
    "inline-flex items-center rounded-2xl border-4 border-black bg-blue-500 px-4 py-2 text-sm font-black text-white shadow-[4px_4px_0_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none";
  button.textContent = "Köp";

  footer.appendChild(price);
  footer.appendChild(button);

  article.appendChild(link);
  article.appendChild(footer);

  return article;
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
        categories,
      ),
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
    state.selectedCategory,
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

export const render = (state) => {
  renderCategories(state);
  renderProducts(state);
};
