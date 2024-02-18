"use strict";

const transitionTime = 0.5;
const confirmBets = document.getElementById("confirm-bets");
const faces = Array.from(document.getElementsByClassName("face"));
const faceBets = Array.from(document.getElementsByClassName("bets"));
const bankDisplay = document.getElementById("bank-display");
const displayDice = Array.from(document.getElementsByClassName("die"));
const faceSVG = new Map([
  ["heart", "./images/card-icons/heart.svg"],
  ["crown", "./images/card-icons/crown.svg"],
  ["diamond", "./images/card-icons/diamond.svg"],
  ["spade", "./images/card-icons/spade.svg"],
  ["anchor", "./images/card-icons/anchor.svg"],
  ["club", "./images/card-icons/club.svg"],
]);

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

// Used for locking play during animations
let playLocked = false;

/* -----Execution----- */
document.body.style.setProperty(
  "animation",
  `${transitionTime}s ease-in forwards fade-in`
);

(function () {
  let i = 0;
  rollDice(3).forEach((roll) => {
    displayDice[i].innerHTML = `<img class="die-face" src="${faceSVG.get(
      roll
    )}" draggable="false" />`;
    i++;
  });
})();

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
  if (playLocked) return;
  const dice = rollDice(3);
  let winnings = 0;
  let i = 0;
  dice.forEach((roll) => {
    displayDice[i].innerHTML = `<img class="die-face" src="${faceSVG.get(
      roll
    )}" draggable="false" />`;
    i++;
    if (bets.get(roll)) winnings += bets.get(roll);
  });
  visualizeWinnings(dice);
  for (const bet of bets.keys()) bets.set(bet, 0);
  bank += winnings;
  bankDisplay.innerText = `${bank}`;
  return winnings;
}

function visualizeWinnings(faces) {
  playLocked = true;
  const faceItems = [];
  for (const face of faces) faceItems.push(document.getElementById(face));
  faceItems.forEach((face) => face.style.setProperty("filter", "sepia(1)"));
  faceBets.forEach((bets) => bets.style.setProperty("opacity", "0"));
  setTimeout(() => {
    clearBetHTML();
    faceItems.forEach((face) => face.style.setProperty("filter", "sepia(0)"));
    faceBets.forEach((bets) => bets.style.setProperty("opacity", "1"));
    playLocked = false;
  }, 2000);
}

// Places bet and update tick for passed face
function placeBet(face) {
  if (playLocked) return;
  if (bank < betAmount) {
    alert("Your bank is empty. You can't place anymore bets.");
    return;
  }
  bets.set(face, bets.get(face) + betAmount);
  bank -= betAmount;
  bankDisplay.innerText = `${bank}`;
  updateBetHTML(face);
}
