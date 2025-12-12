import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import MainScene from '../MainScene.js';

type Vegetable = {
  vegetableType: string,
  count: number,
  image: string
};

export default class VegetablesScene extends Scene {
  private goToMain: boolean;

  private grownVegetables: Vegetable[] = [];

  private cucumberCount: number = 0;

  private potatoCount: number = 0;

  private carrotCount: number = 0;

  private cornCount: number = 0;

  private pumpkinCount: number = 0;

  private messageDiv: HTMLDivElement;

  private points: number;

  private garden: HTMLDivElement;

  private messageText: HTMLDivElement;

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
    this.canvas.style.backgroundImage = 'url(\'./assets/vegetablesScene/grownVegetables.png\')';
    this.canvas.style.backgroundColor = '#4f2f1c';
    this.canvas.parentElement!.style.position = 'relative';
    document.body.style.cursor = 'none';
    this.goToMain = false;

    this.messageDiv = document.createElement('div');
    this.canvas.parentElement!.appendChild(this.messageDiv);

    // Append the message content to the message div
    this.messageText = document.createElement('div');
    this.messageDiv.appendChild(this.messageText);

    this.grownVegetables = [
      { vegetableType: 'komkommer', count: this.cucumberCount, image: './assets/vegetablesScene/cucumberGrown.png' },
      { vegetableType: 'aardappel', count: this.potatoCount, image: './assets/vegetablesScene/potatoGrown.png' },
      { vegetableType: 'wortel', count: this.carrotCount, image: './assets/vegetablesScene/carrotGrown.png' },
      { vegetableType: 'maïs', count: this.cornCount, image: './assets/vegetablesScene/cornGrown.png' },
      { vegetableType: 'pompoen', count: this.pumpkinCount, image: './assets/vegetablesScene/pumpkinGrown.png' }
    ];

    this.garden = document.createElement('div');
    this.garden.style.backgroundImage = 'url(\'./assets/vegetablesScene/garden.png\')';
    this.garden.style.padding = '120px 0';
    this.garden.classList.add('div-bottom');
    this.canvas.parentElement!.appendChild(this.garden);

    this.grownVegetables.forEach((vegetable: Vegetable) => {
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
    if (keyListener.keyPressed(KeyListener.KEY_Q)) {
      this.goToMain = true;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goToMain) {
      document.body.removeChild(this.garden);
      return new MainScene(this.canvas, this.points, 0, 0, 0, 0, 0, this.cucumberCount,
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
