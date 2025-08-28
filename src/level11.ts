import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(496, 1612),
    goalPos: Vector(1982, 636),
    background: {
      positions: [
        Vector(264, 272),
        Vector(2732, 260),
        Vector(2708, 2716),
        Vector(272, 2720),
      ],
    },
    objects: [
      { box: { pos: Vector(200, 200), width: 200, height: 2600 } },
      { shuriken: { pos: Vector(996, 1528) } },
      { shuriken: { pos: Vector(472, 476) } },
      { shuriken: { pos: Vector(2436, 880) } },
      { pickup: { pos: Vector(1620, 740) } },
      { pickup: { pos: Vector(964, 736) } },
      { pickup: { pos: Vector(608, 2404) } },
      { ropeContactPoint: { pos: Vector(1276, 536) } },
      {
        ropeContactPoint: {
          pos: Vector(1824, 1176),
          endPos: Vector(1824, 1176),
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(1812, 2004),
          endPos: Vector(1812, 1604),
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(796, 1896),
          endPos: Vector(1396, 1896),
        },
      },
      {
        ropeContactPoint: { pos: Vector(800, 1196), endPos: Vector(1299, 796) },
      },
      {
        ropeContactPoint: {
          pos: Vector(2171, 1732),
          endPos: Vector(2171, 1732),
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(1307.4375, 1348),
          endPos: Vector(1307.4375, 1348),
        },
      },
      { box: { pos: Vector(1831, 756), width: 420, height: 200 } },
      { box: { pos: Vector(400, 1800), width: 200, height: 200 } },
      { box: { pos: Vector(400, 2176), width: 1285, height: 120 } },
      { box: { pos: Vector(400, 2600), width: 2235, height: 200 } },
      { box: { pos: Vector(400, 200), width: 2400, height: 200 } },
      { box: { pos: Vector(2600, 200), width: 200, height: 2600 } },
    ],
  };
}
