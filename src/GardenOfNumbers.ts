import Game from './Game.js';
import KeyListener from './KeyListener.js';
import Scene from './Scenes/Scene.js';
import StartScene from './Scenes/StartScene.js';

export default class GardenOfNumbers extends Game {
  private canvas: HTMLCanvasElement;

  private keyListener: KeyListener;

  private currentScene: Scene;

  public constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.keyListener = new KeyListener();
    this.currentScene = new StartScene(this.canvas);
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public processInput(): void {
    this.currentScene.processInput(this.keyListener);
  }

  /**
   * Update game state. Called from the GameLoop
   *
   * @returns true if the game should continue
   */
  public update(): boolean {
    const nextScene: Scene | null = this.currentScene.getNextScene();
    if (nextScene !== null) {
      this.currentScene = nextScene;
    }
    return true;
  }

  /**
   * Render all the elements in the screen. Called from GameLoop
   */
  public render(): void {
    this.currentScene.render();
  }
}
