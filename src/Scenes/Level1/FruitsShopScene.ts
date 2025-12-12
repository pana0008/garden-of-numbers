import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import ConversationPedro from './ConversationPedro.js';

type Fruit = {
  fruitType: string,
  count: number,
  image: string
};

export default class FruitsShopScene extends Scene {
  private grownFruits: Fruit[] = [];

  private appleCount: number;

  private cherryCount: number;

  private blueberryCount: number;

  private strawberryCount: number;

  private bananaCount: number;

  private points: number;

  private fruitsShelf: HTMLDivElement;

  private goToPedro: boolean = false;

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
    this.canvas.style.backgroundImage = 'url(\'./assets/bothShops/fruitsShop.png\')';
    this.canvas.style.backgroundColor = '#4f2f1c';
    this.canvas.parentElement!.style.position = 'relative';
    document.body.style.cursor = 'none';

    this.grownFruits = [
      { fruitType: 'appel', count: this.appleCount, image: './assets/bothShops/apple.png' },
      { fruitType: 'kers', count: this.cherryCount, image: './assets/bothShops/cherry.png' },
      { fruitType: 'bosbes', count: this.blueberryCount, image: './assets/bothShops/blueberry.png' },
      { fruitType: 'aardbei', count: this.strawberryCount, image: './assets/bothShops/strawberry.png' },
      { fruitType: 'banaan', count: this.bananaCount, image: './assets/bothShops/banana.png' }
    ];

    this.fruitsShelf = document.createElement('div');
    this.fruitsShelf.style.backgroundImage = 'url(\'./assets/bothShops/shelf.png\')';
    this.fruitsShelf.classList.add('div-bottom');

    this.grownFruits.forEach((fruit: Fruit) => {
      for (let i: number = 0; i < fruit.count; i++) {
        const fruitImage: HTMLImageElement = document.createElement('img');
        fruitImage.src = fruit.image;
        fruitImage.classList.add('fruit-image');
        this.fruitsShelf.appendChild(fruitImage);
      }
    });

    this.canvas.parentElement!.appendChild(this.fruitsShelf);
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_ENTER)) {
      document.body.removeChild(this.fruitsShelf);
      this.goToPedro = true;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goToPedro) {
      return new ConversationPedro(this.canvas, this.points, this.appleCount, this.cherryCount,
        this.blueberryCount, this.strawberryCount, this.bananaCount);
    }
    return null;
  }

  /**
   * Render all the elements on the screen.
   */
  public render(): void {
    // Clear the canvas using CanvasRenderer
    CanvasRenderer.clearCanvas(this.canvas);
  }
}
