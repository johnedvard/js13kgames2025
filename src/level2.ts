import { Vector } from "kontra";

// ⇧ ⇨ ⇩ ⇦
export default function getLevel() {
  return {
    playerPos: Vector(0, -500),
    goalPos: Vector(2415, 120),
    background: { pos: Vector(-490, -940), width: 1100 * 3 - 20, height: 1100 },
    objects: [
      // ceiling wall
      { box: { pos: Vector(-500, -950), width: 1100 * 3, height: 200 } },
      // left wall
      { box: { pos: Vector(-500, -750), width: 200, height: 1100 } },
      // floor
      { box: { pos: Vector(-500, 150), width: 1100, height: 200 } },
      { box: { pos: Vector(1500, 150), width: 1100, height: 200 } },
      // right wall
      { box: { pos: Vector(1500 + 1100, -750), width: 200, height: 1100 } },
      { text: { pos: Vector(205, -400), text: "Tap and hold" } },
      { text: { pos: Vector(2415 - 40, 200), text: "Goal" } },
      { ropeContactPoint: { pos: Vector(300, -500), radius: 40 } },
      { ropeContactPoint: { pos: Vector(1000, -500), radius: 40 } },
      { ropeContactPoint: { pos: Vector(1800, -500), radius: 40 } },
    ],
  };
}
