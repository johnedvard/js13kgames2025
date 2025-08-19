import { Vector } from "kontra";
import { GameObjectType } from "./GameObjectType";

export interface MyGameEntity {
  type: GameObjectType;
  pos: Vector;
  width?: number; // Optional for collision detection (rectangles)
  height?: number; // Optional for collision detection (rectangles)
  radius?: number; // Optional for collision detection (circles)
  update: () => void;
  render: (ctx: CanvasRenderingContext2D) => void;
}
