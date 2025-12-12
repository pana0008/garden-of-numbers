import CanvasRenderer from '../CanvasRenderer.js';
import Scene from './Scene.js';
import KeyListener from '../KeyListener.js';
import StartScene from './StartScene.js';

export default class EndScene extends Scene {
  private continue: boolean = false;

  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/storyScenes/end.png\')';
    this.canvas.style.backgroundColor = '#4f2f1c';
    document.body.style.cursor = 'none';
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
    if(this.continue) {
      return new StartScene(this.canvas);
    }
    return null;
  }

  /**
   * Render all the elements on the screen.
   */
  public render(): void {
    // Clear the canvas using CanvasRenderer
    CanvasRenderer.clearCanvas(this.canvas);
  }
}
