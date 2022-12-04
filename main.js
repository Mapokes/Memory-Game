const themeButtons = document.querySelectorAll(".theme-button");
const playerNumButtons = document.querySelectorAll(".player-num-button");
const gridSizeButtons = document.querySelectorAll(".grid-size-button");
const siteBody = document.querySelector("body");
const startGameButton = document.getElementById("start-game-button");
const gameScreen = document.querySelector(".game-screen-main");
const memoryButtonsSection = document.getElementById("memory-buttons-section");
const currTurnText = document.getElementById("cur-turn-txt");
const multiTimer = document.getElementById("multi-timer");
const playerTime = document.querySelector(".player-time");
const turnLostText = document.querySelector(".turn-lost-text");
const singleplayerMoveCount = document.getElementById("moves-count");
const multiplayerPairCount = document.querySelectorAll(".pair-count");
const singleTimer = document.getElementById("single-timer");
const playerBoxes = document.querySelectorAll(".player-box");
const textMobile = document.querySelectorAll(".text-mobile");
const textDesktop = document.querySelectorAll(".text-desktop");
const singlePlayerResultSection = document.getElementById("single-player-result-section");
const multiPlayerResultSection = document.getElementById("multi-player-result-section");
const backgroundOverlay = document.querySelector(".background-overlay");
const timeResult = document.getElementById("time-result");
const movesTaken = document.getElementById("moves-taken");
const multiResultTitle = document.getElementById("multi-result-title");
const multiResultBoxes = document.querySelectorAll("#multi-player-result-section .result-box");
const headerOptionButtons = document.querySelectorAll(".header-option-button");
const resultOptionButtons = document.querySelectorAll(".result-option-button");
const confirmationScreen = document.querySelector(".confirmation-screen");
const confirmationDetail = document.getElementById("confirmation-detail");
const confirmButton = document.getElementById("confirm-btn");
const declineButton = document.getElementById("decline-btn");
const mobileMenuButton = document.querySelector(".mobile-menu-button");
const gameMenuButtons = document.querySelector(".game-menu-buttons");
const cancelButton = document.getElementById("cancel-button");

let theme = "numbers";
let playersCount = 1;
let gridSize = "4x4";
let multiInterval;
let memoryButtonDelay;
let singleInterval;
let optionText;
let playersPairsCountObjects = [
  {
    player: 1,
    playerPairsCount: 0,
  },
  {
    player: 2,
    playerPairsCount: 0,
  },
  {
    player: 3,
    playerPairsCount: 0,
  },
  {
    player: 4,
    playerPairsCount: 0,
  },
];

// ===============================================================
// MAIN MENU
// ===============================================================

// for choosing numbers or icons
themeButtons.forEach((themeButton) => {
  themeButton.addEventListener("click", () => {
    activateThemeButton(themeButton);
    theme = themeButton.textContent.toLocaleLowerCase();
  });
});

/**removes "selected" class from theme buttons and adds one to clicked theme button */
function activateThemeButton(clickedButton) {
  themeButtons.forEach((themeButton) => {
    themeButton.classList.remove("selected");
  });
  clickedButton.classList.add("selected");
}

// for choosing number of players
playerNumButtons.forEach((playerNumButton) => {
  playerNumButton.addEventListener("click", () => {
    activatePlayerNumberButton(playerNumButton);
    playersCount = Number(playerNumButton.textContent);
  });
});

/**removes "selected" class from number of players buttons and adds one to clicked number of players button */
function activatePlayerNumberButton(clickedButton) {
  playerNumButtons.forEach((playerNumButton) => {
    playerNumButton.classList.remove("selected");
  });
  clickedButton.classList.add("selected");
}

// for choosing grid size
gridSizeButtons.forEach((gridSizeButton) => {
  gridSizeButton.addEventListener("click", () => {
    activateGridSizeButton(gridSizeButton);
    gridSize = gridSizeButton.textContent;
  });
});

/**removes "selected" class from grid size buttons and adds one to clicked grid size button */
function activateGridSizeButton(clickedButton) {
  gridSizeButtons.forEach((gridSizeButton) => {
    gridSizeButton.classList.remove("selected");
  });
  clickedButton.classList.add("selected");
}

