import { Vector } from "kontra";
import { GameObjectType } from "./GameObjectType";
import { MyGameEntity } from "./MyGameEntity";
import { colorBlack } from "./colorUtils";

export class Ball implements MyGameEntity {
  type = GameObjectType.Ball;
  pos = Vector(0, 0);
  velocity = Vector(0, 0);
  radius = 15;
  gravity = 0.3;

  constructor(startPos: Vector, private color: string) {
    this.pos = startPos || Vector(0, 0);

    // Add initial random speed
    const randomSpeedX = (Math.random() - 0.5) * 10; // Random X velocity between -5 and 5
    const randomSpeedY = (Math.random() - 0.5) * 10; // Random Y velocity between -5 and 5
    this.velocity = Vector(randomSpeedX, randomSpeedY);
  }

  update() {
    // Apply gravity
    this.velocity = this.velocity.add(Vector(0, this.gravity));

    // Update position
    this.pos = this.pos.add(this.velocity);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // Draw shadow circle first
    ctx.beginPath();
    ctx.fillStyle = colorBlack;
    ctx.globalAlpha = 0.7;
    ctx.arc(
      this.pos.x - this.radius / 2 + 4,
      this.pos.y + this.radius + 4,
      this.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw main circle
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 1;
    ctx.arc(
      this.pos.x - this.radius / 2,
      this.pos.y + this.radius,
      this.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }

  // Ball-specific properties and methods go here
}
