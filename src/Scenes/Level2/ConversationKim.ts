import CanvasRenderer from '../../CanvasRenderer.js';
import Scene from '../Scene.js';
import KeyListener from '../../KeyListener.js';
import MainScene from '../MainScene.js';

export default class ConversationKim extends Scene {
  private continue: boolean = false;

  private points: number;

  private cucumberCount: number;

  private potatoCount: number;

  private carrotCount: number;

  private cornCount: number;

  private pumpkinCount: number;

  public constructor(canvas: HTMLCanvasElement, points: number, cucumberCount: number,
    potatoCount: number, carrotCount: number, cornCount: number, pumpkinCount: number) {
    super(canvas);

    this.points = points;
    this.cucumberCount = cucumberCount;
    this.potatoCount = potatoCount;
    this.carrotCount = carrotCount;
    this.cornCount = cornCount;
    this.pumpkinCount = pumpkinCount;

    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/conversations/conversationKim.png\')';
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
      this.points += 100;
      return new MainScene(this.canvas, this.points, 0, 0, 0, 0, 0, this.cucumberCount,
        this.potatoCount, this.carrotCount, this.cornCount, this.pumpkinCount);
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
