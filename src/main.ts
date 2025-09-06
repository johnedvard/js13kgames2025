import { init, GameLoop, on } from "kontra";
import { Camera } from "./Camera";
import { SceneTransition } from "./SceneTransition";
import { Player } from "./Player";
import { listenForResize } from "./domUtils";
import { initializeInputController } from "./inputController";
import { setItem, getItem } from "./storageUtils";
import { Goal } from "./Goal";
import { initLevel } from "./levelutils";
import { GameEvent } from "./GameEvent";
import { GameObjectType } from "./GameObjectType";
import { MyGameEntity } from "./MyGameEntity";
import { handleOtherCollisions, handlePlayerCollisions } from "./gameUtils";
import { RopeContactPoint } from "./RopeContactPoint";
import { Ball } from "./Ball";
import {
  colorAccent,
  colorBlack,
  colorBuilding,
  colorLightGray,
  colorWhite,
} from "./colorUtils";
import { MainMenu } from "./MainMenu";
import { playDead, playGoal } from "./audio";
import { MyVector, Vector } from "./Vector";

const { canvas } = init("g");
const { canvas: transitionCanvas } = init("t");
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
const transitionContext = transitionCanvas.getContext(
  "2d"
) as CanvasRenderingContext2D;

// Initialize main menu with canvas
const mainMenu = new MainMenu(canvas);
const enum SceneId {
  Level = "l",
  Menu = "s",
}

let activeScene: SceneId = SceneId.Menu;
let nextScene: SceneId = SceneId.Menu;
const sceneTransition = new SceneTransition(transitionCanvas);
let _player: Player;
let _goal: Goal;
let _objects: MyGameEntity[] = [];
let camera: Camera;
let currentLevelId = 1;
let gameHasStarted = false;
let isLoadingNextLevel = false;
const levelPersistentObjects: any[] = [];
let fadeinComplete = false; // used to control the fadein out transtiion
let levelBackground: any = null; // Store the current level's background
let skyLine: SkyLine | null = null; // City skyline renderer

class SkyLine {
  private positions: any[] = [];
  private buildings: any[] = [];

  constructor(positions: any[]) {
    this.positions = positions;
    this.generateBuildings();
  }

  private generateBuildings() {
    if (!this.positions || this.positions.length === 0) return;

    // Calculate bounds of the background polygon
    const minX = Math.min(...this.positions.map((p: any) => p.x));
    const maxX = Math.max(...this.positions.map((p: any) => p.x));
    const minY = Math.min(...this.positions.map((p: any) => p.y));
    const maxY = Math.max(...this.positions.map((p: any) => p.y));

    const groundLevel = maxY + 50; // Move buildings 100px down (was maxY - 50)
    const maxBuildingHeight = (maxY - minY) * 0.5; // Max height is half the background height

    this.buildings = [];

    let currentX = minX;
    // Generate buildings across the width with varying widths
    while (currentX < maxX) {
      // Varying building widths with increased max width
      const buildingWidth = 100 + Math.random() * 250; // Random width between 100-350px (increased from 120-280px)
      const buildingSpacing = -20 + Math.random() * 55; // Random spacing between -20px to 15px

      // Building height is limited to half the background height maximum
      const heightPercent = 0.3 + Math.random() * 0.7; // 30% to 100% of max allowed height
      const buildingHeight = maxBuildingHeight * heightPercent;
      const buildingTop = groundLevel - buildingHeight;

      // Generate fewer, larger windows for this building
      const windows = [];
      const windowSize = 12; // Larger windows
      const windowSpacing = 30; // More space between windows

      for (
        let wy = buildingTop + 20;
        wy < groundLevel - 20;
        wy += windowSpacing
      ) {
        for (
          let wx = currentX + 20;
          wx < currentX + buildingWidth - 20;
          wx += windowSpacing
        ) {
          if (Math.random() > 0.4) {
            // 60% chance of window being lit (slightly fewer)
            windows.push({ x: wx, y: wy, size: windowSize });
          }
        }
      }

      this.buildings.push({
        x: currentX,
        top: buildingTop,
        width: buildingWidth,
        height: buildingHeight,
        windows,
      });

      currentX += buildingWidth + buildingSpacing;
    }
  }

