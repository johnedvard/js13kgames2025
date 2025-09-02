import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(316, 464),
    goalPos: Vector(3604, 2912),
    background: {
      positions: [
        Vector(100, 100),
        Vector(4244, 100),
        Vector(4128, 3160),
        Vector(100, 3084),
      ],
    },
    objects: [
      {
        box: { pos: Vector(92, 700), width: 308, height: 548, canBounce: true },
      },
      { shuriken: { pos: Vector(500, 1044) } },
      { shuriken: { pos: Vector(708, 1248) } },
      { shuriken: { pos: Vector(1104, 1492) } },
      { shuriken: { pos: Vector(1528, 1864) } },
      { shuriken: { pos: Vector(1896, 2076) } },
      { shuriken: { pos: Vector(2136, 2268) } },
      { shuriken: { pos: Vector(2344, 2464) } },
      { shuriken: { pos: Vector(2712, 2676) } },
      { shuriken: { pos: Vector(2968, 2892) } },
      {
        ropeContactPoint: {
          pos: Vector(732, 464),
          endPos: Vector(732, 464),
          canActivate: true,
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(1288, 700),
          endPos: Vector(1288, 700),
          canActivate: true,
          isActive: false,
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(1916, 1116),
          endPos: Vector(1916, 1116),
          canActivate: true,
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(2512, 1500),
          endPos: Vector(2512, 1500),
          canActivate: true,
          isActive: false,
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(2912, 1868),
          endPos: Vector(2912, 1868),
          canActivate: true,
          isActive: false,
        },
      },
      {
        ropeContactPoint: {
          pos: Vector(3476, 2180),
          endPos: Vector(3476, 2180),
          canActivate: true,
        },
      },
      { pickup: { pos: Vector(952, 968) } },
      { pickup: { pos: Vector(1772, 1652) } },
      { pickup: { pos: Vector(2516, 2308) } },
      { box: { pos: Vector(0, 0), width: 200, height: 1300 } },
      { box: { pos: Vector(0, 1200), width: 580, height: 300 } },
      { box: { pos: Vector(0, 1404), width: 800, height: 200 } },
      { box: { pos: Vector(0, 1600), width: 1200, height: 1424 } },
      { box: { pos: Vector(1200, 1816), width: 200, height: 200 } },
      { box: { pos: Vector(1188, 2000), width: 408, height: 258 } },
      { box: { pos: Vector(1192, 2188), width: 784, height: 898 } },
      { box: { pos: Vector(1928, 2408), width: 256, height: 600 } },
      { box: { pos: Vector(200, 0), width: 3892, height: 300 } },
      { box: { pos: Vector(1008, 286), width: 2836, height: 262 } },
      { box: { pos: Vector(1800, 508), width: 2020, height: 276 } },
      { box: { pos: Vector(2000, 768), width: 1880, height: 260 } },
      { box: { pos: Vector(2596, 1004), width: 1256, height: 196 } },
      { box: { pos: Vector(2776, 1176), width: 1048, height: 212 } },
      { box: { pos: Vector(2156, 2600), width: 260, height: 248 } },
      { box: { pos: Vector(2160, 2812), width: 632, height: 200 } },
      { box: { pos: Vector(0, 3000), width: 3952, height: 200 } },
      { box: { pos: Vector(2956, 1384), width: 1020, height: 200 } },
      { box: { pos: Vector(3420, 1526), width: 488, height: 258 } },
      { box: { pos: Vector(3532, 1734), width: 520, height: 254 } },
      { box: { pos: Vector(3816, 0), width: 788, height: 3200 } },
    ],
  };
}
