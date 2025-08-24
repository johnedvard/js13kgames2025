import { Vector } from "kontra";

export default function getLevel() {
  return {
    playerPos: Vector(400, -500),
    goalPos: Vector(-250, 120),
    background: {
      positions: [
        Vector(-490, -940),
        Vector(-490 + 1100 * 3 - 20, -940),
        Vector(-490 + 1100 * 3 - 20, -940 + 1100),
        Vector(-490, -940 + 1100),
      ],
    },
    objects: [
      // ceiling wall
      { box: { pos: Vector(-500, -950), width: 1100 * 3, height: 200 } },
      // left wall
      { box: { pos: Vector(-500, -750), width: 200, height: 1100 } },
      { pickup: { pos: Vector(100, -300) } },
      { pickup: { pos: Vector(1100, -200) } },
      { pickup: { pos: Vector(1900, -300) } },
      { shuriken: { pos: Vector(100, 20) } },
      { shuriken: { pos: Vector(1100, -450) } },
      { shuriken: { pos: Vector(2100, 20) } },
      // floor
      { box: { pos: Vector(-500, 150), width: 1100 * 3, height: 200 } },
      // right wall
      { box: { pos: Vector(1500 + 1100, -750), width: 200, height: 1100 } },

      {
        ropeContactPoint: {
          pos: Vector(700, -500),
          radius: 40,
          isActive: false,
          canActivate: true,
        },
      },
      { ropeContactPoint: { pos: Vector(1800, -500), radius: 40 } },
    ],
  };
}
