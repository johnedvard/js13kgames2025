import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(512, 964),
    goalPos: Vector(3004, 1888),
    background: {
      positions: [
        Vector(264, 480),
        Vector(1832, 484),
        Vector(3332, 512),
        Vector(3352, 2356),
        Vector(296, 2356),
        Vector(276, 1060),
      ],
    },
    objects: [
      {
        ropeContactPoint: {
          pos: Vector(1012, 1004),
          canActivate: true,
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(1628, 1204),
          canActivate: true,
          isActive: false,
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(2208, 1388),
          canActivate: true,
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(2812, 1404),
          canActivate: true,
          isActive: false,
        },
      },
      { shuriken: { pos: Vector(1600, 2084) } },
      { shuriken: { pos: Vector(2200, 2084) } },
      { shuriken: { pos: Vector(2804, 2076) } },
      { pickup: { pos: Vector(1352, 1244) } },
      { pickup: { pos: Vector(1992, 1580) } },
      { pickup: { pos: Vector(2584, 1660) } },
      { shuriken: { pos: Vector(1000, 2080) } },
      { box: { pos: Vector(296, 2200), width: 3000, height: 200 } },
      { box: { pos: Vector(200, 400), width: 200, height: 1600 } },
      { box: { pos: Vector(3200, 400), width: 200, height: 2000 } },
      { box: { pos: Vector(200, 1100), width: 400, height: 1300 } },
      { box: { pos: Vector(200, 1400), width: 600, height: 1000 } },
      { box: { pos: Vector(400, 400), width: 3000, height: 200 } },
      { box: { pos: Vector(2950, 2000), width: 450, height: 400 } },
    ],
  };
}
