import {
  $,
  clearCartStorage,
  formatPrice,
  getCart,
} from "./shared.js";

let cart = getCart();

const ui = {
  items: $("checkout-cart-items"),
  total: $("checkout-total"),
  form: $("checkout-form"),
  message: $("message"),
  emptyCartButton: $("empty-cart-btn"),
};

const getValue = (id) => $(id).value.trim();

const showMessage = (text, type) => {
  ui.message.textContent = text;
  ui.message.className =
    type === "success"
      ? "mt-4 rounded-2xl border-4 border-black bg-green-300 p-3 text-sm font-bold text-black shadow-[4px_4px_0_0_#000]"
      : "mt-4 rounded-2xl border-4 border-black bg-red-300 p-3 text-sm font-bold text-black shadow-[4px_4px_0_0_#000]";
};

const hideMessage = () => {
  ui.message.textContent = "";
  ui.message.className = "mt-4 hidden rounded-2xl p-3 text-sm";
};

function getSingleItem() {
  if (!cart.length) {
    return null;
  }

  return cart[0];
}

function removeItem() {
  cart = [];
  clearCartStorage();
  renderCheckoutCart();
}

function emptyCart() {
  cart = [];
  clearCartStorage();
  renderCheckoutCart();
}

function renderCheckoutCart() {
  const item = getSingleItem();

  if (!item) {
    clearCartStorage();
    window.location.href = "./index.html";
    return;
  }

  ui.items.innerHTML = `
    <div
      class="flex items-center justify-between gap-4 rounded-2xl border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]"
    >
      <div class="min-w-0">
        <div class="truncate text-sm font-black text-black">
          ${item.name}
        </div>
        <div class="mt-1 text-sm text-gray-700">
          ${formatPrice(item.price)}
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-sm font-black text-black">Antal: 1</span>

        <button
          type="button"
          data-action="remove"
          aria-label="Ta bort ${item.name} från kundvagnen"
          class="inline-flex items-center rounded-xl border-2 border-black bg-red-600 px-3 py-1 text-xs font-black text-white"
        >
          Ta bort
        </button>

        <strong class="text-sm font-black text-blue-700">
          ${formatPrice(item.price)}
        </strong>
      </div>
    </div>
  `;

  ui.total.textContent = formatPrice(item.price);
}

function getOrderData() {
  const item = getSingleItem();

  return {
    name: getValue("name"),
    email: getValue("email"),
    phone: getValue("phone"),
    address: getValue("address"),
    postalCode: getValue("postalCode"),
    city: getValue("city"),
    item,
    total: item ? item.price : 0,
  };
}

ui.items.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const { action } = button.dataset;

  if (action === "remove") {
    removeItem();
  }
});

ui.emptyCartButton.addEventListener("click", () => {
  emptyCart();
});

ui.form.addEventListener("submit", (event) => {
  event.preventDefault();
  hideMessage();

  const item = getSingleItem();

  if (!item) {
    showMessage("Kassan är tom.", "error");
    return;
  }

  const order = getOrderData();

  console.log("Order placed:", order);

  showMessage(
    `Tack ${order.name || "!"} Din beställning på ${formatPrice(
      order.total
    )} är lagd.`,
    "success"
  );

  clearCartStorage();
  cart = [];
  ui.form.reset();

  setTimeout(() => {
    window.location.href = "./index.html";
  }, 2000);
});

renderCheckoutCart();