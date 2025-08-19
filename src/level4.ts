import { Vector } from "kontra";
import { LevelObject } from "./types";

// Level 3 - Tower Climb
export default function getLevel(): LevelObject {
  return {
    playerPos: Vector(-800, 0), // Bottom left corner
    goalPos: Vector(1300, -650), // Top left corner
    background: { pos: Vector(-1180, -1980), width: 2760, height: 2560 },
    objects: [
      { box: { pos: Vector(900, -600), width: 550, height: 200 } }, // Goal platform
      { box: { pos: Vector(-1200, -2000), width: 2800, height: 200 } }, // Ceiling
      { box: { pos: Vector(-1200, -1800), width: 200, height: 2400 } }, // Left wall
      { box: { pos: Vector(1400, -2000), width: 200, height: 2600 } }, // Right wall
      { box: { pos: Vector(-1200, 400), width: 2800, height: 200 } }, // Floor

      // Rope connection points with more spacing
      { ropeContactPoint: { pos: Vector(-300, -150), radius: 40 } }, // Bottom level
      { ropeContactPoint: { pos: Vector(600, -150), radius: 40 } },

      { ropeContactPoint: { pos: Vector(100, -600), radius: 40 } }, // Lower middle level

      { ropeContactPoint: { pos: Vector(-300, -1050), radius: 40 } }, // Upper middle level
      { ropeContactPoint: { pos: Vector(600, -1050), radius: 40 } },

      { ropeContactPoint: { pos: Vector(100, -1500), radius: 40 } }, // Top level
      { ropeContactPoint: { pos: Vector(1000, -1500), radius: 40 } },
      { pickup: { pos: Vector(100, -200) } },
      { pickup: { pos: Vector(-500, -1500) } },
      { pickup: { pos: Vector(500, -900) } },
      // Instructions
      { text: { pos: Vector(-800, -160), text: "Swing up the tower!" } },
    ],
  };
}
