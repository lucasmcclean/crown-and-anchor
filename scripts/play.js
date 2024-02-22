"use strict";

const transitionTime = 0.5;
const confirmBets = document.getElementById("confirm-bets");
const faces = Array.from(document.getElementsByClassName("face"));
const faceBets = Array.from(document.getElementsByClassName("bets"));
const bankDisplay = document.getElementById("bank-display");
const displayDice = Array.from(document.getElementsByClassName("die"));
const betAmountDisplay = document.getElementById("bet-amt");
const faceSVG = new Map([
  ["heart", "./images/card-icons/heart.svg"],
  ["crown", "./images/card-icons/crown.svg"],
  ["diamond", "./images/card-icons/diamond.svg"],
  ["spade", "./images/card-icons/spade.svg"],
  ["anchor", "./images/card-icons/anchor.svg"],
  ["club", "./images/card-icons/club.svg"],
]);

let bets;
if (localStorage.getItem("betsMap")) {
  bets = new Map(JSON.parse(localStorage.getItem("betsMap")));
} else {
  bets = new Map([
    ["heart", 0],
    ["crown", 0],
    ["diamond", 0],
    ["spade", 0],
    ["anchor", 0],
    ["club", 0],
  ]);
}
// Used in converting numeric index to key
const numToFaces = [...bets.keys()];
let bank;
if (localStorage.getItem("bankNum")) {
  bank = JSON.parse(localStorage.getItem("bankNum"));
} else {
  bank = 500;
}
let betAmount;
if (localStorage.getItem("betAmountNum")) {
  betAmount = JSON.parse(localStorage.getItem("betAmountNum"));
} else {
  betAmount = 5;
}

// Used for locking play during animations
let playLocked = false;

/* -----Execution----- */
syncVisuals();
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

bankDisplay.innerText = bank;
confirmBets.addEventListener("click", () => calculateWinnings());
faces.forEach((face) => {
  face.addEventListener("click", () => placeBet(face.id));
});

document
  .getElementById("inc-bet-amt")
  .addEventListener("click", () => adjustBetAmount(true));
document
  .getElementById("dec-bet-amt")
  .addEventListener("click", () => adjustBetAmount(false));

// Make top left corner functionally a back button
Array.from(document.getElementsByClassName("back-button")).forEach((part) =>
  part.addEventListener("click", () => redirectTransition("./play.html"))
);

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
function updateBetHTML(oldVal, face) {
  for (let i = oldVal; i < bets.get(face); i += 5) {
    // Styled in play.css / .bet-tick
    faceBets[
      numToFaces.indexOf(face)
    ].innerHTML += `<div class="bet-tick"></div>`;
  }
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
  let winningFaces = [];
  dice.forEach((roll) => {
    displayDice[i].innerHTML = `<img class="die-face" src="${faceSVG.get(
      roll
    )}" draggable="false" />`;
    i++;
    if (bets.get(roll)) {
      winningFaces.push(roll);
      winnings += bets.get(roll);
    }
  });
  visualizeWinnings(winningFaces);
  for (const bet of bets.keys()) bets.set(bet, 0);
  localStorage.setItem("betsMap", JSON.stringify(Array.from(bets.entries())));
  bank += winnings;
  bankDisplay.innerText = bank;
  localStorage.setItem("bankNum", bank);
  return winnings;
}

// Updates visuals to reflect which faces won
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
  }, 1000);
}

// Places bet and update tick for passed face
function placeBet(face) {
  if (playLocked) return;
  // Bet limit of two rows equates to 60 ticks
  if (bets.get(face) >= 5 * 60) return;
  if (bank < betAmount) {
    alert("Your bank is empty. You can't place anymore bets.");
    return;
  }
  let oldAmount = bets.get(face);
  bets.set(face, bets.get(face) + betAmount);
  localStorage.setItem("betsMap", JSON.stringify(Array.from(bets.entries())));
  bank -= betAmount;
  localStorage.setItem("bankNum", bank);
  bankDisplay.innerText = bank;
  updateBetHTML(oldAmount, face);
}

function adjustBetAmount(isIncrease) {
  if (isIncrease && betAmount < 100) {
    betAmount += 5;
  } else if (!isIncrease && betAmount > 5) {
    betAmount -= 5;
  } else {
    isIncrease ? (betAmount = 5) : (betAmount = 100);
  }
  betAmountDisplay.innerText = betAmount;
  localStorage.setItem("betAmountNum", betAmount);
}

function syncVisuals() {
  betAmountDisplay.innerText = betAmount;
  bankDisplay.innerText = bank;
  [...bets.keys()].forEach((face) => {
    if (bets.get(face) !== 0) updateBetHTML(0, face);
  });
}

function redirectTransition(newPage) {
  document.body.style.setProperty(
    "animation",
    `${transitionTime}s ease-in forwards fade-out`
  );
  window.location.href = newPage;
}
