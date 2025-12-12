import CanvasRenderer from '../CanvasRenderer.js';
import Scene from './Scene.js';
import KeyListener from '../KeyListener.js';
import MainScene from './MainScene.js';

export default class StoryScene extends Scene {
  private continue: boolean;

  private points: number;

  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/storyScenes/gameStory.png\')';
    this.canvas.style.backgroundColor = '#263530';
    document.body.style.cursor = 'none';
    this.continue = false;
    this.points = 15;
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
      return new MainScene(this.canvas, this.points, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
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
