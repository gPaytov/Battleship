import { gameboardFactory, playerFactory } from "./script";
import "./style.css";

const createNewPlayerGameboard = (
  missedAttacks,
  successfulAttacks,
  shipLocations
) => {
  const container = document.querySelector("#playerGameboard");

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      let obj = document.createElement("div");
      obj.classList.add("cube");
      obj.classList.add(`${x}:${y}`);
      if (missedAttacks.some((e) => e.x === x && e.y === y)) {
        obj.style.backgroundColor = "gray";
      } else if (successfulAttacks.some((e) => e.x === x && e.y === y)) {
        obj.style.backgroundColor = "red";
      } else if (shipLocations.some((e) => e.x === x && e.y === y)) {
        obj.style.backgroundColor = "green";
      }
    
      container.appendChild(obj);
    }
  }
};
const createNewOpponentGameboard = (opponent, gameboard) => {
  const container = document.querySelector("#opponentGameboard");
  const containerPlayer = document.querySelector("#playerGameboard");

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      let obj = document.createElement("div");
      obj.classList.add("cube");
      obj.classList.add(`${x}:${y}`);
      if (gameboard.missedAttacks().some((e) => e.x === x && e.y === y)) {
        obj.style.backgroundColor = "gray";
      } else if (
        gameboard.successfulAttacks().some((e) => e.x === x && e.y === y)
      ) {
        obj.style.backgroundColor = "red";
      } else {
        obj.addEventListener("click", function (event) {
          const coordinates = event.target.classList[1].split(":");
          opponent.playerReceiveAttack(coordinates[0], coordinates[1]);
          container.innerHTML = "";
          createNewOpponentGameboard(opponent, gameboard);
          if (opponent.playerLoss()) {
            alert("Opponent has lost");
          } else {
            opponent.computerAttack();
            containerPlayer.innerHTML = "";
            createNewPlayerGameboard(
              opponent.getMissedAttacks(),
              opponent.getSuccessfulAttacks(),
              opponent.otherPlayerShipLocations()
            );

            if (opponent.otherPlayerLoss()) {
              alert("You lose");
            }
          }
        });
      }
      container.appendChild(obj);
    }
  }
};
let playerGameboard1 = gameboardFactory();
let playerGameboard2 = gameboardFactory();
playerGameboard1.randomGameboard();
playerGameboard2.randomGameboard();
let player1 = playerFactory(playerGameboard1, playerGameboard2);
let player2 = playerFactory(playerGameboard2, playerGameboard1, true);
createNewPlayerGameboard([], [], []);
createNewOpponentGameboard(player2, playerGameboard2);
const cubes = document.querySelector(".cube");
