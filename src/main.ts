import { init, GameLoop, Vector, on } from "kontra";
import { Camera } from "./Camera";
import { SceneTransition } from "./SceneTransition";
import { Player } from "./Player";
import { listenForResize } from "./domUtils";
import { initializeInputController } from "./inputController";
import { playDead, playGoal } from "./audio";
import { setItem } from "./storageUtils";
import { Goal } from "./Goal";
import { initLevel } from "./levelutils";
import { GameEvent } from "./GameEvent";
import { GameObjectType } from "./GameObjectType";
import { MyGameEntity } from "./MyGameEntity";
import { handleOtherCollisions, handlePlayerCollisions } from "./gameUtils";
import { RopeContactPoint } from "./RopeContactPoint";
import { Ball } from "./Ball";
import { colorAccent, colorBlack, colorWhite } from "./colorUtils";
import { MainMenu } from "./MainMenu";

const { canvas } = init("g");
const { canvas: transitionCanvas } = init("t");
const { canvas: backgroundCanvas } = init("b");
// These are just in-game values, not the actual canvas size
export const GAME_WIDTH = 2548;

// Initialize main menu with canvas
const mainMenu = new MainMenu(canvas);
enum SceneId {
  Level = "l",
  Menu = "s",
}

let activeScene: SceneId = SceneId.Level;
let nextScene: SceneId = SceneId.Level;
const sceneTransition = new SceneTransition(transitionCanvas);
let _player: Player;
let _goal: Goal;
let _objects: MyGameEntity[] = [];
let camera: Camera;
let currentLevelId = 1;
let gameHasStarted = false;
let isDisplayingLevelClearScreen = false;
let isDisplayingPlayerDiedScreen = false;
const levelPersistentObjects: any[] = [];
let fadeinComplete = false; // used to control the fadein out transtiion
let levelBackground: any = null; // Store the current level's background

const mainMenuObjects: any = [];
const selectLevelObjects: any = [];

let _closestRopeContactPoint: RopeContactPoint | null = null;

on(GameEvent.play, ({ levelId }: any) => {
  setTimeout(() => {
    currentLevelId = levelId;
    nextScene = SceneId.Level;
    sceneTransition.reset();
    transitionLoop.start();
  }, 500);
});

on(GameEvent.kill, () => {
  if (_player && _player.state === "a") {
    _player.setState("d");
    handlePlayerDead();
  }
});

on(GameEvent.goal, () => {
  handleLevelClear();
});

on(GameEvent.up, ({ x, y }: any) => {
  // Handle main menu clicks when in select scene
  if (activeScene === "s") {
    mainMenu.handleClick(x, y);
    mainMenu.handleDragEnd();
  }
});

on(GameEvent.down, ({ x, y }: any) => {
  // Handle main menu drag start when in select scene
  if (activeScene === "s") {
    if (mainMenu.isPointInMainMenu(x, y)) {
      mainMenu.handleDragStart(y);
    }
  }
});

on(GameEvent.drag, ({ detail }: any) => {
  // Handle main menu drag when in select scene
  if (activeScene === "s") {
    if (mainMenu.isDragging) {
      mainMenu.handleDragMove(detail.diffY + mainMenu.lastMouseY);
    }
  }
});

on(GameEvent.wheel, ({ deltaY, x, y }: any) => {
  // Handle main menu wheel scroll when in select scene
  if (activeScene === "s") {
    if (mainMenu.isPointInMainMenu(x, y)) {
      mainMenu.handleScroll(deltaY);
    }
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
    if (activeScene === SceneId.Menu) {
      mainMenu.update();
      //   camera?.follow(currentCanvasPos);
      selectLevelObjects.forEach((object: any) => object.update());
    } else {
      _objects.forEach((object) => object.update());
      levelPersistentObjects.forEach((object) => object.update());
      camera?.follow(_player, { offset: Vector(100, 100), lerp: true });
      // consider not adding levelpersitent objects to the collision detection
      handlePlayerCollisions(_player, [..._objects, ...levelPersistentObjects]);
      handleOtherCollisions([..._objects, ...levelPersistentObjects]);
      highlightClosestRopeContactPoint();
    }
  },
  render: function () {
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    camera.clear(context);
    camera.apply(context);

    if (activeScene === SceneId.Menu) {
      mainMenu.render(context);
    } else if (activeScene === SceneId.Select) {
      selectLevelObjects.forEach((object: any) => object.render(context));
      mainMenu.render(context);
    } else {
      renderBackgrounds(context);
      levelPersistentObjects.forEach((object) => object.render(context));
      _objects.forEach((object) => object.render(context));
    }
  },
});

