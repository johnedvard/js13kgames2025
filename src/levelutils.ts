import { Vector, Text } from "kontra";

import { Camera } from "./Camera";
import { Goal } from "./Goal";
import { LevelObject } from "./types";
import { Player } from "./Player";
import { Box } from "./Box";
import { RopeContactPoint } from "./RopeContactPoint";
import { Pickup } from "./Pickup";
import { Shuriken } from "./Shuriken";
import { colorBlack } from "./colorUtils";
import level1 from "./level1";
import level2 from "./level2";
import level3 from "./level3";
import level4 from "./level4";
import level5 from "./level5";
import level6 from "./level6";
import level7 from "./level7";

// Keep an odd number of levels to make it work.
const levels: Array<() => LevelObject> = [
  level7,
  level2,
  level3,
  level4,
  level5,
  level6,
];

export function numLevels() {
  return levels.length;
}

export function initLevel(
  canvas: HTMLCanvasElement,
  camera: Camera,
  levelId = 1,
  levelData: any
) {
  const gameObjects: any[] = [];

  let level = levels[levelId - 1]();
  if (levelData) {
    level = levelData;
  }
  const player = new Player(canvas, Vector(level.playerPos));
  const goal = new Goal(Vector(level.goalPos));
  camera.setPosition(player.pos);

  level.objects.forEach((object: any) => {
    if (object.box) {
      gameObjects.push(
        new Box(object.box.pos, object.box.width, object.box.height)
      );
    } else if (object.ropeContactPoint) {
      gameObjects.push(
        new RopeContactPoint(
          object.ropeContactPoint.pos,
          object.ropeContactPoint.radius
        )
      );
    } else if (object.pickup) {
      gameObjects.push(new Pickup(object.pickup.pos));
    } else if (object.shuriken) {
      gameObjects.push(new Shuriken(object.shuriken.pos));
    } else if (object.text) {
      const text = Text({
        color: colorBlack,
        x: object.text.pos.x,
        y: object.text.pos.y,
        text: object.text.text,
        font: "42px Impact",
        context: canvas.getContext("2d") as CanvasRenderingContext2D,
      });
      gameObjects.push(text);
    }
  });
  return { player, goal, gameObjects, background: level.background };
}
