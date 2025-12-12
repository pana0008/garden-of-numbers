import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import MainScene from '../MainScene.js';

type Fruit = {
  fruitType: string,
  count: number,
  image: string
};

export default class FruitsScene extends Scene {
  private goToMain: boolean;

  private grownFruits: Fruit[] = [];

  private appleCount: number;

  private cherryCount: number;

  private blueberryCount: number;

  private strawberryCount: number;

  private bananaCount: number;

  private messageDiv: HTMLDivElement;

  private points: number;

  private garden: HTMLDivElement;

  private messageText: HTMLDivElement;

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
    this.canvas.style.backgroundImage = 'url(\'./assets/fruitsScene/grownFruits.png\')';
    this.canvas.style.backgroundColor = '#4f2f1c';
    this.canvas.parentElement!.style.position = 'relative';
    document.body.style.cursor = 'none';
    this.goToMain = false;

    this.messageDiv = document.createElement('div');
    this.canvas.parentElement!.appendChild(this.messageDiv);

    // Append the message content to the message div
    this.messageText = document.createElement('div');
    this.messageDiv.appendChild(this.messageText);

    this.grownFruits = [
      { fruitType: 'appel', count: this.appleCount, image: './assets/fruitsScene/appleGrown.png' },
      { fruitType: 'kers', count: this.cherryCount, image: './assets/fruitsScene/cherryGrown.png' },
      { fruitType: 'bosbes', count: this.blueberryCount, image: './assets/fruitsScene/blueberryGrown.png' },
      { fruitType: 'aardbei', count: this.strawberryCount, image: './assets/fruitsScene/strawberryGrown.png' },
      { fruitType: 'banaan', count: this.bananaCount, image: './assets/fruitsScene/bananaGrown.png' }
    ];

    this.garden = document.createElement('div');
    this.garden.style.backgroundImage = 'url(\'./assets/fruitsScene/garden.png\')';
    this.garden.style.padding = '120px 0';
    this.garden.classList.add('div-bottom');
    this.canvas.parentElement!.appendChild(this.garden);

    this.grownFruits.forEach((fruit: Fruit) => {
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
    if (keyListener.keyPressed(KeyListener.KEY_Q)) {
      this.goToMain = true;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goToMain) {
      document.body.removeChild(this.garden);
      return new MainScene(this.canvas, this.points, this.appleCount, this.cherryCount,
        this.blueberryCount, this.strawberryCount, this.bananaCount, 0, 0, 0, 0, 0);
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
