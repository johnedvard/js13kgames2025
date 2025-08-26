import { Vector } from "kontra";
import { GameObjectType } from "./GameObjectType";
import { MyGameEntity } from "./MyGameEntity";
import {
  colorBlack,
  colorWall,
  colorWhite,
  colorGray,
  colorAccent,
} from "./colorUtils";

export class RopeContactPoint implements MyGameEntity {
  pos: Vector;
  radius: number;
  rotation: number = 0;
  type = GameObjectType.RopeContactPoint;
  isHighlighted: boolean = false;
  isActive: boolean = true; // ON/OFF state
  canActivate: boolean = true; // Activation state
  activationTime = 3000;
  timeSinceActivated = 0;
  // Movement properties
  canMove: boolean = false;
  startPoint: Vector | null = null;
  endPoint: Vector | null = null;
  moveTime: number = 2000; // ms to move from start to end
  moveElapsed: number = 0;
  movingForward: boolean = true;

  constructor(
    pos: Vector,
    radius: number,
    isActive: boolean = true,
    canActivate: boolean = false,
    canMove: boolean = false,
    startPoint: Vector | null = null,
    endPoint: Vector | null = null,
    moveTime: number = 2000
  ) {
    this.pos = pos;
    this.radius = radius;
    this.isActive = isActive;
    this.canActivate = canActivate;
    this.canMove = canMove;
    this.startPoint = startPoint || pos;
    this.endPoint = endPoint || pos;
    this.moveTime = moveTime;
  }

  update() {
    this.rotation += 0.02; // Rotate slowly over time

    // Movement logic
    if (this.canMove && this.startPoint && this.endPoint) {
      this.moveElapsed += 16.67; // Assuming 60 FPS
      let t = this.moveElapsed / this.moveTime;
      if (t > 1) {
        t = 1;
        // Reverse direction at end
        this.moveElapsed = 0;
        this.movingForward = !this.movingForward;
        // Swap start/end for back-and-forth
        const temp = this.startPoint;
        this.startPoint = this.endPoint;
        this.endPoint = temp;
      }
      // Lerp position
      this.pos = Vector(
        this.startPoint.x + (this.endPoint.x - this.startPoint.x) * t,
        this.startPoint.y + (this.endPoint.y - this.startPoint.y) * t
      );
    }

    // Handle automatic activation/deactivation if canActivate is true
    if (this.canActivate) {
      this.timeSinceActivated += 16.67; // Assuming 60 FPS, so ~16.67ms per frame
      if (this.timeSinceActivated >= this.activationTime) {
        this.toggleActive();
        this.timeSinceActivated = 0; // Reset the timer
      }
    }
  }

  render(context: CanvasRenderingContext2D) {
    // Draw dotted line from startPoint to endPoint if moving
    if (this.canMove && this.startPoint && this.endPoint) {
      context.save();
      context.strokeStyle = colorGray;
      context.lineWidth = 3;
      context.setLineDash([8, 8]);
      context.beginPath();
      context.moveTo(this.startPoint.x, this.startPoint.y);
      context.lineTo(this.endPoint.x, this.endPoint.y);
      context.stroke();
      context.setLineDash([]);
      context.restore();
    }
    context.save();

    // Render white highlight circle behind everything if this is the closest rope point
    if (this.isHighlighted) {
      context.fillStyle = colorWhite;
      context.globalAlpha = 0.8;
      context.beginPath();
      context.arc(this.pos.x, this.pos.y, this.radius + 10, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 1.0; // Reset alpha for other elements
    }

    // Choose color based on active state
    const strokeColor = this.isActive ? "#6E2639" : colorGray; // Same color as Box when active, gray when inactive
    context.strokeStyle = strokeColor;
    context.lineWidth = 5;

    // Set up dotted line pattern
    context.setLineDash([8, 6]); // 8px dash, 6px gap
    context.lineDashOffset = -this.rotation * 20; // Make the dashes rotate

    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    context.stroke();

    // Reset line dash for the filled circle
    context.setLineDash([]);

    // Draw activation timer arc if canActivate is true
    if (this.canActivate) {
      const progress = this.timeSinceActivated / this.activationTime;
      const arcRadius = this.radius + 15; // Arc positioned outside the main circle

      // Calculate arc angles (start from top, go clockwise)
      const startAngle = -Math.PI / 2; // Start at top (-90 degrees)
      const endAngle = startAngle + progress * 2 * Math.PI; // End based on progress

      // Draw the progress arc
      context.strokeStyle = colorAccent; // Use accent color for the timer arc
      context.lineWidth = 6;
      context.beginPath();
      context.arc(this.pos.x, this.pos.y, arcRadius, startAngle, endAngle);
      context.stroke();

      // Draw the remaining arc in a dimmer color
      context.strokeStyle = colorGray;
      context.globalAlpha = 0.3;
      context.lineWidth = 2;
      context.beginPath();
      context.arc(
        this.pos.x,
        this.pos.y,
        arcRadius,
        endAngle,
        startAngle + 2 * Math.PI
      );
      context.stroke();
      context.globalAlpha = 1.0; // Reset alpha
    }

    // Only render inner circle and shadow when active
    if (this.isActive) {
      // Draw shadow for the inner circle (14px offset, black, 0.7 opacity)
      context.globalAlpha = 0.4;
      context.fillStyle = colorBlack;
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
    }

    context.restore();
  }
  setHighlight(value: boolean) {
    this.isHighlighted = value;
  }

  setActive(value: boolean) {
    this.isActive = value;
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }

  getActive(): boolean {
    return this.isActive;
  }
}
