"use strict";

const transitionTime = 0.5;
let darkMode = true;

/* -----Execution----- */
document.body.style.setProperty(
  "animation",
  `${transitionTime}s ease-in forwards fade-in`
);

document.getElementById("light-dark-btn").addEventListener("click", () => {
  if (darkMode) {
    document.documentElement.style.setProperty("--clr-primary", "#0a0b0b");
    document.documentElement.style.setProperty("--clr-base", "#eae6ef");
    document.documentElement.style.setProperty("--clr-secondary", "#554e5b");
    darkMode = false;
  } else {
    document.documentElement.style.setProperty("--clr-primary", "#eae6ef");
    document.documentElement.style.setProperty("--clr-base", "#0a0b0b");
    document.documentElement.style.setProperty("--clr-secondary", "#150e1b");
    darkMode = true;
  }
});

document.getElementById("reset-btn").addEventListener("click", () => {
  localStorage.clear();
});
