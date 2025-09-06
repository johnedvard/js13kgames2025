import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(876, 2728),
    goalPos: Vector(3000, 2888),
    background: {
      positions: [
        Vector(100, 100),
        Vector(4244, 100),
        Vector(4336, 3056),
        Vector(100, 3084),
      ],
    },
    objects: [
      {
        box: {
          pos: Vector(1212, 632),
          width: 200,
          height: 2460,
          canBounce: true,
        },
      },
      { pickup: { pos: Vector(1324, 400) } },
      { pickup: { pos: Vector(1896, 2680) } },
      { pickup: { pos: Vector(3492, 780) } },
      {
        ropeContactPoint: { pos: Vector(484, 2052), endPos: Vector(484, 2052) },
      },
      {
        ropeContactPoint: {
          pos: Vector(1040, 1324),
          endPos: Vector(1040, 1324),
        },
      },
      { ropeContactPoint: { pos: Vector(604, 608), endPos: Vector(604, 608) } },
      {
        ropeContactPoint: {
          pos: Vector(2208, 2320),
          endPos: Vector(2208, 2320),
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(1652, 1600),
          endPos: Vector(1652, 1600),
        },
      },
      {
        ropeContactPoint: { pos: Vector(1932, 716), endPos: Vector(1932, 716) },
      },
      {
        ropeContactPoint: { pos: Vector(3820, 420), endPos: Vector(3820, 420) },
      },
      {
        ropeContactPoint: {
          pos: Vector(2984, 1280),
          endPos: Vector(2984, 1280),
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(3812, 2084),
          endPos: Vector(3812, 2084),
        },
      },
      { shuriken: { pos: Vector(3856, 2816) } },
      { shuriken: { pos: Vector(2872, 364) } },
      { shuriken: { pos: Vector(2252, 328) } },
      { shuriken: { pos: Vector(376, 352) } },
      {
        box: {
          pos: Vector(2450, 200),
          width: 200,
          height: 700,
          canBounce: true,
        },
      },
      {
        box: {
          pos: Vector(2450, 1300),
          width: 200,
          height: 1700,
          canBounce: true,
        },
      },
      {
        box: { pos: Vector(200, 0), width: 3800, height: 200, canBounce: true },
      },
      {
        box: {
          pos: Vector(200, 3000),
          width: 3800,
          height: 200,
          canBounce: true,
        },
      },
      { box: { pos: Vector(0, 0), width: 200, height: 3200, canBounce: true } },
      {
        box: {
          pos: Vector(4000, 0),
          width: 400,
          height: 3200,
          canBounce: true,
        },
      },
    ],
  };
}
