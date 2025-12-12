import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import SecondZone from './SecondZone.js';

export default class FixBridgeScene extends Scene {
  private points: number;

  private inputAnswer: HTMLInputElement;

  private messageDiv: HTMLDivElement;

  private isRepaired: boolean;

  public constructor(canvas: HTMLCanvasElement, points: number) {
    super(canvas);

    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/secondZone/fixBridge.png\')';
    this.canvas.parentElement!.style.position = 'relative';
    this.canvas.style.backgroundColor = '#4f2f1c';
    document.body.style.cursor = 'auto';
    this.isRepaired = false;
    this.points = points;

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
      if (this.inputAnswer.value === '40') {
        document.body.removeChild(this.inputAnswer);
        document.body.removeChild(this.messageDiv);
        this.isRepaired = true;
      } else {
        this.messageDiv.textContent = `Uw antwoord "${this.inputAnswer.value}" is onjuist! Probeer het opnieuw!`;
        this.inputAnswer.value = '';
      }
    }
  }

  public override getNextScene(): Scene | null {
    if(this.isRepaired) {
      return new SecondZone(this.canvas, this.points, this.isRepaired, false, false, false, false);
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
