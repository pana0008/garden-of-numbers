import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import FruitsScene from './FruitsScene.js';

export default class WaterFruits extends Scene {
  private inputAnswer: HTMLInputElement;

  private messageDiv: HTMLDivElement;

  private isWatered: boolean;

  private points: number;

  private appleCount: number;

  private cherryCount: number;

  private blueberryCount: number;

  private strawberryCount: number;

  private bananaCount: number;

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
    this.canvas.style.backgroundImage = 'url(\'./assets/waterScene/waterFruits.png\')';
    this.canvas.parentElement!.style.position = 'relative';
    this.canvas.style.backgroundColor = '#4f2f1c';
    document.body.style.cursor = 'auto';
    this.isWatered = false;

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
      if (this.inputAnswer.value === '3/4') {
        document.body.removeChild(this.inputAnswer);
        document.body.removeChild(this.messageDiv);
        this.isWatered = true;
      } else {
        this.messageDiv.textContent = `Uw antwoord "${this.inputAnswer.value}" is onjuist! Probeer het opnieuw!`;
        this.inputAnswer.value = '';
      }
    }
  }

  public override getNextScene(): Scene | null {
    if (this.isWatered) {
      return new FruitsScene(this.canvas, this.points, this.appleCount, this.cherryCount,
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
