type Vector2 = {
  x: number;
  y: number;
};
type Size = {
  width: number;
  height: number;
};
export class GenericObject {
  public position: Vector2;
  public size: Size;
  image: HTMLImageElement;

  constructor(position: Vector2, size: Size, image: HTMLImageElement) {
    this.position = position;
    this.size = size;
    this.image = image;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }
}
