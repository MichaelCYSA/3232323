const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const jumpHeight = 170;
const steps = 25;

const jumpPower = (jumpHeight / steps) ** (1 / 2) / steps;

const jumpSteps = (() => {
  const arr = [];
  let prev = null;
  for (let i = 0; i <= steps; i++) {
    let result = Math.round(i * (i * jumpPower) ** 2);
    arr.push(prev ? result - prev : result);
    prev = result;
  }
  return arr;
})();

const maxJumpStep = Math.max(...jumpSteps);

class Platform {
  constructor(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 10;
  }

  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function approximatelyEqual(a, b, epsilon) {
  return Math.abs(a - b) < epsilon;
}

class Player {
  constructor() {
    this.x = 0;
    this.y = canvas.height - 45;
    this.height = 45;
    this.width = 40;
    this.speed = 10;

    this.jumpDirection = 0;
    this.moveDirection = 0;
    this.hasJumped = false;
    this.stepIndex = jumpSteps.length - 1;
    this.onPlatform = true;
  }

  playerRender(platforms) {
    this.updateMovement();
    this.updateJump();
    platforms.forEach((platform) => {
      this.checkCollision(platform);
    });
  }

  updateMovement() {
    this.x += this.moveDirection * this.speed;
    this.x = Math.max(0, Math.min(this.x, canvas.width));
  }

  checkCollision(platform) {

      if (
        this.y + this.height >= platform.y && // если игрок ниже верхней части платформы
        this.y + this.height <= platform.y + platform.height + maxJumpStep && // если игрок выше нижней части платформы
        this.x + this.width >= platform.x &&
        this.x <= platform.x + platform.width &&
        this.jumpDirection !== 1 && !this.onPlatform
      ) {
        this.y = platform.y - this.height - maxJumpStep;
        this.hasJumped = false;
        this.jumpDirection = 0;
        this.stepIndex = steps - 2;
        this.onPlatform = true;
        console.log('onPlatform')
      }else if(!this.hasJumped && this.onPlatform){
         this.onPlatform = false
      }

    if (this.y + this.height >= canvas.height) {
      this.onPlatform = true;
      this.y = canvas.height - this.height;
    }

    if (!this.onPlatform && !this.hasJumped) {
      this.y = this.y + 5; 
    }
  }
  updateJump() {
    if (this.jumpDirection === 1) {
      if (this.stepIndex - 1 < 0) {
        this.stepIndex = 1;
        this.jumpDirection = -1;
      }
      this.y -= jumpSteps[this.stepIndex];
      this.stepIndex--;
    } else if (this.jumpDirection === -1) {
      if (this.stepIndex + 1 > steps - 1) {
        this.jumpDirection = 0;
        this.stepIndex = steps - 1;
        this.hasJumped = false;
      }
      this.stepIndex++;
      this.y += jumpSteps[this.stepIndex];
    }
  }

  moveLeft() {
    this.moveDirection = -1;
  }

  moveRight() {
    this.moveDirection = 1;
  }

  moveStop() {
    this.moveDirection = 0;
  }

  jump() {
    if (this.jumpDirection === 0) {
      this.jumpDirection = 1;
      this.hasJumped = true;
      this.onPlatform = false;
    }
  }
}

let player = new Player();

const platforms = [];

function generatePlatforms() {
  const platformCount = 5
  ;
  const platformWidth = 80;
  const platformGap = 100;
  const maxPlatformHeight = canvas.height  - 100;

  let platformX = 0;
  let platformY = canvas.height - platformGap;

  for (let i = 0; i < platformCount; i++) {
    const platform = new Platform(platformX, platformY, platformWidth);
    platforms.push(platform);

    platformX += platformWidth + platformGap;
    platformY = Math.random() * (maxPlatformHeight - 50) + 50;
  }
}

function drawPlatforms() {
  platforms.forEach((platform) => {
    platform.draw();
  });
}

const gameLoop = () => {
  requestAnimationFrame(gameLoop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

 

  drawPlatforms();

  player.playerRender(platforms);

  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);
};

generatePlatforms();
gameLoop();

document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowLeft") {
    player.moveLeft();
  } else if (event.code === "ArrowRight") {
    player.moveRight();
  }
  if (event.code === "Space") {
    player.jump();
  }
});

document.addEventListener("keyup", function (event) {
  if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
    player.moveStop();
  }
});
