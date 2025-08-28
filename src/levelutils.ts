import { Vector } from "./Vector";

import { Camera } from "./Camera";
import { Goal } from "./Goal";
import { LevelObject } from "./types";
import { Player } from "./Player";
import { Box } from "./Box";
import { RopeContactPoint } from "./RopeContactPoint";
import { Pickup } from "./Pickup";
import { Shuriken } from "./Shuriken";
import { colorBlack } from "./colorUtils";
import { MyText } from "./MyText";

import levelFinal from "./levelFinal";
import level1 from "./level1";
import level2 from "./level2";
import level3 from "./level3";
import level4 from "./level4";
import level5 from "./level5";
import level6 from "./level6";
import level7 from "./level7";
import level8 from "./level8";
import level9 from "./level9";
import level10 from "./level10";
import level11 from "./level11";

// Keep an odd number of levels to make it work.
export const levels: Array<() => LevelObject> = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
  levelFinal,
];

export function numLevels() {
  return levels.length;
}

export function initLevel(camera: Camera, levelId = 1) {
  const gameObjects: any[] = [];

  let level = levels[levelId - 1]();

  const player = new Player(Vector(level.playerPos.x, level.playerPos.y));
  const goal = new Goal(Vector(level.goalPos.x, level.goalPos.y));
  camera.pos = Vector(player.pos.x, player.pos.y);

  level.objects.forEach((object: any) => {
    if (object.box) {
      gameObjects.push(
        new Box(
          object.box.pos,
          object.box.width,
          object.box.height,
          object.box.canBounce || false
        )
      );
    } else if (object.ropeContactPoint) {
      gameObjects.push(
        new RopeContactPoint(
          object.ropeContactPoint.pos,
          object.ropeContactPoint.isActive,
          object.ropeContactPoint.canActivate,
          object.ropeContactPoint.endPos
        )
      );
    } else if (object.pickup) {
      gameObjects.push(new Pickup(object.pickup.pos));
    } else if (object.shuriken) {
      gameObjects.push(new Shuriken(object.shuriken.pos));
    } else if (object.text) {
      const text = new MyText(
        Vector(object.text.pos.x, object.text.pos.y),
        object.text.text,
        colorBlack
      );
      gameObjects.push(text);
    }
  });
  return { player, goal, gameObjects, background: level.background };
}
