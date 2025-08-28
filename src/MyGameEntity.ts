import { GameObjectType } from "./GameObjectType";
import { MyVector } from "./Vector";

export interface MyGameEntity {
  type: GameObjectType;
  pos: MyVector;
  width?: number; // Optional for collision detection (rectangles)
  height?: number; // Optional for collision detection (rectangles)
  radius?: number; // Optional for collision detection (circles)
  update: () => void;
  render: (ctx: CanvasRenderingContext2D) => void;
}
