import { off, on, Vector } from "kontra";
import { GameEvent } from "./GameEvent";
import { findClosestRopeContactPoint } from "./main";
import { RopeContactPoint } from "./RopeContactPoint";
import { MyGameEntity } from "./MyGameEntity";
import { GameObjectType } from "./GameObjectType";
import { colorAccent, colorBlack, colorWhite } from "./colorUtils";
import { playRopeExtend } from "./audio";
export type PlayerState = "d" | "a";

// Verlet point for headband threads
interface VerletPoint {
  pos: Vector;
  oldPos: Vector;
  pinned: boolean; // First point is pinned to headband
}

export class Player implements MyGameEntity {
  rot = 0;
  pos: Vector = Vector(0, 0); // Center point of the balloon
  velocity: Vector = Vector(0, 0); // Player velocity
  state: PlayerState = "a"; // dead alive
  type = GameObjectType.Player;

  // Collision and positioning
  radius = 79;
  private catCenterX = -58;
  private catCenterY = 95;

  // Headband threads using Verlet integration
  private leftThread: VerletPoint[] = [];
  private rightThread: VerletPoint[] = [];
  private threadSegmentLength = 16;
  private threadCount = 8;

  // Cached cat body rendering
  private catBodyCanvas: OffscreenCanvas | null = null;
  private catShadowCanvas: OffscreenCanvas | null = null;

  // Rope physics properties
  isGrappling: boolean = false;
  ropeContactPoint: RopeContactPoint | null = null;
  ropeLength = 0;
  targetRopeLength = 0;
  initialRopeLength = 0;
  ropeTweenProgress = 0;
  ropeTweenDuration = 60;
  ropeShootProgress = 0;
  ropeShootDuration = 20;
  fullRopeDistance = 0;

  // Physics properties
  spinVelocity = 0;
  spinDamping = 0.9;
  gravity = 0.3;
  damping = 0.999;
  maxSpeed = 25;
  startPos = Vector(0, 0);

  constructor(startPos: Vector) {
    this.startPos = startPos;
    this.pos = startPos;
    this.initializeCatBodyCache();
    this.initializeHeadbandThreads();
    this.listenForEvents();
  }

  private initializeCatBodyCache() {
    // Create an offscreen canvas to cache the normal cat body
    this.catBodyCanvas = new OffscreenCanvas(300, 300);
    const catBodyContext = this.catBodyCanvas.getContext("2d")!;

    // Create an offscreen canvas to cache the shadow cat body
    this.catShadowCanvas = new OffscreenCanvas(300, 300);
    const catShadowContext = this.catShadowCanvas.getContext("2d")!;

    // Render the normal cat body
    this.renderCatBodyToCanvas(catBodyContext, false);

    // Render the black shadow cat body
    this.renderCatBodyToCanvas(catShadowContext, true);
  }

  private initializeHeadbandThreads() {
    // Initialize left thread from left side of cat center (moved up and left)
    const catCenter = this.getCenterPosition();
    const leftAttachPos = Vector(catCenter.x - 30, catCenter.y - 30); // Moved left by 10 pixels
    this.leftThread = [];
    for (let i = 0; i < this.threadCount; i++) {
      const point: VerletPoint = {
        pos: Vector(
          leftAttachPos.x,
          leftAttachPos.y + i * this.threadSegmentLength
        ),
        oldPos: Vector(
          leftAttachPos.x,
          leftAttachPos.y + i * this.threadSegmentLength
        ),
        pinned: i === 0, // First point is pinned to cat center
      };
      this.leftThread.push(point);
    }

    // Initialize right thread from right side of cat center (moved up and left)
    const rightAttachPos = Vector(catCenter.x + 10, catCenter.y - 30); // Moved left by 10 pixels
    this.rightThread = [];
    for (let i = 0; i < this.threadCount; i++) {
      const point: VerletPoint = {
        pos: Vector(
          rightAttachPos.x,
          rightAttachPos.y + i * this.threadSegmentLength
        ),
        oldPos: Vector(
          rightAttachPos.x,
          rightAttachPos.y + i * this.threadSegmentLength
        ),
        pinned: i === 0, // First point is pinned to cat center
      };
      this.rightThread.push(point);
    }
  }

