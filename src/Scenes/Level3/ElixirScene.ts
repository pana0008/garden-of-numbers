import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import SecondZone from './SecondZone.js';

export default class ElixirScene extends Scene {
  private goToEndScene: boolean;

  private points: number;

  public constructor(canvas: HTMLCanvasElement, points: number) {
    super(canvas);

    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/secondZone/elixirScene.png\')';
    this.canvas.style.backgroundColor = '#4f2f1c';
    document.body.style.cursor = 'none';
    this.points = points;
    this.goToEndScene = false;
    this.points = points;
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_ENTER)) {
      this.goToEndScene = true;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goToEndScene) {
      this.points = 0;
      return new SecondZone(this.canvas, this.points, true, false, false, false, false);
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
