import { Vector } from "./Vector";

export default function getLevel() {
  return {
    playerPos: Vector(872, 1624),
    goalPos: Vector(3804, 1376),
    background: {
      positions: [
        Vector(392, 300),
        Vector(4484, 336),
        Vector(4512, 2896),
        Vector(436, 2900),
      ],
    },
    objects: [
      { box: { pos: Vector(1668, 884), width: 200, height: 200 } },
      { box: { pos: Vector(2544, 920), width: 200, height: 200 } },
      { box: { pos: Vector(1724, 1744), width: 200, height: 200 } },
      { box: { pos: Vector(2796, 1772), width: 200, height: 200 } },
      { shuriken: { pos: Vector(2308, 1408) } },
      { pickup: { pos: Vector(2260, 944) } },
      { pickup: { pos: Vector(2416, 2288) } },
      { pickup: { pos: Vector(1204, 1408) } },
      { ropeContactPoint: { pos: Vector(1204, 1004) } },
      { ropeContactPoint: { pos: Vector(3220, 1004) } },
      { ropeContactPoint: { pos: Vector(1812, 2212) } },
      { ropeContactPoint: { pos: Vector(3624, 2216) } },
      { box: { pos: Vector(3764, 1460), width: 200, height: 200 } },
      { box: { pos: Vector(300, 200), width: 4300, height: 200 } },
      { box: { pos: Vector(760, 1868), width: 200, height: 200 } },
      { ropeContactPoint: { pos: Vector(2308, 592) } },
      { box: { pos: Vector(300, 400), width: 200, height: 2600 } },
      { box: { pos: Vector(300, 2800), width: 4200, height: 200 } },
      { box: { pos: Vector(4400, 200), width: 200, height: 2800 } },
    ],
  };
}
