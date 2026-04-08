import { actions } from "./actions.js";

export function initClickEvents() {
  document.addEventListener("click", (event) => {
    const e = event.target.closest("[data-action");
    if (!e) return;

    const { action, id } = e.dataset;

    actions[action]?.(id);
  });
}
