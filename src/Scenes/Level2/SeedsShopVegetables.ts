import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import PlantingVegetablesScene from './PlantingVegetablesScene.js';

type Seed = {
  seedType: string,
  points: number,
  image: string
};

export default class SeedsShopVegetables extends Scene {
  private boughtSeeds: boolean;

  private vegetableSeeds: Seed[] = [];

  private cucumberCount: number = 0;

  private potatoCount: number = 0;

  private carrotCount: number = 0;

  private cornCount: number = 0;

  private pumpkinCount: number = 0;

  private messageDiv: HTMLDivElement;

  private points: number;

  private seedsShelf: HTMLDivElement;

  private messageText: HTMLDivElement;

  private goToNextScene: boolean = false;

  public constructor(canvas: HTMLCanvasElement, points: number) {
    super(canvas);
    this.points = points;

    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/seedsShopScene/seedsShopVegetables.png\')';
    this.canvas.style.backgroundColor = '#4f2f1c';
    this.canvas.parentElement!.style.position = 'relative';
    document.body.style.cursor = 'auto';
    this.boughtSeeds = false;

    this.messageDiv = document.createElement('div');
    this.canvas.parentElement!.appendChild(this.messageDiv);

    // Append the message content to the message div
    this.messageText = document.createElement('div');
    this.messageDiv.appendChild(this.messageText);

    this.vegetableSeeds.push(
      { seedType: 'komkommer', points: 6, image: './assets/seedsShopScene/cucumberSeeds.png' },
      { seedType: 'aardappel', points: 7, image: './assets/seedsShopScene/potatoSeeds.png' },
      { seedType: 'wortel', points: 8, image: './assets/seedsShopScene/carrotSeeds.png' },
      { seedType: 'maïs', points: 9, image: './assets/seedsShopScene/cornSeeds.png' },
      { seedType: 'pompoen', points: 10, image: './assets/seedsShopScene/pumpkinSeeds.png' }
    );

    // Container for the shelf with the bags with seeds
    this.seedsShelf = document.createElement('div');
    this.seedsShelf.style.backgroundImage = 'url(\'./assets/seedsShopScene/shelf.png\')';
    this.seedsShelf.classList.add('div-bottom');

    for (let i: number = 0; i < this.vegetableSeeds.length; i++) {
      // Container for the bag with seeds and the label
      const bagAndLabel: HTMLDivElement = document.createElement('div');
      bagAndLabel.classList.add('vegetable-image');
      bagAndLabel.style.userSelect = 'none';


      // Bag with seeds
      const bagWithSeeds: HTMLImageElement = document.createElement('img');
      bagWithSeeds.src = this.vegetableSeeds[i]!.image;
      bagWithSeeds.style.width = '100%';
      bagWithSeeds.style.height = '100%';
      bagWithSeeds.style.userSelect = 'none';
      bagAndLabel.appendChild(bagWithSeeds);

      // Label for a bag with seeds
      const labelCount: HTMLParagraphElement = document.createElement('p');
      labelCount.classList.add('label-count');
      labelCount.textContent = this.getSeedCount(this.vegetableSeeds[i]!.seedType).toString();
      bagAndLabel.appendChild(labelCount);
      this.seedsShelf.appendChild(bagAndLabel);
      this.canvas.parentElement!.appendChild(this.seedsShelf);

      bagAndLabel.addEventListener('click', () => {
        const selectedSeed: Seed = this.vegetableSeeds[i]!;

        if (this.points < selectedSeed.points) {
          alert(`Niet genoeg punten om ${selectedSeed.seedType} zaden te kopen!`);
          return;
        }

        switch (selectedSeed.seedType) {
          case 'komkommer':
            this.cucumberCount = this.cucumberCount + 1;
            break;
          case 'aardappel':
            this.potatoCount = this.potatoCount + 1;
            break;
          case 'wortel':
            this.carrotCount = this.carrotCount + 1;
            break;
          case 'maïs':
            this.cornCount = this.cornCount + 1;
            break;
          case 'pompoen':
            this.pumpkinCount = this.pumpkinCount + 1;
            break;
        }

        this.points -= selectedSeed.points;
        labelCount.textContent = this.getSeedCount(selectedSeed.seedType).toString();
      });
    }
  }

  private getSeedCount(seedType: string): number {
    switch (seedType) {
      case 'komkommer': return this.cucumberCount;
      case 'aardappel': return this.potatoCount;
      case 'wortel': return this.carrotCount;
      case 'maïs': return this.cornCount;
      case 'pompoen': return this.pumpkinCount;
      default: return 0;
    }
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_D)) {
      this.resetCountsAndLabels();
    }

    if (this.points === 10) {
      // Outer container for black background
      this.messageDiv.id = 'message-div';

      // Inner div for the message's text
      this.messageText.id = 'message-text';
      this.messageText.textContent = 'YAY! Je hebt zaden gekocht voor 40 punten! Druk op enter om je zaden te planten >>';
      this.boughtSeeds = true;
    }

    if (this.boughtSeeds && keyListener.keyPressed(KeyListener.KEY_ENTER)) {
      document.body.removeChild(this.messageDiv);
      document.body.removeChild(this.seedsShelf);
      this.goToNextScene = true;
    }
  }

  private resetCountsAndLabels(): void {
    // Reset all counts and points to 0
    this.cucumberCount = 0;
    this.potatoCount = 0;
    this.carrotCount = 0;
    this.cornCount = 0;
    this.pumpkinCount = 0;

    this.points = 50;

    const labels: NodeListOf<HTMLParagraphElement> = this.seedsShelf.querySelectorAll<HTMLParagraphElement>('.label-count');
    labels.forEach((label: HTMLParagraphElement) => {
      label.textContent = '0';
    });
  }

  public override getNextScene(): Scene | null {
    if (this.goToNextScene) {
      return new PlantingVegetablesScene(this.canvas, this.points, this.cucumberCount,
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
