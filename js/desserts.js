import Cart from "./cart.js";

export default class Desserts extends Cart {
  constructor() {
    super();
    this.items = [];
    this.fetchItems().then(() => this.display());
  }

  async fetchItems() {
    try {
      const res = await fetch("./data.json");
      const list = await res.json();
      list.forEach((item, index) => (item.id = `id-${index + 1}`));
      this.items = list;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  createCard(item) {
    const { id, image, name, category, price } = item;

    const card = document.createElement("li");
    const picture = document.createElement("picture");
    const sourceDesktop = document.createElement("source");
    const sourceTablet = document.createElement("source");
    const img = document.createElement("img");
    const detailsContainer = document.createElement("div");
    const categoryContainer = document.createElement("span");
    const nameContainer = document.createElement("span");
    const priceContainer = document.createElement("span");

    const cartButton = this.renderButton(item);

    card.id = id;

    card.classList.add("card");
    detailsContainer.classList.add("details");
    categoryContainer.classList.add("category");
    nameContainer.classList.add("name");
    priceContainer.classList.add("price");

    sourceDesktop.srcset = image.desktop;
    sourceDesktop.media = "(min-width: 950px)";

    sourceTablet.srcset = image.tablet;
    sourceTablet.media = "(min-width: 500px)";

    img.src = image.mobile;
    img.alt = name;

    categoryContainer.textContent = category;
    nameContainer.textContent = name;
    priceContainer.textContent = `$${price.toFixed(2)}`;

    picture.append(sourceDesktop, sourceTablet, img);
    detailsContainer.append(categoryContainer, nameContainer, priceContainer);
    card.append(picture, cartButton, detailsContainer);

    return card;
  }

  display() {
    super.display();

    const dessertsContainer = document.querySelector("ul.desserts");
    const cards = this.items.map((item) => this.createCard(item));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("show", entry.isIntersecting);
      });
    });

    dessertsContainer.append(...cards);
    cards.forEach((card) => observer.observe(card));
  }
}
