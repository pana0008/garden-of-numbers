import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import PlantedFruits from './PlantedFruits.js';

type Fruit = {
  fruitType: string,
  count: number,
  image: string
};

export default class PlantingScene extends Scene {
  private goToWater: boolean;

  private plantSeeds: Fruit[] = [];

  private appleCount: number;

  private cherryCount: number;

  private blueberryCount: number;

  private strawberryCount: number;

  private bananaCount: number;

  private points: number;

  private garden: HTMLDivElement;

  public constructor(canvas: HTMLCanvasElement, points: number, appleCount: number,
    cherryCount: number, blueberryCount: number, strawberryCount: number, bananaCount: number) {
    super(canvas);

    this.points = points;

    this.appleCount = appleCount;
    this.cherryCount = cherryCount;
    this.blueberryCount = blueberryCount;
    this.strawberryCount = strawberryCount;
    this.bananaCount = bananaCount;

    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/plantScene/plantingSeeds.png\')';
    this.canvas.style.backgroundColor = '#4f2f1c';
    this.canvas.parentElement!.style.position = 'relative';
    document.body.style.cursor = 'none';
    this.goToWater = false;

    this.plantSeeds = [
      { fruitType: 'appel', count: this.appleCount, image: './assets/plantScene/seeds.png' },
      { fruitType: 'kers', count: this.cherryCount, image: './assets/plantScene/seeds.png' },
      { fruitType: 'bosbes', count: this.blueberryCount, image: './assets/plantScene/seeds.png' },
      { fruitType: 'aardbei', count: this.strawberryCount, image: './assets/plantScene/seeds.png' },
      { fruitType: 'banaan', count: this.bananaCount, image: './assets/plantScene/seeds.png' }
    ];

    this.garden = document.createElement('div');
    this.garden.style.backgroundImage = 'url(\'./assets/fruitsScene/garden.png\')';
    this.garden.classList.add('div-bottom');
    this.garden.style.padding = '120px 0';

    this.canvas.parentElement!.appendChild(this.garden);

    this.plantSeeds.forEach((fruit: Fruit) => {
      for (let i: number = 0; i < fruit.count; i++) {
        const fruitImage: HTMLImageElement = document.createElement('img');
        fruitImage.src = fruit.image;
        fruitImage.classList.add('fruit-image');
        this.garden.appendChild(fruitImage);
      }
    });
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_ENTER)) {
      this.goToWater = true;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goToWater) {
      document.body.removeChild(this.garden);
      return new PlantedFruits(this.canvas, this.points, this.appleCount, this.cherryCount,
        this.blueberryCount, this.strawberryCount, this.bananaCount);
    } else {
      return null;
    }
  }

  /**
   * Render all the elements on the screen.
   */
  public render(): void {
    // Clear the canvas using CanvasRenderer
    CanvasRenderer.clearCanvas(this.canvas);
  }
}
