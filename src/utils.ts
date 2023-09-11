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
async function loadImage(path: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = `./img/${path}`;
  });
}

export async function loadImages(assets: any) {
  const data = { ...assets };

  try {
    for (const key in data) {
      if (typeof data[key] === 'string') {
        data[key] = await loadImage(data[key]);
      } else
        for (const subKey in data[key]) {
          const imagePath = data[key][subKey];
          if (typeof imagePath === 'string') {
            data[key][subKey] = await loadImage(imagePath);
          }
        }
    }
  } catch (error) {
    console.error(`Error loading assets!`, error);
  }

  return data;
}
