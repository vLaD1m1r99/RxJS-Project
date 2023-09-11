import { Game } from './game';
import { loadImages, fetchImageAssets, fetchGameAssets } from './utils';

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
    console.error('Failed to fetch game assets. The game cannot start.');
  }
}
initializeAndStartGame();
