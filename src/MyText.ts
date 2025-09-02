import { MyVector } from "./Vector";
import { MyGameEntity } from "./MyGameEntity";
import { GameObjectType } from "./GameObjectType";
import { colorWhite, fontFamily } from "./colorUtils";

export class MyText implements MyGameEntity {
  pos: MyVector;
  type = GameObjectType.Text;
  text: string;
  color: string;

  constructor(pos: MyVector, text: string, color: string = colorWhite) {
    this.pos = pos;
    this.text = text;
    this.color = color;
  }

  update() {}

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.font = `62px ${fontFamily}`;
    ctx.fillText(this.text, this.pos.x, this.pos.y);
    ctx.restore();
  }
}
