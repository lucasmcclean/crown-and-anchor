"use strict";

/* -----Variables----- */
const confirmBets = document.getElementById("confirm-bets");
const faces = Array.from(document.getElementsByClassName("face"));
const faceBets = Array.from(document.getElementsByClassName("bets"));
const bankDisplay = document.getElementById("bank-display");

const bets = new Map([
  ["heart", 0],
  ["crown", 0],
  ["diamond", 0],
  ["spade", 0],
  ["anchor", 0],
  ["club", 0],
]);
// Used in converting numeric index to key
const numToFaces = [...bets.keys()];

let bank = 50;

let betAmount = 5;

/* -----Execution----- */
bankDisplay.innerText = `${bank}`;
confirmBets.addEventListener("click", () => calculateWinnings());
faces.forEach((face) => {
  face.addEventListener("click", () => placeBet(face.id));
});

/* -----Functions----- */
// Roll dice returning numDice values between 1 and 6
function rollDice(numDice) {
  let rolls = [];
  for (let i = 0; i < numDice; i++) {
    rolls.push(numToFaces[Math.trunc(Math.random() * 6)]);
  }
  return rolls;
}

// Update passed face to include an additional bet tick
function updateBetHTML(face) {
  // Styled in play.css / .bet-tick
  faceBets[
    numToFaces.indexOf(face)
  ].innerHTML += `<div class="bet-tick"></div>`;
}

// Wipes all bet ticks from faces
function clearBetHTML() {
  for (let i = 0; i < faceBets.length; i++) {
    faceBets[i].innerHTML = "";
  }
}

// Roll dice and calculate winnings based on placed bets
function calculateWinnings() {
  const dice = rollDice(3);
  let winnings = 0;
  dice.forEach((roll) => {
    if (bets.get(roll)) winnings += bets.get(roll);
  });
  for (const bet of bets.keys()) bets.set(bet, 0);
  bank += winnings;
  bankDisplay.innerText = `${bank}`;
  clearBetHTML();
  return winnings;
}

// Places bet and update tick for passed face
function placeBet(face) {
  if (bank < betAmount) {
    alert("Your bank is empty. You can't place anymore bets.");
    return;
  }
  bets.set(face, bets.get(face) + betAmount);
  bank -= betAmount;
  bankDisplay.innerText = `${bank}`;
  updateBetHTML(face);
}
