export default class Cart {
  constructor() {
    this.total = 0;
    this.totalItem = 0;
    this.items = [];
    this.itemsObj = {};
  }

  addItem(item) {
    const { id, price } = item;

    this.total += price;
    this.totalItem++;

    if (!this.itemsObj[id]) this.itemsObj[id] = { ...item, quantity: 0 };
    if (this.itemsObj[id].quantity >= 10) return;
    this.itemsObj[id].quantity++;

    this.items = Object.values(this.itemsObj);
    this.updateCart();
    this.renderButton(this.itemsObj[id]);
  }

  removeItem(id) {
    if (!this.itemsObj[id]) return null;

    this.total -= this.itemsObj[id].price;
    this.totalItem--;
    this.itemsObj[id].quantity--;

    const item = { ...this.itemsObj[id] };
    if (this.itemsObj[id].quantity <= 0) delete this.itemsObj[id];

    this.items = Object.values(this.itemsObj);
    this.updateCart();
    this.renderButton(item);
  }

  clearItem(id) {
    if (!this.itemsObj[id]) return null;

    const { price, quantity } = this.itemsObj[id];

    this.total -= price * quantity;
    this.totalItem -= quantity;

    const item = { ...this.itemsObj[id], quantity: 0 };
    delete this.itemsObj[id];

    this.items = Object.values(this.itemsObj);
    this.updateCart();
    this.renderButton(item);
  }

  clearCart() {
    this.items.forEach((item) => {
      item.quantity = 0;
      this.renderButton(item);
    });

    this.total = 0;
    this.totalItem = 0;
    this.items = [];
    this.itemsObj = {};

    this.updateCart();
  }

  createCart() {
    const cart = document.createElement("section");

    cart.id = "cart";
    this.displayNoItems(cart);

    const callback = (entries) => {
      entries.forEach((entry) => {
        const link = document.querySelector("a[href='#cart']");
        link.hidden = entry.isIntersecting;
      });
    };
    const options = { threshold: 0.3 };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(cart);

    return cart;
  }

  updateCart() {
    const cart = document.querySelector("#cart");
    cart.innerHTML = "";

    if (!this.items.length) this.displayNoItems(cart);
    else this.displayItems(cart);
  }

  addButton(parentElement, item) {
    if (!item?.quantity) {
      const button = document.createElement("button");
      const icon = document.createElement("img");
      const text = document.createElement("span");

      button.classList.add("cart-button");

      icon.src = "./assets/images/icon-add-to-cart.svg";
      icon.alt = "";
      text.textContent = "Add to Cart";
      button.type = "button";
      button.onclick = () => this.addItem(item);

      button.append(icon, text);
      parentElement.innerHTML = "";
      parentElement.appendChild(button);
    } else {
      const container = document.createElement("div");
      const incrementButton = document.createElement("button");
      const decrementButton = document.createElement("button");
      const count = document.createElement("span");

      container.classList.add("quantity-button");
      count.classList.add("count");
      incrementButton.classList.add("increment-button");
      decrementButton.classList.add("decrement-button");

      count.textContent = item.quantity;
      incrementButton.textContent = "+";
      decrementButton.textContent = "-";

      incrementButton.type = "button";
      decrementButton.type = "button";

      incrementButton.autofocus = "true";
      incrementButton.disabled = item.quantity >= 10;

      incrementButton.onclick = () => this.addItem(item);
      decrementButton.onclick = () => this.removeItem(item.id);

      container.append(decrementButton, count, incrementButton);
      parentElement.innerHTML = "";
      parentElement.appendChild(container);
    }
  }

  renderItem(For = "cart") {
    return (item) => {
      const list = document.createElement("li");
      const details = document.createElement("div");
      const info = document.createElement("div");
      const name = document.createElement("div");
      const quantity = document.createElement("span");
      const price = document.createElement("span");
      const totalPrice = document.createElement("span");
      const icon = document.createElement("img");
      const button = document.createElement("button");
      const img = document.createElement("img");

      const itemCost = item.price.toFixed(2);
      const totalItemCost = (item.price * item.quantity).toFixed(2);

      list.classList.add("item");
      details.classList.add("details");
      info.classList.add("info");
      name.classList.add("name");
      quantity.classList.add("quantity");
      price.classList.add("price");
      totalPrice.classList.add("total-price");

      img.classList.add("item-image");
      img.src = item.image.thumbnail;
      img.alt = "clear item";

      name.textContent = item.name;
      quantity.textContent = item.quantity + "x";
      price.textContent = `@ $${itemCost}`;
      totalPrice.textContent = `$${totalItemCost}`;

      icon.src = "./assets/images/icon-remove-item.svg";
      icon.alt = "clear item";

      button.type = "button";
      button.classList.add("remove");
      button.onclick = () => this.clearItem(item.id);

      if (For === "confirm") {
        info.append(quantity, price);
        details.append(name, info);
        list.append(img, details, totalPrice);
      } else {
        info.append(quantity, price, totalPrice);
        details.append(name, info);
        button.appendChild(icon);
        list.append(details, button);
      }

      return list;
    };
  }

