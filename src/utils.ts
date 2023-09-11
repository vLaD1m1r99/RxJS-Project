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
export async function fetchImageAssets() {
  try {
    const response = await fetch('http://localhost:3000/imageAssets');
    if (!response.ok) {
      throw new Error('Failed to fetch image assets');
    }
    const assets = await response.json();
    return assets;
  } catch (error) {
    console.error('Error fetching image assets', error);
    return null;
  }
}
export async function fetchGameAssets() {
  try {
    const response = await fetch('http://localhost:3000/gameAssets');
    if (!response.ok) {
      throw new Error('Failed to fetch game assets');
    }
    const assets = await response.json();
    return assets;
  } catch (error) {
    console.error('Error fetching game assets', error);
    return null;
  }
}