  private renderCatBodyToCanvas(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    isBlackShadow: boolean
  ) {
    ctx.translate(150, 100); // Center the cat in the cache canvas

    // Set global alpha for shadow
    if (isBlackShadow) {
      ctx.globalAlpha = 0.4;
    }

    // Start at (0,0) - main cat body using new SVG path
    // Original path: M666,493C686.516,460.905 677.789,657.701 666.276,672.808C648.758,695.793 572.861,697.023 553,668.702C539.76,649.823 537.699,469.646 553,493C586.474,544.091 628.964,550.939 666,493
    // Converted to start at (0,0), removed decimals, and shortened bottom by ~30px
    ctx.beginPath();
    ctx.moveTo(0, 0); // Starting point at origin
    ctx.bezierCurveTo(20, -32, 11, 134, 0, 149); // Reduced Y from 164,179 to 134,149 (moved up ~30px)
    ctx.bezierCurveTo(-18, 172, -93, 174, -113, 145); // Reduced Y from 202,204,175 to 172,174,145 (moved up ~30px)
    ctx.bezierCurveTo(-126, 126, -128, -24, -113, 0); // Reduced Y from 156 to 126 (moved up ~30px)
    ctx.bezierCurveTo(-79, 41, -37, 48, 0, 0); // Reduced Y from 51,58 to 41,48 (moved up ~10px)
    ctx.closePath();
    ctx.fillStyle = colorBlack;
    ctx.fill();

    // headband
    ctx.save();
    ctx.fillStyle = isBlackShadow ? colorBlack : colorAccent;
    ctx.fillRect(-125, 45, 137, 41);
    ctx.restore();

    // Eyes on the headband
    ctx.save();

    // Helper function to draw eye
    const drawEye = (offsetX: number, offsetY: number, scale = 0.8) => {
      ctx.beginPath();
      const s = scale;
      ctx.moveTo(offsetX - 30 * s, offsetY);
      ctx.bezierCurveTo(
        offsetX - 31 * s,
        offsetY - 23 * s,
        offsetX - 16 * s,
        offsetY - 30 * s,
        offsetX,
        offsetY - 30 * s
      );
      ctx.bezierCurveTo(
        offsetX + 16 * s,
        offsetY - 30 * s,
        offsetX + 29 * s,
        offsetY - 14 * s,
        offsetX + 29 * s,
        offsetY + 2 * s
      );
      ctx.bezierCurveTo(
        offsetX + 29 * s,
        offsetY + 18 * s,
        offsetX + 16 * s,
        offsetY + 30 * s,
        offsetX,
        offsetY + 30 * s
      );
      ctx.bezierCurveTo(
        offsetX - 16 * s,
        offsetY + 30 * s,
        offsetX - 28 * s,
        offsetY + 24 * s,
        offsetX - 30 * s,
        offsetY
      );
      ctx.closePath();
      ctx.fillStyle = isBlackShadow ? colorBlack : colorWhite;
      ctx.fill();

      // Pupil
      ctx.beginPath();
      ctx.arc(offsetX, offsetY, 6, 0, Math.PI * 2);
      ctx.fillStyle = colorBlack;
      ctx.fill();
    };

    // Draw both eyes
    drawEye(-80, 66);
    drawEye(-30, 66);
    ctx.restore();
  }

