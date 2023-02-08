import AbstractView from "./AbstractView.js";
import { gameStart } from "../models/multi.js";

let username = "";

const storedData = JSON.parse(localStorage.getItem("data"));
if (storedData && storedData.username) {
  username = storedData.username;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.gameId = params.id;
    this.setTitle = "Game in progress";
  }
  async getHtml() {
    if (!username) return (window.location.href = `/login`);

    return `<div class="container game__container">

    <div class="multi__wrapper">
      <div class="multi__info block">
        <div class="multi__info-id">Game id: <span>${this.gameId}</span></div>
        <div  class="player p1">
        <div id="firstPlayer">Player 1</div>
        <div class="connected">Connected <span></span></div>
        <div class="ready">Ready <span></span></div>
        </div>
        <div class="player p2">
        <div id="secondPlayer">Player 2</div>
        <div class="connected">Connected <span></span></div>
        <div class="ready">Ready <span></span></div>
        </div>
      </div>

      <div class="chat block" id="chat-container">
        <ul class="chat__messages" id="messages">
        </ul>
        <form id="chat-form">
          <input class="chat__input form__input" type="text" id="chat-input" placeholder="Type message here...">
          <button class="chat__button form__button block__button button" type="submit">Send</button>
        </form>
      </div>


        <div class="hidden-info__block hidden-info__inner block block__inner">
        <button class="form__button block__button button" id="start">Start Game</button>
        <h3 id="whose-go">Your Go</h3>
        </div>
    </div>
    

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

    <div class="game__wrapper">
      <div class="grid grid-user"></div>
      <div class="grid grid-computer"></div>
    </div>


</div>

<div class="modal">
      <div class="modal__block block">
        <h1 class="block__title" id="modal-info"></h1>
      </div>
    </div>

    `;
  }

  async afterRender() {
    if (!username) return "";
    return gameStart(this.gameId);
  }
}
