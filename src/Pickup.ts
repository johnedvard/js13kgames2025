import { Vector, MyVector } from "./Vector";
import { GameObjectType } from "./GameObjectType";
import { MyGameEntity } from "./MyGameEntity";
import { colorAccent, colorShadow } from "./colorUtils";

import { playPickup } from "./audio";

export class Pickup implements MyGameEntity {
  type = GameObjectType.Pickup;
  pos = Vector(0, 0);
  width = 128; // 4 times bigger (32 * 4)
  height = 128; // 4 times bigger (32 * 4)

  // Animation properties
  private animationTime: number = 0;
  private baseScale: number = 1;
  private currentScale: number = 1;
  private currentRotation: number = 0;

  // Burst animation properties
  private burstStartTime: number = 0;
  private burstDuration: number = 1; // 1 second at 60fps

  // Cached clover rendering (similar to Player's cat body)
  private cloverCanvas: OffscreenCanvas | null = null;
  private cloverContext: OffscreenCanvasRenderingContext2D | null = null;
  private cloverShadowCanvas: OffscreenCanvas | null = null;
  private cloverShadowContext: OffscreenCanvasRenderingContext2D | null = null;

  private state: "c" | "d" | "a" = "a";
  collected = false;
  constructor(startPos: MyVector, private color = colorAccent) {
    this.pos = startPos;
    this.initializeCloverCache();
  }

  setScale(value: number) {
    this.baseScale = value;
    this.update();
  }

  private initializeCloverCache() {
    // Create an offscreen canvas to cache the normal clover
    this.cloverCanvas = new OffscreenCanvas(200, 200);
    this.cloverContext = this.cloverCanvas.getContext("2d")!;

    // Create an offscreen canvas to cache the shadow clover
    this.cloverShadowCanvas = new OffscreenCanvas(200, 200);
    this.cloverShadowContext = this.cloverShadowCanvas.getContext("2d")!;

    // Render the normal clover
    this.renderCloverToCanvas(this.cloverContext, false);

    // Render the black shadow clover
    this.renderCloverToCanvas(this.cloverShadowContext, true);
  }