  renderCat(ctx: CanvasRenderingContext2D) {
    if (!this.catBodyCanvas || !this.catShadowCanvas) return;

    // Render shadow first (always 8px down and left, not rotated)
    ctx.save();
    ctx.translate(
      this.pos.x + this.catCenterX + 14,
      this.pos.y + this.catCenterY + 14
    ); // Shadow offset: 8px left and down
    ctx.rotate(this.rot); // Rotate the shadow the same as the cat
    ctx.translate(-this.catCenterX, -this.catCenterY);
    ctx.drawImage(this.catShadowCanvas, -150, -100); // Use the pre-rendered black shadow
    ctx.restore();

    // Render the main cat body with rotation
    ctx.save();
    ctx.translate(this.pos.x + this.catCenterX, this.pos.y + this.catCenterY); // Move to cat's center
    ctx.rotate(this.rot); // Rotate around the center
    ctx.translate(-this.catCenterX, -this.catCenterY); // Move back to draw from original position
    ctx.drawImage(this.catBodyCanvas, -150, -100); // Position to match the original rendering
    ctx.restore(); // Restore the transformation state
  }

  onStartGrapple = () => {
    playRopeExtend();
    const closestRopeContactPoint = findClosestRopeContactPoint(this.pos);
    this.ropeContactPoint = closestRopeContactPoint;
    if (!closestRopeContactPoint) return;

    // Start grappling
    this.isGrappling = true;
    const ropeAttachPos = this.getRopeAttachmentPosition();

    // Initialize rope shooting animation
    this.fullRopeDistance = ropeAttachPos.distance(closestRopeContactPoint.pos);
    this.ropeShootProgress = 0; // Start shooting animation

    // Set initial rope length to full distance
    this.ropeLength = this.fullRopeDistance;
    this.initialRopeLength = this.ropeLength;
    // Set target length to be shorter (reduce by 20%)
    this.targetRopeLength = this.ropeLength * 0.8;
    // Reset tween progress
    this.ropeTweenProgress = 0;

    // Give the player speed boost towards the grapple point only if current speed is low
    const currentSpeed = this.velocity.length();
    const speedThreshold = 8; // Only boost if speed is below this threshold

    if (currentSpeed < speedThreshold) {
      // Calculate boost amount based on how slow the player is moving
      const speedDeficit = speedThreshold - currentSpeed;
      const boostMultiplier = speedDeficit / speedThreshold; // 0 to 1, higher when slower
      const baseBoostSpeed = 9; // Base speed boost amount
      const actualBoostSpeed = baseBoostSpeed * boostMultiplier;

      // Determine horizontal direction to the grapple point
      const deltaToGrapple =
        closestRopeContactPoint.pos.subtract(ropeAttachPos);

      // Add velocity only in horizontal direction (+x or -x)
      const horizontalDirection = Math.sign(deltaToGrapple.x); // -1 for left, +1 for right
      this.velocity = this.velocity.add(
        Vector(horizontalDirection * actualBoostSpeed, 0)
      );
    }
  };

  getDirection() {
    return this.velocity.normalize();
  }

  onStopGrapple = () => {
    // Calculate spin velocity based on current movement speed
    const currentSpeed = this.velocity.length();
    const spinSpeedMultiplier = 0.8; // Adjust this to control how much speed affects spin
    this.spinVelocity = currentSpeed * spinSpeedMultiplier;

    // Start spinning if there's enough velocity
    if (this.spinVelocity > 2) {
      // Determine spin direction based on horizontal movement direction
      // Positive X velocity = clockwise spin, Negative X velocity = counter-clockwise spin
      const horizontalDirection = Math.sign(this.velocity.x);
      this.spinVelocity = Math.abs(this.spinVelocity) * horizontalDirection;
    }

    // Release the rope
    this.isGrappling = false;
    this.ropeContactPoint = null;
    this.ropeLength = 0;
    this.targetRopeLength = 0;
    this.initialRopeLength = 0;
    this.ropeTweenProgress = 0;
    this.ropeShootProgress = 0;
    this.fullRopeDistance = 0;
  };
  setState(state: PlayerState) {
    this.state = state;
  }
  listenForEvents() {
    on(GameEvent.down, this.onStartGrapple);
    on(GameEvent.up, this.onStopGrapple);
  }
  removeEventListeners() {
    off(GameEvent.down, this.onStartGrapple);
    off(GameEvent.up, this.onStopGrapple);
  }
  destroy() {
    // Remove event listeners
    this.removeEventListeners();

    // Clean up cached canvases
    this.catBodyCanvas = null;
    this.catShadowCanvas = null;
  }
  render(context: CanvasRenderingContext2D) {
    if (this.state === "d") {
      return;
    }

    // Render the threads behind the cat first
    this.renderHeadbandThreads(context);

    // Render the rope if grappling
    if (this.isGrappling && this.ropeContactPoint) {
      this.renderRope(context);
    }

    this.renderCat(context);
  }