// starts game with selected options by user
startGameButton.addEventListener("click", () => {
  // changes display of page from menu to game
  siteBody.classList.remove("menu-display");
  siteBody.classList.add("game-display");

  // renders single player or multiplayer footer accordingly
  if (playersCount == 1) {
    gameScreen.classList.add("single-player");
    renderSinglePlayerFooter();
  } else {
    gameScreen.classList.add("multi-player");
    renderMultiPlayerFooter(playersCount);
  }

  // renders grid size 4x4 or 6x6 accordingly
  if (gridSize == "4x4") {
    memoryButtonsSection.classList.add("game-44");
    renderMemoryButtons(16, theme);
  } else {
    memoryButtonsSection.classList.add("game-66");
    renderMemoryButtons(36, theme);
  }

  gameScreen.classList.add(theme);

  // loads main memory game function
  memoryGame();
});

// ===============================================================
// GRID SECTION WITH MEMORY BUTTONS
// ===============================================================

// gets json with icon classes and stores them inside global variable "icons"
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    icons = data;
  });

/**depending on selected grid size and theme renders 4x4 or 6x6 grid size with theme of numbers or icons */
function renderMemoryButtons(gridSizeNumber, selectedTheme) {
  // empty array for 8 or 16 random numbers
  let numberArray = [];

  // creates 8 or 16 random numbers, if there is already same number in numberArray it rerolls that number
  for (let i = 0; i < gridSizeNumber / 2; i++) {
    let randomNumber = Math.floor(Math.random() * 99);
    numberArray.includes(randomNumber) ? (i -= 1) : (numberArray[i] = randomNumber);
  }

  if (selectedTheme == "numbers") {
    // doubles each number by copying itself
    numberArray = numberArray.concat(numberArray);

    arrayRandomizer(numberArray);

    // creates memory buttons - amount depends on grid size
    for (let i = 0; i < gridSizeNumber; i++) {
      const memoryButton = document.createElement("button");
      memoryButton.classList.add("memory-button");
      memoryButton.classList.add("memory-hidden");
      memoryButton.textContent = numberArray[i];

      memoryButtonsSection.appendChild(memoryButton);
    }
  } else {
    let iconArray = [];

    // randomize order of icons stored inside variable "icons"
    arrayRandomizer(icons);

    for (let i = 0; i < numberArray.length; i++) {
      const memoryButton = document.createElement("button");
      memoryButton.classList.add("memory-button");
      memoryButton.classList.add("memory-hidden");

      const memoryNumber = document.createElement("p");
      memoryNumber.textContent = numberArray[i];

      const iconElement = document.createElement("i");
      iconElement.classList.add(icons[i].class1);
      iconElement.classList.add(icons[i].class2);

      memoryButton.appendChild(memoryNumber);
      memoryButton.appendChild(iconElement);
      iconArray.push(memoryButton);
    }

    // doubles each icon by copying itself
    for (let i = 0; i < numberArray.length; i++) {
      iconArray.push(iconArray[i].cloneNode(true));
    }

    arrayRandomizer(iconArray);

    // creates memory buttons - amount depends on grid size
    for (let i = 0; i < gridSizeNumber; i++) {
      memoryButtonsSection.appendChild(iconArray[i]);
    }
  }

  // fake buttons for multiplayer purpose for idling player
  if (gameScreen.classList.contains("multi-player")) {
    const fakeButton1 = document.createElement("button");
    const fakeButton2 = document.createElement("button");
    fakeButton1.id = "fake-btn1";
    fakeButton2.id = "fake-btn2";
    fakeButton1.classList.add("memory-button");
    fakeButton2.classList.add("memory-button");
    fakeButton1.textContent = "1df1";
    fakeButton2.textContent = "22g22";

    memoryButtonsSection.appendChild(fakeButton1);
    memoryButtonsSection.appendChild(fakeButton2);
  }

  /**randomizes number order or icon order inside selected array */
  function arrayRandomizer(array) {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  }
}

// ==================
// MAIN GAME FUNCTION
// ==================

