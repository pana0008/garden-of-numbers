import GardenOfNumbers from './GardenOfNumbers.js';

const game: GardenOfNumbers = new GardenOfNumbers(document.getElementById('game') as HTMLCanvasElement);

window.addEventListener('load', () => {
  game.start();
});
