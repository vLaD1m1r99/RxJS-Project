export const gravity = 0.5;
export const playerSpeed = 5;
export const playerJump = 15;
export const platformSpeed = 5;
export const genericObjectSpeed = 3;
export const winingLength = 10000;
export function createImage(imageSrc: string) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}
export function createGap() {
  return;
}
