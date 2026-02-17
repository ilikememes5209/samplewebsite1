 function hideHeader() {
    let headerElement = document.getElementById("dismissible-header");
    // Add the 'hidden' class to the header to hide it
    headerElement.classList.add("hidden");
}

// Update the time display
function updateTime() {
    const timeDisplay = document.getElementById("time-display");
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update time immediately and then every second
updateTime();
setInterval(updateTime, 1000);
// Calculator functionality
let display = document.getElementById("display");
let currentInput = "0";
let previousInput = "";
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
    if (display) {
        display.textContent = currentInput;
    }
}

function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        // Prevent multiple leading zeros
        if (currentInput === "0" && num !== ".") {
            currentInput = num;
        } else if (num === "." && currentInput.includes(".")) {
            return; // Prevent multiple decimals
        } else {
            currentInput += num;
        }
    }
    updateDisplay();
}

function appendOperator(op) {
    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
}

function calculate() {
    if (operator === null || shouldResetDisplay) {
        return;
    }
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch (operator) {
        case "+":
            result = prev + current;
            break;
        case "-":
            result = prev - current;
            break;
        case "*":
            result = prev * current;
            break;
        case "/":
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentInput = result.toString();
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function clearDisplay() {
    currentInput = "0";
    previousInput = "";
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = "0";
    }
    updateDisplay();
}

// Initialize display on page load
if (display) {
    updateDisplay();
}

// Pong Game
const canvas = document.getElementById("pong-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

let gameRunning = false;
let playerScore = 0;
let aiScore = 0;
let currentDifficulty = "medium";

// Menu Functions
function showMainMenu() {
  hideAllMenus();
  document.getElementById("main-menu").classList.remove("hidden");
  if (gameRunning) {
    gameRunning = false;
  }
  // Reset scores
  playerScore = 0;
  aiScore = 0;
  updateScores();
}

function showDifficultyMenu() {
  hideAllMenus();
  document.getElementById("difficulty-menu").classList.remove("hidden");
}

function showInstructions() {
  hideAllMenus();
  document.getElementById("instructions-menu").classList.remove("hidden");
}

function showGameScreen() {
  hideAllMenus();
  document.getElementById("game-screen").classList.remove("hidden");
}

function hideAllMenus() {
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("difficulty-menu").classList.add("hidden");
  document.getElementById("instructions-menu").classList.add("hidden");
  document.getElementById("game-screen").classList.add("hidden");
}

function selectDifficulty(difficulty) {
  currentDifficulty = difficulty;
  const difficultyNames = { easy: "Easy", medium: "Medium", hard: "Hard" };
  document.getElementById("difficulty-display").textContent = `Difficulty: ${difficultyNames[difficulty]}`;
  showGameScreen();
}

const difficultySettings = {
  easy: { aiSpeed: 2.5 },
  medium: { aiSpeed: 4 },
  hard: { aiSpeed: 6 }
};

const game = {
  paddleHeight: 80,
  paddleWidth: 10,
  ballSize: 8,
  ballSpeed: 5,
};

const player = {
  x: 20,
  y: canvas ? canvas.height / 2 - game.paddleHeight / 2 : 0,
  dy: 0,
};

const ai = {
  x: canvas ? canvas.width - 30 : 0,
  y: canvas ? canvas.height / 2 - game.paddleHeight / 2 : 0,
  dy: 4,
};

let ball = {
  x: canvas ? canvas.width / 2 : 0,
  y: canvas ? canvas.height / 2 : 0,
  dx: game.ballSpeed,
  dy: game.ballSpeed,
};

const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key.toUpperCase()] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toUpperCase()] = false;
});

function startGame() {
  gameRunning = true;
  playerScore = 0;
  aiScore = 0;
  ai.dy = difficultySettings[currentDifficulty].aiSpeed;
  player.y = canvas.height / 2 - game.paddleHeight / 2;
  ai.y = canvas.height / 2 - game.paddleHeight / 2;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = game.ballSpeed;
  ball.dy = game.ballSpeed;
  document.getElementById("start-btn").textContent = "Game Running...";
  document.getElementById("start-btn").disabled = true;
  gameLoop();
}

function updateScores() {
  document.getElementById("player-score").textContent = playerScore;
  document.getElementById("ai-score").textContent = aiScore;
}

function gameLoop() {
  if (!gameRunning) return;

  // Update player position
  if (keys["W"] && player.y > 0) {
    player.y -= 7;
  }
  if (keys["S"] && player.y < canvas.height - game.paddleHeight) {
    player.y += 7;
  }

  // AI paddle movement
  const aiCenterY = ai.y + game.paddleHeight / 2;
  if (aiCenterY < ball.y - 35) {
    ai.y += ai.dy;
  } else if (aiCenterY > ball.y + 35) {
    ai.y -= ai.dy;
  }

  // Keep AI in bounds
  if (ai.y < 0) ai.y = 0;
  if (ai.y > canvas.height - game.paddleHeight) {
    ai.y = canvas.height - game.paddleHeight;
  }

  // Update ball position
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with top and bottom
  if (ball.y - game.ballSize < 0 || ball.y + game.ballSize > canvas.height) {
    ball.dy = -ball.dy;
  }

  // Ball collision with paddles
  if (
    ball.x - game.ballSize < player.x + game.paddleWidth &&
    ball.y > player.y &&
    ball.y < player.y + game.paddleHeight
  ) {
    ball.dx = -ball.dx;
    ball.x = player.x + game.paddleWidth + game.ballSize;
  }

  if (
    ball.x + game.ballSize > ai.x &&
    ball.y > ai.y &&
    ball.y < ai.y + game.paddleHeight
  ) {
    ball.dx = -ball.dx;
    ball.x = ai.x - game.ballSize;
  }

  // Score points
  if (ball.x < 0) {
    aiScore++;
    resetBall();
  }
  if (ball.x > canvas.width) {
    playerScore++;
    resetBall();
  }

  updateScores();
  
  // Check for game over
  if (playerScore >= 10) {
    endGame("You Won!");
  } else if (aiScore >= 10) {
    endGame("AI Won!");
  }
  
  if (!gameRunning) return;
  
  draw();
  requestAnimationFrame(gameLoop);
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = (Math.random() > 0.5 ? 1 : -1) * game.ballSpeed;
  ball.dy = (Math.random() > 0.5 ? 1 : -1) * game.ballSpeed;
}

function draw() {
  // Clear canvas
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw center line
  ctx.strokeStyle = "#129db3";
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = "#129db3";
  ctx.fillRect(player.x, player.y, game.paddleWidth, game.paddleHeight);
  ctx.fillRect(ai.x, ai.y, game.paddleWidth, game.paddleHeight);

  // Draw ball
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(ball.x - game.ballSize, ball.y - game.ballSize, game.ballSize * 2, game.ballSize * 2);
}


function endGame(message) {
  gameRunning = false;
  document.getElementById("start-btn").textContent = "Start Game";
  document.getElementById("start-btn").disabled = false;
  
  // Display game over message on canvas
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "#129db3";
  ctx.font = "bold 48px inter";
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 40);
  
  ctx.font = "24px inter";
  ctx.fillText("Use menu buttons to continue", canvas.width / 2, canvas.height / 2 + 20);
}

// Initialize game - show main menu on page load
window.addEventListener("DOMContentLoaded", () => {
  showMainMenu();
});