  // Render headband threads
  private renderHeadbandThreads(context: CanvasRenderingContext2D) {
    this.renderThread(context, this.leftThread);
    this.renderThread(context, this.rightThread);
  }

  private renderThread(
    context: CanvasRenderingContext2D,
    thread: VerletPoint[]
  ) {
    if (thread.length < 2) return;

    context.save();

    // Render thread shadow first
    context.globalAlpha = 0.8;
    context.strokeStyle = colorBlack;
    context.lineWidth = 30; // 10 times larger than original (3 * 10)
    this.drawSpline(context, thread, 4, 4); // Shadow offset

    // Render main thread
    context.globalAlpha = 1;
    context.strokeStyle = colorAccent; // Same color as headband
    context.lineWidth = 30; // 10 times larger than original (3 * 10)
    this.drawSpline(context, thread, 0, 0); // No offset

    context.restore();
  }

  // Helper method to draw a smooth spline through the thread points
  private drawSpline(
    context: CanvasRenderingContext2D,
    thread: VerletPoint[],
    offsetX: number,
    offsetY: number
  ) {
    if (thread.length < 2) return;

    context.beginPath();
    context.moveTo(thread[0].pos.x + offsetX, thread[0].pos.y + offsetY);

    if (thread.length === 2) {
      // If only 2 points, draw a straight line
      context.lineTo(thread[1].pos.x + offsetX, thread[1].pos.y + offsetY);
    } else {
      // Draw smooth curves through the points
      for (let i = 1; i < thread.length - 1; i++) {
        const currentPoint = thread[i];
        const nextPoint = thread[i + 1];

        // Calculate control point as midpoint between current and next
        const controlX = (currentPoint.pos.x + nextPoint.pos.x) / 2 + offsetX;
        const controlY = (currentPoint.pos.y + nextPoint.pos.y) / 2 + offsetY;

        // Draw quadratic curve to the current point
        context.quadraticCurveTo(
          currentPoint.pos.x + offsetX,
          currentPoint.pos.y + offsetY,
          controlX,
          controlY
        );
      }

      // Draw final curve to the last point
      const lastPoint = thread[thread.length - 1];
      context.quadraticCurveTo(
        lastPoint.pos.x + offsetX,
        lastPoint.pos.y + offsetY,
        lastPoint.pos.x + offsetX,
        lastPoint.pos.y + offsetY
      );
    }

    context.stroke();
  }

  // Helper method to get the center position of the cat body
  private getCenterPosition(): Vector {
    return Vector(this.pos.x + this.catCenterX, this.pos.y + this.catCenterY);
  }

  // Helper method to get the rope attachment position (bottom of the cat)
  private getRopeAttachmentPosition(): Vector {
    return Vector(
      this.pos.x + this.catCenterX,
      this.pos.y + this.catCenterY + 40
    ); // 40px below center
  }

