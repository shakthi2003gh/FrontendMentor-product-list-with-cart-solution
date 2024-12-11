import Desserts from "./desserts.js";

const html = document.querySelector("html");
const dialog = document.querySelector("dialog");
const closeButton = dialog.querySelector("button");

const desserts = new Desserts();

dialog.addEventListener("close", () => {
  window.scrollTo(0, 0);
  html.style.overflowY = "scroll";

  desserts.clearCart();
});

closeButton.onclick = () => dialog.close();
