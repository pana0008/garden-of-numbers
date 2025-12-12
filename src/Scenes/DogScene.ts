import CanvasRenderer from '../CanvasRenderer.js';
import Scene from './Scene.js';
import KeyListener from '../KeyListener.js';
import MainScene from './MainScene.js';

export default class DogScene extends Scene {
  private goBack: boolean;

  private points: number;

  private appleCount: number;

  private cherryCount: number;

  private blueberryCount: number;

  private strawberryCount: number;

  private bananaCount: number;

  private cucumberCount: number;

  private potatoCount: number;

  private carrotCount: number;

  private cornCount: number;

  private pumpkinCount: number;

  public constructor(canvas: HTMLCanvasElement, points: number, appleCount: number,
    cherryCount: number, blueberryCount: number, strawberryCount: number, bananaCount: number,
    cucumberCount: number, potatoCount: number, carrotCount: number,
    cornCount: number, pumpkinCount: number) {
    super(canvas);

    this.points = points;

    this.appleCount = appleCount;
    this.cherryCount = cherryCount;
    this.blueberryCount = blueberryCount;
    this.strawberryCount = strawberryCount;
    this.bananaCount = bananaCount;

    this.cucumberCount = cucumberCount;
    this.potatoCount = potatoCount;
    this.carrotCount = carrotCount;
    this.cornCount = cornCount;
    this.pumpkinCount = pumpkinCount;

    // Canvas setup
    this.canvas.style.backgroundImage = 'url(\'./assets/mainScene/dogScene.png\')';
    this.canvas.style.backgroundColor = '#263530';
    document.body.style.cursor = 'none';
    this.goBack = false;
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public override processInput(keyListener: KeyListener): void {
    if (keyListener.keyPressed(KeyListener.KEY_ENTER)) {
      this.goBack = true;
    }
  }

  public override getNextScene(): Scene | null {
    if (this.goBack) {
      return new MainScene(this.canvas, this.points, this.appleCount, this.cherryCount,
        this.blueberryCount, this.strawberryCount, this.bananaCount, this.cucumberCount,
        this.potatoCount, this.carrotCount, this.cornCount, this.pumpkinCount);
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
