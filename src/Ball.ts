import { colorBlack } from "./colorUtils";
import { GameObjectType } from "./GameObjectType";
import { MyGameEntity } from "./MyGameEntity";
import { Vector, MyVector } from "./Vector";

export class Ball implements MyGameEntity {
  type = GameObjectType.Ball;
  pos = Vector(0, 0);
  velocity = Vector(0, 0);
  radius = 15;
  gravity = 0.3;
  private shadowColor: string; // Pre-calculated shadow color

  constructor(startPos: MyVector, private color: string) {
    this.pos = startPos || Vector(0, 0);

    this.shadowColor = colorBlack;

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
    ctx.fillStyle = this.shadowColor;
    ctx.beginPath();
    ctx.arc(this.pos.x + 3, this.pos.y + 3, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw main ball
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ball-specific properties and methods go here
}
