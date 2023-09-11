export class Platform {
  position: Vector2;
  size: Size;
  image: HTMLImageElement;

  constructor(position: Vector2, size: Size, image: HTMLImageElement) {
    this.position = position;
    this.size = size;
    this.image = image;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }
}
