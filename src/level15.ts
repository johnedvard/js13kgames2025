import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(1106, 842),
    goalPos: Vector(4424, 738),
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
      { pickup: { pos: Vector(2842, 334) } },
      { pickup: { pos: Vector(2318, 2162) } },
      { pickup: { pos: Vector(4258, 1202) } },
      {
        ropeContactPoint: { pos: Vector(1638, 718), endPos: Vector(1638, 718) },
      },
      {
        ropeContactPoint: { pos: Vector(3014, 606), endPos: Vector(3014, 606) },
      },
      {
        laser: { startPoint: Vector(1400, 510), endPoint: Vector(1400, 1400) },
      },
      {
        laser: { startPoint: Vector(2800, 1800), endPoint: Vector(1700, 1800) },
      },
      {
        laser: { startPoint: Vector(3600, 1010), endPoint: Vector(3600, 1400) },
      },
      {
        ropeContactPoint: {
          pos: Vector(2256, 1204),
          endPos: Vector(2256, 1204),
        },
      },
      {
        ropeContactPoint: { pos: Vector(4052, 420), endPos: Vector(4052, 420) },
      },
      {
        box: {
          pos: Vector(1000, 1200),
          width: 200,
          height: 200,
          canBounce: true,
        },
      },
      { box: { pos: Vector(700, 0), width: 1900, height: 500 } },
      { box: { pos: Vector(2600, 0), width: 2200, height: 200 } },
      { box: { pos: Vector(700, 500), width: 200, height: 1100 } },
      { box: { pos: Vector(700, 1400), width: 1000, height: 1800 } },
      { box: { pos: Vector(1616, 2400), width: 1236, height: 800 } },
      { box: { pos: Vector(4600, 0), width: 200, height: 3200 } },
      { box: { pos: Vector(2800, 1400), width: 2000, height: 1800 } },
    ],
  };
}