/**main game function for handling events regarding memory buttons and finising the game */
function memoryGame() {
  const memoryButtons = document.querySelectorAll(".memory-button");
  const takenPlayerBoxes = document.querySelectorAll(".player-box.taken");

  let clickedNumber = false;
  let savedMemoryButton1 = "";
  let savedMemoryButton2 = "";
  let totalPairCount = 0;
  let playerIndex = 0;
  let multiSeconds = 0;

  // starts multiplayer timer in multiplayer and identifies global variables for fake buttons
  if (gameScreen.classList.contains("multi-player")) {
    fakeBtn1 = document.getElementById("fake-btn1");
    fakeBtn2 = document.getElementById("fake-btn2");
    multiInterval = setInterval(multiplayerTimer, 1000);
  }

  // displays content of memory button, disables and enables it accordingly
  memoryButtons.forEach((memoryButton) => {
    memoryButton.addEventListener("click", () => {
      memoryButton.classList.remove("memory-hidden");
      memoryButton.classList.add("memory-clicked");
      memoryButton.setAttribute("disabled", "");

      // stores first clicked memory button and 2nd clicked memory button
      if (!clickedNumber) {
        clickedNumber = true;
        savedMemoryButton1 = memoryButton;
      } else {
        clickedNumber = false;
        savedMemoryButton2 = memoryButton;
      }

      // for multiplayer timer
      if (multiSeconds < 6 && gameScreen.classList.contains("multi-player")) {
        multiSeconds = 0;
        playerTime.textContent = multiSeconds + "/5";
      }

      // if first and 2nd memory buttons are different -> disables all buttons so that they can't be clicked for 1 second and then it enables back all hidden memory buttons
      // else adds count to multiplayer found pairs count / single player clicked pair count
      if (savedMemoryButton1.textContent != savedMemoryButton2.textContent && savedMemoryButton2 != "") {
        multiSeconds = 0;
        disableMemoryButtons();

        memoryButtonDelay = setTimeout(() => {
          savedMemoryButton1.classList.add("memory-hidden");
          savedMemoryButton1.classList.remove("memory-clicked");

          savedMemoryButton2.classList.add("memory-hidden");
          savedMemoryButton2.classList.remove("memory-clicked");

          enableMemoryButtons();

          savedMemoryButton1 = "";
          savedMemoryButton2 = "";

          // for single player it only adds move count to player
          // for multiplayer it removes player turn and gives it to next player
          if (gameScreen.classList.contains("single-player")) {
            singleplayerMoveCount.textContent++;
          } else {
            takenPlayerBoxes[playerIndex].classList.remove("active");

            playerIndex + 1 == takenPlayerBoxes.length ? (playerIndex = 0) : playerIndex++;

            takenPlayerBoxes[playerIndex].classList.add("active");
            takenPlayerBoxes[playerIndex].appendChild(currTurnText);
            takenPlayerBoxes[playerIndex].appendChild(multiTimer);

            playerTime.classList.add("active");
            turnLostText.classList.remove("active");
          }
        }, 1000);
      } else if (savedMemoryButton2 != "") {
        if (gameScreen.classList.contains("single-player")) {
          singleplayerMoveCount.textContent++;
        } else {
          multiplayerPairCount[playerIndex].textContent++;
          playersPairsCountObjects[playerIndex].playerPairsCount++;
        }
        totalPairCount++;

        savedMemoryButton1.classList.remove("memory-clicked");
        savedMemoryButton2.classList.remove("memory-clicked");

        savedMemoryButton1 = "";
        savedMemoryButton2 = "";
      }

      // validates if last pair was found to fire up result function
      if (totalPairCount == memoryButtons.length / 2 && gameScreen.classList.contains("single-player")) {
        renderResultScreen();
      } else if (totalPairCount == (memoryButtons.length - 2) / 2 && gameScreen.classList.contains("multi-player")) {
        renderResultScreen();
      }
    });
  });

  /**disables all memory buttons */
  function disableMemoryButtons() {
    memoryButtons.forEach((memoryButton) => {
      memoryButton.setAttribute("disabled", "");
    });
  }

  /**enables all hidden memory buttons and enables fake buttons for multiplayer  */
  function enableMemoryButtons() {
    memoryButtons.forEach((memoryButton) => {
      if (memoryButton.classList.contains("memory-hidden")) memoryButton.removeAttribute("disabled");

      if (gameScreen.classList.contains("multi-player")) {
        fakeBtn1.removeAttribute("disabled");
        fakeBtn2.removeAttribute("disabled");
      }
    });
  }

  /**timer for a player in multiplayer game */
  function multiplayerTimer() {
    playerTime.textContent = multiSeconds + "/5";
    multiSeconds++;

    if (multiSeconds == 6) {
      playerTime.classList.remove("active");
      turnLostText.classList.add("active");

      if (!clickedNumber) {
        fakeBtn1.click();
        fakeBtn2.click();
      } else {
        fakeBtn2.click();
      }
    }
  }
}

// ===============================================================
// SINGLE PLAYER FOOTER
// ===============================================================

