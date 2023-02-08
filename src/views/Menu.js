import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle = "Menu";
  }
  async getHtml() {
    return ` 
    <div class="container form__inner">
      <form class="form block" id="menu">
        <div class="block__inner">
          <a class="form__button block__button button" href="/game"  data-link>Solo game</a>
          <div class="line"></div>
          <input class="form__input" id="inputId" placeholder="Room id(Skippable)">
          <a class="form__button block__button button" id="multiplayer__link" data-link>Multiplayer/Join</a></div>
      </form>
    </div>`;
  }
  async afterRender() {
    const link = document.querySelector("#multiplayer__link");
    link.addEventListener("click", () => {
      const id =
        document.querySelector("#inputId").value || `${Date.now()}`.slice(5);
      link.href = `/game/${id}`;
    });
  }
}
