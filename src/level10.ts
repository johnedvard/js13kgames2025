import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(1008, 936),
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
      {
        box: {
          pos: Vector(263, 1580),
          width: 200,
          height: 876,
          canBounce: true,
        },
      },
      { shuriken: { pos: Vector(1992, 2340) } },
      { shuriken: { pos: Vector(608, 1480) } },
      { shuriken: { pos: Vector(612, 1036) } },
      { pickup: { pos: Vector(1720, 564) } },
      { pickup: { pos: Vector(1412, 2028) } },
      { pickup: { pos: Vector(608, 2404) } },
      {
        ropeContactPoint: {
          pos: Vector(1792, 1204),
          endPos: Vector(1792, 1204),
        },
      },
      {
        ropeContactPoint: { pos: Vector(1344, 796), endPos: Vector(1344, 796) },
      },
      {
        ropeContactPoint: { pos: Vector(784, 1932), endPos: Vector(784, 1932) },
      },
      {
        ropeContactPoint: {
          pos: Vector(1991.4375, 1792),
          endPos: Vector(1991.4375, 1792),
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(1343, 1524),
          endPos: Vector(1343, 1524),
        },
      },
      { box: { pos: Vector(200, 200), width: 200, height: 2600 } },
      {
        box: {
          pos: Vector(2147, 1408),
          width: 200,
          height: 944,
          canBounce: true,
        },
      },
      {
        box: {
          pos: Vector(915, 1160),
          width: 200,
          height: 200,
          canBounce: true,
        },
      },
      { box: { pos: Vector(1831, 756), width: 420, height: 200 } },
      {
        box: {
          pos: Vector(915, 1828),
          width: 200,
          height: 200,
          canBounce: true,
        },
      },
      {
        box: {
          pos: Vector(1072, 2396),
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
