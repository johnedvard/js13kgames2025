import { Vector } from "kontra";
import { MyGameEntity } from "./MyGameEntity";
import { GameObjectType } from "./GameObjectType";
import { colorWall } from "./colorUtils";

export class Box implements MyGameEntity {
  pos: Vector;
  width: number;
  height: number;
  type = GameObjectType.Platform;

  constructor(pos: Vector, width: number, height: number) {
    this.pos = pos;
    this.width = width;
    this.height = height;
  }
  update() {}
  render(context: CanvasRenderingContext2D) {
    context.save();

    // Render shadow box behind the original (x+4, y+4 with 0.7 opacity)
    context.globalAlpha = 0.9;
    context.fillStyle = "#000";
    context.fillRect(this.pos.x + 14, this.pos.y + 14, this.width, this.height);

    // Render original box
    context.globalAlpha = 1.0;
    context.fillStyle = colorWall; // cat noir color
    context.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    context.restore();
  }
}
