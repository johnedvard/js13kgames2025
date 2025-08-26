import { Vector } from "kontra";
import { MyGameEntity } from "./MyGameEntity";
import { GameObjectType } from "./GameObjectType";
import { colorBlack, colorWall, colorWhite } from "./colorUtils";

export class Box implements MyGameEntity {
  pos: Vector;
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
    pos: Vector,
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
      if (this.strokeWidth <= this.minStrokeWidth) {
        this.strokeWidth = this.minStrokeWidth;
      }
    }
  }

  // Method to trigger bounce effect
  triggerBounce() {
    this.strokeWidth = this.maxStrokeWidth;
  }

  render(context: CanvasRenderingContext2D) {
    context.save();

    // Render shadow box behind the original (x+4, y+4 with 0.7 opacity)
    context.globalAlpha = 0.9;
    context.fillStyle = colorBlack;
    context.fillRect(this.pos.x + 14, this.pos.y + 14, this.width, this.height);

    // Render original box
    context.globalAlpha = 1.0;
    context.fillStyle = colorWall; // cat noir color
    context.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    // Add white stroke if canBounce is true
    if (this.canBounce) {
      context.strokeStyle = colorWhite;
      context.lineWidth = this.strokeWidth;
      context.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    context.restore();
  }
}
