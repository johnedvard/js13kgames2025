import { MyVector } from "./Vector";
import { MyGameEntity } from "./MyGameEntity";
import { GameObjectType } from "./GameObjectType";
import { colorBlack, colorWall, colorWhite } from "./colorUtils";

export class Box implements MyGameEntity {
  pos: MyVector;
  width: number;
  height: number;
  type = GameObjectType.Platform;
  canBounce: boolean = false;
  // Animation properties for bounce effect
  strokeWidth: number = 5;
  maxStrokeWidth: number = 20;
  minStrokeWidth: number = 3;
  bounceDecay: number = 0.8;

  constructor(
    pos: MyVector,
    width: number,
    height: number,
    canBounce: boolean = false
  ) {
    this.pos = pos;
    this.width = width;
    this.height = height;
    this.canBounce = canBounce;
  }

  update() {
    // Animate stroke width back to minimum
    if (this.strokeWidth > this.minStrokeWidth) {
      this.strokeWidth *= this.bounceDecay;
    } else {
      this.strokeWidth = this.minStrokeWidth;
    }
  }

  // Method to trigger bounce effect
  triggerBounce() {
    this.strokeWidth = this.maxStrokeWidth;
  }

  render(context: CanvasRenderingContext2D) {
    context.save();

    context.fillStyle = colorBlack;
    context.fillRect(this.pos.x + 14, this.pos.y + 14, this.width, this.height);

    context.fillStyle = colorWall; // cat noir color
    context.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    // Optimized white border for Safari - use fillRect instead of strokeRect
    if (this.canBounce) {
      const borderWidth = Math.round(this.strokeWidth); // Round for pixel-perfect rendering
      context.fillStyle = colorWhite;

      // Draw border as four rectangles instead of using strokeRect
      // Top border
      context.fillRect(this.pos.x, this.pos.y, this.width, borderWidth);
      // Bottom border
      context.fillRect(
        this.pos.x,
        this.pos.y + this.height - borderWidth,
        this.width,
        borderWidth
      );
      // Left border
      context.fillRect(this.pos.x, this.pos.y, borderWidth, this.height);
      // Right border
      context.fillRect(
        this.pos.x + this.width - borderWidth,
        this.pos.y,
        borderWidth,
        this.height
      );
    }

    context.restore();
  }
}
