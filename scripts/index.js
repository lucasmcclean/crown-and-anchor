"use strict";

document
  .getElementById("play-btn")
  .addEventListener("click", () => redirectTransition("./play.html"));

document
  .getElementById("about-btn")
  .addEventListener("click", () => redirectTransition("./about.html"));

const transitionTime = 0.7;

function redirectTransition(newPage) {
  document
    .getElementById("main")
    .style.setProperty(
      "animation",
      `${transitionTime}s linear forwards transition-page`
    );
  setTimeout(() => (window.location.href = newPage), transitionTime * 1000);
}
