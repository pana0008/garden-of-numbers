import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import PlantedVegetables from './PlantedVegetables.js';

type Vegetable = {
  vegetableType: string,
  count: number,
  image: string
};

export default class PlantingVegetablesScene extends Scene {
  private goToWater: boolean;

  private plantSeeds: Vegetable[] = [];

  private cucumberCount: number = 0;

  private potatoCount: number = 0;

  private carrotCount: number = 0;

  private cornCount: number = 0;

  private pumpkinCount: number = 0;

  private points: number;

  private garden: HTMLDivElement;

  public constructor(canvas: HTMLCanvasElement, points: number, cucumberCount: number,
    potatoCount: number, carrotCount: number, cornCount: number, pumpkinCount: number) {
    super(canvas);

    this.points = points;
    this.cucumberCount = cucumberCount;
    this.potatoCount = potatoCount;
    this.carrotCount = carrotCount;
    this.cornCount = cornCount;
    this.pumpkinCount = pumpkinCount;

    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/plantScene/plantingSeeds.png\')';
    this.canvas.style.backgroundColor = '#4f2f1c';
    this.canvas.parentElement!.style.position = 'relative';
    document.body.style.cursor = 'none';
    this.goToWater = false;

    this.plantSeeds = [
      { vegetableType: 'komkommer', count: this.cucumberCount, image: './assets/plantScene/seeds.png' },
      { vegetableType: 'aardappel', count: this.potatoCount, image: './assets/plantScene/seeds.png' },
      { vegetableType: 'wortel', count: this.carrotCount, image: './assets/plantScene/seeds.png' },
      { vegetableType: 'maïs', count: this.cornCount, image: './assets/plantScene/seeds.png' },
      { vegetableType: 'pompoen', count: this.pumpkinCount, image: './assets/plantScene/seeds.png' }
    ];

    this.garden = document.createElement('div');
    this.garden.style.backgroundImage = 'url(\'./assets/vegetablesScene/garden.png\')';
    this.garden.classList.add('div-bottom');
    this.garden.style.padding = '120px 0';

    this.canvas.parentElement!.appendChild(this.garden);

    this.plantSeeds.forEach((vegetable: Vegetable) => {
      for (let i: number = 0; i < vegetable.count; i++) {
        const vegetableImage: HTMLImageElement = document.createElement('img');
        vegetableImage.src = vegetable.image;
        vegetableImage.classList.add('vegetable-image');
        this.garden.appendChild(vegetableImage);
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
      return new PlantedVegetables(this.canvas, this.points, this.cucumberCount,
        this.potatoCount, this.carrotCount, this.cornCount, this.pumpkinCount);
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
