import AbstractView from "./AbstractView.js";
import { handleRegistration } from "../models/user.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle = "Register";
  }
  async getHtml() {
    return `
    <div class="container form__inner">
        <form class="form  block" id="createAccount">
            <div class="block__inner">
              <h1 class="form__title block__title">Create Account</h1>
              <div class="form__input-group">
                  <input type="text" id="signupUsername" class="form__input" autofocus placeholder="Username">
                  <div class="form__input-error-message">error</div>
              </div>
              <div class="form__input-group">
                  <input type="password" id="password" class="form__input" autofocus placeholder="Password">
                  <div class="form__input-error-message">error</div>
              </div>
              <div class="form__input-group">
                  <input type="password" id="passwordConfirm" class="form__input" autofocus placeholder="Confirm password">
                  <div class="form__input-error-message">error</div>
              </div>
              <button class="form__button button block__button" type="submit">Continue</button>
              <div class="form__message form__message--error">error</div>
              <p class="form__text">
                  <a class="form__link" href="/login" data-link id="linkLogin">Sign in</a>
              </p>
            </div>
        </form>
    </div>`;
  }
  async afterRender() {
    const form = document.getElementById("createAccount");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.querySelector("#signupUsername").value;
      const password = document.querySelector("#password").value;
      const passwordConfirm = document.querySelector("#passwordConfirm").value;
      if (password !== passwordConfirm) {
        document.querySelector(".form__message--error").textContent =
          "Passwords don't match";
        return;
      }
      document.querySelector(".form__message--error").textContent = "";
      await handleRegistration(username, password);
    });
  }
}