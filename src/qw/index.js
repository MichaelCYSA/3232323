const canvas = document.getElementById("gameField");
const context = canvas.getContext("2d");

class Player {
  constructor() {
    this.inJumping = false;
    this.maxJumpHeight = 100;
    this.jumpingHeight = 0;
    this.velocity = 15;
    this.gravity = 10;
    this.height = 75;
    this.width = 40;
    this.x = 0;
    this.y = canvas.height - this.height;
    this.speed = 10;
  }

  moveLeft() {
    if (this.x - this.speed > 0) {
      this.x = this.x - this.speed;
    } else {
      this.x = 0;
    }
  }
  moveRight() {
    if (this.x + this.speed < canvas.width) {
      this.x = this.x + this.speed;
    } else {
      this.x = canvas.width;
    }
  }
  pressJump() {
    if (!this.inJumping) {
      this.inJumping = true;
      console.log("assdadsasd");
    }
  }
  drawJump() {
    const currentJumpingHeight = this.jumpingHeight - this.gravity;
    if (this.inJumping && this.maxJumpHeight > this.jumpingHeight) {
      this.jumpingHeight = this.jumpingHeight + this.velocity;
      console.log(this.jumpingHeight);
    } else if (!this.inJumping && this.jumpingHeight > 0) {
      this.jumpingHeight = currentJumpingHeight < 0 ? 0 : currentJumpingHeight;
    } else if (this.inJumping && this.jumpingHeight === this.maxJumpHeight) {
      this.inJumping = false;
    }

    this.y = this.y - this.jumpingHeight
  }
}

const player = new Player();

function loop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(loop);

  console.log(player.y);
  player.drawJump();

  context.fillStyle = "black";
  context.fillRect(player.x, player.y, player.width, player.height);
}

loop();

document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowLeft") {
    player.moveLeft();
  }
  if (event.code === "ArrowRight") {
    player.moveRight();
  }
  if (event.code === "Space") {
    player.pressJump();
  }
});
