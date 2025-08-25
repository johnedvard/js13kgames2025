import { Vector } from "kontra";
import { MyGameEntity } from "./MyGameEntity";
import { GameObjectType } from "./GameObjectType";
import { colorWhite } from "./colorUtils";

export class Goal implements MyGameEntity {
  pos: Vector;
  type = GameObjectType.Goal;
  width: number = 200;
  height: number = 150;
  private alpha: number = 1;
  private radiusX = 100;
  private radiusY = 150;
  constructor(pos: Vector) {
    this.pos = pos;
  }

  update() {}

  render(context: CanvasRenderingContext2D) {
    context.save();
    context.globalAlpha = this.alpha;

    context.beginPath();
    context.ellipse(
      this.pos.x + this.width / 2,
      this.pos.y,
      this.radiusX,
      this.radiusY,
      0,
      0,
      2 * Math.PI
    );

    // Fill with white
    context.fillStyle = colorWhite;
    context.fill();

    context.restore();
  }
}
