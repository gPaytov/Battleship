import {shipFactory, gameboardFactory, playerFactory } from "./script";

let ship = shipFactory(3);
let ship2 = shipFactory(2);
ship.hit(0);
ship.hit(2);
ship.hit(1);
ship2.hit(1);
test('Gets length', () => {
  expect(ship.getLength()).toBe(3);
});
test('Gets hit positions', () => {
  expect(ship.hitPositions()).toEqual([0,1,2]);
});
test('Sunk test 1', () => {
  expect(ship.isSunk()).toBe(true);
});
test('Memory leak', () => {
  expect(ship2.hitPositions()).toEqual([1]);
});
test('Sunk test 2', () => {
  expect(ship2.isSunk()).toBe(false);
});
let gameboard = gameboardFactory();
let gameboard2 = gameboardFactory();
let gameboard3 = gameboardFactory();
gameboard3.placeShip(0,2,false,2);

gameboard.placeShip(2,4,true,1);
gameboard2.placeShip(2,4,false,2);
gameboard.receiveAttack(3,4);
gameboard2.receiveAttack(2,4);
test('Ship placement', () => {
  expect(gameboard3.placeShip(2,3, true,1)).toBe(false);
});
test('Ship placement 2', () => {
  expect(gameboard3.placeShip(2,4, true,1)).toBe(true);
});
test('Ship placement 3', () => {
  expect(gameboard3.placeShip(3,2, true,2)).toBe(false);
});
test('Receive attack misss', () => {
  expect(gameboard.receiveAttack(3,3)).toBe(false);
});
test('Receive attack hit', () => {
  expect(gameboard.receiveAttack(2,4)).toBe(true);
});
test('Missed coordinates', () => {
  expect(gameboard.missedAttacks()).toEqual([{x:3,y:3},{x:3,y:4}]);
});
test('Missed coordinates - none missed', () => {
  expect(gameboard2.missedAttacks()).toEqual([]);
});
test('Sunken ships all', () => {
  expect(gameboard.allShipsSunk()).toBe(true);
});
test('Sunken ships not all', () => {
  expect(gameboard2.allShipsSunk()).toBe(false);
});
test('Hit coordinates', () => {
  expect(gameboard2.successfulAttacks()).toEqual([{x:2,y:4}]);
});
let playerGameboard1 = gameboardFactory();
let playerGameboard2 = gameboardFactory();
playerGameboard2.placeShip(2,4,false,2);
let player1 = playerFactory(playerGameboard1,playerGameboard2);
let player2 = playerFactory(playerGameboard2,playerGameboard1, true);
player1.playerAttack(2,4);
test('Computer attack', () => {
  expect(player2.computerAttack()).toBe(false);
});
test('Player attack', () => {
  expect(player1.playerAttack(3,4)).toBe(true);
});
test('Player loss', () => {
  expect(player2.playerLoss()).toBe(true);
});

