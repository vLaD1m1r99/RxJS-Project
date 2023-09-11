export class Finish {
  image: HTMLImageElement;

  constructor(image: HTMLImageElement) {
    this.image = image;
  }

  draw(ctx: CanvasRenderingContext2D, position: Vector2) {
    ctx.drawImage(
      this.image,
      position.x,
      position.y,
      this.image.width,
      this.image.height
    );
  }
}
