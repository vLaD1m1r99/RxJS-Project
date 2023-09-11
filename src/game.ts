import { fromEvent, merge, from } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MainMenu } from './mainMenu';
import { GameOver } from './gameOver';
import { YouWon } from './youWon';
import { Player } from './player';
import { Platform } from './platform';
import { Finish } from './finish';
import { Life } from './life';
import { GenericObject } from './genericObject';

export class Game {
  private ctx: CanvasRenderingContext2D;
  private imageAssets: ImageAssets;
  private gameAssets: GameAssets;
  private player: Player;
  private life: Life;
  private platforms: Platform[];
  private genericObjects: GenericObject[];
  private finish: Finish;
  private keys: Keys;
  private scrollOffset: number;
  private stagger: number = 0;
  private mainMenu: MainMenu;
  private gameOver: GameOver;
  private youWon: YouWon;
  private canvas: HTMLCanvasElement;

  constructor(
    canvas: HTMLCanvasElement,
    imageAssets: ImageAssets,
    gameAssets: GameAssets
  ) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.imageAssets = imageAssets;
    this.gameAssets = gameAssets;
    this.mainMenu = new MainMenu(
      canvas,
      imageAssets.mainMenu.background,
      imageAssets.mainMenu.play
    );
    this.gameOver = new GameOver(
      canvas,
      imageAssets.mainMenu.background,
      imageAssets.mainMenu.play
    );
    this.youWon = new YouWon(
      canvas,
      imageAssets.mainMenu.background,
      imageAssets.mainMenu.play
    );
    // Movement Keys
    this.keys = {
      right: { pressed: false },
      left: { pressed: false },
    };
    // Offset on a x axis from start
    this.scrollOffset = 0;
    // Creating Player
    this.createPlayer(canvas, imageAssets.character);
    // Creating Platforms
    this.createPlatforms(canvas, imageAssets.platform);
    // Creating General Objects
    this.createGenericObjects(canvas, imageAssets.background);
    // Creating Finish Object
    this.createFinishLine(imageAssets.finish);
    // Creating Life Objects
    this.createLives(imageAssets.life);
    // Event listeners for keyboard input
    this.gameMovement();
  }

  private createPlayer(
    canvas: HTMLCanvasElement,
    characterAssets: CharacterAssets
  ) {
    this.player = new Player(
      { x: 50, y: 50 },
      { x: 0, y: 0 },
      {
        width: characterAssets.characterStandRight.width,
        height: characterAssets.characterStandRight.height,
      },
      canvas,
      characterAssets.characterStandLeft,
      characterAssets.characterStandRight,
      characterAssets.characterMoveLeft,
      characterAssets.characterMoveRight,
      this.gameAssets.gravity,
      this.gameAssets.playerSpeed,
      this.gameAssets.playerJump
    );
  }
  private createPlatforms(
    canvas: HTMLCanvasElement,
    platformImage: HTMLImageElement
  ) {
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
    while (this.gameAssets.winingLength > lastX - maxGap) {
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
  private createGenericObjects(
    canvas: HTMLCanvasElement,
    backgroundImage: HTMLImageElement
  ) {
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
  private createFinishLine(finishImage: HTMLImageElement) {
    const lastPlatform = this.platforms[this.platforms.length - 1];
    this.finish = new Finish(finishImage);
  }
  private createLives(lifeImage: HTMLImageElement) {
    this.life = new Life(
      {
        x: this.canvas.width,
        y: 10,
      },
      lifeImage,
      3
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
    this.createPlayer(this.canvas, this.imageAssets.character);
    this.createPlatforms(this.canvas, this.imageAssets.platform);
    this.createGenericObjects(this.canvas, this.imageAssets.background);
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
    this.life.draw(this.ctx);
    this.finish.draw(this.ctx, {
      x: this.gameAssets.winingLength - this.scrollOffset + 400,
      y:
        this.platforms[this.platforms.length - 1].position.y -
        this.finish.image.height,
    });
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
        this.scrollOffset += this.gameAssets.playerSpeed;
        this.platforms.forEach((platform) => {
          platform.position.x -= this.gameAssets.playerSpeed;
        });
        this.genericObjects.forEach((genericObject) => {
          genericObject.position.x -= this.gameAssets.genericObjectSpeed;
        });
      } else if (this.keys.left.pressed && this.scrollOffset > 0) {
        this.scrollOffset -= this.gameAssets.playerSpeed;
        this.platforms.forEach((platform) => {
          platform.position.x += this.gameAssets.platformSpeed;
        });
        this.genericObjects.forEach((genericObject) => {
          genericObject.position.x += this.gameAssets.genericObjectSpeed;
        });
      }
    }
  }
  private gameStatus() {
    // Win condition
    if (this.scrollOffset > this.gameAssets.winingLength) {
      this.youWon.setInYouWon();
      this.restart();
      this.life.life = 3;
    }
    // Lose condition and game restart
    if (this.player.position.y > this.canvas.height) {
      this.life.life--;
      if (this.life.life <= 0) {
        this.gameOver.setInGameOver();
        this.restart();
        this.life.life = 3;
      } else {
        this.restart();
      }
    }
  }
  private gameLoop() {
    requestAnimationFrame(() => this.gameLoop());
    if (this.mainMenu.getInMainMenu()) this.mainMenu.drawMainMenu();
    else if (this.gameOver.getInGameOver()) this.gameOver.drawGameOver();
    else if (this.youWon.getInYouWon()) this.youWon.drawYouWon();
    else {
      this.draw();
      this.checkForColision();
      this.checkMovement();
      this.gameStatus();
      this.player.update();
    }
  }

  public start() {
    this.gameLoop();
  }
}
