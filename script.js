 function hideHeader() {
    let headerElement = document.getElementById("dismissible-header");
    // Add the 'hidden' class to the header to hide it
    headerElement.classList.add("hidden");
}

function toggleMenu() {
  const nav = document.querySelector('.nav-links');
  const isOpen = nav.classList.contains('open');
  
  nav.classList.toggle('open');
  
  if (isOpen) {
    // Menu is closing, add hidden class
    nav.classList.add('hidden');
  } else {
    // Menu is opening, remove hidden class
    nav.classList.remove('hidden');
  }
}

function checkOverflow() {
  const nav = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');
  const header = document.querySelector('.main-header');
  const timeDisplay = document.querySelector('.time-display');
  
  // Check if content needs to wrap by comparing total needed width vs available width
  const hamburgerWidth = hamburger.offsetWidth || 40;
  const timeWidth = timeDisplay.offsetWidth || 100;
  const navWidth = nav.scrollWidth;
  const headerWidth = header.offsetWidth;
  const padding = 40;
  
  // If all items don't fit in one line, show hamburger
  if (hamburgerWidth + timeWidth + navWidth + padding > headerWidth) {
    hamburger.style.display = 'block';
    nav.classList.add('hidden');
    nav.classList.remove('open');
  } else {
    hamburger.style.display = 'none';
    nav.classList.remove('hidden');
    nav.classList.remove('open');
  }
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

window.addEventListener('load', checkOverflow);
window.addEventListener('resize', checkOverflow);

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
  const mainMenu = document.getElementById("main-menu");
  if (mainMenu) mainMenu.classList.remove("hidden");
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
  const difficultyMenu = document.getElementById("difficulty-menu");
  if (difficultyMenu) difficultyMenu.classList.remove("hidden");
}

function showInstructions() {
  hideAllMenus();
  const instructionsMenu = document.getElementById("instructions-menu");
  if (instructionsMenu) instructionsMenu.classList.remove("hidden");
}

function showGameScreen() {
  hideAllMenus();
  const gameScreen = document.getElementById("game-screen");
  if (gameScreen) gameScreen.classList.remove("hidden");
  
  detectMobile();
  const mobileControls = document.getElementById("mobile-controls");
  const controlsText = document.getElementById("controls-text");
  
  if (isMobile) {
    if (mobileControls) mobileControls.classList.remove("hidden");
    if (controlsText) controlsText.innerHTML = "Use the <strong>UP</strong> and <strong>DOWN</strong> buttons to move your paddle";
  } else {
    if (mobileControls) mobileControls.classList.add("hidden");
    if (controlsText) controlsText.innerHTML = "Use <strong>W</strong> and <strong>S</strong> keys to move your paddle";
  }
}

function hideAllMenus() {
  const mainMenu = document.getElementById("main-menu");
  if (mainMenu) mainMenu.classList.add("hidden");
  const difficultyMenu = document.getElementById("difficulty-menu");
  if (difficultyMenu) difficultyMenu.classList.add("hidden");
  const instructionsMenu = document.getElementById("instructions-menu");
  if (instructionsMenu) instructionsMenu.classList.add("hidden");
  const gameScreen = document.getElementById("game-screen");
  if (gameScreen) gameScreen.classList.add("hidden");
}

function selectDifficulty(difficulty) {
  currentDifficulty = difficulty;
  const difficultyNames = { easy: "Easy", medium: "Medium", hard: "Hard" };
  const difficultyDisplay = document.getElementById("difficulty-display");
  if (difficultyDisplay) difficultyDisplay.textContent = `Difficulty: ${difficultyNames[difficulty]}`;
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
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let mobileControlsActive = { up: false, down: false };

function detectMobile() {
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
}

function startMobileControl(direction) {
  mobileControlsActive[direction] = true;
  if (direction === 'up') keys['W'] = true;
  if (direction === 'down') keys['S'] = true;
}

function stopMobileControl(direction) {
  mobileControlsActive[direction] = false;
  if (direction === 'up') keys['W'] = false;
  if (direction === 'down') keys['S'] = false;
}

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
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.textContent = "Game Running...";
    startBtn.disabled = true;
  }
  
  const mobileControls = document.getElementById("mobile-controls");
  if (isMobile && mobileControls) {
    mobileControls.classList.add("show");
  }
  
  gameLoop();
}

