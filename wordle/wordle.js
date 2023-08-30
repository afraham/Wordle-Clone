let startOver = document.getElementById("startover");
let dictionary;
async function getDict() {
  startOver.textContent = "Loading...";
  startOver.disabled = true;
  try {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
      headers: {
        "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
      },
    });
    const json = await res.json();
    dictionary = json.dictionary;
    startOver.textContent = "Start Over";
    startOver.disabled = false;
    pickWord();
  } catch (error) {
    // error happens, another text for the buttons
    startOver.textContent = "Something happened... Refresh please!";
  }
}

// choosing random word
let word;
let index;
function pickWord() {
  index = Number.parseInt(Math.random() * dictionary.length);
  word = dictionary[index].word;
  word = word.toUpperCase();
}

// user typing inside of the table
let userInput = [];
let row = 0;
let column = 0;
const rows = document.querySelectorAll("tr");
document.addEventListener("keyup", (event) => {
  const letter = event.key.toUpperCase();
  if (/^[A-Z]$/.test(letter) && userInput.length < 4) {
    userInput.push(letter);
    rows[row].querySelectorAll("td")[column].textContent = letter;
    column++;
  } else if (event.key === "Backspace" && column > 0) {
    column--;
    userInput.pop();
    rows[row].querySelectorAll("td")[column].textContent = "";
  } else if (event.key === "Enter" && userInput.length === 4) {
    const userWord = userInput.join("");
    testWord(userWord, row);
    userInput = [];
    if (checkAnswer(rows[row])) {
      congratsDisplay();
    } else if (row === 3) {
      let tempHint = document.querySelector("#hiddenhint");
      if (!tempHint.classList.contains("hidden")) {
        hiddenhint.classList.toggle("hidden");
      }
      document.getElementById("failmessage").textContent = word;
      document.getElementById("failmessage").classList.toggle("hidden");
    } else {
      row++;
      column = 0;
    }
  } else if (event.key === "Enter") {
    alert("Make sure the word is 4-letters long!\nTry again :)");
  }
});

// checks if the rows are all green, returns boolean
function checkAnswer(tr) {
  if (!tr) {
    return false;
  }
  const tds = tr.getElementsByTagName("td");
  let allGreen = true;
  for (let i = 0; i < tds.length; i++) {
    const td = tds[i];
    const bgColor = td.style.backgroundColor;
    if (bgColor !== "rgb(56, 118, 29)") {
      // if one element != green, return false
      allGreen = false;
      break;
    } else {
      continue;
    }
  }
  return allGreen; // if all elements == green, return true
}

// compares the words, and colours accordingly
function testWord(userWord, rowNum) {
  let row = document.querySelectorAll("table tr")[rowNum];
  let cells = row.querySelectorAll("td");
  cells.forEach((cell, index) => {
    let userChar = userWord.charAt(index);
    let dictChar = word.charAt(index);
    if (userChar === dictChar) {
      // if letter (by user) same place as the randomized letter, color green
      cell.style.backgroundColor = "rgb(56, 118, 29)";
    } else if (word.includes(userChar)) {
      // if letter (by user) in the randomized letter, but not right place, color yellow
      cell.style.backgroundColor = "rgb(191, 144, 0)";
    } else {
      // else, color gray
      cell.style.backgroundColor = "rgb(128, 128, 128)";
    }
  });
}

// congrats display toggles
let congratsmessage = document.getElementById("congratsmessage");
let congratsgif = document.getElementById("congratsgif");
let tablehide = document.getElementById("gameboard-table");
function congratsDisplay() {
  let tempHint = document.querySelector("#hiddenhint");
  if (!tempHint.classList.contains("hidden")) {
    hiddenhint.classList.toggle("hidden");
  }
  tablehide.classList.toggle("hidden");
  congratsmessage.classList.toggle("hidden");
  congratsgif.classList.toggle("hidden");
  congratsmessage.textContent = word;
}

// dark mode toggles
const body = document.body;
darkmode.addEventListener("click", () => {
  body.classList.toggle("dark-body");
  darkmode.classList.toggle("dark-button");
  hint.classList.toggle("dark-button");
  instructions.classList.toggle("dark-button");
});

// instruction box toggles
const instructions = document.getElementById("instructions");
const hiddenInstruct = document.getElementById("instructbox");
instructions.addEventListener("click", () => {
  hiddenInstruct.classList.toggle("hidden");
});

// hint toggles
const hint = document.getElementById("hint");
const hiddenhint = document.querySelector("#hiddenhint");
function displayHint() {
  hiddenhint.textContent = dictionary[index].hint;
  hiddenhint.classList.toggle("hidden");
}
hint.addEventListener("click", () => {
  displayHint();
});

// functionality for the start over button
function resetGame() {
  startOver.addEventListener("click", () => {
    // hide the hint, if showing
    if (!hiddenhint.classList.contains("hidden")) {
      hiddenhint.classList.toggle("hidden");
    }
    // hide the fail message, if showing
    let tempFail = document.querySelector("#failmessage");
    if (!tempFail.classList.contains("hidden")) {
      failmessage.classList.toggle("hidden");
    }
    // hide the congrats message, if showing
    let tempCongrats = document.querySelector("#congratsgif");
    if (!tempCongrats.classList.contains("hidden")) {
      tablehide.classList.toggle("hidden");
      congratsmessage.classList.toggle("hidden");
      congratsgif.classList.toggle("hidden");
    }
    // clearing the table, and starting inputs from the top right corner
    document.querySelectorAll("td").forEach((cell) => {
      cell.innerText = "";
      cell.style.backgroundColor = "";
    });
    column = 0;
    row = 0;
    userInput = [];
    pickWord();
  });
}

getDict();
