import { gravity, playerSpeed, playerJump } from './utils';
type Vector2 = {
  x: number;
  y: number;
};
type Size = {
  width: number;
  height: number;
};
type Sprites = {
  stand: {
    right: HTMLImageElement;
    left: HTMLImageElement;
  };
  run: {
    right: HTMLImageElement;
    left: HTMLImageElement;
  };
};
export class Player {
  public position: Vector2;
  public velocity: Vector2;
  public size: Size;
  public canvas: HTMLCanvasElement;
  public sprites: Sprites;
  public currentFrame: number;
  public currentSprite: HTMLImageElement;
  public canJump: boolean;

  constructor(
    position: Vector2,
    velocity: Vector2,
    size: Size,
    canvas: HTMLCanvasElement,
    imgStandLeft: HTMLImageElement,
    imgStandRight: HTMLImageElement,
    imgRunLeft: HTMLImageElement,
    imgRunRight: HTMLImageElement
  ) {
    this.position = position;
    this.velocity = velocity;
    this.size = size;
    this.canvas = canvas;
    this.sprites = {
      stand: {
        right: imgStandRight,
        left: imgStandLeft,
      },
      run: {
        right: imgRunRight,
        left: imgRunLeft,
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentFrame = 0;
    this.canJump = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // const spriteOffset = this.currentFrame * 70;
    let cols = 9;
    let spriteWidth;
    this.currentSprite === this.sprites.stand.left ||
    this.currentSprite === this.sprites.stand.right
      ? (spriteWidth = this.currentSprite.width)
      : (spriteWidth = this.currentSprite.width / cols);
    // console.log(spriteWidth);
    let srcX = this.currentFrame * spriteWidth;
    let srcY = 0;
    ctx.drawImage(
      this.currentSprite,
      srcX,
      srcY,
      spriteWidth,
      this.currentSprite.height,
      this.position.x - this.currentFrame * 4.4,
      this.position.y,
      spriteWidth,
      this.currentSprite.height
    );
  }

  update() {
    let totalFrames = 9;
    this.currentSprite === this.sprites.stand.left ||
    this.currentSprite === this.sprites.stand.right
      ? (this.currentFrame = 0)
      : (this.currentFrame = this.currentFrame % totalFrames);

    // Updating player position and velocity
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (
      this.position.y + this.size.height + this.velocity.y <=
      this.canvas.height
    )
      this.velocity.y += gravity;
    this.draw(this.canvas.getContext('2d'));
  }
  moveLeft() {
    this.velocity.x = -playerSpeed;
  }
  moveRight() {
    this.velocity.x = +playerSpeed;
  }
  stop() {
    this.velocity.x = 0;
  }
  jump() {
    if (this.canJump === true) this.velocity.y = -playerJump;
  }
}
