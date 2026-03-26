import { changeCartQuantity, clearCart, removeFromCart } from "./cart.js";
import { $, formatPrice, getCart, getCartTotal } from "./shared.js";

let cart = getCart();

const ui = {
  items: $("checkout-cart-items"),
  total: $("checkout-total"),
  form: $("checkout-form"),
  message: $("message"),
  emptyCartButton: $("empty-cart-btn"),
};

const getValue = (id) => $(id)?.value.trim() ?? "";

const showMessage = (text, type) => {
  if (!ui.message) {
    return;
  }

  ui.message.textContent = text;
  ui.message.className =
    type === "success"
      ? "mt-4 rounded-2xl border-4 border-black bg-green-300 p-3 text-sm font-bold text-black shadow-[4px_4px_0_0_#000]"
      : "mt-4 rounded-2xl border-4 border-black bg-red-300 p-3 text-sm font-bold text-black shadow-[4px_4px_0_0_#000]";
};

const hideMessage = () => {
  if (!ui.message) {
    return;
  }

  ui.message.textContent = "";
  ui.message.className = "mt-4 hidden rounded-2xl p-3 text-sm";
};

const setFormDisabled = (disabled) => {
  if (!ui.form) {
    return;
  }

  ui.form
    .querySelectorAll("input, select, textarea, button")
    .forEach((field) => {
      field.disabled = disabled;
    });
};

function renderCheckoutCart() {
  cart = getCart();

  if (!ui.items || !ui.total) {
    return;
  }

  ui.items.replaceChildren();

  if (!cart.length) {
    const empty = document.createElement("p");
    empty.className =
      "rounded-2xl border-4 border-black bg-white p-4 font-bold shadow-[4px_4px_0_0_#000]";
    empty.textContent = "Kundvagnen är tom.";

    ui.items.appendChild(empty);
    ui.total.textContent = formatPrice(0);

    if (ui.emptyCartButton) {
      ui.emptyCartButton.disabled = true;
    }

    setFormDisabled(true);
    return;
  }

  if (ui.emptyCartButton) {
    ui.emptyCartButton.disabled = false;
  }

  setFormDisabled(false);

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className =
      "flex flex-col gap-3 rounded-2xl border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000] sm:flex-row sm:items-center sm:justify-between";

    const info = document.createElement("div");
    info.className = "min-w-0";

    const title = document.createElement("div");
    title.className = "truncate text-sm font-black text-black";
    title.textContent = item.title || item.name;

    const unitPrice = document.createElement("div");
    unitPrice.className = "mt-1 text-sm text-gray-700";
    unitPrice.textContent = `Styckpris: ${formatPrice(item.price)}`;

    info.appendChild(title);
    info.appendChild(unitPrice);

    const actions = document.createElement("div");
    actions.className = "flex flex-wrap items-center gap-2";

    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.dataset.action = "decrease";
    decrease.dataset.id = String(item.id);
    decrease.className =
      "inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white font-black text-black";
    decrease.textContent = "−";

    const quantity = document.createElement("span");
    quantity.className = "min-w-12 text-center text-sm font-black text-black";
    quantity.textContent = `Antal: ${item.quantity}`;

    const increase = document.createElement("button");
    increase.type = "button";
    increase.dataset.action = "increase";
    increase.dataset.id = String(item.id);
    increase.className =
      "inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white font-black text-black";
    increase.textContent = "+";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.action = "remove";
    remove.dataset.id = String(item.id);
    remove.className =
      "inline-flex items-center rounded-xl border-2 border-black bg-red-600 px-3 py-2 text-xs font-black text-white";
    remove.textContent = "Ta bort";

    const total = document.createElement("strong");
    total.className = "text-sm font-black text-blue-700";
    total.textContent = formatPrice(item.price * item.quantity);

    actions.appendChild(decrease);
    actions.appendChild(quantity);
    actions.appendChild(increase);
    actions.appendChild(remove);
    actions.appendChild(total);

    row.appendChild(info);
    row.appendChild(actions);

    ui.items.appendChild(row);
  });

  ui.total.textContent = formatPrice(getCartTotal(cart));
}

function getOrderData() {
  return {
    name: getValue("name"),
    email: getValue("email"),
    phone: getValue("phone"),
    address: getValue("address"),
    postalCode: getValue("postalCode"),
    city: getValue("city"),
    items: cart,
    total: getCartTotal(cart),
  };
}

function setupEvents() {
  if (ui.items) {
    ui.items.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");

      if (!button) {
        return;
      }

      const id = Number(button.dataset.id);
      const { action } = button.dataset;

      if (action === "increase") {
        cart = changeCartQuantity(id, 1);
      }

      if (action === "decrease") {
        cart = changeCartQuantity(id, -1);
      }

      if (action === "remove") {
        cart = removeFromCart(id);
      }

      renderCheckoutCart();
    });
  }

  if (ui.emptyCartButton) {
    ui.emptyCartButton.addEventListener("click", () => {
      hideMessage();
      cart = clearCart();
      renderCheckoutCart();
    });
  }

  if (ui.form) {
    ui.form.addEventListener("submit", (event) => {
      event.preventDefault();
      hideMessage();

      if (!cart.length) {
        showMessage("Kassan är tom.", "error");
        return;
      }

      const order = getOrderData();

      console.log("Order placed:", order);

      showMessage(
        `Tack${order.name ? ` ${order.name}` : ""}! Din beställning på ${formatPrice(order.total)} är lagd.`,
        "success"
      );

      ui.form.reset();
      cart = clearCart();
      renderCheckoutCart();

      setTimeout(() => {
        window.location.href = "./index.html";
      }, 2000);
    });
  }
}

function init() {
  if (!ui.items || !ui.total || !ui.form || !ui.message) {
    return;
  }

  hideMessage();
  setupEvents();
  renderCheckoutCart();
}

init();