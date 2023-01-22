//DECLARACION DE VARIABLES

function printGame() {
  //ELEMENTO CANVAS
  const canvas = document.getElementById("game-canvas");
  const context = canvas.getContext("2d");

  //ELEMENTOS SETTINGS
  const checkboxGrid = document.getElementById("grid");
  const rangeGridWidth = document.getElementById("gridWidth");
  const settingsIcon = document.getElementById("settings-icon");
  const settingsItems = document.getElementById("settings-items");

  //ELEMENTOS PLAYER-STATS
  const livesContainer = document.getElementById("lives");
  const timeContainer = document.getElementById("time-played");
  const recordContainer = document.getElementById("current-record");

  //BOTONES
  const botones = {
    Arriba: document.getElementById("up"),
    Abajo: document.getElementById("down"),
    Izquierda: document.getElementById("left"),
    Derecha: document.getElementById("right"),
  };

  //ELEMENOS SCREEN MENU INICIAL
  const menuContainer = document.querySelector(".game-menu");
  const playBtn = document.querySelector(".fa-solid.fa-play");

  //ELEMENTOS SCREEN IN-GAME
  const gameContainer = document.querySelector(".game");
  const countdownContainer = document.getElementById("countdown");

  //ELEMENTOS SCREEN GAME OVER
  const gameOverContainer = document.querySelector(".game-over");
  const restartButton = document.querySelector(".game-over__play");
  const gameOverTitle = document.querySelector(".game-over__title");

  playBtn.addEventListener("click", () => {
    menuContainer.classList.add("game-menu--inactive");
    gameContainer.classList.add("game--active");
    startGame();
  });

  //VARIABLES GLOBALES DE CONFIGURACION INICIAL DEL JUEGO
  let intervalo = 0;
  let timeStart = 0;
  let timePlayed = 0;
  let time = 20000;
  let lives = 3;
  let level = 3;

  //VARIABLES GLOBALES DE POSICIONAMIENTO Y RENDERIZADO
  const playerPosition = {
    x: 0,
    y: 0,
    xIndex: null,
    yIndex: null,
  };
  let startPosition = true;
  const positions = {};
  const bombPositions = [];
  let giftPosition = {};

  function setListener() {
    //Listerners de renderizado
    window.addEventListener("resize", drawGame);
    checkboxGrid.addEventListener("click", drawGame);
    rangeGridWidth.addEventListener("input", drawGame);

    //Listeners de movimiento
    document.addEventListener("keydown", detectarMovimiento);
    for (let boton in botones) {
      botones[boton].addEventListener("click", detectarMovimiento);
    }

    //Listeners de configuraciones
    settingsIcon.addEventListener("click", function () {
      settingsItems.classList.toggle("settings-active");
    });

    //Reiniciar Juego
    restartButton.addEventListener("click", restartGame);
  }

  function removeListener() {
    checkboxGrid.removeEventListener("click", drawGame);
    rangeGridWidth.removeEventListener("input", drawGame);
    document.removeEventListener("keydown", detectarMovimiento);
    for (let boton in botones) {
      botones[boton].removeEventListener("click", detectarMovimiento);
    }
  }

  //FUNCIONES DE RENDERIZADO

  function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    detectarColision();
    print();
    drawCanvas();
    drawGrid();
    setPositions();
    drawElement(level);
    drawPlayer();
    if (lives == 0) {
      loseGame("Boom!" + emojis["PLAYER"]);
    }
  }

  function drawCanvas() {
    let size = 800;
    if (window.innerWidth < 900 || window.innerHeight < 900) {
      size = window.innerWidth - 100;
      if (window.innerHeight < window.innerWidth) {
        size = window.innerHeight - 150;
      }
      if (window.innerHeight < 300 || window.innerWidth < 300) {
        size = 200;
      }
    }
    canvas.width = size;
    canvas.height = size;
  }

  function drawGrid() {
    let size = canvas.width / 10;
    context.lineWidth = rangeGridWidth.value;

    if (checkboxGrid.checked) {
      context.strokeStyle = "white";
    } else {
      context.strokeStyle = "transparent";
    }
    while (size < canvas.width) {
      context.beginPath();
      context.moveTo(size, 0);
      context.lineTo(size, canvas.height);
      context.stroke();
      context.beginPath();
      context.moveTo(0, size);
      context.lineTo(canvas.width, size);
      context.stroke();
      size += canvas.width / 10;
    }
  }

  function getMap(index) {
    const rows = maps[index].match(/[XIO\-]+/g);
    return rows.map((row) => row.split(""));
  }

  function drawElement(lvl) {
    const size = canvas.width / 10;
    const map = getMap(lvl);
    context.font = `${size * 0.75}px sans-serif`;
    context.textAlign = "left";
    context.textBaseline = "top";

    let responsiveY = 5;
    if (canvas.width > 600) {
      responsiveY = 15;
    }
    let bombCount = 0;
    map.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        const x = positions[colIndex];
        const y = positions[rowIndex];
        context.fillText(emojis[col], x, y + responsiveY);
        if (col == "O") {
          if (startPosition) {
            playerPosition.x = x;
            playerPosition.y = y;
            playerPosition.xIndex = colIndex;
            playerPosition.yIndex = rowIndex;
            drawPlayer();
          }
        } else if (col == "X") {
          bombPositions[bombCount] = {
            x: x,
            y: y,
            xIndex: colIndex,
            yIndex: rowIndex,
          };
          bombCount++;
        } else if (col == "I") {
          giftPosition = { x: x, y: y, xIndex: colIndex, yIndex: rowIndex };
        }
      });
    });
  }

  function drawPlayer() {
    let responsiveY = 5;
    if (canvas.width > 600) {
      responsiveY = 15;
    }
    context.fillText(
      emojis["PLAYER"],
      positions[playerPosition.xIndex],
      positions[playerPosition.yIndex] + responsiveY
    );
  }

  //FUNCIONES DE MOVIMIENTO Y POSICION
  function detectarColision() {
    let collision = false;
    if (
      playerPosition.xIndex === giftPosition.xIndex &&
      playerPosition.yIndex === giftPosition.yIndex
    ) {
      winLevel();
    } else {
      bombPositions.forEach((bomb) => {
        if (
          bomb.xIndex === playerPosition.xIndex &&
          bomb.yIndex === playerPosition.yIndex
        ) {
          collision = true;
          loseLevel();
        }
      });
    }
    return collision;
  }

  function setPositions() {
    for (let i = 0; i < 10; i++) {
      positions[i] = (canvas.width / 10) * i;
    }
  }

  function detectarMovimiento(e) {
    if (e.code) {
      const keys = {
        ArrowUp: "Arriba",
        ArrowRight: "Derecha",
        ArrowDown: "Abajo",
        ArrowLeft: "Izquierda",
      };
      if (keys.hasOwnProperty(e.code)) {
      }
      moverJugador(keys[e.code]);
    } else if (e.target) {
      for (let boton in botones) {
        if (e.target == botones[boton]) {
          moverJugador(boton);
        }
      }
    }
  }

  function moverJugador(direccion) {
    if (direccion && lives > 0) {
      startPosition = false;
      if (direccion == "Arriba") {
        if (playerPosition.yIndex > 0) {
          playerPosition.yIndex--;
        }
      } else if (direccion == "Abajo") {
        if (playerPosition.yIndex < 9) {
          playerPosition.yIndex++;
        }
      } else if (direccion == "Derecha") {
        if (playerPosition.xIndex < 9) {
          playerPosition.xIndex++;
        }
      } else if (direccion == "Izquierda") {
        if (playerPosition.xIndex > 0) {
          playerPosition.xIndex--;
        }
      }
      drawGame();
    }
  }

  //FUNCIONES DE IMPRESION EN DOM

  function print() {
    livesContainer.innerHTML = "💖".repeat(lives);
  }

  //FUNCIONES DE MECANICAS

  function winLevel() {
    if (level < maps.length - 1) {
      bombPositions.splice(0, bombPositions.length);
      level++;
      startPosition = true;
    } else if (level == maps.length - 1) {
      winGame();
    }
  }

  function loseLevel() {
    if (lives > 0) {
      bombPositions.splice(0, bombPositions.length);
      startPosition = true;
      lives--;
    }
  }

  function winGame() {
    removeListener();
    const record = localStorage.getItem("record");
    clearInterval(intervalo);
    if (record) {
      if (timePlayed < record) {
        localStorage.setItem("record", time - timePlayed);
        console.log("Record Superado.");
      }
    } else {
      localStorage.setItem("record", time - timePlayed);
      console.log("Record Superado.");
    }
    let stats = {
      timeLeft: time,
      timePlayed: time - timePlayed,
      record: localStorage.getItem("record"),
    };
    console.log(stats);
  }

  function loseGame(msg) {
    clearInterval(intervalo);
    showGameOverScreeen(msg);
  }

  function showGameOverScreeen(msg) {
    gameOverTitle.innerText = msg;
    gameContainer.classList.remove("game--active");
    gameContainer.classList.add("game--inactive");
    gameOverContainer.classList.remove("game-over--inactive");
    gameOverContainer.classList.add("game-over--active");
  }

  function restartGame() {
    gameOverContainer.classList.remove("game-over--active");
    gameOverContainer.classList.add("game-over--inactive");
    gameContainer.classList.remove("game--inactive");
    gameContainer.classList.add("game--active");
    timeContainer.innerText = "";
    if (lives <= 0) {
      startPosition = true;
      level = 0;
      lives = 3;
      startGame();
    }
  }

  function countdown() {
    countdownContainer.classList.remove("countdown--inactive");
    countdownContainer.innerText = 3;
    setTimeout(function () {
      countdownContainer.innerText = 2;
      setTimeout(function () {
        countdownContainer.innerText = 1;
        setTimeout(function () {
          countdownContainer.classList.add("countdown--inactive");
          timeStart = Date.now() + time;
          intervalo = setInterval(function () {
            timePlayed = timeStart - Date.now();
            timeContainer.innerText = `${timePlayed / 1000}`;
            if (timePlayed <= 0) {
              loseGame("Time out 🕒");
            }
          });
          setListener();
        }, 1000);
      }, 1000);
    }, 1000);
  }

  function startGame() {
    drawGame();
    countdown();
  }
}

window.addEventListener("load", printGame);
