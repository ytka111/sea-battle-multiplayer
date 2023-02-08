import AbstractView from "./AbstractView.js";
import { gameStart } from "../models/solo.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle = "Game in progress";
  }
  async getHtml() {
    return `
    <div class="container game__container">
    <button class="rotate__button form__button block__button button" id="rotate">Rotate Your Ships</button>
      <div class="grid-display">
      <div class="ship destroyer-container" draggable="true"><div id="destroyer-0"></div></div>
      <div class="ship destroyer-container" draggable="true"><div id="destroyer-0"></div></div>
      <div class="ship destroyer-container" draggable="true"><div id="destroyer-0"></div></div>
      <div class="ship destroyer-container" draggable="true"><div id="destroyer-0"></div></div>
        <div class="ship submarine-container" draggable="true"><div id="submarine-0"></div><div id="submarine-1"></div></div>
        <div class="ship submarine-container" draggable="true"><div id="submarine-0"></div><div id="submarine-1"></div></div>
        <div class="ship submarine-container" draggable="true"><div id="submarine-0"></div><div id="submarine-1"></div></div>
        <div class="ship cruiser-container" draggable="true"><div id="cruiser-0"></div><div id="cruiser-1"></div><div id="cruiser-2"></div></div>
        <div class="ship cruiser-container" draggable="true"><div id="cruiser-0"></div><div id="cruiser-1"></div><div id="cruiser-2"></div></div>
        <div class="ship battleship-container" draggable="true"><div id="battleship-0"></div><div id="battleship-1"></div><div id="battleship-2"></div><div id="battleship-3"></div></div>
      </div>
      
      <div class="hidden-info">
        <div class="hidden-info__block hidden-info__inner block block__inner">
          <button class="form__button block__button button" id="start">Start Game</button>
          <h3 id="whose-go">Your Go</h3>
        </div>
      </div>

      <div class="game__wrapper">
        <div class="grid grid-user"></div>
        <div class="grid grid-computer"></div>
      </div>

      <div class="modal">
      <div class="modal__block block">
        <h1 class="block__title" id="modal-info"></h1>
      </div>
    </div>

    </div>`;
  }

  async afterRender() {
    return gameStart();
  }
}
