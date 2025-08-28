import { lerp } from "kontra";
import { GameObjectType } from "./GameObjectType";
import { MyGameEntity } from "./MyGameEntity";
import {
  colorBlack,
  colorWall,
  colorWhite,
  colorGray,
  colorAccent,
} from "./colorUtils";
import { smoothstep } from "./mathUtils";
import { MyVector, Vector } from "./Vector";

export class RopeContactPoint implements MyGameEntity {
  pos: MyVector;
  radius: number = 40;
  rotation: number = 0;
  type = GameObjectType.RopeContactPoint;
  isHighlighted: boolean = false;
  isActive: boolean = true; // ON/OFF state
  canActivate: boolean = true; // Activation state
  activationTime = 3;
  timeSinceActivated = 0;
  // Movement properties
  canMove: boolean = false;
  startPos: MyVector;
  endPos: MyVector;
  moveTime: number = 2000; // ms to move from start to end
  moveElapsed: number = 0;
  moveDirection: number = 1; // 1: start to end, -1: end to start

  constructor(
    pos: MyVector,
    isActive: boolean = true,
    canActivate: boolean = false,
    endPos: MyVector,
    moveTime: number = 2000
  ) {
    this.pos = pos;
    this.isActive = isActive;
    this.canActivate = canActivate;
    this.startPos = pos;
    this.endPos = endPos || pos;
    this.moveTime = moveTime;
    if (endPos?.x && this.startPos?.x) {
      this.canMove =
        endPos.x !== this.startPos.x || endPos.y !== this.startPos.y;
    }
  }

  update() {
    this.rotation += 0.02; // Rotate slowly over time

    // Movement logic
    if (this.canMove) {
      this.moveElapsed += 16.67; // Assuming 60 FPS
      let t = this.moveElapsed / this.moveTime;
      let easeT = this.moveDirection == 1 ? t : 1 - t;
      easeT = smoothstep(easeT);
      this.pos = Vector(
        lerp(this.startPos.x, this.endPos.x, easeT),
        lerp(this.startPos.y, this.endPos.y, easeT)
      );
      if (t >= 1) {
        t = 1;
        this.moveElapsed = 0;
        this.moveDirection *= -1;
      }
    }

    // Handle automatic activation/deactivation if canActivate is true
    if (this.canActivate) {
      this.timeSinceActivated += 0.02;
      if (this.timeSinceActivated >= this.activationTime) {
        this.toggleActive();
        this.timeSinceActivated = 0; // Reset the timer
      }
    }
  }

  render(context: CanvasRenderingContext2D) {
    // Draw dotted line from startPoint to endPos if moving
    if (this.canMove) {
      context.save();
      context.strokeStyle = colorGray;
      context.lineWidth = 12;
      context.setLineDash([8, 8]);
      context.beginPath();
      context.moveTo(this.startPos.x, this.startPos.y);
      context.lineTo(this.endPos.x, this.endPos.y);
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
    const strokeColor = this.isActive ? colorAccent : colorGray; // Same color as Box when active, gray when inactive
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
