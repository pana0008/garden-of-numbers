import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from './../Scene.js';
import KeyListener from '../../KeyListener.js';
import ElixirScene from './ElixirScene.js';

export default class HivesScene extends Scene {
  private continue: boolean;

  private points: number;

  public constructor(canvas: HTMLCanvasElement, points: number) {
    super(canvas);

    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/secondZone/hivesScene.png\')';
    this.canvas.style.backgroundColor = '#4f2f1c';
    document.body.style.cursor = 'none';
    this.continue = false;
    this.points = points;
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_ENTER)) {
      this.continue = true;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.continue) {
      return new ElixirScene(this.canvas, this.points);
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
