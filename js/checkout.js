import {
  $,
  clearCartStorage,
  formatPrice,
  getCart,
  getCartTotal,
  saveCart,
} from "./shared.js";

let cart = getCart();

const ui = {
  items: $("checkout-cart-items"),
  total: $("checkout-total"),
  form: $("checkout-form"),
  message: $("message"),
  fields: {
    name: $("name"),
    email: $("email"),
    phone: $("phone"),
    address: $("address"),
    postalCode: $("postalCode"),
    city: $("city"),
  },
  errors: {
    name: $("name-error"),
    email: $("email-error"),
    phone: $("phone-error"),
    address: $("address-error"),
    postalCode: $("postalCode-error"),
    city: $("city-error"),
  },
};

const defaultInputClass =
  "block w-full rounded-2xl border-4 border-black bg-white px-3 py-2.5 text-sm shadow-[4px_4px_0_0_#000] outline-none";

const invalidInputClass =
  "block w-full rounded-2xl border-4 border-red-600 bg-red-50 px-3 py-2.5 text-sm shadow-[4px_4px_0_0_#000] outline-none";

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

const isValidEmail = (email) => email.includes("@") && email.length <= 50;

const isValidPhone = (phone) => /^[0-9()\-]+$/.test(phone) && phone.length <= 20;

const isValidPostalCode = (postalCode) => /^[0-9]{5}$/.test(postalCode);

function setFieldError(fieldName, message) {
  ui.errors[fieldName].textContent = message;
  ui.fields[fieldName].className = invalidInputClass;
}

function clearFieldError(fieldName) {
  ui.errors[fieldName].textContent = "";
  ui.fields[fieldName].className = defaultInputClass;
}

function clearAllFieldErrors() {
  Object.keys(ui.fields).forEach(clearFieldError);
}

function validateField(fieldName, value) {
  switch (fieldName) {
    case "name":
      if (!value) {
        return "Fyll i ditt namn.";
      }

      if (value.length < 2 || value.length > 50) {
        return "Namnet måste vara mellan 2 och 50 tecken.";
      }

      return "";

    case "email":
      if (!value) {
        return "Fyll i din e-postadress.";
      }

      if (!isValidEmail(value)) {
        return "E-post måste innehålla @ och vara max 50 tecken.";
      }

      return "";

    case "phone":
      if (!value) {
        return "Fyll i ditt telefonnummer.";
      }

      if (!isValidPhone(value)) {
        return "Telefonnummer får bara innehålla siffror, bindestreck och parenteser. Max 20 tecken.";
      }

      return "";

    case "address":
      if (!value) {
        return "Fyll i din gatuadress.";
      }

      if (value.length < 2 || value.length > 50) {
        return "Gatuadress måste vara mellan 2 och 50 tecken.";
      }

      return "";

    case "postalCode":
      if (!value) {
        return "Fyll i ditt postnummer.";
      }

      if (!isValidPostalCode(value)) {
        return "Postnummer måste vara exakt 5 siffror.";
      }

      return "";

    case "city":
      if (!value) {
        return "Fyll i din ort.";
      }

      if (value.length < 2 || value.length > 20) {
        return "Ort måste vara mellan 2 och 20 tecken.";
      }

      return "";

    default:
      return "";
  }
}

function validateForm() {
  let isValid = true;

  Object.entries(ui.fields).forEach(([fieldName, field]) => {
    const error = validateField(fieldName, field.value.trim());

    if (error) {
      setFieldError(fieldName, error);
      isValid = false;
    } else {
      clearFieldError(fieldName);
    }
  });

  return isValid;
}

function increaseQuantity(itemId) {
  cart = cart.map((item) =>
    String(item.id) === String(itemId)
      ? { ...item, quantity: item.quantity + 1 }
      : item
  );

  saveCart(cart);
  renderCheckoutCart();
}

function decreaseQuantity(itemId) {
  cart = cart
    .map((item) =>
      String(item.id) === String(itemId)
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    .filter((item) => item.quantity > 0);

  if (!cart.length) {
    clearCartStorage();
  } else {
    saveCart(cart);
  }

  renderCheckoutCart();
}

function renderCheckoutCart() {
  if (!cart.length) {
    clearCartStorage();
    window.location.href = "./index.html";
    return;
  }

  ui.items.innerHTML = cart
    .map(
      (item) => `
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
            <button
              type="button"
              data-action="decrease"
              data-id="${item.id}"
              aria-label="Minska antal för ${item.name}"
              class="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-red-400 text-sm font-black text-white"
            >
              −
            </button>

            <span class="min-w-5 text-center text-sm font-black text-black">
              ${item.quantity}
            </span>

            <button
              type="button"
              data-action="increase"
              data-id="${item.id}"
              aria-label="Öka antal för ${item.name}"
              class="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-green-400 text-sm font-black text-black"
            >
              +
            </button>

            <strong class="text-sm font-black text-blue-700">
              ${formatPrice(item.price * item.quantity)}
            </strong>
          </div>
        </div>
      `
    )
    .join("");

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

ui.items.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const { action, id } = button.dataset;

  if (action === "increase") {
    increaseQuantity(id);
  }

  if (action === "decrease") {
    decreaseQuantity(id);
  }
});

Object.entries(ui.fields).forEach(([fieldName, field]) => {
  field.addEventListener("input", () => {
    const error = validateField(fieldName, field.value.trim());

    if (error) {
      setFieldError(fieldName, error);
    } else {
      clearFieldError(fieldName);
    }

    hideMessage();
  });
});

ui.form.addEventListener("submit", (event) => {
  event.preventDefault();
  hideMessage();
  clearAllFieldErrors();

  if (!cart.length) {
    showMessage("Kassan är tom.", "error");
    return;
  }

  const isFormValid = validateForm();

  if (!isFormValid) {
    showMessage("Kontrollera formuläret och rätta felen.", "error");
    return;
  }

  const order = getOrderData();

  console.log("Order placed:", order);

  showMessage(
    `Tack ${order.name}! Din beställning på ${formatPrice(
      order.total
    )} är lagd.`,
    "success"
  );

  clearCartStorage();
  cart = [];
  ui.form.reset();
  clearAllFieldErrors();

  setTimeout(() => {
    window.location.href = "./index.html";
  }, 2000);
});

renderCheckoutCart();