function updateScores() {
  const playerScoreEl = document.getElementById("player-score");
  if (playerScoreEl) playerScoreEl.textContent = playerScore;
  const aiScoreEl = document.getElementById("ai-score");
  if (aiScoreEl) aiScoreEl.textContent = aiScore;
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
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.textContent = "Start Game";
    startBtn.disabled = false;
  }
  
  const mobileControls = document.getElementById("mobile-controls");
  if (mobileControls) {
    mobileControls.classList.remove("show");
  }
  
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

// CLI Command Handler
const cliCommandHistory = [];
let cliHistoryIndex = -1;
const cliCommands = {
  'help': 'Shows this help message',
  'help [command]': 'Shows help for a specific command',
  'clear': 'Clears the terminal output',
  'reset': 'Resets the CLI',
  'echo [text]': 'Echoes the text back to you',
  'date': 'Shows the current date and time',
  'whoami': 'Shows the current user',
  'pwd': 'Shows the current directory',
  'ls': 'Lists available commands',
  'about': 'Information about this website',
  'time': 'Shows the current time',
  'joke': 'Tells a random joke',
  'calc [expression]': 'Simple calculator (e.g., calc 5+3*2)',
  'random [max]': 'Generates a random number (0 to max)',
  'fortune': 'Shows a random fortune/quote',
  'weather': 'Shows mock weather information',
  'history': 'Shows command history',
  'status': 'Shows system status',
  'version': 'Shows version information',
  'banner': 'Shows banner',
  'color': 'Displays color palette codes',
  'countdown [seconds]': 'Countdown timer (max 60 seconds)',
  'math [operation]': 'Math operations (sqrt, sin, cos, etc.)',
  'uptime': 'Shows how long the page has been open',
  'neofetch': 'Shows system info in neofetch style',
  'tree': 'Shows website structure',
  'tip': 'Shows a random programming tip',
  'ping': 'Tests connection to remote server',
  'ip': 'Shows IP address information',
  'disk': 'Shows simulated disk usage',
  'memory': 'Shows RAM information',
  'cpu': 'Shows CPU information',
  'network': 'Shows network information',
  'screenfetch': 'Shows screen/display information',
  'quote': 'Shows an inspirational quote',
  'fact': 'Shows a random fact',
  'roll [sides]': 'Rolls a dice (default 6 sides)',
  'flip': 'Flips a coin',
  'todo [action] [text]': 'Manage todos (add, list, clear)',
  'timer [seconds]': 'Shows a timer',
  'password [length]': 'Generates a random password',
  'morse [text]': 'Converts text to morse code',
  'base64 [action]': 'Encodes/decodes base64',
  'sum [numbers]': 'Sums the numbers provided',
  'md5 [text]': 'Shows a fake MD5 hash',
  'stats': 'Shows various statistics',
  'cls': 'Alias for clear',
  'man [command]': 'Shows manual for a command',
  'eval [expression]': 'Evaluates an expression',
  'say [text]': 'Uses text-to-speech (if available)',
  'find [text]': 'Searches through command history',
  'grep [pattern]': 'Searches for pattern in output',
  'head [lines]': 'Shows first N lines of output',
  'tail [lines]': 'Shows last N lines of output'
};

