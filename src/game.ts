import { Player } from './player';
import { Platform } from './platform';
import { fromEvent, merge, from } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GenericObject } from './genericObject';
import {
  createImage,
  genericObjectSpeed,
  platformSpeed,
  playerSpeed,
  winingLength,
} from './utils';

const platformImage = createImage('./img/platform.png');
const backgroundImage = createImage('./img/bg.png');
const finishImage = createImage('./img/finish.png');
const charRunLeftImage = createImage('./img/charMoveLeft.png');
const charRunRightImage = createImage('./img/charMoveRight.png');
const charStandLeftImage = createImage('./img/charStandLeft.png');
const charStandRightImage = createImage('./img/charStandRight.png');

type Keys = {
  right: { pressed: boolean };
  left: { pressed: boolean };
};
export class Game {
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private platforms: Platform[];
  private genericObjects: GenericObject[];
  private keys: Keys;
  private scrollOffset: number;
  private stagger: number = 0;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    // Movement Keys
    this.keys = {
      right: { pressed: false },
      left: { pressed: false },
    };
    // Offset on a x axis from start
    this.scrollOffset = 0;
    // Creating Player
    this.createPlayer(canvas);
    // Creating Platforms
    this.createPlatforms(canvas);
    // Creating General Objects
    this.createGenericObjects(canvas);
    // // Add event listeners for keyboard input
    this.gameMovement();
  }
  private createPlayer(canvas: HTMLCanvasElement) {
    this.player = new Player(
      { x: 50, y: 50 },
      { x: 0, y: 0 },
      {
        width: charStandRightImage.width,
        height: charStandRightImage.height,
      },
      canvas,
      charStandLeftImage,
      charStandRightImage,
      charRunLeftImage,
      charRunRightImage
    );
  }
  private createPlatforms(canvas: HTMLCanvasElement) {
    this.platforms = [];
    // Creating first platfom
    this.platforms.push(
      new Platform(
        { x: 0, y: 700 },
        { width: platformImage.width, height: platformImage.height },
        platformImage
      )
    );
    // Gap constants
    const minGap = 100;
    const maxGap = 300;
    let lastX = platformImage.width;
    // Creating all other random platforms
    while (winingLength > lastX - maxGap) {
      const x = lastX + Math.random() * (maxGap - minGap) + minGap;
      const y = canvas.height - platformImage.height - Math.random() * 200;
      lastX = x + platformImage.width;
      this.platforms.push(
        new Platform(
          { x, y },
          { width: platformImage.width, height: platformImage.height },
          platformImage
        )
      );
    }
  }
  private createGenericObjects(canvas: HTMLCanvasElement) {
    this.genericObjects = [];

    for (let i = 0; i < 10; i++) {
      this.genericObjects.push(
        new GenericObject(
          { x: backgroundImage.width * i, y: 0 },
          {
            width: backgroundImage.width,
            height:
              canvas.height - backgroundImage.height + backgroundImage.height,
          },
          backgroundImage
        )
      );
    }
  }
  private drawFinishLine() {
    const lastPlatform = this.platforms[this.platforms.length - 1];
    this.ctx.drawImage(
      finishImage,
      winingLength - this.scrollOffset + 400,
      lastPlatform.position.y - finishImage.height,
      finishImage.width,
      finishImage.height
    );
  }
  private gameMovement() {
    const keydown$ = fromEvent(document, 'keydown').pipe(
      filter((event: KeyboardEvent) => {
        return (
          event.code === 'KeyA' ||
          event.code === 'KeyD' ||
          event.code === 'Space'
        );
      })
    );

    const keyup$ = fromEvent(document, 'keyup').pipe(
      filter((event: KeyboardEvent) => {
        return (
          event.code === 'KeyA' ||
          event.code === 'KeyD' ||
          event.code === 'Space'
        );
      })
    );

    merge(keydown$, keyup$).subscribe((event: KeyboardEvent) => {
      if (this.player) {
        if (event.type === 'keydown') {
          if (event.code === 'KeyA') {
            this.keys.left.pressed = true;
            this.player.currentSprite = this.player.sprites.run.left;
          }
          if (event.code === 'KeyD') {
            this.keys.right.pressed = true;
            this.player.currentSprite = this.player.sprites.run.right;
          }
          if (event.code === 'Space') {
            this.player.jump();
            this.player.canJump = false;
          }
        } else if (event.type === 'keyup') {
          if (event.code === 'KeyA') {
            this.keys.left.pressed = false;
            this.player.currentSprite = this.player.sprites.stand.left;
          }
          if (event.code === 'KeyD') {
            this.keys.right.pressed = false;
            this.player.currentSprite = this.player.sprites.stand.right;
          }
        }
      }
    });
  }
  private restart() {
    this.createPlayer(this.canvas);
    this.createPlatforms(this.canvas);
    this.createGenericObjects(this.canvas);
    this.scrollOffset = 0;
  }

  private draw() {
    // Drawing the game
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (this.genericObjects)
      this.genericObjects.forEach((genericObject) => {
        genericObject.draw(this.ctx);
      });
    if (this.player) {
      if (this.stagger >= 15) {
        this.player.currentFrame++;
        this.stagger = 0;
      }
      this.player.draw(this.ctx);
    }
    this.stagger++;
    if (this.platforms)
      this.platforms.forEach((platform) => {
        platform.draw(this.ctx);
      });
    this.drawFinishLine();
  }

  private checkForColision() {
    from(this.platforms)
      .pipe(
        filter(
          (platform) =>
            this.player.position.y + this.player.size.height <=
              platform.position.y &&
            this.player.position.y +
              this.player.size.height +
              this.player.velocity.y >=
              platform.position.y &&
            this.player.position.x + this.player.size.width >=
              platform.position.x &&
            this.player.position.x <= platform.position.x + platform.size.width
        )
      )
      .subscribe(() => {
        this.player.velocity.y = 0;
        this.player.canJump = true;
      });
  }

  private checkMovement() {
    if (this.keys.right.pressed && this.player.position.x < 400)
      this.player.moveRight();
    else if (
      (this.keys.left.pressed && this.player.position.x > 100) ||
      (this.keys.left.pressed &&
        this.scrollOffset === 0 &&
        this.player.position.x > 0)
    ) {
      this.player.moveLeft();
    } else {
      this.player.stop();
      if (this.keys.right.pressed) {
        this.scrollOffset += playerSpeed;
        this.platforms.forEach((platform) => {
          platform.position.x -= platformSpeed;
        });
        this.genericObjects.forEach((genericObject) => {
          genericObject.position.x -= genericObjectSpeed;
        });
      } else if (this.keys.left.pressed && this.scrollOffset > 0) {
        this.scrollOffset -= playerSpeed;
        this.platforms.forEach((platform) => {
          platform.position.x += platformSpeed;
        });
        this.genericObjects.forEach((genericObject) => {
          genericObject.position.x += genericObjectSpeed;
        });
      }
    }
  }
  private gameStatus() {
    // Win condition
    if (this.scrollOffset > winingLength) console.log('you win');
    // Lose condition and game restart
    if (this.player.position.y > this.canvas.height) this.restart();
  }
  private gameLoop() {
    requestAnimationFrame(() => this.gameLoop());
    this.draw();
    this.checkForColision();
    this.checkMovement();
    this.gameStatus();
    this.player.update();
  }

  public start() {
    this.gameLoop();
  }
}
