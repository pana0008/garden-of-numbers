import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import VegetablesShopScene from './VegetablesShopScene.js';

export default class UnlockVegetablesShop extends Scene {
  private inputAnswer: HTMLInputElement;

  private messageDiv: HTMLDivElement;

  private unlocked: boolean;

  private cucumberCount: number;

  private potatoCount: number;

  private carrotCount: number;

  private cornCount: number;

  private pumpkinCount: number;

  private points: number;

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
    this.canvas.style.backgroundImage = 'url(\'./assets/unlockScenes/unlockVegetablesShop.png\')';
    this.canvas.parentElement!.style.position = 'relative';
    this.canvas.style.backgroundColor = '#4f2f1c';
    document.body.style.cursor = 'auto';
    this.unlocked = false;

    // Create input box
    this.inputAnswer = document.createElement('input');
    this.inputAnswer.type = 'text';
    this.inputAnswer.placeholder = 'Vul uw antwoord in';

    // Styling the input box
    this.inputAnswer.classList.add('input-answer');
    this.canvas.parentElement!.appendChild(this.inputAnswer);

    this.messageDiv = document.createElement('div');
    this.messageDiv.classList.add('div-mistake');
    this.canvas.parentElement!.appendChild(this.messageDiv);
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_ENTER)) {
      if (this.inputAnswer.value === '16') {
        document.body.removeChild(this.inputAnswer);
        document.body.removeChild(this.messageDiv);
        this.unlocked = true;
      } else {
        this.messageDiv.textContent = `Uw antwoord "${this.inputAnswer.value}" is onjuist! Probeer het opnieuw!`;
        this.inputAnswer.value = '';
      }
    }
  }

  public override getNextScene(): Scene | null {
    if (this.unlocked) {
      return new VegetablesShopScene(this.canvas, this.points, this.cucumberCount,
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
