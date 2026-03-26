export const $ = (id) => document.getElementById(id);

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getCart = () => readJson("cart", []);

export const saveCart = (cart) => {
  writeJson("cart", cart);
};

export const clearCartStorage = () => {
  localStorage.removeItem("cart");
};

export const getStoredProducts = () => readJson("products", []);

export const saveStoredProducts = (products) => {
  writeJson("products", products);
};

export const getRecentlyViewed = () => readJson("recentlyViewed", []);

export const saveRecentlyViewed = (product) => {
  const updated = getRecentlyViewed().filter((item) => item.id !== product.id);

  updated.unshift(product);
  writeJson("recentlyViewed", updated.slice(0, 6));
};

const usdToSek = 9.38;

export const formatPrice = (price) => {
  const value = Math.round(price * usdToSek * 100) / 100;

  return `${value.toLocaleString("sv-SE", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })} kr`;
};

export const getCartTotal = (cart) =>
  cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const getCartCount = (cart) =>
  cart.reduce((sum, item) => sum + item.quantity, 0);

export const getCategories = (products) => [
  "allt",
  ...new Set(products.flatMap((product) => product.categories ?? [])),
];

export const getFilteredProducts = (products, category) =>
  category === "allt"
    ? products
    : products.filter((product) =>
        (product.categories ?? []).includes(category)
      );

export const normalizeProduct = (item) => ({
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
});