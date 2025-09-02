import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(3472, 2820),
    goalPos: Vector(232, 624),
    background: {
      positions: [
        Vector(100, 100),
        Vector(4244, 100),
        Vector(4128, 3160),
        Vector(100, 3084),
      ],
    },
    objects: [
      { shuriken: { pos: Vector(500, 1044) } },
      { shuriken: { pos: Vector(732, 1436) } },
      { shuriken: { pos: Vector(1668, 668) } },
      { shuriken: { pos: Vector(1348, 2040) } },
      { shuriken: { pos: Vector(2220, 1368) } },
      { shuriken: { pos: Vector(2468, 2660) } },
      { shuriken: { pos: Vector(3284, 1728) } },
      { ropeContactPoint: { pos: Vector(796, 448), endPos: Vector(796, 448) } },
      {
        ropeContactPoint: { pos: Vector(1260, 912), endPos: Vector(1260, 912) },
      },
      {
        ropeContactPoint: {
          pos: Vector(1912, 1196),
          endPos: Vector(1912, 1196),
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(2512, 1500),
          endPos: Vector(2512, 1500),
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(3476, 2180),
          endPos: Vector(3476, 2180),
        },
      },
      { pickup: { pos: Vector(1140, 1156) } },
      { pickup: { pos: Vector(1772, 1652) } },
      { pickup: { pos: Vector(3088, 2796) } },
      { box: { pos: Vector(0, 0), width: 200, height: 1300 } },
      { box: { pos: Vector(92, 700), width: 308, height: 548 } },
      { box: { pos: Vector(0, 1196), width: 580, height: 810 } },
      { box: { pos: Vector(0, 1600), width: 1200, height: 1424 } },
      { box: { pos: Vector(1192, 2188), width: 784, height: 898 } },
      { box: { pos: Vector(200, 0), width: 3892, height: 300 } },
      { box: { pos: Vector(1008, 286), width: 2836, height: 262 } },
      { box: { pos: Vector(1800, 508), width: 2020, height: 276 } },
      { box: { pos: Vector(2000, 764), width: 1880, height: 416 } },
      { box: { pos: Vector(2772, 1176), width: 1048, height: 376 } },
      { box: { pos: Vector(2160, 2812), width: 632, height: 200 } },
      { box: { pos: Vector(0, 3000), width: 3952, height: 200 } },
      { box: { pos: Vector(3420, 1526), width: 488, height: 258 } },
      { box: { pos: Vector(3532, 1734), width: 520, height: 254 } },
      { box: { pos: Vector(3816, 0), width: 788, height: 3200 } },
    ],
  };
}
