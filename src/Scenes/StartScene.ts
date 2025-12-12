import CanvasRenderer from '../CanvasRenderer.js';
import Scene from './Scene.js';
import KeyListener from '../KeyListener.js';
import StoryScene from './StoryScene.js';

export default class StartScene extends Scene {
  private gardenOfNumbers: HTMLImageElement;

  private woodenSign: HTMLImageElement;

  private startingText: HTMLParagraphElement;

  private starting: boolean;

  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/startingScene/background.png\')';
    this.canvas.style.backgroundColor = '#000000';
    document.body.style.cursor = 'none';

    // Assets
    this.gardenOfNumbers = new Image();
    this.gardenOfNumbers.src = './assets/startingScene/garden-of-numbers.png';

    this.woodenSign = new Image();
    this.woodenSign.src = './assets/startingScene/wooden-sign.png';

    // Starting text 'Press Enter' setup
    this.starting = false;
    this.startingText = document.createElement('p');
    this.startingText.id = 'starting-text';
    this.startingText.innerText = 'Druk op enter';
    this.startingText.style.top = `${this.canvas.height / 2 - 10}px`;
    this.startingText.style.left = `${this.canvas.width / 2 - 130}px`;
    document.body.appendChild(this.startingText);
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_ENTER)) {
      this.starting = true;
      document.body.removeChild(this.startingText);
    }
  }

  public override getNextScene(): Scene | null {
    if (this.starting) {
      return new StoryScene(this.canvas);
    } else {
      return null;
    }
  }

  /**
   * Render all the elements on the screen.
   */
  public override render(): void {
    // Clear the canvas using CanvasRenderer
    CanvasRenderer.clearCanvas(this.canvas);

    // Center the wooden sign
    const signX: number = (this.canvas.width - this.woodenSign.width) / 2;
    const signY: number = (this.canvas.height - this.woodenSign.height) / 2 - 50;
    CanvasRenderer.drawImage(this.canvas, this.woodenSign, signX, signY);

    // Center the logo 'Garden Of Numbers' on the wooden sign
    const logoX: number = signX + (this.woodenSign.width - this.gardenOfNumbers.width) / 2;
    const logoY: number = signY + (this.woodenSign.height - this.gardenOfNumbers.height) / 2;
    CanvasRenderer.drawImage(this.canvas, this.gardenOfNumbers, logoX, logoY);
  }
}
