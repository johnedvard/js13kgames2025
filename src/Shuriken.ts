import { Vector } from "kontra";
import { MyGameEntity } from "./MyGameEntity";
import { GameObjectType } from "./GameObjectType";
import { colorBlack } from "./colorUtils";

export class Shuriken implements MyGameEntity {
  pos: Vector;
  type = GameObjectType.Shuriken;
  width = 40;
  height = 50;

  radius = 55; // Collision radius

  private rotation = 0;
  private rotationSpeed = 0.08; // Spinning speed

  // Cached shuriken blade rendering (similar to Pickup's clover cache)
  private bladeCanvas: OffscreenCanvas | null = null;
  private bladeContext: OffscreenCanvasRenderingContext2D | null = null;

  constructor(startPos: Vector) {
    this.pos = startPos;
    this.initializeBladeCache();
  }

  private initializeBladeCache() {
    // Create an offscreen canvas to cache the complete shuriken (all 4 blades)
    this.bladeCanvas = new OffscreenCanvas(400, 400);
    this.bladeContext = this.bladeCanvas.getContext("2d")!;

    // Render the complete shuriken (all 4 blades) to canvas
    this.renderBladeToCanvas(this.bladeContext);
  }

  private renderBladeToCanvas(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  ) {
    ctx.translate(233, 182); // Center the complete shuriken in the cache canvas, for rotation

    // Function to draw a single blade
    const drawBlade = () => {
      // SVG path coordinates scaled and positioned
      const scale = 0.5;
      const pathCoords = [
        { x: 0 * scale, y: 0 * scale },
        { x: -139 * scale, y: 62 * scale },
        { x: 0 * scale, y: 127 * scale },
        { x: 0 * scale, y: 95 * scale },
        { x: -11 * scale, y: 62 * scale },
        { x: 0 * scale, y: 33 * scale },
      ];

      // Fill with black
      ctx.fillStyle = colorBlack;
      ctx.beginPath();
      ctx.moveTo(pathCoords[0].x, pathCoords[0].y);
      ctx.lineTo(pathCoords[1].x, pathCoords[1].y);
      ctx.lineTo(pathCoords[2].x, pathCoords[2].y);
      ctx.lineTo(pathCoords[3].x, pathCoords[3].y);
      ctx.lineTo(pathCoords[4].x, pathCoords[4].y);
      ctx.lineTo(pathCoords[5].x, pathCoords[5].y);
      ctx.closePath();
      ctx.fill();

      // Add black stroke
      ctx.strokeStyle = colorBlack;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    // Draw 4 blades at different rotations and positions to create complete shuriken
    const bladePositions = [
      {
        rotation: Math.PI / 2,
        translateX: -1,
        translateY: 0,
      },
      {
        rotation: Math.PI,
        translateX: 14,
        translateY: -50,
      },
      {
        rotation: (3 * Math.PI) / 2,
        translateX: -34,
        translateY: -64,
      },
      {
        rotation: 0,
        translateX: -50,
        translateY: -14,
      },
    ];

    bladePositions.forEach((blade) => {
      ctx.save();
      ctx.rotate(blade.rotation);
      ctx.translate(blade.translateX, blade.translateY);
      drawBlade();
      ctx.restore();
    });
  }

  update(): void {
    // Spin the shuriken continuously
    this.rotation += this.rotationSpeed;
    if (this.rotation > Math.PI * 2) {
      this.rotation -= Math.PI * 2;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.pos.x + this.width, this.pos.y + this.height); // move to the collision box
    ctx.rotate(this.rotation);

    // Draw ninja shuriken with 4 pointed blades using cached canvas
    this.renderShuriken(ctx);

    ctx.restore();
  }

  private renderShuriken(ctx: CanvasRenderingContext2D): void {
    if (!this.bladeCanvas) return;

    // Draw the complete cached shuriken (all 4 blades)
    ctx.drawImage(this.bladeCanvas, -200, -200);
  }
}