  render(
    context: CanvasRenderingContext2D,
    playerPos?: { x: number; y: number }
  ) {
    if (
      !this.positions ||
      this.positions.length === 0 ||
      this.buildings.length === 0
    )
      return;

    // Calculate parallax offset based on player position
    let parallaxOffset = 0;
    if (playerPos) {
      // Subtle parallax effect: move buildings 1/8th the distance of player movement
      // Use a reference point (like level center) to calculate relative movement
      const levelCenterX =
        (Math.min(...this.positions.map((p: any) => p.x)) +
          Math.max(...this.positions.map((p: any) => p.x))) /
        2;
      parallaxOffset = (playerPos.x - levelCenterX) * -0.025; // 2.5% of player movement
    }

    // Set up clipping path using the same coordinates as the background
    context.save();
    context.beginPath();
    context.moveTo(this.positions[0].x, this.positions[0].y);
    for (let i = 1; i < this.positions.length; i++) {
      context.lineTo(this.positions[i].x, this.positions[i].y);
    }
    context.closePath();
    context.clip();

    // Draw cached buildings with parallax offset
    this.renderCachedBuildings(context, parallaxOffset);

    context.restore();
  }

  private renderCachedBuildings(
    context: CanvasRenderingContext2D,
    parallaxOffset: number = 0
  ) {
    context.fillStyle = colorBuilding;

    // Draw each cached building
    for (const building of this.buildings) {
      // Draw building rectangle with parallax offset
      context.fillRect(
        building.x + parallaxOffset,
        building.top,
        building.width,
        building.height
      );

      // Draw windows using their stored size with parallax offset
      context.fillStyle = colorLightGray;
      for (const window of building.windows) {
        context.fillRect(
          window.x + parallaxOffset,
          window.y,
          window.size,
          window.size
        );
      }

      context.fillStyle = colorBuilding;
    }
  }
}

const mainMenuObjects: any = [];
const selectLevelObjects: any = [];

let _closestRopeContactPoint: RopeContactPoint | null = null;

on(GameEvent.play, ({ levelId }: any) => {
  currentLevelId = levelId;
  nextScene = SceneId.Level;
  sceneTransition.reset();
  transitionLoop.start();
});

on(GameEvent.kill, () => {
  if (_player && _player.state == "a") {
    _player.setState("d");
    handlePlayerDead();
  }
});

on(GameEvent.goal, () => {
  if (isLoadingNextLevel) return;
  isLoadingNextLevel = true;

  nextScene = SceneId.Level;
  sceneTransition.reset();
  transitionLoop.start();
  handleLevelClear();
});

on(GameEvent.up, ({ x, y }: any) => {
  // Handle main menu clicks when in select scene
  if (activeScene == SceneId.Menu) {
    mainMenu.handleClick(x, y);
    mainMenu.handleDragEnd();
    mainMenu.handleMouseUp(); // Handle button press state
  }
});

on(GameEvent.down, ({ x, y }: any) => {
  // Handle main menu drag start when in select scene
  if (activeScene == SceneId.Menu) {
    mainMenu.handleMouseDown(x, y); // Handle button press state
    if (mainMenu.isPointInMainMenu(x, y)) {
      mainMenu.handleDragStart(y);
    }
  }
});

on(GameEvent.drag, ({ detail }: any) => {
  // Handle main menu drag when in select scene
  if (activeScene == SceneId.Menu) {
    if (mainMenu.isDragging) {
      mainMenu.handleDragMove(detail.diffY + mainMenu.lastMouseY);
    }
  }
});

on(GameEvent.wheel, ({ deltaY, x, y }: any) => {
  // Handle main menu wheel scroll when in select scene
  if (activeScene == SceneId.Menu) {
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
    if (activeScene == SceneId.Menu) {
      mainMenu.update();
      selectLevelObjects.forEach((object: any) => object.update());
    } else {
      _objects.forEach((object) => object.update());
      levelPersistentObjects.forEach((object) => object.update());
      camera?.follow(_player);
      // consider not adding levelPersistentObjects to the collision detection
      handlePlayerCollisions(_player, [..._objects, ...levelPersistentObjects]);
      handleOtherCollisions([..._objects, ...levelPersistentObjects]);
      highlightClosestRopeContactPoint();
    }
  },
  render: function () {
    camera.clear(context);
    camera.apply(context);

    if (activeScene == SceneId.Menu) {
      mainMenu.render(context);
      selectLevelObjects.forEach((object: any) => object.render(context));
    } else {
      renderBackgrounds(context);
      levelPersistentObjects.forEach((object) => object.render(context));
      _objects.forEach((object) => object.render(context));
    }
  },
});

