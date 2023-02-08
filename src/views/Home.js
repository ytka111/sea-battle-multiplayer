import AbstractView from "./AbstractView.js";

let username = "";

const storedData = JSON.parse(localStorage.getItem("data"));
if (storedData && storedData.username) {
  username = storedData.username;
}

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle = "Home";
  }
  async getHtml() {
    return `<div class="container form__inner">
      ${
        username
          ? `<form class="form block" id="logout">
        <div class="home__inner block__inner">
          <h2 class="block__title">Profile</h2>
          <div class='home__text form__text' id='username'>Username: <span>${username}</span></div>
          <button class='form__button block__button button' type='submit'>Logout</button>
        </div>
          </form>`
          : (window.location.href = `/login`)
      }
    </div>`;
  }

  async afterRender() {
    if (!username) return;
    document
      .querySelector(".form__button")
      .addEventListener("click", async () => {
        localStorage.setItem("data", null);
      });
  }
}