function fetchWeather(lat, lon) {
  // Using Open-Meteo API (free, no authentication required)
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=fahrenheit`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const current = data.current;
      const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Slight drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with large hail'
      };
      
      const condition = weatherCodes[current.weather_code] || 'Unknown';
      addCLIOutput(`Temperature: ${current.temperature_2m}°F`, 'output');
      addCLIOutput(`Condition: ${condition}`, 'output');
      addCLIOutput(`Humidity: ${current.relative_humidity_2m}%`, 'output');
      addCLIOutput(`Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}`, 'output');
    })
    .catch(error => {
      addCLIOutput(`Error fetching weather: ${error.message}`, 'error');
    });
}

function handleCLIInput(event) {
  if (event.key === 'Enter') {
    const input = document.getElementById('cli-input');
    const command = input.value.trim();
    
    if (command) {
      cliCommandHistory.push(command);
      cliHistoryIndex = cliCommandHistory.length;
      executeCLICommand(command);
      input.value = '';
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (cliHistoryIndex > 0) {
      cliHistoryIndex--;
      document.getElementById('cli-input').value = cliCommandHistory[cliHistoryIndex];
    }
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (cliHistoryIndex < cliCommandHistory.length - 1) {
      cliHistoryIndex++;
      document.getElementById('cli-input').value = cliCommandHistory[cliHistoryIndex];
    } else if (cliHistoryIndex === cliCommandHistory.length - 1) {
      cliHistoryIndex++;
      document.getElementById('cli-input').value = '';
    }
  }
}

function executeCLICommand(command) {
  const output = document.getElementById('cli-output');
  if (!output) return; // CLI not on this page
  
  addCLIOutput('$ ' + command, 'prompt');
  
  const [cmd, ...args] = command.split(' ');
  const cmdLower = cmd.toLowerCase();
  
  switch (cmdLower) {
    case 'help':
      if (args.length > 0) {
        const helpCmd = args[0].toLowerCase();
        if (cliCommands[helpCmd]) {
          addCLIOutput(`${helpCmd}: ${cliCommands[helpCmd]}`, 'output');
        } else if (cliCommands[helpCmd + ' [text]']) {
          addCLIOutput(`${helpCmd} [text]: ${cliCommands[helpCmd + ' [text]']}`, 'output');
        } else {
          addCLIOutput(`No command found: ${helpCmd}`, 'error');
        }
      } else {
        addCLIOutput('Available commands:', 'output');
        for (const [command, description] of Object.entries(cliCommands)) {
          addCLIOutput(`  ${command.padEnd(25)} - ${description}`, 'output');
        }
      }
      break;
      
    case 'clear':
      clearCLI();
      break;
      
    case 'reset':
      resetCLI();
      break;
      
    case 'echo':
      if (args.length === 0) {
        addCLIOutput('echo: missing operand', 'error');
      } else {
        addCLIOutput(args.join(' '), 'output');
      }
      break;
      
    case 'date':
      addCLIOutput(new Date().toString(), 'output');
      break;
      
    case 'time':
      addCLIOutput(new Date().toLocaleTimeString(), 'output');
      break;
      
    case 'whoami':
      addCLIOutput('Student', 'output');
      break;
      
    case 'pwd':
      addCLIOutput('/home/website/page5', 'output');
      break;
      
    case 'ls':
      addCLIOutput('Available commands: ' + Object.keys(cliCommands).join(', '), 'output');
      break;
      
    case 'about':
      addCLIOutput('Sample Website 2.0', 'output');
      addCLIOutput('A feature-rich website with components like a calculator, game, and CLI.', 'output');
      addCLIOutput('Type "help" for more commands.', 'output');
      break;
      
    case 'joke':
      const jokes = [
        'Why do programmers prefer dark mode? Because light attracts bugs!',
        'How many programmers does it take to change a light bulb? None, that\'s a hardware problem.',
        'Why did the developer go broke? Because he lost his domain.',
        'Why do Java developers wear glasses? Because they don\'t C#.',
        'How do you know if someone is a real programmer? They say "sudo make me a sandwich"'
      ];
      addCLIOutput(jokes[Math.floor(Math.random() * jokes.length)], 'output');
      break;

    case 'calc':
      if (args.length === 0) {
        addCLIOutput('calc: missing expression', 'error');
      } else {
        try {
          const expression = args.join('');
          const result = Function('"use strict"; return (' + expression + ')')();
          addCLIOutput(`${expression} = ${result}`, 'output');
        } catch (e) {
          addCLIOutput(`calc: invalid expression`, 'error');
        }
      }
      break;

    case 'random':
      const max = args.length > 0 ? parseInt(args[0]) : 100;
      if (isNaN(max)) {
        addCLIOutput('random: invalid number', 'error');
      } else {
        addCLIOutput(Math.floor(Math.random() * (max + 1)).toString(), 'output');
      }
      break;

    case 'fortune':
      const fortunes = [
        'The only way to do great work is to love what you do. - Steve Jobs',
        'Innovation distinguishes between a leader and a follower. - Steve Jobs',
        'Code is poetry written for computers. - Unknown',
        'The best debugging is done with printf. - Unknown',
        'Any fool can write code that a computer can understand. - Martin Fowler',
        'First, solve the problem. Then, write the code. - John Johnson',
        'It always seems impossible until it is done. - Nelson Mandela'
      ];
      addCLIOutput(fortunes[Math.floor(Math.random() * fortunes.length)], 'output');
      break;

    case 'weather':
      addCLIOutput('Fetching weather data...', 'output');
      // Get user's geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeather(lat, lon);
          },
          (error) => {
            // If geolocation fails, use default location (New York)
            addCLIOutput('Location access denied, using default location (New York)', 'output');
            fetchWeather(40.7128, -74.0060);
          }
        );
      } else {
        // Fallback to default location
        fetchWeather(40.7128, -74.0060);
      }
      break;

    case 'history':
      if (cliCommandHistory.length === 0) {
        addCLIOutput('No command history', 'output');
      } else {
        cliCommandHistory.forEach((cmd, index) => {
          addCLIOutput(`${index + 1}  ${cmd}`, 'output');
        });
      }
      break;

    case 'status':
      addCLIOutput('System Status Report', 'output');
      addCLIOutput('===============================', 'output');
      addCLIOutput(`Browser: ${navigator.userAgent.split(' ').pop()}`, 'output');
      addCLIOutput(`Platform: ${navigator.platform}`, 'output');
      addCLIOutput(`Language: ${navigator.language}`, 'output');
      addCLIOutput(`Online: ${navigator.onLine ? 'Yes' : 'No'}`, 'output');
      addCLIOutput(`Cookies: ${navigator.cookieEnabled ? 'Enabled' : 'Disabled'}`, 'output');
      break;

    case 'version':
      addCLIOutput('Sample Website v2.0', 'output');
      addCLIOutput('CLI Version 1.0.0', 'output');
      addCLIOutput('Release Date: February 18, 2026', 'output');
      break;

    case 'banner':
      addCLIOutput('====================================', 'output');
      addCLIOutput('Welcome to Sample Website CLI', 'output');
      addCLIOutput('Type help for available commands', 'output');
      addCLIOutput('====================================', 'output');
      break;

    case 'color':
      addCLIOutput('Color Palette:', 'output');
      addCLIOutput('[#129db3] Cyan (Primary)', 'output');
      addCLIOutput('[#00ff00] Green (Terminal)', 'output');
      addCLIOutput('[#0d0d0d] Dark (Background)', 'output');
      addCLIOutput('[#ff3333] Red (Error)', 'output');
      break;

    case 'countdown':
      if (args.length === 0) {
        addCLIOutput('countdown: missing seconds argument', 'error');
      } else {
        let seconds = parseInt(args[0]);
        if (isNaN(seconds) || seconds < 1 || seconds > 60) {
          addCLIOutput('countdown: seconds must be between 1 and 60', 'error');
        } else {
          addCLIOutput(`Countdown: ${seconds}...`, 'output');
        }
      }
      break;

    case 'math':
      if (args.length === 0) {
        addCLIOutput('Math operations: sqrt, abs, sin, cos, tan, log, floor, ceil, round', 'output');
      } else {
        const op = args[0].toLowerCase();
        const val = parseFloat(args[1]);
        if (isNaN(val)) {
          addCLIOutput('math: invalid value', 'error');
        } else {
          try {
            let result;
            switch(op) {
              case 'sqrt': result = Math.sqrt(val); break;
              case 'abs': result = Math.abs(val); break;
              case 'sin': result = Math.sin(val); break;
              case 'cos': result = Math.cos(val); break;
              case 'tan': result = Math.tan(val); break;
              case 'log': result = Math.log(val); break;
              case 'floor': result = Math.floor(val); break;
              case 'ceil': result = Math.ceil(val); break;
              case 'round': result = Math.round(val); break;
              default: addCLIOutput(`math: unknown operation`, 'error'); return;
            }
            addCLIOutput(`${op}(${val}) = ${result}`, 'output');
          } catch (e) {
            addCLIOutput(`math: error`, 'error');
          }
        }
      }
      break;

    case 'uptime':
      const uptime = Math.floor((Date.now() - (window.pageLoadTime || Date.now())) / 1000);
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const secs = uptime % 60;
      addCLIOutput(`Page uptime: ${hours}h ${minutes}m ${secs}s`, 'output');
      break;

    case 'neofetch':
      addCLIOutput('======================================', 'output');
      addCLIOutput('Welcome to Sample Website', 'output');
      addCLIOutput('======================================', 'output');
      addCLIOutput(`OS: Web Browser`, 'output');
      addCLIOutput(`Host: Sample Website 2.0`, 'output');
      addCLIOutput(`Kernel: JavaScript`, 'output');
      addCLIOutput(`Shell: CLI v1.0`, 'output');
      break;

    case 'tree':
      addCLIOutput('Sample Website', 'output');
      addCLIOutput('├── Home (index.html)', 'output');
      addCLIOutput('├── About Us (page1.html)', 'output');
      addCLIOutput('├── Download (page2.html)', 'output');
      addCLIOutput('├── Calculator (page3.html)', 'output');
      addCLIOutput('├── Game (page4.html)', 'output');
      addCLIOutput('│   └── Pong Game', 'output');
      addCLIOutput('└── CLI (page5.html) [You are here]', 'output');
      break;

    case 'tip':
      const tips = [
        'Keep variable names descriptive and meaningful.',
        'Always test edge cases in your code.',
        'Comment complex logic for future maintainers.',
        'DRY: Don\'t Repeat Yourself - extract common code into functions.',
        'Use version control for all projects.',
        'Refactor code regularly to improve readability.',
        'Learn a new programming language every year.',
        'Code reviews help catch bugs early.',
        'Write tests as you write code.',
        'Performance optimization should come after functionality works.'
      ];
      addCLIOutput(tips[Math.floor(Math.random() * tips.length)], 'output');
      break;

    case 'ping':
      addCLIOutput('Pinging sample-website.local...', 'output');
      addCLIOutput(`PING sample-website.local (192.168.1.100) 56(84) bytes of data.`, 'output');
      const pings = ['64 bytes from sample-website.local: time=12ms TTL=64', 
                     '64 bytes from sample-website.local: time=11ms TTL=64',
                     '64 bytes from sample-website.local: time=13ms TTL=64'];
      pings.forEach(p => addCLIOutput(p, 'output'));
      addCLIOutput('--- sample-website.local statistics ---', 'output');
      addCLIOutput('3 packets transmitted, 3 received, 0% packet loss, time 5ms', 'output');
      break;

    case 'ip':
      addCLIOutput('IP Configuration', 'output');
      addCLIOutput('================', 'output');
      addCLIOutput(`IPv4 Address: 192.168.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}`, 'output');
      addCLIOutput('Subnet Mask: 255.255.255.0', 'output');
      addCLIOutput('Gateway: 192.168.1.1', 'output');
      addCLIOutput('DNS: 8.8.8.8, 8.8.4.4', 'output');
      break;

    case 'disk':
      addCLIOutput('Disk Usage:', 'output');
      const totalDisk = 1000;
      const usedDisk = Math.floor(Math.random() * totalDisk * 0.8);
      const percentDisk = Math.round((usedDisk / totalDisk) * 100);
      addCLIOutput(`Total: ${totalDisk}GB`, 'output');
      addCLIOutput(`Used: ${usedDisk}GB (${percentDisk}%)`, 'output');
      addCLIOutput(`Free: ${totalDisk - usedDisk}GB`, 'output');
      break;

    case 'memory':
      addCLIOutput('Memory Information:', 'output');
      const totalMem = 16;
      const usedMem = Math.round(Math.random() * totalMem * 0.7 * 10) / 10;
      const percentMem = Math.round((usedMem / totalMem) * 100);
      addCLIOutput(`Total RAM: ${totalMem}GB`, 'output');
      addCLIOutput(`Used: ${usedMem}GB (${percentMem}%)`, 'output');
      addCLIOutput(`Available: ${(totalMem - usedMem).toFixed(1)}GB`, 'output');
      break;

    case 'cpu':
      addCLIOutput('CPU Information:', 'output');
      addCLIOutput('Processor: Intel Core i7-10700K @ 3.80GHz', 'output');
      addCLIOutput(`Cores: 8 | Threads: 16`, 'output');
      addCLIOutput(`Current Usage: ${Math.floor(Math.random() * 80)}%`, 'output');
      addCLIOutput(`Temperature: ${(50 + Math.random() * 30).toFixed(1)}°C`, 'output');
      break;

    case 'network':
      addCLIOutput('Network Information:', 'output');
      addCLIOutput(`Interface: eth0`, 'output');
      addCLIOutput(`MAC Address: ${Array(6).fill(0).map(() => Math.floor(Math.random()*16).toString(16).toUpperCase()).join(':')}`, 'output');
      addCLIOutput(`Download Speed: ${Math.floor(Math.random() * 100)}Mbps`, 'output');
      addCLIOutput(`Upload Speed: ${Math.floor(Math.random() * 50)}Mbps`, 'output');
      addCLIOutput(`Ping: ${Math.floor(Math.random() * 50)}ms`, 'output');
      break;

    case 'screenfetch':
      addCLIOutput('=====================================', 'output');
      addCLIOutput(`Display: ${window.innerWidth}x${window.innerHeight} px`, 'output');
      addCLIOutput(`Refresh Rate: ${window.devicePixelRatio * 60}Hz`, 'output');
      addCLIOutput(`Color Depth: 32-bit`, 'output');
      addCLIOutput(`Browser: ${navigator.userAgent.split(' ').pop()}`, 'output');
      addCLIOutput(`Screen Orientation: ${window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait'}`, 'output');
      addCLIOutput('=====================================', 'output');
      break;

    case 'quote':
      const quotes = [
        '"The only way to do great work is to love what you do." - Steve Jobs',
        '"It always seems impossible until it\'s done." - Nelson Mandela',
        '"Code is poetry written for computers." - Unknown',
        '"Stay hungry. Stay foolish." - Steve Jobs',
        '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
        '"Life is what happens when you\'re busy making other plans." - John Lennon',
        '"The only impossible journey is the one never begun." - Tony Robbins'
      ];
      addCLIOutput(quotes[Math.floor(Math.random() * quotes.length)], 'output');
      break;

    case 'fact':
      const facts = [
        'A group of flamingos is called a "flamboyance".',
        'Honey never spoils. Archaeologists found 3000-year-old honey that was still edible.',
        'The shortest war lasted only 38 to 45 minutes.',
        'A single bolt of lightning is about 54,000 degrees Fahrenheit.',
        'The human brain uses 20% of the body\'s energy.',
        'Octopuses have three hearts.',
        'A day on Venus is longer than its year.',
        'Bananas are berries, but strawberries are not.'
      ];
      addCLIOutput('Random Fact: ' + facts[Math.floor(Math.random() * facts.length)], 'output');
      break;

    case 'roll':
      const sides = args.length > 0 ? parseInt(args[0]) : 6;
      if (isNaN(sides) || sides < 2) {
        addCLIOutput('roll: sides must be at least 2', 'error');
      } else {
        const roll = Math.floor(Math.random() * sides) + 1;
        addCLIOutput(`Rolled a ${sides}-sided dice: ${roll}`, 'output');
      }
      break;

    case 'flip':
      const flip = Math.random() > 0.5 ? 'Heads' : 'Tails';
      addCLIOutput(`🪙 ${flip}!`, 'output');
      break;

    case 'todo':
      if (!window.todos) window.todos = [];
      if (args.length === 0) {
        addCLIOutput('Usage: todo [add|list|clear|remove] [item]', 'error');
      } else {
        const action = args[0].toLowerCase();
        if (action === 'add' && args.length > 1) {
          const item = args.slice(1).join(' ');
          window.todos.push(item);
          addCLIOutput(`Added: ${item}`, 'output');
        } else if (action === 'list') {
          if (window.todos.length === 0) {
            addCLIOutput('No todos yet', 'output');
          } else {
            window.todos.forEach((t, i) => addCLIOutput(`${i+1}. ${t}`, 'output'));
          }
        } else if (action === 'clear') {
          window.todos = [];
          addCLIOutput('todos cleared', 'output');
        } else if (action === 'remove' && args.length > 1) {
          const idx = parseInt(args[1]) - 1;
          if (idx >= 0 && idx < window.todos.length) {
            const removed = window.todos.splice(idx, 1);
            addCLIOutput(`Removed: ${removed[0]}`, 'output');
          } else {
            addCLIOutput('Invalid todo number', 'error');
          }
        }
      }
      break;

    case 'timer':
      if (args.length === 0) {
        addCLIOutput('Usage: timer [seconds]', 'error');
      } else {
        let seconds = parseInt(args[0]);
        if (isNaN(seconds) || seconds < 1) {
          addCLIOutput('timer: seconds must be positive', 'error');
        } else {
          addCLIOutput(`Timer started for ${seconds} seconds...`, 'output');
        }
      }
      break;

    case 'password':
      const length = args.length > 0 ? parseInt(args[0]) : 16;
      if (isNaN(length) || length < 4) {
        addCLIOutput('password: length must be at least 4', 'error');
      } else {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        const pass = Array(length).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
        addCLIOutput(`Generated password: ${pass}`, 'output');
      }
      break;

    case 'morse':
      if (args.length === 0) {
        addCLIOutput('morse: missing text argument', 'error');
      } else {
        const morseMap = {
          'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
          'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
          'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
          's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
          'y': '-.--', 'z': '--..', '0': '-----', '1': '.----', '2': '..---',
          '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
          '8': '---..', '9': '----.'
        };
        const text = args.join('').toLowerCase();
        const morse = text.split('').map(c => morseMap[c] || '/').join(' ');
        addCLIOutput(`${text} = ${morse}`, 'output');
      }
      break;

    case 'base64':
      if (args.length < 2) {
        addCLIOutput('Usage: base64 [encode|decode] [text]', 'error');
      } else {
        const b64action = args[0].toLowerCase();
        const b64text = args.slice(1).join(' ');
        if (b64action === 'encode') {
          const encoded = btoa(b64text);
          addCLIOutput(`Encoded: ${encoded}`, 'output');
        } else if (b64action === 'decode') {
          try {
            const decoded = atob(b64text);
            addCLIOutput(`Decoded: ${decoded}`, 'output');
          } catch(e) {
            addCLIOutput('base64: invalid input', 'error');
          }
        }
      }
      break;

    case 'sum':
      if (args.length === 0) {
        addCLIOutput('Usage: sum [number] [number] ...', 'error');
      } else {
        const numbers = args.map(a => parseFloat(a)).filter(n => !isNaN(n));
        if (numbers.length === 0) {
          addCLIOutput('sum: no valid numbers provided', 'error');
        } else {
          const total = numbers.reduce((a, b) => a + b, 0);
          addCLIOutput(`Sum of ${numbers.join(' + ')} = ${total}`, 'output');
        }
      }
      break;

    case 'md5':
      if (args.length === 0) {
        addCLIOutput('md5: missing text argument', 'error');
      } else {
        const text = args.join(' ');
        const fakeHash = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const hash = Array(6).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        addCLIOutput(`MD5("${text}") = ${hash}${fakeHash}${hash}c...`, 'output');
      }
      break;

    case 'stats':
      addCLIOutput('System Statistics', 'output');
      addCLIOutput('=================', 'output');
      addCLIOutput(`Commands Run: ${cliCommandHistory.length}`, 'output');
      addCLIOutput(`Uptime: ${Math.floor((Date.now() - (window.pageLoadTime || Date.now())) / 1000)}s`, 'output');
      addCLIOutput(`Memory Usage: ${(performance.memory?.usedJSHeapSize / 1048576).toFixed(2) || 'N/A'}MB`, 'output');
      addCLIOutput(`Browser: ${navigator.userAgent.split(' ').pop()}`, 'output');
      addCLIOutput(`Timezone: ${new Date().getTimezoneOffset() / -60}`, 'output');
      break;

    case 'cls':
      clearCLI();
      break;

    case 'man':
      if (args.length === 0) {
        addCLIOutput('Usage: man [command]', 'error');
      } else {
        const cmd = args[0].toLowerCase();
        if (cliCommands[cmd]) {
          addCLIOutput(`MANUAL: ${cmd.toUpperCase()}`, 'output');
          addCLIOutput(`========== ${'='.repeat(cmd.length)} `, 'output');
          addCLIOutput(`${cliCommands[cmd]}`, 'output');
        } else {
          addCLIOutput(`No manual entry for ${cmd}`, 'error');
        }
      }
      break;

    case 'eval':
      if (args.length === 0) {
        addCLIOutput('eval: missing expression', 'error');
      } else {
        try {
          const result = Function('"use strict"; return (' + args.join('') + ')')();
          addCLIOutput(`Result: ${result}`, 'output');
        } catch(e) {
          addCLIOutput(`eval: ${e.message}`, 'error');
        }
      }
      break;

    case 'say':
      if (args.length === 0) {
        addCLIOutput('Usage: say [text]', 'error');
      } else {
        const textToSay = args.join(' ');
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(textToSay);
          window.speechSynthesis.speak(utterance);
          addCLIOutput(`Speaking: "${textToSay}"`, 'output');
        } else {
          addCLIOutput('Text-to-speech not supported in this browser', 'error');
        }
      }
      break;

    case 'find':
      if (args.length === 0) {
        addCLIOutput('Usage: find [text]', 'error');
      } else {
        const searchText = args.join(' ').toLowerCase();
        const found = cliCommandHistory.filter(h => h.toLowerCase().includes(searchText));
        if (found.length === 0) {
          addCLIOutput('No matching commands found', 'output');
        } else {
          found.forEach((f, i) => addCLIOutput(`${i+1}. ${f}`, 'output'));
        }
      }
      break;

    case 'grep':
      if (args.length === 0) {
        addCLIOutput('Usage: grep [pattern]', 'error');
      } else {
        addCLIOutput('grep: feature under development', 'output');
      }
      break;

    case 'head':
      if (args.length === 0) {
        addCLIOutput('Usage: head [lines]', 'error');
      } else {
        const headLines = parseInt(args[0]) || 10;
        addCLIOutput(`First ${headLines} lines of history:`, 'output');
        cliCommandHistory.slice(0, headLines).forEach((cmd, i) => {
          addCLIOutput(`${i+1}. ${cmd}`, 'output');
        });
      }
      break;

    case 'tail':
      if (args.length === 0) {
        addCLIOutput('Usage: tail [lines]', 'error');
      } else {
        const tailLines = parseInt(args[0]) || 10;
        addCLIOutput(`Last ${tailLines} lines of history:`, 'output');
        cliCommandHistory.slice(-tailLines).forEach((cmd, i) => {
          addCLIOutput(`${i+1}. ${cmd}`, 'output');
        });
      }
      break;
      
    default:
      if (command.trim() === '') {
        break;
      }
      addCLIOutput(`Command not found: ${cmd}. Type "help" for available commands.`, 'error');
  }
}

function addCLIOutput(text, type = 'output') {
  const output = document.getElementById('cli-output');
  if (!output) return;
  
  const line = document.createElement('div');
  line.className = `cli-line ${type}`;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function clearCLI() {
  const output = document.getElementById('cli-output');
  if (output) {
    output.innerHTML = '';
  }
}

function resetCLI() {
  clearCLI();
  cliCommandHistory.length = 0;
  cliHistoryIndex = -1;
  addCLIOutput('Welcome to the CLI! Type "help" for available commands.', 'output');
  const input = document.getElementById('cli-input');
  if (input) {
    input.value = '';
  }
}

// Track page load time for uptime command
window.pageLoadTime = Date.now();

// Initialize game - show main menu on page load
window.addEventListener("DOMContentLoaded", () => {
  detectMobile();
  showMainMenu();
});

window.addEventListener("resize", () => {
  detectMobile();
});