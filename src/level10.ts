import { Vector } from "kontra";

export default function getLevel() {
  return {
    playerPos: Vector(648, 1600),
    goalPos: Vector(1982, 636),
    background: {
      positions: [
        Vector(264, 272),
        Vector(2340, 260),
        Vector(2332, 2716),
        Vector(272, 2720),
      ],
    },
    objects: [
      { box: { pos: Vector(200, 200), width: 200, height: 2600 } },
      { shuriken: { pos: Vector(896, 2188) } },
      { shuriken: { pos: Vector(1000, 1100) } },
      { shuriken: { pos: Vector(1680, 1528) } },
      { pickup: { pos: Vector(1500, 916) } },
      { pickup: { pos: Vector(720, 768) } },
      { pickup: { pos: Vector(608, 2404) } },
      { ropeContactPoint: { pos: Vector(1276, 536), radius: 40 } },
      { ropeContactPoint: { pos: Vector(1916, 1148), radius: 40 } },
      { ropeContactPoint: { pos: Vector(1812, 2004), radius: 40 } },
      { ropeContactPoint: { pos: Vector(1028, 1540), radius: 40 } },
      { box: { pos: Vector(1831, 756), width: 420, height: 200 } },
      {
        box: {
          pos: Vector(547, 1872),
          width: 200,
          height: 200,
          canBounce: true,
        },
      },
      {
        box: {
          pos: Vector(1136, 2240),
          width: 724,
          height: 120,
          canBounce: true,
        },
      },
      {
        box: {
          pos: Vector(400, 2600),
          width: 1800,
          height: 200,
          canBounce: true,
        },
      },
      { box: { pos: Vector(400, 200), width: 2000, height: 200 } },
      { box: { pos: Vector(2200, 200), width: 200, height: 2600 } },
    ],
  };
}
