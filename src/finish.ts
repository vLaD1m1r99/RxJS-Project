export class Finish {
  position: Vector2;
  image: HTMLImageElement;

  constructor(position: Vector2, image: HTMLImageElement) {
    this.position = position;
    this.image = image;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.image.width,
      this.image.height
    );
  }
}
