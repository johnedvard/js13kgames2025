import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(760, 604),
    goalPos: Vector(310, 2028),
    background: {
      positions: [
        Vector(76, 100),
        Vector(2336, 104),
        Vector(2332, 2716),
        Vector(76, 2736),
      ],
    },
    objects: [
      { box: { pos: Vector(0, 0), width: 200, height: 2800 } },
      { shuriken: { pos: Vector(2044, 2464) } },
      { pickup: { pos: Vector(1524, 932) } },
      { pickup: { pos: Vector(364, 864) } },
      { pickup: { pos: Vector(596, 2404) } },
      {
        ropeContactPoint: { pos: Vector(1032, 464), endPos: Vector(1032, 464) },
      },
      {
        ropeContactPoint: { pos: Vector(1968, 640), endPos: Vector(1968, 640) },
      },
      {
        ropeContactPoint: {
          pos: Vector(1604, 1600),
          endPos: Vector(1604, 1600),
        },
      },
      {
        ropeContactPoint: { pos: Vector(604, 1576), endPos: Vector(604, 1576) },
      },
      {
        laser: { startPoint: Vector(1100, 2150), endPoint: Vector(2200, 2150) },
      },
      {
        laser: { startPoint: Vector(932, 1100), endPoint: Vector(2200, 1100) },
      },
      { laser: { startPoint: Vector(600, 2100), endPoint: Vector(600, 200) } },
      {
        box: {
          pos: Vector(160, 1044),
          width: 760,
          height: 120,
          canBounce: true,
        },
      },
      {
        box: {
          pos: Vector(132, 2100),
          width: 964,
          height: 120,
          canBounce: true,
        },
      },
      { box: { pos: Vector(96, 2600), width: 2204, height: 200 } },
      { box: { pos: Vector(0, 0), width: 2400, height: 200 } },
      { box: { pos: Vector(2200, 200), width: 200, height: 2600 } },
    ],
  };
}
