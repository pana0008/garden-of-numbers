import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import MainScene from '../MainScene.js';

export default class ConversationPedro extends Scene {
  private continue: boolean = false;

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
    this.canvas.style.backgroundImage = 'url(\'./assets/conversations/conversationPedro.png\')';
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
    if (this.continue) {
      this.points = 50;
      return new MainScene(this.canvas, this.points, this.appleCount, this.cherryCount,
        this.blueberryCount, this.strawberryCount, this.bananaCount, 0, 0, 0, 0, 0);
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
