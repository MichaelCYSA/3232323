const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const jumpHeight = 170;
const steps = 35;
const platformCount = 100;

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

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * max) + min;
};

const maxJumpStep = Math.max(...jumpSteps);

class Platform {
  constructor(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 40;
  }

  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 45;
    this.height = 45;
    this.width = 40;
    this.speed = 15;

    this.jumpDirection = 0;
    this.moveDirection = 0;
    this.hasJumped = false;
    this.stepIndex = jumpSteps.length - 1;
    this.onPlatform = true;
    this.aheadPremonitionLeft = false;
    this.aheadPremonitionRight = false;
    this.aheadPremonitionJumpCount = 0;
  }

  playerRender(platforms) {
    this.updateJump();
    platforms.forEach((platform) => {
      this.checkCollision(platform);
    });
  }
  checkCollision(platform) {
    const playerFullY = this.y + this.height;

    // проверка если игрок столкнулся с платформой с верху
    if (
      playerFullY <= platform.y &&
      playerFullY + jumpSteps[this.stepIndex] >= platform.y &&
      this.x + this.width >= platform.x &&
      this.x <= platform.x + platform.width &&
      this.jumpDirection !== 1
    ) {
      this.y = platform.y - this.height;
      this.hasJumped = false;
      this.jumpDirection = 0;
      this.stepIndex = steps - 1;
      this.onPlatform = true;
      // проверка если игрок столкнулся с платформой с низу
    } else if (
      this.y >= platform.y + platform.height - jumpSteps[this.stepIndex] &&
      this.y - jumpSteps[this.stepIndex] <=
        platform.y + platform.height - jumpSteps[this.stepIndex] &&
      this.x + this.width >= platform.x &&
      this.x <= platform.x + platform.width &&
      this.jumpDirection === 1
    ) {
      this.y = platform.y + platform.height;
      this.hasJumped = false;
      this.jumpDirection = 0;
      this.stepIndex = steps - 1;
      this.onPlatform = false;
      this.aheadPremonitionJumpCount = 10;
      // проверка если игрок столкнулся с платформой с боку с лева
    } else if (
      this.x + this.width >= platform.x && // Проверяем, что правая сторона персонажа достигла левой стороны платформы
      this.x + this.width <= platform.x + platform.width && // Проверяем, что левая сторона персонажа не вышла за правую сторону платформы
      this.y + this.height >= platform.y && // Проверяем, что персонаж находится выше верхней границы платформы
      this.y <= platform.y + platform.height // Проверяем, что
    ) {
      // this.moveDirection = 0;

      this.aheadPremonitionLeft = true;
    } else if (
      this.x <= platform.x + platform.width && // Проверяем, что левая сторона персонажа достигла или превысила правую сторону платформы
      this.x >= platform.x && // Проверяем, что правая сторона персонажа не вышла за левую сторону платформы
      this.y + this.height > platform.y && // Проверяем, что персонаж находится выше верхней границы платформы
      this.y < platform.y + platform.height // Проверяем, что персонаж ниже нижней границы платформы
    ) {
      // this.moveDirection = 0;
      this.aheadPremonitionRight = true;
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
    if (this.jumpDirection === 0 && this.onPlatform) {
      this.jumpDirection = 1;
      this.hasJumped = true;
      this.onPlatform = false;
    }
  }
}

let player = new Player();

let platforms = [];

function generatePlatforms() {
  let prevPlatformX = 0;
  let prevPlatformY = canvas.height - jumpHeight + player.y;
  const minGap = 20;
  const maxPlatformHeightGap = 200;
  const minPlatformHeight = 100;
  const platformDirection = Math.random() < 0.5;

  for (let i = 0; i < platformCount; i++) {
    const platformWidth = getRandomNumber(30, 120);
    let platformY;

    if (
      platformDirection &&
      prevPlatformY - maxPlatformHeightGap > minPlatformHeight
    ) {
      platformY = prevPlatformY - getRandomNumber(minGap, maxPlatformHeightGap);
    } else if (prevPlatformY + minPlatformHeight < canvas.height - minGap) {
      platformY = prevPlatformY + getRandomNumber(minGap, maxPlatformHeightGap);
    } else {
      platformY = prevPlatformY - getRandomNumber(minGap, maxPlatformHeightGap);
    }

    const platformX = prevPlatformX + getRandomNumber(minGap, 150);
    prevPlatformX = platformX;
    prevPlatformY = platformY;

    const platform = new Platform(platformX, platformY, platformWidth);
    platforms.push(platform);
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

  const updatedPlatforms = platforms.map((platform) => {
    if (player.moveDirection === 1 && !player.aheadPremonitionLeft) {
      platform.x = platform.x - player.speed;
    }
    if (player.moveDirection === -1 && !player.aheadPremonitionRight) {
      platform.x = platform.x + player.speed;
    }
    if (player.aheadPremonitionLeft) {
      platform.x - 1;
    }
    if (player.aheadPremonitionRight) {
      platform.x + 1;
    }

    return platform;
  });

  platforms = updatedPlatforms;

  player.aheadPremonitionLeft = false;
  player.aheadPremonitionRight = false;
  player.onPlatform = false;
  player.aheadPremonitionJumpCount =
  player.aheadPremonitionJumpCount - 1 < 0
    ? 0
    : player.aheadPremonitionJumpCount - 1;
  player.playerRender(platforms);

 

  if (
    !player.onPlatform &&
    !player.hasJumped &&
    player.aheadPremonitionJumpCount === 0
  ) {
    player.y = player.y + maxJumpStep;
  }
  if (player.y + player.height >= canvas.height) {
    player.onPlatform = true;
    player.y = canvas.height - player.height;
  }

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
