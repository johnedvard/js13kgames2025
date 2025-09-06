import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(400, 585),
    goalPos: Vector(4248, 2685),
    background: {
      positions: [
        Vector(100, 100),
        Vector(4696, 92),
        Vector(4696, 2912),
        Vector(916, 2912),
        Vector(908, 1424),
        Vector(100, 1392),
      ],
    },
    objects: [
      { box: { pos: Vector(0, 0), width: 200, height: 1500 } },
      { shuriken: { pos: Vector(1148, 1382) } },
      { shuriken: { pos: Vector(1593, 1597) } },
      { shuriken: { pos: Vector(2398, 2003) } },
      { pickup: { pos: Vector(711, 892) } },
      { pickup: { pos: Vector(2199, 809) } },
      { pickup: { pos: Vector(3211, 1394) } },
      { ropeContactPoint: { pos: Vector(2413, 1395) } },
      { ropeContactPoint: { pos: Vector(1593, 795) } },
      { ropeContactPoint: { pos: Vector(751, 448) } },
      { ropeContactPoint: { pos: Vector(3812, 1400) } },
      { shuriken: { pos: Vector(3816, 1812) } },
      { box: { pos: Vector(0, 1300), width: 1000, height: 1700 } },
      { box: { pos: Vector(200, 0), width: 4600, height: 200 } },
      { box: { pos: Vector(800, 1300), width: 200, height: 1700 } },
      { box: { pos: Vector(800, 2800), width: 4000, height: 200 } },
      { box: { pos: Vector(4600, 0), width: 200, height: 3000 } },
    ],
  };
}