/**for rendering single player footer */
function renderSinglePlayerFooter() {
  let minutes = 0;
  let seconds = 0;

  // starts timer for single player
  singleInterval = setInterval(startTimer, 1000);

  /**for counting seconds and minutes in single player game */
  function startTimer() {
    seconds++;

    if (seconds <= 9) singleTimer.textContent = `00:0${seconds}`;
    if (seconds > 9) singleTimer.textContent = `00:${seconds}`;

    if (seconds > 59) {
      minutes++;
      seconds = 0;
      singleTimer.textContent = `0${minutes}:0${seconds}`;
    }
    if (minutes > 9 && seconds < 10) singleTimer.textContent = `${minutes}:0${seconds}`;
    if (minutes > 9 && seconds > 9) singleTimer.textContent = `${minutes}:${seconds}`;
  }
}

// ===============================================================
// MULTIPLAYER FOOTER
// ===============================================================

/**for rendering multiplayer footer */
function renderMultiPlayerFooter() {
  // gives "taken" class to player box for each player in game, and for displaying player number
  for (let i = 0; i < playersCount; i++) {
    playerBoxes[i].style.display = "flex";
    playerBoxes[i].classList.add("taken");
    textMobile[i].classList.add("active");
    textDesktop[i].classList.add("active");
  }
}

// ===============================================================
// RESULT SCREEN
// ===============================================================

/**after completing game, renders result screen, adds "completed" class to site body and game screen and adds "active" class to bg overlay */
function renderResultScreen() {
  gameScreen.classList.add("completed");
  siteBody.classList.add("completed");
  backgroundOverlay.classList.add("active");

  // stops delayed function on main game function
  clearTimeout(memoryButtonDelay);

  // render result screen for single player / multiplayer depending on game setting
  if (gameScreen.classList.contains("single-player")) {
    // stops single player timer
    clearInterval(singleInterval);
    let singleTime = singleTimer.textContent;

    timeResult.textContent = singleTime;
    movesTaken.textContent = `${singleplayerMoveCount.textContent} Moves`;

    singlePlayerResultSection.style.display = "flex";
  } else {
    // stops multiplayer timer
    clearInterval(multiInterval);
    let winnerPlayersArray = [];
    let winnerPlayersText = "";

    getWinnerPlayers();

    winnerPlayersText = winnerPlayersArray.join(", ");

    // selects appropriate text depending if there is one winner or more
    if (winnerPlayersArray.length < 2) {
      multiResultTitle.textContent = `Player ${winnerPlayersText} Wins!`;
    } else {
      winnerPlayersText = `${winnerPlayersText.substring(0, winnerPlayersText.lastIndexOf(","))} and ${winnerPlayersText.substring(winnerPlayersText.lastIndexOf(",") + 1)}`;
      multiResultTitle.textContent = `Players ${winnerPlayersText} Win!`;
    }

    // creates result boxes
    for (let i = 0; i < playersCount; i++) {
      // gives to winner/winners class "winner"
      if (winnerPlayersArray.includes(playersPairsCountObjects[i].player)) multiResultBoxes[i].classList.add("winner");

      multiResultBoxes[i].children[0].textContent = `Player ${playersPairsCountObjects[i].player}`;

      // adds text to winner/winners
      if (multiResultBoxes[i].classList.contains("winner")) multiResultBoxes[i].children[0].textContent += " (Winner!)";

      // selects appropriate text depending if there is one winner or more
      playersPairsCountObjects[i].playerPairsCount == 1 ? (multiResultBoxes[i].children[1].textContent = `${playersPairsCountObjects[i].playerPairsCount} Pair`) : (multiResultBoxes[i].children[1].textContent = `${playersPairsCountObjects[i].playerPairsCount} Pairs`);

      multiResultBoxes[i].style.display = "flex";
    }

    multiPlayerResultSection.style.display = "flex";

    /**sorts all players inside array of player objects from highest to lowest score and pushes winner player number or winner players numbers inside new array */
    function getWinnerPlayers() {
      playersPairsCountObjects.sort((a, b) => (a.playerPairsCount < b.playerPairsCount ? 1 : b.playerPairsCount < a.playerPairsCount ? -1 : 0));

      winnerPlayersArray.push(playersPairsCountObjects[0].player);

      for (let i = 0; i < playersPairsCountObjects.length - 1; i++) {
        if (playersPairsCountObjects[i].playerPairsCount == playersPairsCountObjects[i + 1].playerPairsCount) {
          winnerPlayersArray.push(playersPairsCountObjects[i + 1].player);
        } else {
          return;
        }
      }
    }
  }
}

// ===============================================================
// RESTART AND NEW GAME BUTTONS
// ===============================================================

