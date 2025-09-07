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
  strokeWidth: number = 10;
  maxStrokeWidth: number = 35;
  minStrokeWidth: number = 5;
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

    if (this.canBounce) {
      context.fillStyle = colorWhite;
      context.fillRect(
        this.pos.x - this.strokeWidth / 2,
        this.pos.y - this.strokeWidth / 2,
        this.width + this.strokeWidth,
        this.height + this.strokeWidth
      );
    }

    context.fillStyle = colorWall; // cat noir color
    context.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    context.restore();
  }
}