function renderBackgrounds(context: CanvasRenderingContext2D) {
  // Render the level background if it exists
  if (
    levelBackground &&
    levelBackground.positions &&
    levelBackground.positions.length > 0
  ) {
    context.save();

    // Create a vertical gradient - we'll use the bounding box of the polygon
    const positions = levelBackground.positions;
    const minY = Math.min(...positions.map((p: any) => p.y));
    const maxY = Math.max(...positions.map((p: any) => p.y));
    const minX = Math.min(...positions.map((p: any) => p.x));

    const gradient = context.createLinearGradient(minX, minY, minX, maxY);
    gradient.addColorStop(0, "#D3D3D3"); // lightgray
    gradient.addColorStop(1, "#A9A9A9"); // darkgray

    context.fillStyle = gradient;

    // Draw the polygon using the positions array
    context.beginPath();
    context.moveTo(positions[0].x, positions[0].y);

    for (let i = 1; i < positions.length; i++) {
      context.lineTo(positions[i].x, positions[i].y);
    }

    context.closePath();
    context.fill();

    context.restore();
  }
}
function destroySelectLevelObjects() {
  selectLevelObjects.forEach((object: any) => {
    if (object?.destroy) object.destroy();
  });
}

const transitionLoop = GameLoop({
  blur: true, // Prevent pausing when window loses focus
  update: function () {
    sceneTransition?.update();
    if (!fadeinComplete && sceneTransition.isFadeInComplete()) {
      fadeinComplete = true;
      if (nextScene === SceneId.Menu) {
        activeScene = SceneId.Menu;
        mainMenuObjects.forEach((object: any) => {
          object && object.destroy && object.destroy();
        });
        mainMenuObjects.length = 0;
      } else if (nextScene === SceneId.Level) {
        startLevel(SceneId.Level);
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

async function startLevel(scene: SceneId = SceneId.Level, levelId = 1) {
  activeScene = scene;
  currentLevelId = levelId;
  if (!gameHasStarted) {
    listenForResize([backgroundCanvas, transitionCanvas, canvas], []);
    initializeInputController(canvas);
    camera = new Camera(canvas);
  }

  const { player, goal, gameObjects, background } = initLevel(
    camera,
    currentLevelId
  );
  // const seaWeed = new SeaWeed(Vector(player.centerPoint));
  // particles.push(seaWeed);
  _player?.destroy();
  _player = player;
  _goal = goal;
  _objects = gameObjects;
  levelBackground = background; // Store the background
  _objects.splice(0, 0, _player);
  _objects.splice(0, 0, _goal);

  // todo cleanup existing objects

  gameHasStarted = true;
  mainLoop.start(); // start the game
}

function handlePlayerDead() {
  isDisplayingPlayerDiedScreen = true;

  // Create 10 balls that burst out from the player's position
  if (_player) {
    const colors = [colorWhite, colorBlack, colorAccent]; // Available colors for balls
    playDead();
    for (let i = 0; i < 10; i++) {
      // Pick a random color
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const ball = new Ball(Vector(_player.pos.x, _player.pos.y), randomColor);

      // Create a burst effect with random directions and speeds
      const angle = (i / 10) * Math.PI * 2 + (Math.random() - 0.5) * 0.5; // Distribute around circle with some randomness
      const speed = 8 + Math.random() * 6; // Random speed between 8-14

      ball.velocity = Vector(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed - 3 // Subtract 3 to give upward bias
      );

      levelPersistentObjects.push(ball);
    }
  }

  setTimeout(() => {
    _objects.length = 0;
    isDisplayingPlayerDiedScreen = false;
    mainLoop.stop();
    startLevel(SceneId.Level); // Restart the level after a short delay
  }, 750);
}

function handleLevelClear() {
  if (isDisplayingLevelClearScreen || isDisplayingPlayerDiedScreen) return;
  if (!isDisplayingLevelClearScreen) {
    playGoal();

    isDisplayingLevelClearScreen = true;
    levelPersistentObjects.length = 0;
    setTimeout(() => {
      _objects.length = 0;
      isDisplayingLevelClearScreen = false;

      // assume we are playing regular level
      setItem(`complete-${currentLevelId}`, "true");
      currentLevelId++;

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

startLevel(SceneId.Level, 1);
