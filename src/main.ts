import { init, GameLoop, Vector, Text, on } from "kontra";
import { Camera } from "./Camera";
import { SceneTransition } from "./SceneTransition";
import { Player } from "./Player";
import { listenForResize } from "./domUtils";
import { initializeInputController } from "./inputController";
import { playGoal } from "./audio";
import { setItem } from "./storageUtils";
import { Goal } from "./Goal";
import { initLevel, numLevels } from "./levelutils";
import { GameEvent } from "./GameEvent";
import { GameObjectType } from "./GameObjectType";
import { MyGameEntity } from "./MyGameEntity";
import { handleCollision } from "./gameUtils";
import { RopeContactPoint } from "./RopeContactPoint";

const { canvas } = init("g");
const { canvas: transitionCanvas } = init("t");
const { canvas: backgroundCanvas } = init("b");
// These are just in-game values, not the actual canvas size
export const GAME_WIDTH = 2548;

type SceneId = "m" | "l" | "s" | "b"; // menu, level, select, bonus
let activeScene: SceneId = "l";
let nextScene: SceneId = "l";
const sceneTransition = new SceneTransition(transitionCanvas);
let _player: Player;
let _goal: Goal;
let _objects: (MyGameEntity | Text)[] = [];
let camera: Camera;
let currentLevelId = 1;
let currentLevelData: any = null;
let gameHasStarted = false;
let isDisplayingLevelClearScreen = false;
let isDisplayingPlayerDiedScreen = false;
const levelPersistentObjects: any[] = [];
let fadeinComplete = false; // used to control the fadein out transtiion
let levelBackground: any = null; // Store the current level's background

let bonusLevels: any[] = [];
const mainMenuObjects: any = [];
const selectLevelObjects: any = [];
const selectBonusLevelObjects: any = [];
let _closestRopeContactPoint: RopeContactPoint | null = null;

on(GameEvent.play, ({ levelId, levelData }: any) => {
  setTimeout(() => {
    currentLevelId = levelId;
    currentLevelData = levelData;
    nextScene = "l";
    sceneTransition.reset();
    transitionLoop.start();
  }, 500);
});

on(GameEvent.kill, () => {
  if (_player && _player.state === "a") {
    _player.state = "d"; // Set player state to dead
  }
});

function highlightClosestRopeContactPoint() {
  if (!_player) return;

  const closestRopeContactPoint = findClosestRopeContactPoint(_player.pos);
  if (!closestRopeContactPoint) return;
  if (_closestRopeContactPoint !== closestRopeContactPoint) {
    _closestRopeContactPoint?.setHighlight(false);
    closestRopeContactPoint.setHighlight(true);
    _closestRopeContactPoint = closestRopeContactPoint;
  }
}

const mainLoop = GameLoop({
  blur: true, // Prevent pausing when window loses focus
  update: function () {
    if (activeScene === "m") {
      //   camera?.follow(Vector(0, 0));
      mainMenuObjects.forEach((object: any) => object.update());
    } else if (activeScene === "s") {
      //   camera?.follow(currentCanvasPos);
      selectLevelObjects.forEach((object: any) => object.update());
    } else if (activeScene === "b") {
      //   camera?.follow(currentCanvasPos);
      selectBonusLevelObjects.forEach((object: any) => object.update());
    } else {
      _objects.forEach((object) => object.update());
      levelPersistentObjects.forEach((object) => object.update());
      camera?.follow(_player, { offset: Vector(100, 100), lerp: true });
      // consider not adding levelpersitent objects to the collision detection
      handleCollision(_player, [..._objects, ...levelPersistentObjects]);
      handleLevelClear();
      highlightClosestRopeContactPoint();
    }
  },
  render: function () {
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    camera.clear(context);
    camera.apply(context);

    if (activeScene === "m") {
      mainMenuObjects.forEach((object: any) => object.render(context));
    } else if (activeScene === "s") {
      selectLevelObjects.forEach((object: any) => object.render(context));
    } else if (activeScene === "b") {
      selectBonusLevelObjects.forEach((object: any) => object.render(context));
    } else {
      renderBackgrounds(context);
      _objects.forEach((object) => object.render(context));
      levelPersistentObjects.forEach((object) => object.render(context));
    }
  },
});

