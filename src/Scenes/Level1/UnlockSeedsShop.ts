import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import SeedsShopFruits from './SeedsShopFruits.js';

export default class UnlockSeedsShop extends Scene {
  private inputAnswer: HTMLInputElement;

  private messageDiv: HTMLDivElement;

  private unlocked: boolean;

  private points: number;

  public constructor(canvas: HTMLCanvasElement, points: number) {
    super(canvas);
    this.points = points;

    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/unlockScenes/unlockSeedsShop.png\')';
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
      if (this.inputAnswer.value === '28') {
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
      return new SeedsShopFruits(this.canvas, this.points);
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
