import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(1650, 750),
    goalPos: Vector(1000, 1370),
    background: {
      positions: [
        Vector(760, 310),
        Vector(4040, 310),
        Vector(4040, 1410),
        Vector(760, 1410),
      ],
    },
    objects: [
      { box: { pos: Vector(750, 300), width: 3300, height: 200 } },
      { box: { pos: Vector(750, 500), width: 200, height: 1100 } },
      { pickup: { pos: Vector(1350, 1050) } },
      { pickup: { pos: Vector(2350, 1050) } },
      { pickup: { pos: Vector(3350, 1050) } },
      { box: { pos: Vector(750, 1400), width: 3300, height: 200 } },
      { box: { pos: Vector(3850, 500), width: 200, height: 1100 } },
      { ropeContactPoint: { pos: Vector(1950, 750) } },
      { ropeContactPoint: { pos: Vector(3050, 750) } },
    ],
  };
}
