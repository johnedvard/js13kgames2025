import { Vector } from "kontra";
import { GameObjectType } from "./GameObjectType";
import { MyGameEntity } from "./MyGameEntity";
import { colorWall } from "./colorUtils";

export class RopeContactPoint implements MyGameEntity {
  pos: Vector;
  radius: number;
  rotation: number = 0;
  type = GameObjectType.RopeContactPoint;
  isHighlighted: boolean = false;

  constructor(pos: Vector, radius: number) {
    this.pos = pos;
    this.radius = radius;
  }

  update() {
    this.rotation += 0.02; // Rotate slowly over time
  }

  render(context: CanvasRenderingContext2D) {
    context.save();

    // Render white highlight circle behind everything if this is the closest rope point
    if (this.isHighlighted) {
      context.fillStyle = "#ffffff";
      context.globalAlpha = 0.8;
      context.beginPath();
      context.arc(this.pos.x, this.pos.y, this.radius + 10, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 1.0; // Reset alpha for other elements
    }

    context.strokeStyle = "#6E2639"; // Same color as Box
    context.lineWidth = 5;

    // Set up dotted line pattern
    context.setLineDash([8, 6]); // 8px dash, 6px gap
    context.lineDashOffset = -this.rotation * 20; // Make the dashes rotate

    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    context.stroke();

    // Reset line dash for the filled circle
    context.setLineDash([]);

    // Draw shadow for the inner circle (14px offset, black, 0.7 opacity)
    context.globalAlpha = 0.4;
    context.fillStyle = "#000000"; // Black shadow
    context.beginPath();
    context.arc(
      this.pos.x + 3,
      this.pos.y + 2,
      this.radius * 0.5,
      0,
      Math.PI * 2
    );
    context.fill();

    // Draw small filled circle in the center
    context.globalAlpha = 1.0;
    context.fillStyle = colorWall; // Same color as the stroke
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.radius * 0.5, 0, Math.PI * 2); // 30% of the outer radius
    context.fill();

    context.restore();
  }
  setHighlight(value: boolean) {
    this.isHighlighted = value;
  }
}
