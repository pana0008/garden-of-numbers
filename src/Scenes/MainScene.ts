import KeyListener from '../KeyListener.js';
import Scene from './Scene.js';
import { collisionsArrMain } from '../Collisions.js';
import UnlockSeedsShop from './Level1/UnlockSeedsShop.js';
import CanvasRenderer from '../CanvasRenderer.js';
import UnlockFruitsShop from './Level1/UnlockFruitsShop.js';
import SeedsShopVegetables from './Level2/SeedsShopVegetables.js';
import UnlockVegetablesShop from './Level2/UnlockVegetablesShop.js';
import SecondZone from './Level3/SecondZone.js';
import DogScene from './DogScene.js';

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

export default class MainScene extends Scene {
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

  private teleportSeedsShop: boolean = false;

  private teleportFruitsShop: boolean = false;

  private teleportVegetablesShop: boolean = false;

  private teleportSecondZone: boolean = false;

  private teleportDogScene: boolean = false;

  public constructor(canvas: HTMLCanvasElement, points: number, appleCount: number,
    cherryCount: number, blueberryCount: number, strawberryCount: number, bananaCount: number,
    cucumberCount: number, potatoCount: number, carrotCount: number,
    cornCount: number, pumpkinCount: number) {
    super(canvas);

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

    this.canvasContext = this.canvas.getContext('2d')!;
    document.body.style.cursor = 'none';
    this.points = points;

    // 40 rows and 70 columns - array with the rows and cols
    for (let i: number = 0; i < collisionsArrMain.length; i += 70) {
      this.collisionsMap.push(collisionsArrMain.slice(i, 70 + i));
    }

    // Filling in the boundaries array
    // i - the row = Math.floor (symbolNum / 70)
    // j - the col = symbolNum % numColumns
    this.collisionsMap.forEach((row: number[], i: number) => {
      row.forEach((symbol: number, j: number) => {
        if (symbol === 1) {
          this.boundaries.push(
            new Boundary(
              { x: j * Boundary.width - 285, y: i * Boundary.height - 520 },
              this.canvasContext
            )
          );
        }
      });
    });

    this.playgroundImage = new Image();
    this.playgroundImage.src = './assets/mainScene/gameMap.png';
    this.playgroundForeground = new Image();
    this.playgroundForeground.src = './assets/mainScene/gameMap-foreground.png';

    this.loadPlayerImages();

    this.posPlaygroundX = -285;
    this.posPlaygroundY = -520;
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
          if (symbol === 2 && playerRow === i && playerCol === j &&
            this.points > 10 && this.points < 110) {
            this.teleportSeedsShop = true;
          } else if (symbol === 3 && playerRow === i && playerCol === j && this.points === 0) {
            this.teleportFruitsShop = true;
          } else if (symbol === 4 && playerRow === i && playerCol === j && this.points === 10) {
            this.teleportVegetablesShop = true;
          } else if (symbol === 5 && playerRow === i && playerCol === j && this.points === 110) {
            this.teleportSecondZone = true;
          } else if (symbol === 6 && playerRow === i && playerCol === j) {
            this.teleportDogScene = true;
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
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
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
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.playerWidth,
      this.playerHeight
    );

    // Draw the foreground on top of the playground
    this.canvasContext.drawImage(this.playgroundForeground,
      this.posPlaygroundX, this.posPlaygroundY);

    CanvasRenderer.drawRectangle(this.canvas, 20, 20, 550, 100, 'black');
    CanvasRenderer.fillRectangle(this.canvas, 20, 20, 550, 100, 'rgba(0, 0, 0, 0.46)');
    CanvasRenderer.writeText(this.canvas, `PUNTEN: ${this.points}`, 50, 62, 'left', '"Press Start 2P", sans-serif', 20, 'white');
    if (this.points === 15) {
      CanvasRenderer.writeText(this.canvas, 'GA NAAR DE ZADENWINKEL', 50, 102, 'left', '"Press Start 2P", sans-serif', 20, 'white');
    } else if (this.points === 0) {
      CanvasRenderer.writeText(this.canvas, 'GA DOOR DE FRUITWINKEL', 50, 102, 'left', '"Press Start 2P", sans-serif', 20, 'white');
    } else if (this.points === 50) {
      CanvasRenderer.writeText(this.canvas, 'GA NAAR DE ZADENWINKEL', 50, 102, 'left', '"Press Start 2P", sans-serif', 20, 'white');
    } else if (this.points === 10) {
      CanvasRenderer.writeText(this.canvas, 'GA DOOR DE GROENTENWINKEL', 50, 102, 'left', '"Press Start 2P", sans-serif', 20, 'white');
    } else if (this.points === 110) {
      CanvasRenderer.writeText(this.canvas, 'VOLG HET PAD', 50, 102, 'left', '"Press Start 2P", sans-serif', 20, 'white');
    }
  }

  public override getNextScene(): Scene | null {
    if (this.teleportSeedsShop && this.points === 15) {
      return new UnlockSeedsShop(this.canvas, this.points);
    } else if (this.teleportSeedsShop && this.points === 50) {
      return new SeedsShopVegetables(this.canvas, this.points);
    } else if (this.teleportFruitsShop) {
      return new UnlockFruitsShop(this.canvas, this.points, this.appleCount,
        this.cherryCount, this.blueberryCount, this.strawberryCount, this.bananaCount);
    } else if (this.teleportVegetablesShop) {
      return new UnlockVegetablesShop(this.canvas, this.points, this.cucumberCount,
        this.potatoCount, this.carrotCount, this.cornCount, this.pumpkinCount);
    } else if (this.teleportSecondZone) {
      return new SecondZone(this.canvas, this.points, false, false, false, false, false);
    } else if (this.teleportDogScene) {
      return new DogScene(this.canvas, this.points, this.appleCount, this.cherryCount,
        this.blueberryCount, this.strawberryCount, this.bananaCount, this.cucumberCount,
        this.potatoCount, this.carrotCount, this.cornCount, this.pumpkinCount);
    } else {
      return null;
    }
  }
}
