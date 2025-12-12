import KeyListener from '../../KeyListener.js';
import Scene from '../Scene.js';
import { collisionsArrSecondZone } from '../../Collisions.js';
import CanvasRenderer from '../../CanvasRenderer.js';
import FixBridgeScene from './FixBridgeScene.js';
import Bakery from './Bakery.js';
import Store from './Store.js';
import FinalZone from '../Level4/FinalZone.js';
import HivesScene from './HivesScene.js';

class Boundary {
  public position: { x: number; y: number };

  public static width: number = 32;

  public static height: number = 32;

  private canvas: CanvasRenderingContext2D;

  public constructor(position: { x: number; y: number }, canvas: CanvasRenderingContext2D) {
    this.position = position;
    this.canvas = canvas;
  }

  public draw(): void {
    this.canvas.fillStyle = 'red';
    this.canvas.fillRect(this.position.x, this.position.y, Boundary.width, Boundary.height);
  }
}

type Player = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default class SecondZone extends Scene {
  private canvasContext: CanvasRenderingContext2D;

  private posPlaygroundX: number;

  private posPlaygroundY: number;

  private playgroundImage: HTMLImageElement;

  private points: number;

  private playerImages: { [key: string]: HTMLImageElement } = {};

  private boundaries: Boundary[] = [];

  private playerWidth: number = 0;

  private playerHeight: number = 0;

  private playgroundForeground: HTMLImageElement;

  private frameIndex: number = 0;

  private frameCount: number = 4;

  private animationInterval: number = 8;

  private animationTick: number = 0;

  private currentDirection: string = 'down';

  private collisionsMap: number[][] = [];

  private spawnX: number = 100;

  private spawnY: number = 370;

  private teleportFixBridge: boolean = false;

  private isRepaired: boolean = false;

  private teleportBakery: boolean = false;

  private teleportStore: boolean = false;

  private cookCake: boolean;

  private cookCupcake: boolean;

  private cookCookie: boolean;

  private teleportFinalZone: boolean = false;

  private teleportHives: boolean = false;

  private isCooked: boolean = false;

  public constructor(canvas: HTMLCanvasElement, points: number, isRepaired: boolean,
    cookCake: boolean, cookCupcake: boolean, cookCookie: boolean, isCooked: boolean) {
    super(canvas);
    this.canvasContext = this.canvas.getContext('2d')!;
    document.body.style.cursor = 'none';

    this.isCooked = isCooked;
    this.isRepaired = isRepaired;
    this.cookCake = cookCake;
    this.cookCupcake = cookCupcake;
    this.cookCookie = cookCookie;
    this.points = points;

    // 40 rows and 70 columns - array with the rows and cols
    for (let i: number = 0; i < collisionsArrSecondZone.length; i += 70) {
      this.collisionsMap.push(collisionsArrSecondZone.slice(i, 70 + i));
    }

    // Filling in the boundaries array
    // i - the row = Math.floor (symbolNum / 70)
    // j - the col = symbolNum % numColumns
    this.collisionsMap.forEach((row: number[], i: number) => {
      row.forEach((symbol: number, j: number) => {
        if (symbol === 1) {
          this.boundaries.push(
            new Boundary(
              { x: j * Boundary.width, y: i * Boundary.height },
              this.canvasContext
            )
          );
        }
      });
    });

    this.playgroundImage = new Image();
    if (this.isRepaired) {
      this.playgroundImage.src = './assets/secondZone/secondZoneRepaired.png';
    } else {
      this.playgroundImage.src = './assets/secondZone/secondZoneMap.png';
    }
    this.playgroundForeground = new Image();
    this.playgroundForeground.src = './assets/secondZone/secondZoneForeground.png';

    this.loadPlayerImages();

    this.posPlaygroundX = 0;
    this.posPlaygroundY = 0;
  }

  private loadPlayerImages(): void {
    const directions: string[] = ['down', 'up', 'left', 'right'];
    directions.forEach((direction: string) => {
      const image: HTMLImageElement = new Image();
      image.src = `./assets/mainScene/player${direction.charAt(0).toUpperCase() + direction.slice(1)}.png`;
      this.playerImages[direction] = image;

      image.onload = (): void => {
        if (this.playerWidth === 0 && this.playerHeight === 0) {
          this.playerWidth = image.width / this.frameCount;
          this.playerHeight = image.height;
        }
      };
    });
  }

  /**
 * Method that changes the player's position
 * and checks for collision between the player and the boundaries
 */
  private movePlayer(player: Player, dx: number, dy: number, direction: string): void {
    this.currentDirection = direction;
    const newPlayer: Player = { ...player, x: player.x + dx, y: player.y + dy };
    this.animatePlayer();

    let isBlocked: boolean = false;

    function isColliding(player: { x: number; y: number; width: number; height: number },
      boundary: Boundary): boolean {
      return (
        player.x < boundary.position.x + Boundary.width &&
        player.x + player.width > boundary.position.x &&
        player.y < boundary.position.y + Boundary.height &&
        player.y + player.height > boundary.position.y
      );
    }

    for (let i: number = 0; i < this.boundaries.length; i++) {
      if (isColliding(newPlayer, this.boundaries[i]!)) {
        isBlocked = true;
        break;
      }
    }

    if (!isBlocked) {
      // Calculate current position of the player
      const playerCol: number = Math.floor((newPlayer.x - this.posPlaygroundX) / Boundary.width);
      const playerRow: number = Math.floor((newPlayer.y - this.posPlaygroundY) / Boundary.height);

      // Check for teleportation
      this.collisionsMap.forEach((row: number[], i: number) => {
        row.forEach((symbol: number, j: number) => {
          if (symbol === 2 && playerRow === i && playerCol === j && !this.isRepaired) {
            this.teleportFixBridge = true;
          } else if (symbol === 3 && playerRow === i && playerCol === j && this.points === 110) {
            this.teleportBakery = true;
          } else if (symbol === 4 && playerRow === i && playerCol === j && this.points <= 70 &&
            ((this.cookCake || this.cookCupcake || this.cookCookie))) {
            this.teleportStore = true;
          } else if (symbol === 5 && playerRow === i && playerCol === j &&
            this.points <= 70 && this.isCooked) {
            this.teleportHives = true;
          } else if (symbol === 6 && playerRow === i && playerCol === j && this.points === 0) {
            this.teleportFinalZone = true;
          }
        });
      });

      // Move the background and the boundaries if there is no collision
      this.posPlaygroundX -= dx;
      this.posPlaygroundY -= dy;
      this.boundaries.forEach((boundary: Boundary) => {
        boundary.position.x -= dx;
        boundary.position.y -= dy;
      });
    }
  }

  /**
   * Method that updates the player's animation frame
   * based on the animation interval
   */
  private animatePlayer(): void {
    this.animationTick = this.animationTick + 1;
    if (this.animationTick >= this.animationInterval) {
      this.animationTick = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }
  }

  /**
   * Process all input. Player movement
   */
  public override processInput(keyListener: KeyListener): void {
    const player: Player = {
      x: this.spawnX,
      y: this.spawnY,
      width: this.playerWidth,
      height: this.playerHeight,
    };

    const speed: number = 5;

    if (keyListener.isKeyDown(KeyListener.KEY_W)) {
      this.movePlayer(player, 0, -speed, 'up');
    } else if (keyListener.isKeyDown(KeyListener.KEY_A)) {
      this.movePlayer(player, -speed, 0, 'left');
    } else if (keyListener.isKeyDown(KeyListener.KEY_S)) {
      this.movePlayer(player, 0, speed, 'down');
    } else if (keyListener.isKeyDown(KeyListener.KEY_D)) {
      this.movePlayer(player, speed, 0, 'right');
    }
  }

  public override getNextScene(): Scene | null {
    if (this.teleportFixBridge) {
      return new FixBridgeScene(this.canvas, this.points);
    } else if (this.teleportBakery) {
      return new Bakery(this.canvas, this.points);
    } else if (this.teleportStore) {
      return new Store(this.canvas, this.points, this.cookCake, this.cookCupcake, this.cookCookie);
    } else if (this.teleportHives) {
      return new HivesScene(this.canvas, this.points);
    } else if (this.teleportFinalZone) {
      return new FinalZone(this.canvas, this.points);
    } else {
      return null;
    }
  }

  /**
   * Render all the elements on the screen.
   */
  public override render(): void {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasContext.fillStyle = 'black';
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the moving background (playground)
    this.canvasContext.drawImage(this.playgroundImage, this.posPlaygroundX, this.posPlaygroundY);

    // Draw the player on the playground
    const image: HTMLImageElement = this.playerImages[this.currentDirection]!;
    const spriteX: number = this.frameIndex * this.playerWidth;
    const spriteY: number = 0;
    this.canvasContext.drawImage(
      image,
      spriteX,
      spriteY,
      this.playerWidth,
      this.playerHeight,
      this.spawnX,
      this.spawnY,
      this.playerWidth,
      this.playerHeight
    );

    // Draw the foreground on top of the playground
    this.canvasContext.drawImage(this.playgroundForeground,
      this.posPlaygroundX, this.posPlaygroundY);

    CanvasRenderer.drawRectangle(this.canvas, 20, 20, 550, 100, 'black');
    CanvasRenderer.fillRectangle(this.canvas, 20, 20, 550, 100, 'rgba(0, 0, 0, 0.46)');
    CanvasRenderer.writeText(this.canvas, `PUNTEN: ${this.points}`, 50, 62, 'left', '"Press Start 2P", sans-serif', 20, 'white');
    if (this.points === 110 && !this.isRepaired) {
      CanvasRenderer.writeText(this.canvas, 'GA NAAR DE BRUG', 50, 102, 'left', '"Press Start 2P", sans-serif', 20, 'white');
    } else if (this.points === 110 && this.isRepaired) {
      CanvasRenderer.writeText(this.canvas, 'GA NAAR DE BAKKERIJ', 50, 102, 'left', '"Press Start 2P", sans-serif', 20, 'white');
    } else if (this.points <= 70 && (this.cookCake || this.cookCupcake || this.cookCookie)) {
      CanvasRenderer.writeText(this.canvas, 'GA NAAR DE WINKEL', 50, 102, 'left', '"Press Start 2P", sans-serif', 20, 'white');
    } else if (this.points === 0) {
      CanvasRenderer.writeText(this.canvas, 'GA HET PAD AF', 50, 102, 'left', '"Press Start 2P", sans-serif', 20, 'white');
    } else if (this.points <= 70 && !this.cookCake && !this.cookCupcake && !this.cookCookie) {
      CanvasRenderer.writeText(this.canvas, 'GA NAAR DE BIJENKORVEN', 50, 102, 'left', '"Press Start 2P", sans-serif', 20, 'white');
    }
  }
}
