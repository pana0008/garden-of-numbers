import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import RecipeScene from './RecipeScene.js';

export default class Bakery extends Scene {
  private points: number;

  private inputAnswer: HTMLInputElement;

  private messageDiv: HTMLDivElement;

  private cookCake: boolean = false;

  private cookCupcake: boolean = false;

  private cookCookie: boolean = false;

  public constructor(canvas: HTMLCanvasElement, points: number) {
    super(canvas);

    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/secondZone/enterBakery.png\')';
    this.canvas.parentElement!.style.position = 'relative';
    this.canvas.style.backgroundColor = '#4f2f1c';
    document.body.style.cursor = 'auto';
    this.points = points;

    // Create input box
    this.inputAnswer = document.createElement('input');
    this.inputAnswer.type = 'text';
    this.inputAnswer.placeholder = 'Vul uw antwoord in';

    // Styling the input box
    this.inputAnswer.classList.add('input-answer');
    this.inputAnswer.classList.add('input-answer-bakery');
    this.canvas.parentElement!.appendChild(this.inputAnswer);

    this.messageDiv = document.createElement('div');
    this.messageDiv.id = 'div-mistake-bakery';
    this.canvas.parentElement!.appendChild(this.messageDiv);
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_ENTER)) {
      if (this.inputAnswer.value === 'Aardbeien taart'
        || this.inputAnswer.value === 'aardbeien taart'
        || this.inputAnswer.value === 'Taart'
        || this.inputAnswer.value === 'taart') {
        document.body.removeChild(this.inputAnswer);
        document.body.removeChild(this.messageDiv);
        this.cookCake = true;
      } else if (this.inputAnswer.value === 'Cupcake met vanille'
        || this.inputAnswer.value === 'cupcake met vanille'
        || this.inputAnswer.value === 'Cupcake'
        || this.inputAnswer.value === 'cupcake') {
        document.body.removeChild(this.inputAnswer);
        document.body.removeChild(this.messageDiv);
        this.cookCupcake = true;
      } else if (this.inputAnswer.value === 'Chocolade koekje'
        || this.inputAnswer.value === 'chocolade koekje'
        || this.inputAnswer.value === 'Koekje'
        || this.inputAnswer.value === 'koekje') {
        document.body.removeChild(this.inputAnswer);
        document.body.removeChild(this.messageDiv);
        this.cookCookie = true;
      } else {
        this.messageDiv.textContent = `Uw invoer '${this.inputAnswer.value}' is onjuist! Probeer het opnieuw!`;
        this.inputAnswer.value = '';
      }
    }
  }

  public override getNextScene(): Scene | null {
    if (this.cookCake || this.cookCupcake || this.cookCookie) {
      return new RecipeScene(this.canvas, this.points, this.cookCake,
        this.cookCupcake, this.cookCookie);
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
