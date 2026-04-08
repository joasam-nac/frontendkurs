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
  const value = Math.round(Number(price || 0) * usdToSek * 100) / 100;

  return `${value.toLocaleString("sv-SE", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })} kr`;
};

export const getCategories = (products) => [
  "allt",
  ...new Set(products.map((product) => product.category).filter(Boolean)),
];

export const getFilteredProducts = (products, category) =>
  category === "allt"
    ? products
    : products.filter((product) => product.category === category);

export const getProductImage = (product) =>
  typeof product.image === "string" ? product.image : "";