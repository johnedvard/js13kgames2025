import { Vector } from "./Vector";
import { LevelObject } from "./types";

export default function getLevel(): LevelObject {
  return {
    playerPos: Vector(0, -500),
    goalPos: Vector(2265, 120),
    background: {
      positions: [
        Vector(-490, -940),
        Vector(2810, -940),
        Vector(2810, 160),
        Vector(-490, 160),
      ],
    },
    objects: [
      { box: { pos: Vector(-500, -950), width: 3300, height: 200 } },
      { box: { pos: Vector(-500, -750), width: 200, height: 1100 } },
      { pickup: { pos: Vector(100, -200) } },
      { pickup: { pos: Vector(1100, -200) } },
      { pickup: { pos: Vector(2100, -200) } },
      { box: { pos: Vector(-500, 150), width: 3300, height: 200 } },
      { box: { pos: Vector(2600, -750), width: 200, height: 1100 } },
      { text: { pos: Vector(0, -200), text: "Tap and hold anywhere" } },
      { text: { pos: Vector(2315, 230), text: "Goal" } },
      { ropeContactPoint: { pos: Vector(300, -500) } },
      { ropeContactPoint: { pos: Vector(1000, -500) } },
      { ropeContactPoint: { pos: Vector(1800, -500) } },
    ],
  };
}
