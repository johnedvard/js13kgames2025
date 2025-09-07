import { MyGameEntity } from "./MyGameEntity";
import { Vector, MyVector } from "./Vector";
import { GameObjectType } from "./GameObjectType";
import { colorBlack } from "./colorUtils";

export class Laser implements MyGameEntity {
  type = GameObjectType.Laser;
  pos = Vector(0, 0);
  width = 0;
  height = 0;
  radius = 0;

  startPoint: MyVector;
  endPoint: MyVector;
  beamWidth: number = 20;
  isActive: boolean = true; // ON/OFF toggle like RopeContactPoint

  // Periodic toggle properties
  toggleTimer: number = 0;
  toggleDuration: number = 350;
  onDuration: number = 120;

  // Beam animation properties
  beamProgress: number = 0; // 0 to 1, how much of the beam is visible
  beamGrowthSpeed: number = 0.15; // How fast the beam grows (0.1 = slower, 0.3 = faster)
  wasActive: boolean = false; // Track previous state to detect ON transitions

  // Fade-out properties
  fadeProgress: number = 0; // 0 to 1, stroke width multiplier for fade-out
  fadeSpeed: number = 0.2; // How fast the beam fades out (higher = faster)

  // Warning indicator properties
  warningFrames: number = 45;
  isWarning: boolean = false; // Whether to show warning indicator

  constructor(startPoint: MyVector, endPoint: MyVector) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;

    // Simplified: assume perfectly horizontal or vertical lasers
    const isHorizontal = this.startPoint.y === this.endPoint.y;

    if (isHorizontal) {
      this.width = Math.abs(this.endPoint.x - this.startPoint.x);
      this.height = 5;
    } else {
      // Vertical
      this.width = 5;
      this.height = Math.abs(this.endPoint.y - this.startPoint.y);
    }

    // Set position to the top-left corner of the bounding box
    this.pos = Vector(
      Math.min(this.startPoint.x, this.endPoint.x) - 20,
      Math.min(this.startPoint.y, this.endPoint.y)
    );
  }

  update() {
    // Periodic ON/OFF toggle
    this.toggleTimer = (this.toggleTimer + 1) % this.toggleDuration;
    const newActive = this.toggleTimer < this.onDuration;

    // Calculate frames until next ON cycle
    const framesUntilOn =
      this.toggleTimer >= this.onDuration
        ? this.toggleDuration - this.toggleTimer
        : 0;

    // Show warning indicator when close to turning ON
    this.isWarning =
      !this.isActive &&
      framesUntilOn <= this.warningFrames &&
      framesUntilOn > 0;

    // Detect transition from OFF to ON
    if (newActive && !this.wasActive) {
      this.beamProgress = 0; // Reset beam progress when turning ON
      this.fadeProgress = 1; // Full opacity when turning ON
    }

    this.wasActive = this.isActive;
    this.isActive = newActive;

    // Animate beam growth when active
    if (this.isActive) {
      this.beamProgress = Math.min(1, this.beamProgress + this.beamGrowthSpeed);
      this.fadeProgress = 1; // Maintain full opacity while active
    } else {
      this.beamProgress = 0; // Immediately stop growth when OFF
      this.fadeProgress = Math.max(0, this.fadeProgress - this.fadeSpeed); // Fade out quickly
    }
  }

  render(context: CanvasRenderingContext2D) {
    context.save();

    // Simplified: use direct distance calculation for horizontal/vertical
    const isHorizontal = this.startPoint.y === this.endPoint.y;
    const totalLength = isHorizontal
      ? Math.abs(this.endPoint.x - this.startPoint.x)
      : Math.abs(this.endPoint.y - this.startPoint.y);

    // Always render the first 10px of the connection point
    const tenPixelRatio = Math.min(1, 15 / totalLength);

    const tenPixelEndX = isHorizontal
      ? this.startPoint.x +
        (this.endPoint.x - this.startPoint.x) * tenPixelRatio
      : this.startPoint.x;
    const tenPixelEndY = isHorizontal
      ? this.startPoint.y
      : this.startPoint.y +
        (this.endPoint.y - this.startPoint.y) * tenPixelRatio;

    // Use the maximum beam width (same as the main beam's start width)
    const maxWidth = this.beamWidth * 3;

    context.strokeStyle = colorBlack;
    context.lineWidth = maxWidth;

    context.beginPath();
    context.moveTo(this.startPoint.x, this.startPoint.y);
    context.lineTo(tenPixelEndX, tenPixelEndY);
    context.stroke();

    // Always render the last 15px connection point
    const fifteenPixelRatio = Math.min(1, 15 / totalLength);
    const lastFifteenStartX = isHorizontal
      ? this.endPoint.x -
        (this.endPoint.x - this.startPoint.x) * fifteenPixelRatio
      : this.endPoint.x;
    const lastFifteenStartY = isHorizontal
      ? this.endPoint.y
      : this.endPoint.y -
        (this.endPoint.y - this.startPoint.y) * fifteenPixelRatio;

    context.beginPath();
    context.moveTo(lastFifteenStartX, lastFifteenStartY);
    context.lineTo(this.endPoint.x, this.endPoint.y);
    context.stroke();

    // Draw warning indicator (thin red line) before laser activates
    if (this.isWarning) {
      context.strokeStyle = "#f00";
      context.lineWidth = 3;

      context.beginPath();
      context.moveTo(this.startPoint.x, this.startPoint.y);
      context.lineTo(this.endPoint.x, this.endPoint.y);
      context.stroke();
    }

    // Only render main beam if there's something to show (beam progress or fade progress)
    context.restore();

    // Calculate the beam length - simplified for horizontal/vertical
    const beamLength = totalLength;

    // Use beam progress for growth, but allow full beam during fade-out
    const renderProgress = this.isActive ? this.beamProgress : 1;

    // Calculate current end point based on render progress - simplified
    const currentEndX = isHorizontal
      ? this.startPoint.x +
        (this.endPoint.x - this.startPoint.x) * renderProgress
      : this.startPoint.x;
    const currentEndY = isHorizontal
      ? this.startPoint.y
      : this.startPoint.y +
        (this.endPoint.y - this.startPoint.y) * renderProgress;
    const currentLength = beamLength * renderProgress;

    // Create multiple segments for tapering effect
    const segments = Math.max(5, Math.floor(currentLength / 20)); // More segments for longer beams

    for (let i = 0; i < segments; i++) {
      const t1 = i / segments;
      const t2 = (i + 1) / segments;

      // Calculate positions for this segment (relative to current beam progress)
      const x1 = this.startPoint.x + (currentEndX - this.startPoint.x) * t1;
      const y1 = this.startPoint.y + (currentEndY - this.startPoint.y) * t1;
      const x2 = this.startPoint.x + (currentEndX - this.startPoint.x) * t2;
      const y2 = this.startPoint.y + (currentEndY - this.startPoint.y) * t2;

      // Calculate tapered width - starts wide, quickly goes to default
      // Use exponential decay for quick tapering
      const baseWidth = this.beamWidth * 3; // Start 3x wider

      // Draw main beam segment
      context.strokeStyle = "#f00";
      context.lineWidth = baseWidth * this.fadeProgress;
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();

      // Draw brighter core beam
      context.strokeStyle = "#f44";
      context.lineWidth = baseWidth * this.fadeProgress * 0.5;

      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    }

    context.restore();
  }
}