function renderBackgrounds(context: CanvasRenderingContext2D) {
  // First render the original background polygon
  if (levelBackground && levelBackground.positions) {
    context.save();
    const positions = levelBackground.positions;
    context.fillStyle = colorLightGray;
    context.beginPath();
    context.moveTo(positions[0].x, positions[0].y);
    for (let i = 1; i < positions.length; i++) {
      context.lineTo(positions[i].x, positions[i].y);
    }
    context.closePath();
    context.fill();
    context.restore();
  }

  // Then render the skyline on top with player position for parallax
  if (skyLine && _player) {
    skyLine.render(context, { x: _player.pos.x, y: _player.pos.y });
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
      if (nextScene == SceneId.Menu) {
        activeScene = SceneId.Menu;
        // Refresh the main menu buttons to show updated completion data
        mainMenu.refreshButtons();
        mainMenuObjects.forEach((object: any) => {
          object && object.destroy && object.destroy();
        });
        mainMenuObjects.length = 0;
      } else if (nextScene == SceneId.Level) {
        activeScene = SceneId.Level;
        startLevel(SceneId.Level, currentLevelId);
        destroySelectLevelObjects();
      }
    } else if (sceneTransition.isFadeOutComplete()) {
      fadeinComplete = false;
      isLoadingNextLevel = false;
      sceneTransition?.reset();
      transitionLoop.stop();
    }
  },
  render: function () {
    sceneTransition?.render(transitionContext);
  },
});

async function startLevel(scene: SceneId = SceneId.Level, levelId: number) {
  activeScene = scene;
  currentLevelId = levelId;
  if (!gameHasStarted) {
    listenForResize([transitionCanvas, canvas], []);
    initializeInputController(canvas);
    camera = new Camera(canvas);
  }

  const { player, goal, gameObjects, background } = initLevel(
    camera,
    currentLevelId
  );

  _objects.length = 0;
  _player?.destroy();
  _player = player;
  _goal = goal;
  _objects = gameObjects;
  levelBackground = background; // Store the background

  // Create skyline with background positions
  if (background && background.positions) {
    skyLine = new SkyLine(background.positions);
  }

  _objects.splice(0, 0, _player);
  _objects.splice(0, 0, _goal);

  gameHasStarted = true;

  mainLoop.start(); // start the game
}

function handlePlayerDead() {
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
    mainLoop.stop();
    startLevel(SceneId.Level, currentLevelId); // Restart the level after a short delay
  }, 750);
}

function handleLevelClear() {
  playGoal();

  levelPersistentObjects.length = 0;

  // assume we are playing regular level
  const pickups = _objects.filter(
    (object: any) => object.type == GameObjectType.Pickup
  );
  let numCollected = 0;
  pickups.forEach((pickup: any) => {
    if (pickup.collected) {
      numCollected++;
    }
  });

  // Only save if this is a better score than previously achieved
  const existingScore = getItem<string>(`c-${currentLevelId}`);
  const previousBest = existingScore ? parseInt(existingScore, 10) : 0;

  if (numCollected > previousBest) {
    setItem(`c-${currentLevelId}`, `${numCollected}`);
  }

  currentLevelId++;

  sceneTransition.reset();
  transitionLoop.start();
}
export function findClosestRopeContactPoint(
  pos: MyVector
): RopeContactPoint | null {
  let closestObject = null;
  let closestDistance = Infinity;

  _objects.forEach((object) => {
    if (object.type !== GameObjectType.RopeContactPoint) return;
    if (!(object as RopeContactPoint).isActive) return;
    const distance = object.pos.distance(pos);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestObject = object;
    }
  });

  return closestObject;
}

function startMenu() {
  activeScene = SceneId.Menu;
  listenForResize([transitionCanvas, canvas], []);
  initializeInputController(canvas);
  camera = new Camera(canvas);
  mainLoop.start();
  gameHasStarted = true;
}
startMenu();
// if (import.meta.env.MODE !== "poki") {
// } else {
//   // Start the game directly without the menu
//   startLevel(SceneId.Level, currentLevelId);
// }