function renderBackgrounds(context: CanvasRenderingContext2D) {
  // Render the level background if it exists
  if (levelBackground) {
    context.save();

    // Create a vertical gradient from sky blue to light brown
    const gradient = context.createLinearGradient(
      levelBackground.pos.x,
      levelBackground.pos.y,
      levelBackground.pos.x,
      levelBackground.pos.y + levelBackground.height
    );
    gradient.addColorStop(0, "#D3D3D3"); // lightgray
    gradient.addColorStop(1, "#A9A9A9"); // darkgray
    // gradient.addColorStop(0, "#39707a"); // lightgray
    // gradient.addColorStop(1, "#23495d"); // darkgray

    context.fillStyle = gradient;
    context.fillRect(
      levelBackground.pos.x,
      levelBackground.pos.y,
      levelBackground.width,
      levelBackground.height
    );

    context.restore();
  }
}
function destroySelectLevelObjects() {
  selectLevelObjects.forEach((object: any) => {
    if (object?.destroy) object.destroy();
  });
  selectBonusLevelObjects.forEach((object: any) => {
    if (object?.destroy) object.destroy();
  });
}

const transitionLoop = GameLoop({
  blur: true, // Prevent pausing when window loses focus
  update: function () {
    sceneTransition?.update();
    if (!fadeinComplete && sceneTransition.isFadeInComplete()) {
      fadeinComplete = true;
      if (nextScene === "s") {
        activeScene = "s";
        mainMenuObjects.forEach((object: any) => {
          object && object.destroy && object.destroy();
        });
        mainMenuObjects.length = 0;
      } else if (nextScene === "b") {
        activeScene = "b";
        mainMenuObjects.forEach((object: any) => {
          object && object.destroy && object.destroy();
        });
        mainMenuObjects.length = 0;
      } else if (nextScene === "l") {
        startLevel("l");
        destroySelectLevelObjects();
      }
    } else if (sceneTransition.isFadeOutComplete()) {
      fadeinComplete = false;
      sceneTransition?.reset();
      transitionLoop.stop();
    }
  },
  render: function () {
    const context = transitionCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    sceneTransition?.render(context);
  },
});

async function startLevel(scene: SceneId = "l") {
  activeScene = scene;
  if (!gameHasStarted) {
    listenForResize([backgroundCanvas, transitionCanvas, canvas], []);
    initializeInputController(canvas);
    camera = new Camera(canvas);
  }

  const { player, goal, gameObjects, background } = initLevel(
    canvas,
    camera,
    currentLevelId,
    currentLevelData
  );
  // const seaWeed = new SeaWeed(Vector(player.centerPoint));
  // particles.push(seaWeed);
  _player?.destroy();
  _player = player;
  _goal = goal;
  _objects = gameObjects;
  levelBackground = background; // Store the background
  _objects.splice(0, 0, _player);
  _objects.splice(0, 0, goal);

  // todo cleanup existing objects

  gameHasStarted = true;
  mainLoop.start(); // start the game
}

function handleLevelClear() {
  if (isDisplayingLevelClearScreen || isDisplayingPlayerDiedScreen) return;
  if (_player.state === "d") {
    isDisplayingPlayerDiedScreen = true;

    setTimeout(() => {
      _objects.length = 0;
      isDisplayingPlayerDiedScreen = false;
      mainLoop.stop();
      startLevel("l");
    }, 150);
  }
  if (_goal.checkIfGoalReached(_player) && !isDisplayingLevelClearScreen) {
    playGoal();

    isDisplayingLevelClearScreen = true;
    levelPersistentObjects.length = 0;
    setTimeout(() => {
      _objects.length = 0;
      isDisplayingLevelClearScreen = false;
      if (currentLevelData) {
        // assume that we are playing bonus level,
        setItem(`complete-bonus-${currentLevelId}`, "true");
        currentLevelData = bonusLevels.find(
          (l) => l.levelId === currentLevelId + 1
        );
        currentLevelId++;
        if (!currentLevelData) {
          // display the thanks for playing screen when we don't have more bonus levels
          currentLevelId = numLevels();
        }
      } else {
        // assume we are playing regular level
        setItem(`complete-${currentLevelId}`, "true");
        currentLevelId++;
      }
      mainLoop.stop();
      sceneTransition.reset();
      transitionLoop.start();
    }, 20);
  }
}
export function findClosestRopeContactPoint(
  pos: Vector
): RopeContactPoint | null {
  let closestObject = null;
  let closestDistance = Infinity;

  _objects.forEach((object) => {
    if (object.type !== GameObjectType.RopeContactPoint) return;
    const distance = object.pos.distance(pos);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestObject = object;
    }
  });

  return closestObject;
}

startLevel("l");
