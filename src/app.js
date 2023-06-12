import "./styles/styles.css";
import RandomUtil from "./utils/random.util";
import platformImages from "./constants/platforms";

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

const platformWidth = 65;
const platformHeight = 20;
const platformStart = canvas.height - 50;

const gravity = 0.33;
const drag = 0.3;
const bounceVelocity = -12.5;

let minPlatformSpace = 15;
let maxPlatformSpace = 20;
let score = 0;

const springRandom = {
  coefficient: 20,
  number: 1,
};

const scoreHistory = [];

let platforms = [
  {
    x: canvas.width / 2 - platformWidth / 2,
    y: platformStart,
    hasScored: false,
  },
];

let y = platformStart;
while (y > 0) {
  y -=
    platformHeight +
    RandomUtil.limitedRandom(minPlatformSpace, maxPlatformSpace);

  let x;
  do {
    x = RandomUtil.limitedRandom(25, canvas.width - 25 - platformWidth);
  } while (
    y > canvas.height / 2 &&
    x > canvas.width / 2 - platformWidth * 1.5 &&
    x < canvas.width / 2 + platformWidth / 2
  );

  platforms.push({
    x,
    y,
    hasScored: false,
    spring: RandomUtil.randomBoolean(
      springRandom.coefficient,
      springRandom.number
    ),
  });
}

const doodle = {
  width: 40,
  height: 60,
  x: canvas.width / 2 - 20,
  y: platformStart - 60,

  dx: 0,
  dy: 0,
};

let playerDir = 0;
let keydown = false;
let prevDoodleY = doodle.y;

let gameOver = false;

function loop() {
  if (doodle.y - doodle.height > canvas.height && !gameOver) {
    gameOver = true;
  }

  if (gameOver) {
    gameOverScreen();
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(loop);

  doodle.dy += gravity;

  if (doodle.y < canvas.height / 2 && doodle.dy < 0) {
    platforms.forEach(function (platform) {
      platform.y += -doodle.dy;
    });

    while (platforms[platforms.length - 1].y > 0) {
      platforms.push({
        x: RandomUtil.limitedRandom(25, canvas.width - 25 - platformWidth),
        y:
          platforms[platforms.length - 1].y -
          (platformHeight +
            RandomUtil.limitedRandom(minPlatformSpace, maxPlatformSpace)),
        hasScored: false,
        spring: RandomUtil.randomBoolean(
          springRandom.coefficient,
          springRandom.number
        ),
      });

      minPlatformSpace += 0.5;
      maxPlatformSpace += 0.5;

      maxPlatformSpace = Math.min(maxPlatformSpace, canvas.height / 2);
    }
  } else {
    doodle.y += doodle.dy;
  }

  if (!keydown) {
    if (playerDir < 0) {
      doodle.dx += drag;

      if (doodle.dx > 0) {
        doodle.dx = 0;
        playerDir = 0;
      }
    } else if (playerDir > 0) {
      doodle.dx -= drag;

      if (doodle.dx < 0) {
        doodle.dx = 0;
        playerDir = 0;
      }
    }
  }

  doodle.x += doodle.dx;

  if (doodle.x + doodle.width < 0) {
    doodle.x = canvas.width;
  } else if (doodle.x > canvas.width) {
    doodle.x = -doodle.width;
  }

  context.fillStyle = "green";
  platforms.forEach(function (platform) {
    if (platform.spring) {
      const x = platform.x + (platformWidth - 20) / 2;
      context.fillRect(x, platform.y - platformHeight, 20, 20);
    }
    // 'greenplatform.png'
    // context.fillRect(platform.x, platform.y, platformWidth, platformHeight);
    context.drawImage(platformImages.green, platform.x, platform.y, platformWidth, platformHeight);
    if (
      doodle.dy > 0 &&
      prevDoodleY + doodle.height <= platform.y &&
      doodle.x < platform.x + platformWidth &&
      doodle.x + doodle.width > platform.x &&
      doodle.y < platform.y + platformHeight &&
      doodle.y + doodle.height > platform.y
    ) {
      if (!platform.hasScored) {
        doodle.y = platform.y - doodle.height;
        if (platform.spring) {
          doodle.dy = bounceVelocity * 2;
        } else {
          doodle.dy = bounceVelocity;
        }
        platform.hasScored = true;
        score++;
      } else {
        doodle.y = platform.y - doodle.height;
        if (platform.spring) {
          doodle.dy = bounceVelocity * 2;
        } else {
          doodle.dy = bounceVelocity;
        }
      }
    }
  });

  context.fillStyle = "yellow";
  context.fillRect(doodle.x, doodle.y, doodle.width, doodle.height);

  prevDoodleY = doodle.y;

  platforms = platforms.filter(function (platform) {
    return platform.y < canvas.height;
  });

  context.fillStyle = "red";
  context.font = "16px Arial";
  context.fillText("Score: " + score, 10, 20);
}

function gameOverScreen() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "red";
  context.font = "40px Arial";
  context.textAlign = "center";
  context.fillText("Game Over", canvas.width / 2, canvas.height / 2);

  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText(
    "Press Space to Restart",
    canvas.width / 2,
    canvas.height / 2 + 40
  );
  context.fillText(
    `Current score: ${score}`,
    canvas.width / 2,
    canvas.height / 2 + 80
  );
  if (scoreHistory.length > 0) {
    context.fillText(
      `Max Score: ${Math.max(...scoreHistory)}`,
      canvas.width / 2,
      canvas.height / 2 + 120
    );
  }
}

function restartGame() {
  gameOver = false;
  platforms = [
    {
      x: canvas.width / 2 - platformWidth / 2,
      y: platformStart,
      hasScored: false,
      spring: RandomUtil.randomBoolean(
        springRandom.coefficient,
        springRandom.number
      ),
    },
  ];
  doodle.x = canvas.width / 2 - 20;
  doodle.y = platformStart - 60;
  doodle.dx = 0;
  doodle.dy = 0;
  playerDir = 0;
  keydown = false;
  prevDoodleY = doodle.y;
  scoreHistory.push(score);
  score = 0;

  loop();
}

document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowLeft") {
    playerDir = -1;
    doodle.dx = -5;
    keydown = true;
  } else if (event.code === "ArrowRight") {
    playerDir = 1;
    doodle.dx = 5;
    keydown = true;
  }
});

document.addEventListener("keyup", function (event) {
  if (
    (event.code === "ArrowLeft" && playerDir === -1) ||
    (event.code === "ArrowRight" && playerDir === 1)
  ) {
    keydown = false;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  loop();
});

document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && gameOver) {
    restartGame();
  }
});
