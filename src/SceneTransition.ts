import { lerp } from "kontra";
import { colorBlack } from "./colorUtils";
import { Vector } from "./Vector";

const enum TransitionState {
  FadeIn = "i",
  FadeOut = "o",
  Complete = "c",
}
export class SceneTransition {
  targetY = -10;
  lerpFactor = 0.15;
  pos = Vector(0, 0);
  state: TransitionState = TransitionState.FadeIn;
  constructor(private canvas: HTMLCanvasElement) {
    this.pos.y = canvas.height;
  }

  update() {
    // lerp will "never" reach target, so reduce by a small margin
    if (this.pos.y - 10 >= this.targetY) {
      this.pos.y = lerp(this.pos.y, this.targetY, this.lerpFactor);
    } else {
      this.pos.y = lerp(
        this.pos.y,
        this.targetY - this.canvas.height,
        this.lerpFactor
      );
    }
    this.handleState();
  }

  handleState() {
    if (this.state == TransitionState.FadeIn && this.isFadeInComplete()) {
      this.state = TransitionState.FadeOut;
    } else if (
      this.state == TransitionState.FadeOut &&
      this.isFadeOutComplete()
    ) {
      this.state = TransitionState.Complete;
    }
  }
  render(context: CanvasRenderingContext2D) {
    const { width, height } = this.canvas;

    // Clear the canvas
    context.save();
    context.clearRect(0, 0, width, height);

    // Draw the black box
    context.fillStyle = colorBlack;
    context.fillRect(0, this.pos.y, width, height);
    context.restore();
  }

  isFadeInComplete() {
    return this.pos.y <= this.targetY;
  }
  isFadeOutComplete() {
    return this.pos.y - 2 <= this.targetY - this.canvas.height;
  }
  reset() {
    this.state = TransitionState.FadeIn;
    this.pos.y = this.canvas.height;
  }
}
