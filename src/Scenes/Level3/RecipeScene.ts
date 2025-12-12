import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from './../Scene.js';
import KeyListener from '../../KeyListener.js';
import SecondZone from './SecondZone.js';

export default class RecipeScene extends Scene {
  private points: number;

  private goToSecondZone: boolean;

  private cookCake: boolean;

  private cookCupcake: boolean;

  private cookCookie: boolean;

  public constructor(canvas: HTMLCanvasElement, points: number, cookCake: boolean,
    cookCupcake: boolean, cookCookie: boolean) {
    super(canvas);

    this.cookCake = cookCake;
    this.cookCupcake = cookCupcake;
    this.cookCookie = cookCookie;
    this.points = points;

    // Canvas setup
    if (cookCake) {
      this.canvas.style.backgroundImage = 'url(\'./assets/secondZone/strawberryCake.png\')';
      this.points -= 50;
    } else if (cookCupcake) {
      this.canvas.style.backgroundImage = 'url(\'./assets/secondZone/vanillaCupcake.png\')';
      this.points -= 45;
    } else if (cookCookie) {
      this.canvas.style.backgroundImage = 'url(\'./assets/secondZone/chocoladeCookie.png\')';
      this.points -= 40;
    }

    this.canvas.style.backgroundColor = '#4f2f1c';
    document.body.style.cursor = 'none';
    this.goToSecondZone = false;
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_ENTER)) {
      this.goToSecondZone = true;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goToSecondZone) {
      return new SecondZone(this.canvas, this.points, true, this.cookCake,
        this.cookCupcake, this.cookCookie, false);
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
  }
}