  renderTotal() {
    const totalContainer = document.createElement("div");
    const span = document.createElement("span");
    const total = document.createElement("span");

    totalContainer.classList.add("total-container");
    total.classList.add("total");

    span.textContent = "Order Total";
    total.textContent = `$${this.total.toFixed(2)}`;

    totalContainer.append(span, total);
    return totalContainer;
  }

  renderButton(item) {
    if (!item) return console.log("No item");

    const buttonContainerSelector = `#${item?.id}.card .button-container`;
    const buttonContainer =
      (item && document.querySelector(buttonContainerSelector)) ||
      document.createElement("div");

    buttonContainer.classList.add("button-container");
    this.addButton(buttonContainer, item);

    return buttonContainer;
  }

  display() {
    const aside = document.querySelector("aside");
    const cart = this.createCart();

    aside.appendChild(cart);
  }

  displayNoItems(parentElement) {
    if (!parentElement) return;

    const heading = document.createElement("h2");
    const img = document.createElement("img");
    const para = document.createElement("p");

    heading.textContent = `Your Cart (0)`;
    img.src = "./assets/images/illustration-empty-cart.svg";
    img.alt = "";
    para.textContent = "Your added items will appear here";

    parentElement.append(heading, img, para);
  }

  displayItems(parentElement) {
    if (!parentElement) return;

    const heading = document.createElement("h2");
    const listContainer = document.createElement("ul");
    const deliveryType = document.createElement("div");
    const icon = document.createElement("img");
    const text = document.createElement("span");
    const strong = document.createElement("strong");
    const confirmButton = document.createElement("button");

    const lists = this.items.map(this.renderItem());
    const totalContainer = this.renderTotal();

    listContainer.classList.add("items");
    deliveryType.classList.add("delivery-type");
    confirmButton.classList = "primary confirm-button";

    heading.textContent = `Your Cart (${this.totalItem})`;

    strong.textContent = "carbon-neutral";
    confirmButton.type = "submit";
    confirmButton.textContent = "Confirm Order";

    icon.src = "./assets/images/icon-carbon-neutral.svg";
    icon.alt = "";
    confirmButton.onclick = () => this.displayOrderConfirm();

    listContainer.append(...lists);
    text.append("This is a ", strong, " delivery");
    deliveryType.append(icon, text);
    parentElement.append(
      heading,
      listContainer,
      totalContainer,
      deliveryType,
      confirmButton
    );
  }

  displayOrderConfirm() {
    const html = document.querySelector("html");
    const dialog = document.querySelector("dialog");
    const order = dialog.querySelector(".order");
    const listContainer = document.createElement("ul");

    const lists = this.items.map(this.renderItem("confirm"));
    const totalContainer = this.renderTotal();
    const overflowEffect = (list) => {
      const { clientHeight, scrollTop, scrollHeight } = list;

      if (!(clientHeight < scrollHeight)) return;

      const canScrollTop = scrollTop >= 10;
      const canScrollBottom = clientHeight + scrollTop <= scrollHeight - 10;

      if (canScrollTop && canScrollBottom)
        list.style.boxShadow =
          "inset 0 10px 16px -10px var(--clr-Rose-300), inset 0px -10px 16px -10px var(--clr-Rose-300)";
      else if (canScrollTop)
        list.style.boxShadow = "inset 0 10px 16px -10px var(--clr-Rose-300)";
      else if (canScrollBottom)
        list.style.boxShadow = "inset 0 -10px 16px -10px var(--clr-Rose-300)";
      else list.style.boxShadow = "none";
    };

    html.style.overflowY = "hidden";

    listContainer.classList.add("items");
    listContainer.append(...lists);
    listContainer.onscroll = (e) => overflowEffect(e.target);

    order.textContent = "";
    order.append(listContainer, totalContainer);

    dialog.showModal();
    overflowEffect(listContainer);
  }
}
