// Game Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.95;  // Set height to 95% of screen height

// Colors
const WHITE = "#FFFFFF";
const BLACK = "#000000";
const RED = "#FF0000";
const GREEN = "#00FF00";
const YELLOW = "#FFFF00";
const COLORS = [RED, GREEN, "#0000FF", YELLOW, "#FFA500"]; // Example colors

// Fonts
const font = "36px Arial";
const largeFont = "72px Arial";
const smallFont = "24px Arial";

// Game Variables
let score = 0;
let question = "";
let answer = 0;
let userAnswer = "";
let fireworks = [];
let history = [];

// Firework Classes
class Projectile {
  constructor(x, y, xVel, yVel, color) {
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.color = color;
    this.alpha = 255;
  }

  move() {
    this.x += this.xVel;
    this.y += this.yVel;
    this.alpha = Math.max(0, this.alpha - 3);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha / 255})`;
    ctx.fill();
  }
}

class Firework {
  constructor(x, y, yVel, explodeHeight, color) {
    this.x = x;
    this.y = y;
    this.yVel = yVel;
    this.explodeHeight = explodeHeight;
    this.color = color;
    this.projectiles = [];
    this.exploded = false;
  }

  explode() {
    this.exploded = true;
    const numProjectiles = Math.floor(Math.random() * 25 + 25);  // Between 25 and 50 projectiles
    let angleDiff = Math.PI * 2 / numProjectiles;
    let currentAngle = 0;
    const vel = Math.random() * 2 + 2;

    for (let i = 0; i < numProjectiles; i++) {
      let xVel = Math.sin(currentAngle) * vel;
      let yVel = Math.cos(currentAngle) * vel;
      let color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.projectiles.push(new Projectile(this.x, this.y, xVel, yVel, color));
      currentAngle += angleDiff;
    }
  }

  move() {
    if (!this.exploded) {
      this.y += this.yVel;
      if (this.y <= this.explodeHeight) {
        this.explode();
      }
    }

    this.projectiles = this.projectiles.filter(p => {
      p.move();
      return p.alpha > 0;
    });
  }

  draw() {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    this.projectiles.forEach(p => p.draw());
  }
}

// Math Game Functions
function generateQuestion() {
  const num1 = Math.floor(Math.random() * 51);
  const num2 = Math.floor(Math.random() * 51);
  question = `${num1} + ${num2} = ${userAnswer}`;
  answer = num1 + num2;
  userAnswer = "";
}

function checkAnswer() {
  const userInt = parseInt(userAnswer);
  if (userInt === answer) {
    score += 1;
    fireworks.push(new Firework(canvas.width / 2, canvas.height / 2, -5, Math.random() * 200 + 200, COLORS[Math.floor(Math.random() * COLORS.length)]));
    history.push(`${question} ${userInt} (Correct)`);
  } else {
    score -= 2;
    history.push(`${question} ${userInt} (Wrong)`);
  }
  generateQuestion();
}

// Display Game Elements
function drawGameElements() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = BLACK;
  ctx.font = largeFont;
  ctx.fillText(question, canvas.width / 2 - ctx.measureText(question).width / 2, canvas.height / 3);
  ctx.font = font;
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(userAnswer, canvas.width / 2 - ctx.measureText(userAnswer).width / 2, canvas.height / 2);

  // Display history in top right corner
  ctx.font = smallFont;
  let yOffset = 10;
  history.forEach(entry => {
    ctx.fillText(entry, canvas.width - 200, yOffset);
    yOffset += 25;
  });

  fireworks.forEach(f => f.move());
  fireworks.forEach(f => f.draw());
}

// Keyboard Input
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  } else if (event.key === "Backspace") {
    userAnswer = userAnswer.slice(0, -1);
  } else if (event.key >= '0' && event.key <= '9') {
    userAnswer += event.key;
  }
});

// Start Game
generateQuestion();
function gameLoop() {
  drawGameElements();
  requestAnimationFrame(gameLoop);
}

gameLoop();
