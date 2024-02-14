"use strict";

const confirmBets = document.getElementById("confirm-bets");
const faces = Array.from(document.getElementsByClassName("face"));

const bets = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};

const bank = 50;

const rollDice = (numDice) => {
  let rolls = [];
  for (let i = 0; i < numDice; i++) {
    rolls.push(Math.trunc(Math.random() * 6 + 1));
  }
  return rolls;
};

const calculateWinnings = () => {
  let dice = rollDice(3);
  let winnings = 0;
  dice.forEach((roll) => {
    if (bets[roll]) winnings += bets[roll];
  });
  for (let bet in bets) {
    bets[bet] = 0;
  }
  return winnings;
};

const placeBet = (face) => {
  switch (face) {
    case "heart":
      bets[0] += 5;
      break;
    case "crown":
      bets[1] += 5;
      break;
    case "diamond":
      bets[2] += 5;
      break;
    case "spade":
      bets[3] += 5;
      break;
    case "anchor":
      bets[4] += 5;
      break;
    case "club":
      bets[5] += 5;
      break;
  }
};

/* -----Execution----- */
confirmBets.addEventListener("click", () => calculateWinnings());
faces.forEach((face) => {
  face.addEventListener("click", () => placeBet(face.id));
});
