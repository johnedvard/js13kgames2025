import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(4250, 718),
    goalPos: Vector(1132, 922),
    background: {
      positions: [
        Vector(788, 102),
        Vector(4700, 112),
        Vector(4708, 2442),
        Vector(824, 2442),
      ],
    },
    objects: [
      { box: { pos: Vector(3496, 796), width: 1156, height: 200 } },
      { box: { pos: Vector(700, 0), width: 1924, height: 500 } },
      { pickup: { pos: Vector(2842, 334) } },
      { pickup: { pos: Vector(2318, 2162) } },
      { pickup: { pos: Vector(4258, 1202) } },
      { ropeContactPoint: { pos: Vector(1950, 750) } },
      { ropeContactPoint: { pos: Vector(3050, 750) } },
      { box: { pos: Vector(1700, 2344), width: 1152, height: 836 } },
      { box: { pos: Vector(2800, 1400), width: 2000, height: 1780 } },
      { box: { pos: Vector(2600, 0), width: 2100, height: 200 } },
      { box: { pos: Vector(700, 500), width: 200, height: 1100 } },
      {
        box: {
          pos: Vector(700, 1400),
          width: 1000,
          height: 1784,
          canBounce: true,
        },
      },
      { box: { pos: Vector(4600, 0), width: 200, height: 1400 } },
    ],
  };
}
