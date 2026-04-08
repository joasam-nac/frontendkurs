import {
  getProductImage,
  getRecentlyViewed,
  getStoredProducts,
  saveRecentlyViewed,
} from "./shared.js";

const productDetail = document.getElementById("product-detail");
const recentProducts = document.getElementById("recent-products");

const getProductIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
};

const createRecentProductCard = (product) => {
  const link = document.createElement("a");

  link.href = `./product.html?id=${product.id}`;
  link.className =
    "rounded-2xl border-4 border-black bg-transparent p-4 shadow-[4px_4px_0_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none";

  const imageUrl = getProductImage(product);

  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = product.title ?? "Produktbild";
    img.className = "mb-3 h-32 w-full object-contain";
    link.appendChild(img);
  }

  const category = document.createElement("p");
  category.className = "text-xs font-black uppercase text-red-600";
  category.textContent = product.category ?? "okänd";

  const title = document.createElement("h3");
  title.className = "mt-1 text-sm font-black";
  title.textContent = product.title ?? "Okänd produkt";

  const price = document.createElement("p");
  price.className = "mt-2 text-base font-black text-blue-700";
  price.textContent = product.price;

  link.appendChild(category);
  link.appendChild(title);
  link.appendChild(price);

  return link;
};

const renderRecentProducts = (currentProductId) => {
  if (!recentProducts) {
    return;
  }

  recentProducts.replaceChildren();

  const items = getRecentlyViewed()
    .filter((item) => item.id !== currentProductId)
    .slice(0, 5);

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className =
      "rounded-2xl border-4 border-black bg-white p-4 font-bold shadow-[4px_4px_0_0_#000]";
    empty.textContent = "Inga tidigare visade produkter ännu.";
    recentProducts.appendChild(empty);
    return;
  }

  items.forEach((product) => {
    recentProducts.appendChild(createRecentProductCard(product));
  });
};

const renderSpecs = (specs) => {
  const list = document.createElement("ul");
  list.className = "mt-4 space-y-2 text-sm font-medium text-gray-700";

  Object.entries(specs ?? {}).forEach(([key, value]) => {
    const item = document.createElement("li");
    item.textContent = `${key}: ${value}`;
    list.appendChild(item);
  });

  return list;
};

const renderProductDetail = (product) => {
  if (!productDetail) {
    return;
  }

  productDetail.replaceChildren();

  const wrapper = document.createElement("div");
  wrapper.className = "grid gap-8 md:grid-cols-2";

  const imageBox = document.createElement("div");
  imageBox.className =
    "rounded-3xl border-4 border-black bg-transparent p-6 shadow-[4px_4px_0_0_#000]";

  const imageUrl = getProductImage(product);

  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = product.title ?? "Produktbild";
    img.className = "h-96 w-full object-contain";
    imageBox.appendChild(img);
  }

  const content = document.createElement("div");

  const category = document.createElement("p");
  category.className = "text-sm font-black uppercase text-red-600";
  category.textContent = product.category ?? "okänd";

  const title = document.createElement("h1");
  title.className = "mt-2 text-3xl font-black";
  title.textContent = product.title ?? "Okänd produkt";

  const description = document.createElement("p");
  description.className = "mt-4 text-lg leading-7 text-gray-700";
  description.textContent =
    product.description ?? "Ingen beskrivning tillgänglig.";

  const stock = document.createElement("p");
  stock.className = "mt-2 text-sm font-bold text-gray-700";
  stock.textContent = `Lager: ${product.stock ?? 0}`;

  const rating = document.createElement("p");
  rating.className = "mt-2 text-sm font-bold text-gray-700";
  rating.textContent = `Betyg: ${product.rating?.rate ?? 0} (${
    product.rating?.count ?? 0
  } recensioner)`;

  const specsTitle = document.createElement("h2");
  specsTitle.className = "mt-6 text-xl font-black text-blue-600";
  specsTitle.textContent = "Specifikationer";

  const price = document.createElement("p");
  price.className = "mt-6 text-3xl font-black text-blue-700";
  price.textContent = product.price;

  content.appendChild(category);
  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(stock);
  content.appendChild(rating);
  content.appendChild(price);
  content.appendChild(specsTitle);
  content.appendChild(renderSpecs(product.specs));

  wrapper.appendChild(imageBox);
  wrapper.appendChild(content);

  productDetail.appendChild(wrapper);
};

const renderMessage = (text) => {
  if (!productDetail) {
    return;
  }

  productDetail.replaceChildren();

  const message = document.createElement("p");
  message.className =
    "rounded-2xl border-4 border-black bg-white p-4 font-bold shadow-[4px_4px_0_0_#000]";
  message.textContent = text;

  productDetail.appendChild(message);
};

const init = () => {
  const productId = getProductIdFromUrl();

  if (!productId) {
    document.title = "Ingen produkt vald - Grupp 10";
    renderMessage("Ingen produkt vald.");
    return;
  }

  const products = getStoredProducts();

  if (!products.length) {
    document.title = "Produkter saknas - Grupp 10";
    renderMessage(
      "Kunde inte hitta produkter i localStorage. Gå tillbaka till startsidan först.",
    );
    return;
  }

  const product = products.find((item) => item.id === productId);

  if (!product) {
    document.title = "Produkt saknas - Grupp 10";
    renderMessage("Produkten kunde inte hittas.");
    return;
  }

  document.title = `${product.title} - Grupp 10`;

  saveRecentlyViewed(product);
  renderProductDetail(product);
  renderRecentProducts(product.id);
};

init();
