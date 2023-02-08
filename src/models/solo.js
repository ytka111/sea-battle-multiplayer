export const gameStart = () => {
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
  const modal = document.querySelector(".modal");
  const userSquares = [];
  const computerSquares = [];
  let isHorizontal = true;
  let isGameOver = false;
  let currentPlayer = "user";
  let allShipsPlaced = false;
  const width = 10;
turnDisplay.innerHTML = "Wait";

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

  function generate(ship) {
    let direction;
    let randomDirection = Math.floor(Math.random() * ship.directions.length);
    let current = ship.directions[randomDirection];
    if (randomDirection === 0) direction = 1;
    if (randomDirection === 1) direction = 10;
    let randomStart = Math.abs(
      Math.floor(
        Math.random() * computerSquares.length -
          ship.directions[0].length * direction
      )
    );
    const isTaken = current.some((index) =>
      computerSquares[randomStart + index].classList.contains("taken")
    );
    const isAtRightEdge = current.some(
      (index) => (randomStart + index) % width === width - 1
    );
    const isAtLeftEdge = current.some(
      (index) => (randomStart + index) % width === 0
    );
    const isTouchingOtherShip = current.some((index) => {
      try {
        if (
          computerSquares[randomStart + index + 1].classList.contains(
            "taken"
          ) ||
          computerSquares[randomStart + index - 1].classList.contains(
            "taken"
          ) ||
          computerSquares[randomStart + index + 10].classList.contains(
            "taken"
          ) ||
          computerSquares[randomStart + index + 10 + 1].classList.contains(
            "taken"
          ) ||
          computerSquares[randomStart + index + 10 - 1].classList.contains(
            "taken"
          ) ||
          computerSquares[randomStart + index - 10].classList.contains(
            "taken"
          ) ||
          computerSquares[randomStart + index - 10 - 1].classList.contains(
            "taken"
          ) ||
          computerSquares[randomStart + index - 10 + 1].classList.contains(
            "taken"
          )
        )
          return true;
      } catch (e) {
        return true;
      }
    });
    if (!isTaken && !isAtRightEdge && !isAtLeftEdge && !isTouchingOtherShip)
      current.forEach((index) =>
        computerSquares[randomStart + index].classList.add("taken", ship.name)
      );
    else {
      //bruh
      try {
        generate(ship);
      } catch (e) {
        window.location.href = `/game`;
      }
    }
  }

  generate(shipArray[3]);
  generate(shipArray[2]);
  generate(shipArray[2]);
  generate(shipArray[1]);
  generate(shipArray[1]);
  generate(shipArray[1]);
  generate(shipArray[0]);
  generate(shipArray[0]);
  generate(shipArray[0]);
  generate(shipArray[0]);

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

  let isValid = false;

  function playGame() {
    if (!allShipsPlaced) {
      const infoDisplay = document.createElement("h3");
      infoDisplay.classList = "form__message--error";
      infoDisplay.id = "info";
      infoDisplay.textContent = "Please place all ships";
      if (!isValid) {
        turnDisplay.insertAdjacentElement("afterend", infoDisplay);
      }
      isValid = true;
      return;
    }

    if (isValid) {
      document.getElementById("info").remove();
      isValid = false;
    }

    if (isGameOver) return;
    if (currentPlayer === "user") {
      turnDisplay.innerHTML = "Your Go";
      computerSquares.forEach((square) =>
        square.addEventListener("click", function (e) {
          revealSquare(square);
        })
      );
    }
    if (currentPlayer === "computer") {
      computerGo();
      turnDisplay.innerHTML = "Computers Go";
    }
  }
  startButton.addEventListener("click", playGame);

  let playerDestroyedCount = 0;

  function revealSquare(square) {
    if (
      !square.classList.contains("boom") &&
      !square.classList.contains("miss")
    ) {
      if (
        square.classList.contains("destroyer") ||
        square.classList.contains("submarine") ||
        square.classList.contains("cruiser") ||
        square.classList.contains("battleship")
      )
        playerDestroyedCount++;

      if (square.classList.contains("taken")) {
        square.classList.add("boom");
        currentPlayer = "user";
        checkForWins();
        return;
      } else {
        square.classList.add("miss");
        computerGo();
      }

      checkForWins();
      currentPlayer = "computer";
    }
  }

  let cpuDestroyedCount = 0;

  function computerGo() {
    let random = Math.floor(Math.random() * userSquares.length);
    if (
      !userSquares[random].classList.contains("boom") &&
      !userSquares[random].classList.contains("miss")
    ) {
      if (
        userSquares[random].classList.contains("destroyer") ||
        userSquares[random].classList.contains("submarine") ||
        userSquares[random].classList.contains("cruiser") ||
        userSquares[random].classList.contains("battleship")
      ) {
        userSquares[random].classList.add("boom");
        cpuDestroyedCount++;
        checkForWins();
        computerGo();
      } else {
        userSquares[random].classList.add("miss");
      }
    } else computerGo();
    currentPlayer = "user";
    turnDisplay.innerHTML = "Your Go";
  }

  function checkForWins() {
    if (playerDestroyedCount === 20) {
      gameOver();
      modal.style.display = "flex";
      modal.querySelector("#modal-info").textContent = `YOU WIN`;
      setTimeout(() => {
        window.location.href = `/menu`;
      }, 5000);
    }
    if (cpuDestroyedCount === 20) {
      gameOver();
      modal.style.display = "flex";
      modal.querySelector("#modal-info").textContent = `COMPUTER WIN`;
      setTimeout(() => {
        window.location.href = `/menu`;
      }, 5000);
    }
  }

  function gameOver() {
    isGameOver = true;
    startButton.removeEventListener("click", playGame);
  }
};
