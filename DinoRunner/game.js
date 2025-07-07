const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const dino = new Image();
dino.src = "assets/dino.png";

const cactus = new Image();
cactus.src = "assets/cactus.png";

const cloudImg = new Image();
cloudImg.src = "assets/cloud.png";

const groundImg = new Image();
groundImg.src = "assets/ground.png";

let dinoX = 50, dinoY = 160, velocityY = 0, jumping = false;
let gravity = 0.8;

let obstacles = [{ x: 800 }];
let clouds = [{ x: 800, y: 20 }, { x: 1000, y: 60 }];
let groundX = 0;
let score = 0;
let gameOver = false;

const bgMusic = document.getElementById("bgMusic");
document.addEventListener("keydown", () => bgMusic.play());

function drawGround() {
  groundX -= 4;
  if (groundX <= -canvas.width) groundX = 0;
  ctx.drawImage(groundImg, groundX, 180, canvas.width, 20);
  ctx.drawImage(groundImg, groundX + canvas.width, 180, canvas.width, 20);
}

function drawClouds() {
  clouds.forEach(cloud => {
    ctx.drawImage(cloudImg, cloud.x, cloud.y, 60, 30);
    cloud.x -= 1;
    if (cloud.x < -60) cloud.x = canvas.width + Math.random() * 100;
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawClouds();
  drawGround();

  ctx.drawImage(dino, dinoX, dinoY, 40, 40);
  dinoY += velocityY;
  if (dinoY < 160) velocityY += gravity;
  else {
    dinoY = 160;
    velocityY = 0;
    jumping = false;
  }

  if (!gameOver) {
    if (Math.random() < 0.02) obstacles.push({ x: canvas.width });
    for (let i = 0; i < obstacles.length; i++) {
      let obs = obstacles[i];
      ctx.drawImage(cactus, obs.x, 160, 30, 40);
      obs.x -= 6;
      if (obs.x < -30) {
        obstacles.splice(i, 1);
        score++;
      }
      if (obs.x < dinoX + 40 && obs.x + 30 > dinoX && dinoY + 40 > 160) {
        gameOver = true;
      }
    }
    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.fillText("Score: " + score, 700, 30);
  } else {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over! Press R to Restart", 200, 100);
  }

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !jumping) {
    velocityY = -12;
    jumping = true;
  } else if (e.code === "KeyR" && gameOver) {
    location.reload();
  }
});

gameLoop();
