export class Life {
  life: number;
  position: Vector2;
  image: HTMLImageElement;

  constructor(position: Vector2, image: HTMLImageElement, life: number) {
    this.life = life;
    this.position = position;
    this.image = image;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const heartWidth = 30;
    const heartHeight = 30;
    const heartSpacing = 10;
    const initialX = this.position.x - 10 - (heartWidth + heartSpacing) * 3;
    for (let i = 0; i < this.life; i++) {
      const x = initialX + i * (heartWidth + heartSpacing);
      ctx.drawImage(this.image, x, this.position.y, heartWidth, heartHeight);
    }
  }
}
