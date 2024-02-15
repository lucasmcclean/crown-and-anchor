"use strict";

const confirmBets = document.getElementById("confirm-bets");
const faces = Array.from(document.getElementsByClassName("face"));
const faceBets = Array.from(document.getElementsByClassName("bets"));
const bankDisplay = document.getElementById("bank-display");

const bets = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};

// Convert String face to hash identifier for bets
const faceToNum = (face) => {
  switch (face) {
    case "heart":
      return 0;
    case "crown":
      return 1;
    case "diamond":
      return 2;
    case "spade":
      return 3;
    case "anchor":
      return 4;
    case "club":
      return 5;
    default:
      throw new Error(`Error: play.js/faceToNum\nInvalid argument: ${face}`);
  }
};

let bank = 50;

// Roll dice returning numDice values between 1 and 6
const rollDice = (numDice) => {
  let rolls = [];
  for (let i = 0; i < numDice; i++) {
    rolls.push(Math.trunc(Math.random() * 6 + 1));
  }
  return rolls;
};

// Update passed face to include an additional bet tick
const updateBetHTML = (face) => {
  const faceIdx = faceToNum(face);
  // Styled in play.css / .bet-tick
  faceBets[faceIdx].innerHTML += `<div class="bet-tick"></div>`;
};

// Wipes all bet ticks from faces
const clearBetHTML = () => {
  for (let i = 0; i < faceBets.length; i++) {
    faceBets[i].innerHTML = "";
  }
};

// Roll dice and calculate winnings based on placed bets
const calculateWinnings = () => {
  let dice = rollDice(3);
  let winnings = 0;
  dice.forEach((roll) => {
    if (bets[roll]) winnings += bets[roll];
  });
  for (let bet in bets) {
    bets[bet] = 0;
  }
  bank += winnings;
  bankDisplay.innerText = `${bank}`;
  clearBetHTML();
  return winnings;
};

// Places bet and update tick for passed face
const placeBet = (face) => {
  if (bank < 5) {
    alert("Your bank is empty. You can't place anymore bets.");
    return;
  }
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
    default:
      throw new Error(`Error: play.js/placeBet\nInvalid argument: ${face}`);
  }
  bank -= 5;
  bankDisplay.innerText = `${bank}`;
  updateBetHTML(face);
};

/* -----Execution----- */
bankDisplay.innerText = `${bank}`;
confirmBets.addEventListener("click", () => calculateWinnings());
faces.forEach((face) => {
  face.addEventListener("click", () => placeBet(face.id));
});