  private renderCloverToCanvas(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    isBlackShadow: boolean
  ) {
    ctx.translate(100, 100); // Center the clover in the cache canvas

    const drawStalk = () => {
      ctx.save();
      ctx.strokeStyle = isBlackShadow ? colorShadow : this.color;
      ctx.lineWidth = 10;

      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.quadraticCurveTo(5, 45, 45, 50);
      ctx.stroke();
      ctx.restore();
    };

    const drawLeaf = (rotation: number, offsetX: number, offsetY: number) => {
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.rotate(rotation);
      ctx.fillStyle = isBlackShadow ? colorShadow : this.color;
      ctx.beginPath();

      const centerAdjustX = 3;
      const centerAdjustY = -4;

      ctx.moveTo(0 + centerAdjustX, -10 + centerAdjustY);
      ctx.bezierCurveTo(
        -12 + centerAdjustX,
        -12 + centerAdjustY,
        -21 + centerAdjustX,
        1 + centerAdjustY,
        -17 + centerAdjustX,
        12 + centerAdjustY
      );
      ctx.lineTo(7 + centerAdjustX, 20 + centerAdjustY);
      ctx.lineTo(16 + centerAdjustX, 8 + centerAdjustY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Draw the clover to canvas
    drawStalk();
    drawLeaf(0, 0, 0);
    drawLeaf(-Math.PI / 2, 0, 23);
    drawLeaf(-Math.PI, 30, 19);
    drawLeaf((-3 * Math.PI) / 2, 26, -3);
  }

  update() {
    // Increment animation time
    this.animationTime += 0.02; // Speed of animation

    // Create pulsing scale effect (0.9 to 1.1 scale range)
    const scaleOffset = Math.sin(this.animationTime * 3) * 0.1; // 3 controls frequency, 0.1 controls amplitude
    this.currentScale = this.baseScale + scaleOffset;

    // Create gentle rotation oscillation with counter-clockwise bias
    const rotationAmplitude = Math.PI / 18; // 10 degrees in radians
    const counterClockwiseBias = -Math.PI / 20; // 5 degrees counter-clockwise bias
    this.currentRotation =
      Math.sin(this.animationTime * 2) * rotationAmplitude +
      counterClockwiseBias; // 2 controls frequency
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.state == "a") {
      this.renderClover(ctx);
    } else if (this.state == "c") {
      this.renderCloverBurst(ctx);
    }
  }
  renderCloverBurst(ctx: CanvasRenderingContext2D) {
    // Calculate burst progress (0 to 1)
    const burstProgress =
      (this.animationTime - this.burstStartTime) / this.burstDuration;

    if (burstProgress >= 1) {
      this.state = "d";
      return;
    }

    ctx.save();

    // Move to the center of the pickup
    ctx.translate(this.pos.x + this.width / 2, this.pos.y + this.height / 2);

    // Calculate animation values
    const scale = 1 - burstProgress * 0.5; // Scale down to 50%
    const moveDistance = burstProgress * 180; // Move up to 80 pixels away

    // Helper function to draw individual leaf
    const drawLeaf = (
      rotation: number,
      offsetX: number,
      offsetY: number,
      direction: MyVector
    ) => {
      ctx.save();

      // Calculate position with burst movement
      const burstOffsetX = direction.x * moveDistance;
      const burstOffsetY = direction.y * moveDistance;

      ctx.translate(offsetX + burstOffsetX, offsetY + burstOffsetY);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);

      ctx.fillStyle = colorAccent;
      ctx.beginPath();

      const centerAdjustX = 3;
      const centerAdjustY = -4;

      ctx.moveTo(0 + centerAdjustX, -10 + centerAdjustY);
      ctx.bezierCurveTo(
        -12 + centerAdjustX,
        -12 + centerAdjustY,
        -21 + centerAdjustX,
        1 + centerAdjustY,
        -17 + centerAdjustX,
        12 + centerAdjustY
      );
      ctx.lineTo(7 + centerAdjustX, 20 + centerAdjustY);
      ctx.lineTo(16 + centerAdjustX, 8 + centerAdjustY);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // Helper function to draw stalk
    const drawStalk = (direction: MyVector) => {
      ctx.save();

      // Calculate position with burst movement
      const burstOffsetX = direction.x * moveDistance;
      const burstOffsetY = direction.y * moveDistance;

      ctx.translate(burstOffsetX, burstOffsetY);
      ctx.scale(scale, scale);

      ctx.strokeStyle = colorAccent;
      ctx.lineWidth = 10;

      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.quadraticCurveTo(5, 45, 45, 50);
      ctx.stroke();

      ctx.restore();
    };

    // Draw leaves moving in 4 different directions
    drawLeaf(0, 0, 0, Vector(0, -1)); // Top leaf moves up
    drawLeaf(-Math.PI / 2, 0, 23, Vector(1, 0)); // Right leaf moves right
    drawLeaf(-Math.PI, 30, 19, Vector(0, 1)); // Bottom leaf moves down
    drawLeaf((-3 * Math.PI) / 2, 26, -3, Vector(-1, 0)); // Left leaf moves left

    // Draw stalk moving down
    drawStalk(Vector(0, 1));

    ctx.restore();
  }
  renderClover(ctx: CanvasRenderingContext2D) {
    if (!this.cloverCanvas || !this.cloverShadowCanvas) return;

    ctx.save();

    // Move to the center of the pickup
    ctx.translate(this.pos.x + this.width / 2, this.pos.y + this.height / 2);

    // Apply animated rotation
    ctx.rotate(this.currentRotation);

    // Render shadow first with larger scale for depth effect
    ctx.save();
    // Create shadow scale with larger amplitude but same frequency as main clover
    const shadowScaleOffset = Math.sin(this.animationTime * 3) * 0.14; // Same frequency (3) as main clover, larger amplitude (0.2)
    const shadowScale = this.baseScale + shadowScaleOffset + 0.1; // Base offset of 0.1 plus animated offset
    ctx.scale(shadowScale, shadowScale);
    ctx.drawImage(
      this.cloverShadowCanvas,
      -100 + shadowScale,
      -100 + shadowScale + 1
    ); // Use the pre-rendered black shadow
    ctx.restore();

    // Render the main clover with normal animated scale
    ctx.save();
    ctx.scale(this.currentScale, this.currentScale);
    ctx.drawImage(this.cloverCanvas, -100, -100);
    ctx.restore();

    ctx.restore();
  }

  collect() {
    if (this.state == "c" || this.state == "d") return; // Prevent double collection
    this.collected = true;
    playPickup();
    this.state = "c";
    this.burstStartTime = this.animationTime; // Start the burst animation
  }
}
