import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(1540, 1984),
    goalPos: Vector(-9999, -9999),
    background: {
      positions: [
        Vector(100, 100),
        Vector(4680, 136),
        Vector(4688, 3076),
        Vector(120, 3088),
      ],
    },
    objects: [
      { box: { pos: Vector(50, 0), width: 4550, height: 200 } },
      { box: { pos: Vector(4600, 0), width: 200, height: 3000 } },
      { box: { pos: Vector(50, 200), width: 200, height: 2800 } },
      {
        box: {
          pos: Vector(724, 2600),
          width: 2200,
          height: 400,
          canBounce: true,
        },
      },
      { box: { pos: Vector(50, 3000), width: 4750, height: 200 } },
      { shuriken: { pos: Vector(1808, 1200) } },
      {
        box: {
          pos: Vector(3136, 920),
          width: 200,
          height: 200,
          canBounce: true,
        },
      },
      {
        ropeContactPoint: { pos: Vector(1016, 604), endPos: Vector(1016, 604) },
      },
      {
        ropeContactPoint: {
          pos: Vector(2588, 1812),
          endPos: Vector(2588, 1812),
        },
      },
      {
        ropeContactPoint: { pos: Vector(2764, 944), endPos: Vector(2764, 944) },
      },
      {
        ropeContactPoint: { pos: Vector(2164, 456), endPos: Vector(2164, 456) },
      },
      {
        ropeContactPoint: { pos: Vector(716, 1644), endPos: Vector(716, 1644) },
      },
      {
        ropeContactPoint: {
          canActivate: true,
          isActive: false,
          pos: Vector(3832, 2196),
          endPos: Vector(3832, 2196),
        },
      },
      {
        box: {
          pos: Vector(3752, 2532),
          width: 200,
          height: 200,
          canBounce: true,
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(3984, 1228),
          endPos: Vector(2984, 1228),
        },
      },
      { text: { pos: Vector(1500, 2000), text: "Thanks for playing!" } }, // centered for wider level
    ],
  };
}
