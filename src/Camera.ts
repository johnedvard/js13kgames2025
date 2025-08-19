import { lerp, Vector } from "kontra";
import { Player } from "./Player";

type FollowOptions = {
  lerp: boolean;
  offset: Vector;
};
export class Camera {
  pos: Vector = Vector(0, 0);
  canvas: HTMLCanvasElement;
  lerpFactor: number = 0.04; // Adjust this value to control the lerp speed

  // Smoothed offset direction for camera following
  smoothedOffsetDirection: Vector = Vector(1, 0); // Start with default direction
  offsetLerpFactor: number = 0.02; // Slower lerp for offset direction changes

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.pos = Vector(canvas.width, canvas.height);
  }

  setPosition(pos: Vector) {
    this.pos = Vector(pos);
  }

  follow(
    player: Player,
    options: FollowOptions = { lerp: true, offset: Vector(0, 0) }
  ) {
    // Get the current player direction
    const currentDirection = player.getDirection();

    // Calculate dynamic lerp factor based on player speed
    const playerSpeed = player.velocity.length();
    const speedMultiplier = Math.min(playerSpeed * 0.01, 0.8); // Cap at 0.8 for stability
    const dynamicOffsetLerpFactor = this.offsetLerpFactor + speedMultiplier;

    // Lerp the offset direction to smooth camera movement
    this.smoothedOffsetDirection = Vector(
      lerp(
        this.smoothedOffsetDirection.x,
        currentDirection.x,
        dynamicOffsetLerpFactor
      ),
      lerp(
        this.smoothedOffsetDirection.y,
        currentDirection.y,
        dynamicOffsetLerpFactor
      )
    );

    const targetX =
      player.pos.x -
      this.canvas.width / 2 +
      options.offset.x * this.smoothedOffsetDirection.x;
    const targetY =
      player.pos.y -
      this.canvas.height / 2 +
      options.offset.y * this.smoothedOffsetDirection.y;

    if (options.lerp) {
      // Apply dynamic lerp to the camera position based on player speed
      const dynamicLerpFactor = this.lerpFactor + speedMultiplier * 0.5; // Scale down for position lerp
      this.pos = Vector(
        lerp(this.pos.x, targetX, dynamicLerpFactor),
        lerp(this.pos.y, targetY, dynamicLerpFactor)
      );
    } else {
      this.pos = Vector(targetX, targetY);
    }
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
