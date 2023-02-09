export const gameStart = (id) => {
  const userGrid = document.querySelector(".grid-user");
  const computerGrid = document.querySelector(".grid-computer");
  const displayGrid = document.querySelector(".grid-display");
  const ships = document.querySelectorAll(".ship");

  const destroyers = document.querySelectorAll(".destroyer-container");
  const submarines = document.querySelectorAll(".submarine-container");
  const cruisers = document.querySelectorAll(".cruiser-container");
  const battleships = document.querySelectorAll(".battleship-container");

  const startButton = document.querySelector("#start");
  const rotateButton = document.querySelector("#rotate");
  const turnDisplay = document.querySelector("#whose-go");
  const infoDisplay = document.querySelector("#info");
  const chatForm = document.querySelector("#chat-form");
  const chatInput = document.querySelector("#chat-input");
  const messagesContainer = document.querySelector("#messages");
  const modal = document.querySelector(".modal");
  const userSquares = [];
  const computerSquares = [];
  let isHorizontal = true;
  let isGameOver = false;
  let currentPlayer = "user";
  const width = 10;
  let playerNum = 0;
  let ready = false;
  let enemyReady = false;
  let allShipsPlaced = false;
  let shotFired = -1;
  let username = JSON.parse(localStorage.getItem("data")).username;
  let enemyUsername = "";
  const roomId = id;
turnDisplay.innerHTML = "Wait";

  function startMultiPlayer() {
    const socket = io();
    socket.emit("join-room", roomId);
    socket.emit("username", username);
    socket.on("player-number", (num) => {
      if (num === -1) {
        turnDisplay.innerHTML = "Sorry, the server is full";
      } else {
        playerNum = parseInt(num);
        if (playerNum === 1) currentPlayer = "enemy";
        socket.emit("check-players");
      }
    });
    socket.on("player-connection", (num) => {
      playerConnectedOrDisconnected(num);
    });
    socket.on("player-disconnected", (id) => {
      if (roomId == id) {
        modal.style.display = "flex";
        modal.querySelector(
          "#modal-info"
        ).textContent = `${enemyUsername} left!`;
        setTimeout(() => {
          window.location.href = `/menu`;
        }, 3000);
      }
    });
    socket.on("enemy-ready", (num) => {
      enemyReady = true;
      playerReady(num);
      if (ready) playGameMulti(socket);
    });
    socket.on("check-players", (players) => {
      players.forEach((p, i) => {
        if (p.connected) playerConnectedOrDisconnected(i);
        if (p.ready) {
          playerReady(i);
          if (i !== playerReady) enemyReady = true;
        }
      });
    });

    let isValid = false;

    startButton.addEventListener("click", () => {
      if (allShipsPlaced) {
        if (isValid) {
          document.getElementById("info").remove();
          isValid = false;
        }
        playGameMulti(socket);
        startButton.setAttribute("disabled", "");
      } else {
        const infoDisplay = document.createElement("h3");
        infoDisplay.classList = "form__message--error";
        infoDisplay.id = "info";
        infoDisplay.textContent = "Please place all ships";
        if (!isValid) {
          turnDisplay.insertAdjacentElement("afterend", infoDisplay);
        }
        isValid = true;
      }
    });

    computerSquares.forEach((square) => {
      square.addEventListener("click", () => {
        if (currentPlayer === "user" && ready && enemyReady) {
          shotFired = square.dataset.id;
          socket.emit("fire", shotFired);
        }
      });
    });

    socket.on("fire", (id) => {
      enemyGo(id);
      const square = userSquares[id];
      socket.emit("fire-reply", square.classList);
      playGameMulti(socket);
    });

    socket.on("fire-reply", (classList) => {
      revealSquare(classList);
      playGameMulti(socket);
    });

    socket.on("players", function (players) {
      let playersList = "";
      for (var i = 0; i < players.length; i++) {
        playersList += players[i].username + "<br>";
      }
      try {
        if (players[0].username)
          document.getElementById(
            "firstPlayer"
          ).innerHTML = `Player 1 (${players[0].username})`;

        if (players[1].username)
          document.getElementById(
            "secondPlayer"
          ).innerHTML = `Player 2 (${players[1].username})`;
        if (
          players[1].username ===
          JSON.parse(localStorage.getItem("data")).username
        )
          return (enemyUsername = players[0].username);
        return (enemyUsername = players[1].username);
      } catch (e) {}
    });

    function playerConnectedOrDisconnected(num) {
      let player = `.p${parseInt(num) + 1}`;
      document
        .querySelector(`${player} .connected span`)
        .classList.toggle("green");
      if (parseInt(num) === playerNum)
        document.querySelector(player).style.fontWeight = "bold";
    }

    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      socket.emit("chat-message", {
        username: username,
        message: chatInput.value,
      });
      chatInput.value = "";
    });

    socket.on("chat-message", function (data) {
      const li = document.createElement("li");
      li.innerHTML = `<b">${data.username}:</b> ${data.message}`;
      messagesContainer.appendChild(li);
    });
  }

  function createBoard(grid, squares) {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.dataset.id = i;
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard(userGrid, userSquares);
  createBoard(computerGrid, computerSquares);

  const shipArray = [
    {
      name: "destroyer",
      directions: [[0], [0]],
    },
    {
      name: "submarine",
      directions: [
        [0, 1],
        [0, width],
      ],
    },
    {
      name: "cruiser",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    {
      name: "battleship",
      directions: [
        [0, 1, 2, 3],
        [0, width, width * 2, width * 3],
      ],
    },
  ];

  function rotate() {
    if (isHorizontal) {
      destroyers.forEach((destroyer) => {
        destroyer.classList.toggle("destroyer-container-vertical");
      });
      submarines.forEach((submarine) => {
        submarine.classList.toggle("submarine-container-vertical");
      });
      cruisers.forEach((cruiser) => {
        cruiser.classList.toggle("cruiser-container-vertical");
      });
      battleships.forEach((battleship) => {
        battleship.classList.toggle("battleship-container-vertical");
      });
      isHorizontal = false;
      return;
    }
    if (!isHorizontal) {
      destroyers.forEach((destroyer) => {
        destroyer.classList.toggle("destroyer-container-vertical");
      });
      submarines.forEach((submarine) => {
        submarine.classList.toggle("submarine-container-vertical");
      });
      cruisers.forEach((cruiser) => {
        cruiser.classList.toggle("cruiser-container-vertical");
      });
      battleships.forEach((battleship) => {
        battleship.classList.toggle("battleship-container-vertical");
      });
      isHorizontal = true;
      return;
    }
  }
  rotateButton.addEventListener("click", rotate);

  let selectedShipNameWithIndex;
  let draggedShip;
  let draggedShipLength;

  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    ships.forEach((ship) =>
      ship.addEventListener("touchstart", (e) => {
        selectedShipNameWithIndex = e.target.id;
        draggedShip = e.currentTarget;
        let container_div = e.currentTarget;
        let count = container_div.getElementsByTagName("div").length;
        draggedShipLength = count;
        userSquares.forEach((square) =>
          square.addEventListener("touchend", dragDrop)
        );
      })
    );
  } else {
    ships.forEach((ship) => ship.addEventListener("dragstart", dragStart));
    userSquares.forEach((square) =>
      square.addEventListener("dragstart", dragStart)
    );
    userSquares.forEach((square) =>
      square.addEventListener("dragover", dragOver)
    );
    userSquares.forEach((square) =>
      square.addEventListener("dragenter", dragEnter)
    );

    userSquares.forEach((square) => square.addEventListener("drop", dragDrop));

    ships.forEach((ship) =>
      ship.addEventListener("mousedown", (e) => {
        selectedShipNameWithIndex = e.target.id;
      })
    );

    function dragStart() {
      draggedShip = this;
      draggedShipLength = this.childNodes.length;
    }

    function dragOver(e) {
      e.preventDefault();
    }

    function dragEnter(e) {
      e.preventDefault();
    }
  }

  function dragDrop() {
    let notAllowedHorizontal = [];
    let notAllowedVertical = [];
    let shipNum = draggedShipLength - 1;

    let shipNameWithLastId = draggedShip.lastChild.id;
    let shipClass = shipNameWithLastId.slice(0, -2);
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
    let shipLastId = lastShipIndex + parseInt(this.dataset.id) + 1;
    let selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));
    if (!isHorizontal) selectedShipIndex = 0;

    let shipLastIdVer =
      parseInt(this.dataset.id) - selectedShipIndex + width * draggedShipLength;

    notAllowedHorizontal[0] = [];

    notAllowedHorizontal[1] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];

    notAllowedHorizontal[2] = [
      0, 1, 10, 11, 20, 21, 30, 31, 40, 41, 50, 51, 60, 61, 70, 71, 80, 81, 90,
      91, 100, 101,
    ];

    notAllowedHorizontal[3] = [
      0, 1, 2, 10, 11, 12, 20, 21, 22, 30, 31, 32, 40, 41, 42, 50, 51, 52, 60,
      61, 62, 70, 71, 72, 80, 81, 82, 90, 91, 92, 100, 101, 102,
    ];

    notAllowedVertical[0] = [];

    notAllowedVertical[1] = [110, 111, 112, 113, 114, 115, 116, 117, 118, 119];

    notAllowedVertical[2] = [
      110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124,
      125, 126, 127, 128, 129,
    ];

    notAllowedVertical[3] = [
      110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124,
      125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139,
    ];

    shipLastId = shipLastId - selectedShipIndex;
    let isTaken = false;
    for (let i = 0; i < draggedShipLength; i++) {
      let currentSquareIndex;
      if (isHorizontal) {
        currentSquareIndex = parseInt(this.dataset.id) - selectedShipIndex + i;
      } else {
        currentSquareIndex =
          parseInt(this.dataset.id) - selectedShipIndex + width * i;
      }
      try {
        if (userSquares[currentSquareIndex].classList.contains("taken")) {
          isTaken = true;
          break;
        }
      } catch (e) {}
    }
    if (isTaken) return;
    let isAdjacent = false;
    for (let i = 0; i < draggedShipLength; i++) {
      let currentSquareIndex;
      isHorizontal
        ? (currentSquareIndex =
            parseInt(this.dataset.id) - selectedShipIndex + i)
        : (currentSquareIndex =
            parseInt(this.dataset.id) + width * i - width * selectedShipIndex);
      if (
        (currentSquareIndex + 1) % 10 &&
        userSquares[currentSquareIndex + 1] &&
        userSquares[currentSquareIndex + 1].classList.contains("taken")
      ) {
        isAdjacent = true;
        break;
      }
      if (
        currentSquareIndex % 10 &&
        userSquares[currentSquareIndex - 1] &&
        userSquares[currentSquareIndex - 1].classList.contains("taken")
      ) {
        isAdjacent = true;
        break;
      }
      if (
        userSquares[currentSquareIndex + width] &&
        userSquares[currentSquareIndex + width].classList.contains("taken")
      ) {
        isAdjacent = true;
        break;
      }
      if (
        (currentSquareIndex + width + 1) % 10 &&
        userSquares[currentSquareIndex + width + 1] &&
        userSquares[currentSquareIndex + width + 1].classList.contains("taken")
      ) {
        isAdjacent = true;
        break;
      }
      if (
        currentSquareIndex % 10 &&
        userSquares[currentSquareIndex + width - 1] &&
        userSquares[currentSquareIndex + width - 1].classList.contains("taken")
      ) {
        isAdjacent = true;
        break;
      }
      if (
        userSquares[currentSquareIndex - width] &&
        userSquares[currentSquareIndex - width].classList.contains("taken")
      ) {
        isAdjacent = true;
        break;
      }
      if (
        currentSquareIndex > 10 &&
        (currentSquareIndex - width + 1) % 10 &&
        userSquares[currentSquareIndex - width + 1].classList.contains("taken")
      ) {
        isAdjacent = true;
        break;
      }
      if (
        currentSquareIndex % 10 &&
        userSquares[currentSquareIndex - width - 1] &&
        userSquares[currentSquareIndex - width - 1].classList.contains("taken")
      ) {
        isAdjacent = true;
        break;
      }
    }
    if (isAdjacent) return;
    if (
      isHorizontal &&
      !notAllowedHorizontal[shipNum].includes(shipLastId - 1)
    ) {
      for (let i = 0; i < draggedShipLength; i++) {
        userSquares[
          parseInt(this.dataset.id) - selectedShipIndex + i
        ].classList.add("taken", shipClass);
      }
    } else if (
      !isHorizontal &&
      !notAllowedVertical[shipNum].includes(shipLastIdVer)
    ) {
      for (let i = 0; i < draggedShipLength; i++) {
        userSquares[
          parseInt(this.dataset.id) + width * i - width * selectedShipIndex
        ].classList.add("taken", shipClass);
      }
    } else return;
    displayGrid.removeChild(draggedShip);
    userSquares.forEach((square) =>
      square.removeEventListener("touchend", dragDrop)
    );
    if (!displayGrid.querySelector(".ship")) allShipsPlaced = true;
  }

  function playGameMulti(socket) {
    if (isGameOver) return;
    if (!ready) {
      socket.emit("player-ready");
      ready = true;
      playerReady(playerNum);
    }

    if (enemyReady) {
      if (currentPlayer === "user") {
        turnDisplay.innerHTML = "Your Go";
      }
      if (currentPlayer === "enemy") {
        turnDisplay.innerHTML = `${enemyUsername} Go`;
      }
    }
  }

  function playerReady(num) {
    let player = `.p${parseInt(num) + 1}`;
    document.querySelector(`${player} .ready span`).classList.toggle("green");
  }

  let playerDestroyedCount = 0;

  function revealSquare(classList) {
    const enemySquare = computerGrid.querySelector(
      `div[data-id='${shotFired}']`
    );
    const obj = Object.values(classList);
    if (
      !enemySquare.classList.contains("boom") &&
      currentPlayer === "user" &&
      !isGameOver &&
      !enemySquare.classList.contains("miss")
    ) {
      if (
        obj.includes("destroyer") ||
        obj.includes("submarine") ||
        obj.includes("cruiser") ||
        obj.includes("battleship")
      )
        playerDestroyedCount++;

      if (obj.includes("taken")) {
        enemySquare.classList.add("boom");
        currentPlayer = "user";
        checkForWins();
      } else {
        enemySquare.classList.add("miss");
        currentPlayer = "enemy";
      }
    }
  }

  let cpuDestroyedCount = 0;

  function enemyGo(square) {
    if (
      !userSquares[square].classList.contains("boom") &&
      !userSquares[square].classList.contains("miss")
    ) {
      if (
        userSquares[square].classList.contains("destroyer") ||
        userSquares[square].classList.contains("submarine") ||
        userSquares[square].classList.contains("cruiser") ||
        userSquares[square].classList.contains("battleship")
      ) {
        userSquares[square].classList.add("boom");
        cpuDestroyedCount++;
        currentPlayer = "enemy";
        checkForWins();
      } else {
        userSquares[square].classList.add("miss");
        currentPlayer = "user";
        turnDisplay.innerHTML = "Your Go";
      }
    }
  }

    async function checkForWins() {
    if (playerDestroyedCount === 20) {
      gameOver();
      try {
        const { data } = await axios.post(`http://sea-battle-server-production.up.railway.app/auth/win`, {
          username,
        });
        modal.style.display = "flex";
        modal.querySelector("#modal-info").textContent = `YOU WIN`;
        setTimeout(() => {
          window.location.href = `/menu`;
        }, 5000);
      } catch (error) {
        console.error(error.response.data.message);
      }
    }
    if (cpuDestroyedCount === 20) {
      gameOver();
      modal.style.display = "flex";
      modal.querySelector("#modal-info").textContent = `${enemyUsername} WIN`;
      setTimeout(() => {
        window.location.href = `/menu`;
      }, 5000);
    }
  }

  function gameOver() {
    isGameOver = true;
  }

  startMultiPlayer();
};
