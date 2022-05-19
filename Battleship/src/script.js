const shipFactory = (length) => {
  const createShip = (length) => {
    let arr = [];
    for (let i = 0; i < length; i++) {
      arr.push(".");
    }
    return arr;
  };

  let ship = createShip(length);

  const getLength = () => {
    return length;
  };
  const hit = (number) => {
    ship[number] = "x";
  };

  const hitPositions = () => {
    let arr = [];
    for (let i = 0; i < length; i++) {
      if (ship[i] == "x") {
        arr.push(i);
      }
    }
    return arr;
  };
  function isSunk() {
    if (hitPositions().length == length) {
      return true;
    }
    return false;
  }
  return { getLength, hit, isSunk, hitPositions };
};
const gameboardFactory = () => {
  let gameboard = [[], [], [], [], [], [], [], [], [], []];
  let shipNum = 0;
  let sunkenShips = 0;
  const checkAroundSquare = (x, y) => {
    if (x >= 10 || y >= 10) {
      return false;
    }
    if (typeof gameboard[x][y] == "object") {
      return false;
    } else if (x > 0 && y > 0 && typeof gameboard[x - 1][y - 1] == "object") {
      return false;
    } else if (x > 0 && typeof gameboard[x - 1][y] == "object") {
      return false;
    } else if (y > 0 && typeof gameboard[x][y - 1] == "object") {
      return false;
    } else if (x > 0 && y < 9 && typeof gameboard[x - 1][y + 1] == "object") {
      return false;
    } else if (y > 0 && x < 9 && typeof gameboard[x + 1][y - 1] == "object") {
      return false;
    } else if (x < 9 && y < 9 && typeof gameboard[x + 1][y + 1] == "object") {
      return false;
    } else if (x < 9 && typeof gameboard[x + 1][y] == "object") {
      return false;
    } else if (y < 9 && typeof gameboard[x][y + 1] == "object") {
      return false;
    }
    return true;
  };
  const checkShipPosition = (x, y, facingDown, size) => {
    for (let i = 0; i < size; i++) {
      if (!checkAroundSquare(x, y)) {
        return false;
      }
      if (facingDown) {
        y++;
      } else {
        x++;
      }
    }
    return true;
  };
  const placeShip = (x, y, facingDown, size) => {
    if (!checkShipPosition(x, y, facingDown, size)) {
      return false;
    }
    shipNum++;
    let ship = shipFactory(size);
    for (let i = 0; i < size; i++) {
      gameboard[x][y] = { ship: ship, hit: i, facingDown: facingDown };
      if (facingDown) {
        y++;
      } else {
        x++;
      }
    }
    return true;
  };
  const randomBool = () => {
    if (Math.random() > 0.5) {
      return true;
    } else {
      return false;
    }
  };
  //I think this is the last thing you gotta do
  const randomGameboard = () => {
    for (let i = 4; i > 0; i--) {
      for (let y = 0; y < 5 - i; y++) {
        while (
          !placeShip(
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            randomBool(),
            i
          )
        );
      }
    }
  };
  const receiveAttack = (x, y) => {
    let spot = gameboard[x][y];
    //kinda think spot!='m' is unnecessary but i'm not about to remove it
    //since it the missed ones shouldn't be available to click
    if (spot != undefined && spot != "m" && spot != "x") {
      spot.ship.hit(spot.hit);
      if (spot.ship.isSunk()) {
        sunkenShips++;
      }
      gameboard[x][y] = "x";
      return true;
    } else if (spot == undefined) {
      gameboard[x][y] = "m";
      return false;
    }
    return "invalid";
  };
  const allShipsSunk = () => {
    if (sunkenShips == shipNum) {
      return true;
    }
    return false;
  };
  const missedAttacks = () => {
    let missedCoordinates = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        if (gameboard[x][y] == "m") {
          missedCoordinates.push({ x: x, y: y });
        }
      }
    }
    return missedCoordinates;
  };
  const successfulAttacks = () => {
    let successfulCoordinates = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        if (gameboard[x][y] == "x") {
          successfulCoordinates.push({ x: x, y: y });
        }
      }
    }
    return successfulCoordinates;
  };
  const shipLocations = () => {
    let successfulCoordinates = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        if (typeof gameboard[x][y] == "object") {
          successfulCoordinates.push({ x: x, y: y });
        }
      }
    }
    return successfulCoordinates;
  };
  return {
    placeShip,
    receiveAttack,
    allShipsSunk,
    missedAttacks,
    successfulAttacks,
    randomGameboard,
    shipLocations,
  };
};
const playerFactory = (playerGameboard, enemyGameboard, computer = false) => {
  const playerLoss = () => {
    return playerGameboard.allShipsSunk();
  };

  const playerAttack = (x, y) => {
    return enemyGameboard.receiveAttack(x, y);
  };
  const playerReceiveAttack = (x, y) => {
    return playerGameboard.receiveAttack(x, y);
  };

  if (computer) {
    const createPossibleMoves = () => {
      let arr = [];
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          arr.push({ x, y });
        }
      }
      return arr;
    };
    let possibleMoves = createPossibleMoves();

    const generateNumber = () => {
      return Math.floor(Math.random() * possibleMoves.length);
    };
    const computerAttack = () => {
      let num = generateNumber();
      let attack = possibleMoves[num];
      let x = attack.x;
      let y = attack.y;
      possibleMoves.splice(num, 1);
      return playerAttack(x, y);
    };
    const getMissedAttacks = () => {
      return enemyGameboard.missedAttacks();
    };
    const getSuccessfulAttacks = () => {
      return enemyGameboard.successfulAttacks();
    };
    const otherPlayerLoss = () => {
      return enemyGameboard.allShipsSunk();
    };
    const otherPlayerShipLocations = () => {
      return enemyGameboard.shipLocations();
    };

    return {
      playerLoss,
      computerAttack,
      playerReceiveAttack,
      getSuccessfulAttacks,
      getMissedAttacks,
      otherPlayerLoss,
      otherPlayerShipLocations,
    };
  }
  return { playerLoss, playerAttack, playerReceiveAttack };
};

export { shipFactory, gameboardFactory, playerFactory };
