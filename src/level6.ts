import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(760, 604),
    goalPos: Vector(1922, 2524),
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
      { shuriken: { pos: Vector(1236, 2156) } },
      { shuriken: { pos: Vector(1000, 1100) } },
      { shuriken: { pos: Vector(1428, 1600) } },
      { pickup: { pos: Vector(1792, 804) } },
      { pickup: { pos: Vector(608, 1788) } },
      { pickup: { pos: Vector(608, 2404) } },
      { box: { pos: Vector(388, 1024), width: 528, height: 120 } },
      { box: { pos: Vector(392, 2100), width: 724, height: 120 } },
      { ropeContactPoint: { pos: Vector(1336, 608) } },
      { ropeContactPoint: { pos: Vector(1872, 1316) } },
      { ropeContactPoint: { pos: Vector(1812, 2004) } },
      { ropeContactPoint: { pos: Vector(924, 1624) } },
      { box: { pos: Vector(200, 2600), width: 2100, height: 200 } },
      { box: { pos: Vector(400, 200), width: 2000, height: 200 } },
      { box: { pos: Vector(2200, 200), width: 200, height: 2600 } },
    ],
  };
}
