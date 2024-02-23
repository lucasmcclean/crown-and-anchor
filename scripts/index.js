"use strict";

const transitionTime = 0.5;

/* -----Execution----- */
document.body.style.setProperty(
  "animation",
  `${transitionTime}s ease-in forwards fade-in`
);
document
  .getElementById("play-btn")
  .addEventListener("click", () => redirectTransition("./play.html"));

document
  .getElementById("about-btn")
  .addEventListener("click", () => redirectTransition("./about.html"));

document
  .getElementById("settings-btn")
  .addEventListener("click", () => redirectTransition("./settings.html"));

/*-----Functions----- */
function redirectTransition(newPage) {
  document.body.style.setProperty(
    "animation",
    `${transitionTime}s ease-in forwards fade-out`
  );
  window.location.href = newPage;
}