  // Update headband threads using Verlet integration
  private updateHeadbandThreads() {
    const gravity = Vector(0, 0.2); // Gravity for threads
    const damping = 0.995; // Air resistance

    // Calculate rotated anchor points
    const catCenter = this.getCenterPosition();
    const leftOffset = Vector(-30, -30); // Left anchor offset
    const rightOffset = Vector(10, -30); // Right anchor offset

    // Apply rotation to the offsets
    const cos = Math.cos(this.rot);
    const sin = Math.sin(this.rot);

    const rotatedLeftOffset = Vector(
      leftOffset.x * cos - leftOffset.y * sin,
      leftOffset.x * sin + leftOffset.y * cos
    );

    const rotatedRightOffset = Vector(
      rightOffset.x * cos - rightOffset.y * sin,
      rightOffset.x * sin + rightOffset.y * cos
    );

    // Update left thread with rotated anchor position
    this.updateThread(
      this.leftThread,
      Vector(
        catCenter.x + rotatedLeftOffset.x,
        catCenter.y + rotatedLeftOffset.y
      ),
      gravity,
      damping
    );

    // Update right thread with rotated anchor position
    this.updateThread(
      this.rightThread,
      Vector(
        catCenter.x + rotatedRightOffset.x,
        catCenter.y + rotatedRightOffset.y
      ),
      gravity,
      damping
    );
  }

  private updateThread(
    thread: VerletPoint[],
    anchorPos: Vector,
    gravity: Vector,
    damping: number
  ) {
    // Update positions using Verlet integration
    for (let i = 0; i < thread.length; i++) {
      const point = thread[i];

      if (point.pinned) {
        // First point is always attached to headband
        point.pos = anchorPos.add(Vector(0, 0));
        point.oldPos = point.pos;
      } else {
        // Apply Verlet integration
        const velocity = point.pos.subtract(point.oldPos).scale(damping);
        point.oldPos = point.pos;
        point.pos = point.pos.add(velocity).add(gravity);
      }
    }

    // Apply distance constraints between points
    for (let iteration = 0; iteration < 3; iteration++) {
      // Multiple iterations for stability
      for (let i = 0; i < thread.length - 1; i++) {
        const pointA = thread[i];
        const pointB = thread[i + 1];

        const delta = pointB.pos.subtract(pointA.pos);
        const distance = delta.length();

        if (distance > 0) {
          const difference = this.threadSegmentLength - distance;
          const percent = difference / distance / 2;
          const offset = delta.scale(percent);

          if (!pointA.pinned) {
            pointA.pos = pointA.pos.subtract(offset);
          }
          if (!pointB.pinned) {
            pointB.pos = pointB.pos.add(offset);
          }
        }
      }
    }
  }

