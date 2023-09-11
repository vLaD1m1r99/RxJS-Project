import { Game } from './game';
import { loadImages } from './utils';

async function fetchImageAssets() {
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
async function fetchGameAssets() {
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

async function initializeAndStartGame() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.style.backgroundColor = '#7f7053';
  canvas.style.position = 'absolute';
  canvas.style.left = '50%';
  canvas.style.top = '50%';
  canvas.style.transform = 'translate(-50%, -50%)';
  canvas.width = 1024;
  canvas.height = 768;

  // Fetch image assets
  const imageAssets: StringImageAssets = await fetchImageAssets();
  // Fetch game assets
  const gameAssets = await fetchGameAssets();

  if (gameAssets && imageAssets) {
    const loadedImageAssets: ImageAssets = await loadImages(imageAssets);
    const game = new Game(canvas, loadedImageAssets, gameAssets);
    game.start();
  } else {
    // Maybe create error html
    console.error('Failed to fetch game assets. The game cannot start.');
  }
}
initializeAndStartGame();
