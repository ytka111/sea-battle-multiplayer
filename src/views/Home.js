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
    return `<div class="home__container container form__inner">
      ${
        username
          ? `<form class="form block" id="logout">
        <div class="home__inner block__inner">
          <h2 class="block__title">Profile</h2>
          <div class='home__text form__text' id='username'>Username: <span>${username}</span></div>
          <button class='form__button block__button button' type='submit'>Logout</button>
        </div>
          </form>
          <form class="form block" id="logout">
        <div class="home__inner block__inner">
          <h2 class="block__title">Rating</h2>
          <ul class="rating">
          </ul>
        </div>
          </form>`
          : (window.location.href = `/login`)
      }
    </div>`;
  }

  async afterRender() {
        try {
      const { data } = await axios.get(`http://sea-battle-server-production.up.railway.app/auth/rating`);
      const ratingList = document.querySelector(".rating");

      data.sort((a, b) => b.wins - a.wins);

      data.forEach((userData) => {
        const li = document.createElement("li");
        li.classList.add("rating__item");
        li.textContent = `${userData.username}: ${userData.wins}`;
        ratingList.appendChild(li);
      });
    } catch (error) {
      console.error(error.response.data.message);
      document.querySelector(".form__message--error").textContent =
        error.response.data.message;
    }
    if (!username) return;
    document
      .querySelector(".form__button")
      .addEventListener("click",(e) => {
      e.preventDefault();
        localStorage.setItem("data", null);
      });
  }
}
