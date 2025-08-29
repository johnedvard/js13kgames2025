import { lerp } from "kontra";
import { Player } from "./Player";
import { MyVector, Vector } from "./Vector";

export class Camera {
  pos: MyVector = Vector(0, 0);
  canvas: HTMLCanvasElement;
  lerpFactor: number = 0.04; // Adjust this value to control the lerp speed

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.pos = Vector(canvas.width, canvas.height);
  }

  follow(player: Player) {
    // Simple follow: camera centers on player with static offset, using basic lerp
    const targetX = player.pos.x - this.canvas.width / 2;
    const targetY = player.pos.y - this.canvas.height / 2;

    this.pos = Vector(
      lerp(this.pos.x, targetX, this.lerpFactor),
      lerp(this.pos.y, targetY, this.lerpFactor)
    );
  }

  apply(context: CanvasRenderingContext2D) {
    // context.transform(0.5, 0, 0, 0.5, 0, 0); // Apply scale transform
    context.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    context.translate(-this.pos.x, -this.pos.y); // Apply camera translation
  }

  clear(context: CanvasRenderingContext2D) {
    // Adding a margin to clear the canvas

    context.clearRect(
      -1000 + this.pos.x,
      -1000 + this.pos.y,
      this.canvas.width + 2000,
      this.canvas.height + 2000
    );
  }
}
