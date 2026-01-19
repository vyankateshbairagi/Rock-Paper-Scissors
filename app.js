// Game State Management
const gameState = {
  userScore: 0,
  aiScore: 0,
  userChoice: null,
  aiChoice: null,
  gameInProgress: false,
};

// Game choices configuration
const choices = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

// DOM Elements
const choiceButtons = document.querySelectorAll(".choice-btn");
const playerDisplay = document.getElementById("playerDisplay");
const aiDisplay = document.getElementById("aiDisplay");
const resultContainer = document.getElementById("resultContainer");
const countdownEl = document.getElementById("countdown");
const resultText = document.getElementById("resultText");
const resultDetails = document.getElementById("resultDetails");
const resetBtn = document.getElementById("resetBtn");
const userScoreEl = document.getElementById("userScore");
const aiScoreEl = document.getElementById("aiScore");

// Initialize event listeners
function initializeEventListeners() {
  choiceButtons.forEach((btn) => {
    btn.addEventListener("click", handlePlayerChoice);
  });

  resetBtn.addEventListener("click", resetGame);
}

// Generate AI choice using Math.random()
function getAIChoice() {
  const choiceArray = Object.keys(choices);
  const randomIndex = Math.floor(Math.random() * choiceArray.length);
  return choiceArray[randomIndex];
}

// Handle player choice
function handlePlayerChoice(event) {
  if (gameState.gameInProgress) return;

  const selectedChoice = event.target.dataset.choice;
  gameState.userChoice = selectedChoice;

  // Disable buttons during gameplay
  disableChoiceButtons(true);

  // Display player choice
  displayPlayerChoice(selectedChoice);

  // Start countdown and game logic
  startCountdown();
}

// Display player choice with emoji
function displayPlayerChoice(choice) {
  playerDisplay.innerHTML = `<div class="icon-placeholder">${choices[choice]}</div>`;
}

// Display AI choice with emoji
function displayAIChoice(choice) {
  aiDisplay.innerHTML = `<div class="icon-placeholder">${choices[choice]}</div>`;
}

// Start 3-2-1 countdown
function startCountdown() {
  gameState.gameInProgress = true;
  let countdown = 3;
  countdownEl.textContent = countdown;

  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      countdownEl.textContent = countdown;
    } else {
      clearInterval(countdownInterval);
      countdownEl.textContent = "";

      // Get AI choice and show it
      gameState.aiChoice = getAIChoice();
      displayAIChoice(gameState.aiChoice);

      // Determine winner and show result
      setTimeout(() => {
        determineWinner();
        gameState.gameInProgress = false;
        disableChoiceButtons(false);
      }, 500);
    }
  }, 1000);
}

// Determine winner logic
function determineWinner() {
  const user = gameState.userChoice;
  const ai = gameState.aiChoice;

  let result;
  let resultClass;

  if (user === ai) {
    result = "It's a Draw! 🤝";
    resultClass = "draw";
  } else if (
    (user === "rock" && ai === "scissors") ||
    (user === "paper" && ai === "rock") ||
    (user === "scissors" && ai === "paper")
  ) {
    result = "You Win! 🎉";
    resultClass = "win";
    gameState.userScore++;
    userScoreEl.textContent = gameState.userScore;
  } else {
    result = "AI Wins! 🤖";
    resultClass = "lose";
    gameState.aiScore++;
    aiScoreEl.textContent = gameState.aiScore;
  }

  // Update result display
  resultText.textContent = result;
  resultText.className = `result-text ${resultClass}`;

  resultDetails.innerHTML = `
    <div>Your Choice: <strong>${choices[user]} ${user.toUpperCase()}</strong></div>
    <div>AI Choice: <strong>${choices[ai]} ${ai.toUpperCase()}</strong></div>
  `;
}

// Disable/Enable choice buttons
function disableChoiceButtons(disable) {
  choiceButtons.forEach((btn) => {
    btn.disabled = disable;
  });
}

// Reset game to initial state
function resetGame() {
  gameState.userChoice = null;
  gameState.aiChoice = null;
  gameState.gameInProgress = false;

  // Reset displays
  playerDisplay.innerHTML = '<div class="icon-placeholder">❓</div>';
  aiDisplay.innerHTML = '<div class="icon-placeholder">❓</div>';
  countdownEl.textContent = "";
  resultText.textContent = "";
  resultText.className = "result-text";
  resultDetails.textContent = "";

  // Enable buttons
  disableChoiceButtons(false);
}

// Reset scores
function resetScores() {
  gameState.userScore = 0;
  gameState.aiScore = 0;
  userScoreEl.textContent = 0;
  aiScoreEl.textContent = 0;
  resetGame();
}

// Initialize game on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners();
  resetGame();
});
