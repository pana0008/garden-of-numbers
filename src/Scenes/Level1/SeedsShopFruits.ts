import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import PlantingFruitsScene from './PlantingFruitsScene.js';

type Seed = {
  seedType: string,
  points: number,
  image: string
};

export default class SeedsShopFruits extends Scene {
  private boughtSeeds: boolean;

  private fruitSeeds: Seed[] = [];

  private appleCount: number = 0;

  private cherryCount: number = 0;

  private blueberryCount: number = 0;

  private strawberryCount: number = 0;

  private bananaCount: number = 0;

  private messageDiv: HTMLDivElement;

  private points: number;

  private seedsShelf: HTMLDivElement;

  private messageText: HTMLDivElement;

  private goToNextScene: boolean = false;

  public constructor(canvas: HTMLCanvasElement, points: number) {
    super(canvas);
    this.points = points;

    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/seedsShopScene/seedsShopFruits.png\')';
    this.canvas.style.backgroundColor = '#4f2f1c';
    this.canvas.parentElement!.style.position = 'relative';
    document.body.style.cursor = 'auto';
    this.boughtSeeds = false;

    this.messageDiv = document.createElement('div');
    this.canvas.parentElement!.appendChild(this.messageDiv);

    // Append the message content to the message div
    this.messageText = document.createElement('div');
    this.messageDiv.appendChild(this.messageText);

    this.fruitSeeds.push(
      { seedType: 'appel', points: 1, image: './assets/seedsShopScene/appleSeeds.png' },
      { seedType: 'kers', points: 2, image: './assets/seedsShopScene/cherrySeeds.png' },
      { seedType: 'bosbes', points: 3, image: './assets/seedsShopScene/blueberrySeeds.png' },
      { seedType: 'aardbei', points: 4, image: './assets/seedsShopScene/strawberrySeeds.png' },
      { seedType: 'banaan', points: 5, image: './assets/seedsShopScene/bananaSeeds.png' }
    );

    // Container for the shelf with the bags with seeds
    this.seedsShelf = document.createElement('div');
    this.seedsShelf.style.backgroundImage = 'url(\'./assets/seedsShopScene/shelf.png\')';
    this.seedsShelf.classList.add('div-bottom');

    for (let i: number = 0; i < this.fruitSeeds.length; i++) {
      // Container for the bag with seeds and the label
      const bagAndLabel: HTMLDivElement = document.createElement('div');
      bagAndLabel.classList.add('fruit-image');
      bagAndLabel.style.userSelect = 'none';

      // Bag with seeds
      const bagWithSeeds: HTMLImageElement = document.createElement('img');
      bagWithSeeds.src = this.fruitSeeds[i]!.image;
      bagWithSeeds.style.width = '100%';
      bagWithSeeds.style.height = '100%';
      bagWithSeeds.style.userSelect = 'none';
      bagAndLabel.appendChild(bagWithSeeds);

      // Label for a bag with seeds
      const labelCount: HTMLParagraphElement = document.createElement('p');
      labelCount.classList.add('label-count');
      labelCount.textContent = this.getSeedCount(this.fruitSeeds[i]!.seedType).toString();
      bagAndLabel.appendChild(labelCount);
      this.seedsShelf.appendChild(bagAndLabel);
      this.canvas.parentElement!.appendChild(this.seedsShelf);

      bagAndLabel.addEventListener('click', () => {
        const selectedSeed: Seed = this.fruitSeeds[i]!;

        if (this.points < selectedSeed.points) {
          alert(`Niet genoeg punten om ${selectedSeed.seedType} zaden te kopen!`);
          return;
        }

        switch (selectedSeed.seedType) {
          case 'appel':
            this.appleCount = this.appleCount + 1;
            break;
          case 'kers':
            this.cherryCount = this.cherryCount + 1;
            break;
          case 'bosbes':
            this.blueberryCount = this.blueberryCount + 1;
            break;
          case 'aardbei':
            this.strawberryCount = this.strawberryCount + 1;
            break;
          case 'banaan':
            this.bananaCount = this.bananaCount + 1;
            break;
        }

        this.points -= selectedSeed.points;
        labelCount.textContent = this.getSeedCount(selectedSeed.seedType).toString();
      });
    }
  }

  private getSeedCount(seedType: string): number {
    switch (seedType) {
      case 'appel': return this.appleCount;
      case 'kers': return this.cherryCount;
      case 'bosbes': return this.blueberryCount;
      case 'aardbei': return this.strawberryCount;
      case 'banaan': return this.bananaCount;
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

    if (this.points === 0) {
      // Outer container for black background
      this.messageDiv.id = 'message-div';

      // Inner div for the message's text
      this.messageText.id = 'message-text';
      this.messageText.textContent = 'YAY! Je hebt zaden gekocht voor 15 punten! Druk op enter om je zaden te planten >>';
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
    this.appleCount = 0;
    this.cherryCount = 0;
    this.blueberryCount = 0;
    this.strawberryCount = 0;
    this.bananaCount = 0;

    this.points = 15;

    const labels: NodeListOf<HTMLParagraphElement> = this.seedsShelf.querySelectorAll<HTMLParagraphElement>('.label-count');
    labels.forEach((label: HTMLParagraphElement) => {
      label.textContent = '0';
    });
  }

  public override getNextScene(): Scene | null {
    if (this.goToNextScene) {
      return new PlantingFruitsScene(this.canvas, this.points, this.appleCount, this.cherryCount,
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
