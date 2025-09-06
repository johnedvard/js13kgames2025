import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(-800, 0),
    goalPos: Vector(1150, -650),
    background: {
      positions: [
        Vector(-1180, -1980),
        Vector(1580, -1980),
        Vector(1580, 580),
        Vector(-1180, 580),
      ],
    },
    objects: [
      { box: { pos: Vector(900, -600), width: 550, height: 200 } },
      { ropeContactPoint: { pos: Vector(-300, -150) } },
      { ropeContactPoint: { pos: Vector(600, -150) } },
      { ropeContactPoint: { pos: Vector(100, -600) } },
      { ropeContactPoint: { pos: Vector(-300, -1050) } },
      { ropeContactPoint: { pos: Vector(600, -1050) } },
      { ropeContactPoint: { pos: Vector(100, -1500) } },
      { ropeContactPoint: { pos: Vector(1000, -1500) } },
      { pickup: { pos: Vector(100, -200) } },
      { pickup: { pos: Vector(-500, -1500) } },
      { pickup: { pos: Vector(500, -900) } },

      { box: { pos: Vector(-1200, -2000), width: 2800, height: 200 } },
      { box: { pos: Vector(-1200, -1800), width: 200, height: 2400 } },
      { box: { pos: Vector(1400, -2000), width: 200, height: 2600 } },
      { box: { pos: Vector(-1200, 400), width: 2800, height: 368 } },
    ],
  };
}