  // Easing function for smooth rope shortening (ease-out cubic)
  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  private renderRope(context: CanvasRenderingContext2D) {
    if (!this.ropeContactPoint) return;

    const ropeAttachPos = this.getRopeAttachmentPosition();

    // Animate rope shooting to target with easing (fast start, slow end)
    const targetX = this.ropeContactPoint.pos.x;
    const targetY = this.ropeContactPoint.pos.y;
    const easedProgress = this.easeOutCubic(this.ropeShootProgress);
    const currentX =
      ropeAttachPos.x + (targetX - ropeAttachPos.x) * easedProgress;
    const currentY =
      ropeAttachPos.y + (targetY - ropeAttachPos.y) * easedProgress;

    // Render rope shadow first (8px down and left)
    context.save();
    context.globalAlpha = 0.4;
    context.strokeStyle = colorBlack; // Black shadow
    context.lineWidth = 25;

    context.beginPath();
    context.moveTo(ropeAttachPos.x + 12, ropeAttachPos.y + 8); // Shadow offset
    context.lineTo(currentX + 12, currentY + 8); // Shadow offset
    context.stroke();
    context.restore();

    // Render main rope
    context.save();
    context.strokeStyle = colorBlack; // Brown rope color
    context.lineWidth = 25;
    context.beginPath();
    context.moveTo(ropeAttachPos.x, ropeAttachPos.y);
    context.lineTo(currentX, currentY);
    context.stroke();
    context.restore();
  }
  update() {
    if (this.state === "d") {
      return;
    }

    // Update headband threads physics
    this.updateHeadbandThreads();

    // Update spinning effect based on current movement
    const currentSpeed = this.velocity.length();

    // Continuous spinning based on horizontal movement
    if (currentSpeed > 2 && Math.abs(this.velocity.x) > 1) {
      // Determine spin direction based on horizontal movement
      const horizontalDirection = Math.sign(this.velocity.x);
      const targetSpinVelocity = currentSpeed * 0.1 * horizontalDirection; // Reduced from 0.3 to 0.1

      // Calculate the difference between current and target spin velocity
      const velocityDifference = targetSpinVelocity - this.spinVelocity;

      let lerpFactor = 0.05;

      // Smoothly adjust spin velocity towards target
      this.spinVelocity += velocityDifference * lerpFactor;
    } else {
      // Apply damping when not moving much
      this.spinVelocity *= this.spinDamping;
    }

    this.rot += this.spinVelocity * 0.02; // Much slower rotation speed conversion

    // Handle rope shooting animation
    if (this.isGrappling && this.ropeShootProgress < 1) {
      this.ropeShootProgress += 1 / this.ropeShootDuration;
      if (this.ropeShootProgress >= 1) {
        this.ropeShootProgress = 1;
      }
    }

    if (this.isGrappling && this.ropeContactPoint) {
      // Apply rope physics (pendulum motion)
      this.applyRopePhysics();
    } else {
      // Apply gravity when not grappling
      this.velocity = this.velocity.add(Vector(0, this.gravity));
    }

    // Apply damping (air resistance) - less damping when grappling for more speed
    const currentDamping = this.isGrappling ? 1.01 : this.damping; // Less air resistance when grappling
    this.velocity = this.velocity.scale(currentDamping);

    // Apply maximum speed limit
    const velocityMagnitude = this.velocity.length();
    if (velocityMagnitude > this.maxSpeed) {
      // Scale velocity down to max speed while preserving direction
      this.velocity = this.velocity.normalize().scale(this.maxSpeed);
    }

    // Update position
    this.pos = this.pos.add(this.velocity);
  }

  private applyRopePhysics() {
    if (!this.ropeContactPoint) return;

    // Update tween progress and apply easing to rope length
    if (this.ropeTweenProgress < 1) {
      this.ropeTweenProgress += 1 / this.ropeTweenDuration;
      this.ropeTweenProgress = Math.min(1, this.ropeTweenProgress);

      // Apply easing function to create smooth rope shortening
      const easedProgress = this.easeOutCubic(this.ropeTweenProgress);
      this.ropeLength =
        this.initialRopeLength +
        (this.targetRopeLength - this.initialRopeLength) * easedProgress;
    }

    const ropeAttachPos = this.getRopeAttachmentPosition();
    const ropeVector = ropeAttachPos.subtract(this.ropeContactPoint.pos);
    const currentDistance = ropeVector.length();

    // If rope is stretched beyond its length, constrain the player
    if (currentDistance > this.ropeLength) {
      // Normalize the rope vector and set rope attachment position at rope length
      const normalizedRope = ropeVector.normalize();
      const newRopeAttachPos = this.ropeContactPoint.pos.add(
        normalizedRope.scale(this.ropeLength)
      );

      // Update player position based on new rope attachment position
      // Since rope attaches 40px below center, we need to adjust player position accordingly
      this.pos = Vector(
        newRopeAttachPos.x - this.catCenterX,
        newRopeAttachPos.y - this.catCenterY - 40 // Subtract the 40px offset
      );

      // Calculate tangential velocity (perpendicular to rope)
      const tangent = Vector(-normalizedRope.y, normalizedRope.x);
      const tangentialVelocity = this.velocity.dot(tangent);
      this.velocity = tangent.scale(tangentialVelocity);
    }

    // Apply gravity
    this.velocity = this.velocity.add(Vector(0, this.gravity));
  }
}
