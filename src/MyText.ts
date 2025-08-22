import { Vector } from "kontra";
import { MyGameEntity } from "./MyGameEntity";
import { GameObjectType } from "./GameObjectType";
import { colorWhite } from "./colorUtils";

export class MyText implements MyGameEntity {
  pos: Vector;
  type = GameObjectType.Text;
  text: string;
  color: string;

  constructor(pos: Vector, text: string, color: string = colorWhite) {
    this.pos = pos;
    this.text = text;
    this.color = color;
  }

  update() {}

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.font = "42px Impact";
    ctx.fillText(this.text, this.pos.x, this.pos.y);
    ctx.restore();
  }
}
