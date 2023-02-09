import AbstractView from "./AbstractView.js";
import { handleLogin } from "../models/user.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle = "Login";
  }
  async getHtml() {
    return `
    <div class="container form__inner">
        <form class="form block" id="signIn">
        <div class="block__inner">
          <h1 class="form__title block__title">Login</h1>
              <div class="form__input-group">
                  <input type="text" class="form__input" autofocus placeholder="Username" id="signupUsername">
              </div>
              <div class="form__input-group">
                  <input type="password" class="form__input" autofocus placeholder="Password" id="password">
              </div>
              <button class="form__button block__button button" type="submit" id="">Continue</button>
              <p class="form__text">
                  <a class="form__link" href="/register" data-link id="linkCreateAccount">Create account</a>
              </p>
          </div>
        </form>
    </div> 
    `;
  }

  async afterRender() {
    const form = document.getElementById("signIn");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.querySelector("#signupUsername").value;
      const password = document.querySelector("#password").value;
      await handleLogin(username, password);
    });
  }
}
