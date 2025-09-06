import { MyGameEntity } from "./MyGameEntity";
import { GameObjectType } from "./GameObjectType";
import { colorWhite } from "./colorUtils";
import { MyVector } from "./Vector";

export class Goal implements MyGameEntity {
  pos: MyVector;
  type = GameObjectType.Goal;
  width: number = 200;
  height: number = 150;
  radiusX = 100;
  radiusY = 150;
  constructor(pos: MyVector) {
    this.pos = pos;
  }

  update() {}

  render(context: CanvasRenderingContext2D) {
    context.save();

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