// gives functionality to restart and new game buttons on header
headerOptionButtons.forEach((headerOptionButton) => {
  headerOptionButton.addEventListener("click", () => {
    siteBody.classList.add("darkened");
    gameScreen.classList.add("darkened");
    confirmationScreen.classList.add("active");
    backgroundOverlay.classList.add("active");

    // selects appropriate text depending which button was clicked
    if (headerOptionButton.textContent == "Restart") {
      confirmationDetail.textContent = "Are you sure you want to restart game?";
      optionText = "restart";
    } else {
      confirmationDetail.textContent = "Are you sure you want to start a new game?";
      optionText = "new-game";
    }
  });
});

// gives functionality to confirm button
confirmButton.addEventListener("click", () => {
  gameReset(optionText);
  confirmationScreen.classList.remove("active");
});

// gives functionality to decline button
declineButton.addEventListener("click", () => {
  siteBody.classList.remove("darkened");
  gameScreen.classList.remove("darkened");
  confirmationScreen.classList.remove("active");
  backgroundOverlay.classList.remove("active");
  gameMenuButtons.classList.remove("active");
  mobileMenuButton.classList.add("active");
});

resultOptionButtons.forEach((resultOptionButton) => {
  resultOptionButton.addEventListener("click", () => {
    siteBody.classList.remove("completed");
    gameScreen.classList.remove("completed");

    gameReset(resultOptionButton.textContent.toLocaleLowerCase());
  });
});

/**depending which button is clicked (restart or new game) acts accordingly */
function gameReset(resetOption) {
  if (resetOption == "restart") {
    completedGameReset();
    variableReset();
    startGameButton.click();
  } else {
    if (gameScreen.classList.contains("multi-player")) {
      playerBoxes.forEach((playerBox) => {
        playerBox.style.display = "none";
      });

      multiResultBoxes.forEach((multiResultBox) => {
        multiResultBox.style.display = "none";
      });
    }
    completedGameReset();
    variableReset();

    siteBody.classList.remove("game-display");
    siteBody.classList.add("menu-display");
    gameScreen.classList.remove("single-player");
    gameScreen.classList.remove("multi-player");
    memoryButtonsSection.classList.remove("game-44");
    memoryButtonsSection.classList.remove("game-66");
    gameScreen.classList.remove(theme);
  }
}

/**resets variables*/
function variableReset() {
  playersPairsCountObjects = [
    {
      player: 1,
      playerPairsCount: 0,
    },
    {
      player: 2,
      playerPairsCount: 0,
    },
    {
      player: 3,
      playerPairsCount: 0,
    },
    {
      player: 4,
      playerPairsCount: 0,
    },
  ];
}

/**resets everyting */
function completedGameReset() {
  gameMenuButtons.classList.remove("active");
  mobileMenuButton.classList.add("active");
  clearTimeout(memoryButtonDelay);

  if (siteBody.classList.contains("completed")) {
    siteBody.classList.remove("completed");
    gameScreen.classList.remove("completed");
  } else {
    confirmationScreen.classList.remove("active");
    backgroundOverlay.classList.remove("active");
    siteBody.classList.remove("darkened");
    gameScreen.classList.remove("darkened");
  }

  if (gameScreen.classList.contains("multi-player")) {
    clearInterval(multiInterval);
    multiSeconds = 0;
    playerTime.textContent = multiSeconds + "/5";
    playerBoxes.forEach((playerBox) => {
      playerBox.classList.remove("active");
      playerBox.classList.remove("taken");
    });

    multiResultBoxes.forEach((multiResultBox) => {
      multiResultBox.classList.remove("winner");
    });

    multiplayerPairCount.forEach((multiplayerPair) => {
      multiplayerPair.textContent = 0;
    });

    playerBoxes[0].classList.add("active");
    playerBoxes[0].appendChild(currTurnText);
    playerBoxes[0].appendChild(multiTimer);

    multiPlayerResultSection.style.display = "none";
  } else {
    clearInterval(singleInterval);
    singleTimer.textContent = "00:00";
    singleplayerMoveCount.textContent = 0;

    singlePlayerResultSection.style.display = "none";
  }
  memoryButtonsSection.innerHTML = "";
}

// click anywhere to close confirmation page with yes and no buttons
document.onclick = function (e) {
  if (e.target == backgroundOverlay && !siteBody.classList.contains("completed")) declineButton.click();
};

// ===============================================================
// MOBILE MENU BUTTON
// ===============================================================

// adds functionality to mobile menu button
mobileMenuButton.addEventListener("click", () => {
  mobileMenuButton.classList.remove("active");
  gameMenuButtons.classList.add("active");
});

// adds functionality to mobile cancel button
cancelButton.addEventListener("click", () => {
  mobileMenuButton.classList.add("active");
  gameMenuButtons.classList.remove("active");
});
