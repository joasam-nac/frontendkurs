import { formatPrice, getProductImage, getStoredProducts } from "./shared.js";

const checkoutProduct = document.getElementById("checkout-product");
const checkoutForm = document.getElementById("checkout-form");
const formMessage = document.getElementById("form-message");
const nameInput = document.getElementById("name");
const addressInput = document.getElementById("address");

let selectedProduct = null;

const getProductIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
};

const renderProductMessage = (message) => {
  if (!checkoutProduct) {
    return;
  }

  checkoutProduct.replaceChildren();

  const text = document.createElement("p");
  text.className =
    "rounded-2xl border-4 border-black bg-yellow-100 p-4 font-bold shadow-[4px_4px_0_0_#000]";
  text.textContent = message;

  checkoutProduct.appendChild(text);
};

const renderFormMessage = (message, success = false) => {
  if (!formMessage) {
    return;
  }

  formMessage.textContent = message;
  formMessage.className = [
    "mt-4 rounded-2xl border-4 border-black p-4 font-bold shadow-[4px_4px_0_0_#000]",
    success ? "bg-green-200 text-black" : "bg-pink-100 text-black",
  ].join(" ");
};

const renderProduct = (product) => {
  if (!checkoutProduct) {
    return;
  }

  checkoutProduct.replaceChildren();

  const article = document.createElement("article");
  article.className =
    "rounded-3xl border-4 border-black bg-blue-100 p-5 shadow-[6px_6px_0_0_#000]";

  const imageUrl = getProductImage(product);

  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = product.title ?? "Produktbild";
    img.className = "mb-4 h-56 w-full object-contain";
    article.appendChild(img);
  }

  const category = document.createElement("p");
  category.className = "text-xs font-black uppercase text-red-600";
  category.textContent = product.category ?? "okänd";

  const title = document.createElement("h3");
  title.className = "mt-2 text-xl font-black";
  title.textContent = product.title ?? "Okänd produkt";

  const description = document.createElement("p");
  description.className = "mt-3 text-sm leading-6 text-gray-700";
  description.textContent =
    product.description ?? "Ingen beskrivning tillgänglig.";

  const price = document.createElement("p");
  price.className = "mt-4 text-lg font-black text-blue-700";
  price.textContent = formatPrice(product.price);

  article.appendChild(category);
  article.appendChild(title);
  article.appendChild(description);
  article.appendChild(price);

  checkoutProduct.appendChild(article);
};

const validateForm = () => {
  const name = nameInput?.value.trim() ?? "";
  const address = addressInput?.value.trim() ?? "";

  if (!name || !address) {
    renderFormMessage("Fyll i namn och adress.");
    return false;
  }

  if (name.length < 2) {
    renderFormMessage("Namnet måste vara minst 2 tecken.");
    return false;
  }

  if (address.length < 5) {
    renderFormMessage("Adressen måste vara minst 5 tecken.");
    return false;
  }

  return true;
};

const init = () => {
  const productId = getProductIdFromUrl();

  if (!productId) {
    document.title = "Ingen produkt vald - Grupp 10";
    renderProductMessage("Ingen produkt vald.");
    return;
  }

  const products = getStoredProducts();

  if (!products.length) {
    document.title = "Produkter saknas - Grupp 10";
    renderProductMessage(
      "Kunde inte hitta produkter i localStorage. Gå tillbaka till startsidan först."
    );
    return;
  }

  const product = products.find((item) => item.id === productId);

  if (!product) {
    document.title = "Produkt saknas - Grupp 10";
    renderProductMessage("Produkten kunde inte hittas.");
    return;
  }

  selectedProduct = product;
  document.title = `Checkout - ${product.title} - Grupp 10`;
  renderProduct(product);
};

if (checkoutForm) {
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!selectedProduct) {
      renderFormMessage("Ingen produkt är laddad.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    renderFormMessage(`Köp genomfört för ${selectedProduct.title}.`, true);
    checkoutForm.reset();
  });
}

renderFormMessage("Fyll i dina uppgifter för att slutföra köpet.");
init();