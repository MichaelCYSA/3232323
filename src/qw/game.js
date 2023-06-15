const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const jumpHeight = 170 
const gravity = 4 
const jumpPower = 1.5

class Platform {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 10;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Player {
    constructor() {
        this.x = 0;
        this.y = canvas.height - 45;
        this.moveY = canvas.height - 45;
        this.height = 45;
        this.width = 40;
        this.speed = 10;
        this.jumpDirection = 0;
        this.jumpCurrentHeight = 0;
        this.jumpSpeed = gravity * jumpPower;
        this.moveDirection = 0;
    }
    
    playerRender() {
        this.updateMovement();
        this.updateJump();
    }
    
    updateMovement() {
        this.x += this.moveDirection * this.speed;
        this.x = Math.max(0, Math.min(this.x, canvas.width));
    }

    
    checkCollision(platform) {
        if (
            this.moveY + this.height >= platform.y &&
            this.moveY + this.height <= platform.y + platform.height &&
            this.x + this.width >= platform.x &&
            this.x <= platform.x + platform.width
        ) {
            if (this.jumpDirection !== -1) {
                this.jumpDirection = 0;
                this.moveY = platform.y - this.height;
            }
        }
    }

    
    updateJump() {
        if (this.jumpDirection === 1) {
            this.jumpCurrentHeight += this.jumpSpeed;
            const jumpDistance = Math.sin((Math.PI / jumpHeight) * this.jumpCurrentHeight) * jumpHeight;
            this.moveY = canvas.height - this.height - jumpDistance;
    
            if (this.jumpCurrentHeight >= jumpHeight) {
                this.jumpDirection = -1;
                this.jumpCurrentHeight = 0;
            }
        } else if (this.jumpDirection === -1) {
            this.moveY += gravity;
            this.jumpCurrentHeight += gravity;
    
            if (this.moveY >= canvas.height - this.height) {
                this.jumpDirection = 0;
                this.jumpCurrentHeight = 0;
            }
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
        console.log('24');
        this.jumpDirection = 1;
    }
}

let player = new Player()

const platforms = []; // массив для хранения платформ

// генерация платформ
function generatePlatforms() {
    const platformCount = 5; // количество платформ
    const platformWidth = 80;
    const platformGap = 100;
    const maxPlatformHeight = canvas.height - jumpHeight - 100;

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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(gameLoop);

  drawPlatforms();

  platforms.forEach((platform) => {
      player.checkCollision(platform);
  });


  player.playerRender()

  ctx.fill = 'red'
  ctx.fillRect(player.x, player.moveY, player.width , player.height)
  let gravityState = player.moveY + gravity
  player.moveY = gravityState > player.y ? player.y : gravityState
}

generatePlatforms()
gameLoop()

document.addEventListener("keydown", function (event) {
    if (event.code === "ArrowLeft") {
        player.moveLeft()
      } else if (event.code === "ArrowRight") {
        player.moveRight()
      }
    if(player.jumpDirection === 0 && event.code === "Space"){
       player.jump()
    }
});


  document.addEventListener("keyup", function (event) {
    if (
      (event.code === "ArrowLeft") ||
      (event.code === "ArrowRight")
    ) {
      player.moveStop()
    }
  });