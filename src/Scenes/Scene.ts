import KeyListener from '../KeyListener.js';

export default abstract class Scene {
  protected canvas: HTMLCanvasElement;

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public abstract processInput(keyListener: KeyListener): void;
  public abstract getNextScene(): Scene | null;
  public abstract render(): void;
}
