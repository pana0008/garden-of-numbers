import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from './../Scene.js';
import KeyListener from '../../KeyListener.js';
import CookedPastry from './CookedPastry.js';

type Product = {
  productType: string,
  count: number,
  image: string
};

export default class Store extends Scene {
  private points: number;

  private productsShelf: HTMLDivElement;

  private productsArr: Product[] = [];

  private cookCake: boolean;

  private cookCupcake: boolean;

  private cookCookie: boolean;

  private isCooked: boolean = false;

  public constructor(canvas: HTMLCanvasElement, points: number, cookCake: boolean,
    cookCupcake: boolean, cookCookie: boolean) {
    super(canvas);

    this.cookCake = cookCake;
    this.cookCupcake = cookCupcake;
    this.cookCookie = cookCookie;

    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/secondZone/storeScene.png\')';
    this.canvas.style.backgroundColor = '#4f2f1c';
    this.canvas.parentElement!.style.position = 'relative';
    document.body.style.cursor = 'auto';
    this.points = points;

    this.productsArr.push(
      { productType: 'aardbei', count: 0, image: './assets/secondZone/strawberry.png' },
      { productType: 'melk', count: 0, image: './assets/secondZone/milk.png' },
      { productType: 'vanille-extract', count: 0, image: './assets/secondZone/vanilla-extract.png' },
      { productType: 'ei', count: 0, image: './assets/secondZone/egg.png' },
      { productType: 'chocolade', count: 0, image: './assets/secondZone/chocolate.png' },
      { productType: 'suiker', count: 0, image: './assets/secondZone/sugar.png' },
    );

    this.productsShelf = document.createElement('div');
    this.productsShelf.style.backgroundImage = 'url(\'./assets/secondZone/shelf.png\')';
    this.productsShelf.classList.add('div-bottom');
    this.canvas.parentElement!.appendChild(this.productsShelf);

    for (let i: number = 0; i < this.productsArr.length; i++) {
      // Container for the product and the label
      const productAndLabel: HTMLDivElement = document.createElement('div');
      productAndLabel.classList.add('product-image');
      productAndLabel.style.userSelect = 'none';

      const product: HTMLImageElement = document.createElement('img');
      product.src = this.productsArr[i]!.image;
      product.style.width = '100%';
      product.style.height = '100%';
      product.style.userSelect = 'none';
      productAndLabel.appendChild(product);

      // Label for a product
      const labelCount: HTMLParagraphElement = document.createElement('p');
      labelCount.classList.add('label-count');
      labelCount.textContent = '0';
      productAndLabel.appendChild(labelCount);
      this.productsShelf.appendChild(productAndLabel);
      this.canvas.parentElement!.appendChild(this.productsShelf);

      productAndLabel.addEventListener('click', () => {
        const selectedSeed: Product = this.productsArr[i]!;
        let requiredCount: number = 0;
        let message: string = '';

        switch (true) {
          case this.cookCake && selectedSeed.productType === 'aardbei':
            requiredCount = 5;
            message = 'Voor een taart heb je slechts 3x5-10 aardbeien en 5/5 flessen melk nodig!';
            break;
          case this.cookCake && selectedSeed.productType === 'melk':
            requiredCount = 1;
            message = 'Voor een taart heb je slechts 3x5-10 aardbeien en 5/5 flessen melk nodig!';
            break;
          case this.cookCupcake && selectedSeed.productType === 'vanille-extract':
            requiredCount = 2;
            message = 'Je hebt alleen (70+30)/50 eieren en 28/7 - 2 flesjes vanille-extract voor cupcakes nodig!';
            break;
          case this.cookCupcake && selectedSeed.productType === 'ei':
            requiredCount = 2;
            message = 'Je hebt alleen (70+30)/50 eieren en 28/7 - 2 flesjes vanille-extract voor cupcakes nodig!';
            break;
          case this.cookCookie && selectedSeed.productType === 'chocolade':
            requiredCount = 1;
            message = 'Voor cupcakes heb je slechts 33/3 - 5*2 chocolade en 15*2 - 29 suikerzakjes nodig!';
            break;
          case this.cookCookie && selectedSeed.productType === 'suiker':
            requiredCount = 1;
            message = 'Voor cupcakes heb je slechts 33/3 - 5*2 chocolade en 15*2 - 29 suikerzakjes nodig!';
            break;
          default:
            alert('Dit product heeft u niet nodig voor uw recept!');
            return;
        }

        if (selectedSeed.count < requiredCount) {
          selectedSeed.count += 1;
          labelCount.textContent = selectedSeed.count.toString();

          if ((this.productsArr[0]!.count === 5 && this.productsArr[1]!.count === 1) ||
            (this.productsArr[2]!.count === 2 && this.productsArr[3]!.count === 2) ||
            (this.productsArr[4]!.count === 1 && this.productsArr[5]!.count === 1)) {
            this.isCooked = true;
          }
        } else {
          alert(message);
        }
      });
    }
  }

  private resetCountsAndLabels(): void {
    // Reset all counts and points to 0
    this.productsArr[0]!.count = 0;
    this.productsArr[1]!.count = 0;
    this.productsArr[2]!.count = 0;
    this.productsArr[3]!.count = 0;
    this.productsArr[4]!.count = 0;
    this.productsArr[5]!.count = 0;

    const labels: NodeListOf<HTMLParagraphElement> = this.productsShelf.querySelectorAll<HTMLParagraphElement>('.label-count');
    labels.forEach((label: HTMLParagraphElement) => {
      label.textContent = '0';
    });
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_D)) {
      this.resetCountsAndLabels();
    }
  }

  public override getNextScene(): Scene | null {
    if (this.isCooked) {
      document.body.removeChild(this.productsShelf);
      return new CookedPastry(this.canvas, this.points,
        this.cookCake, this.cookCupcake, this.cookCookie);
    }
    return null;
  }

  /**
   * Render all the elements on the screen.
   */
  public override render(): void {
    // Clear the canvas using CanvasRenderer
    CanvasRenderer.clearCanvas(this.canvas);
  }
}
