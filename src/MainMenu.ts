import { Vector } from "kontra";
import { GameObjectType } from "./GameObjectType";
import { MyGameEntity } from "./MyGameEntity";
import { numLevels } from "./levelutils";
import { colorWhite, colorAccent, colorBlack } from "./colorUtils";

type MainMenuState = "h" | "v"; //hidden visible

export class MainMenu implements MyGameEntity {
  type = GameObjectType.MainMenu;
  pos = Vector(0, 0);
  width = 1000;
  height = 800;
  radius = 0;
  state: MainMenuState = "v";
  canvas: HTMLCanvasElement | null = null;

  // Scrolling properties
  scrollOffset = 0; // Current scroll position
  maxVisibleButtons = 5; // Max buttons visible at once
  buttonHeight = 120;
  buttonSpacing = 60;
  totalLevels = 0;

  // Scroll area properties
  scrollAreaTop = 150;
  scrollAreaHeight = 0; // Will be calculated

  // Drag/scroll state
  isDragging = false;
  lastMouseY = 0;

  // Offscreen canvas for scrollable content
  private offscreenCanvas: HTMLCanvasElement | null = null;
  private offscreenCtx: CanvasRenderingContext2D | null = null;

  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas || null;
    this.totalLevels = numLevels();
    this.updatePosition();
    this.createOffscreenCanvas();
  }

  updatePosition() {
    if (this.canvas) {
      // Position the main menu at the top of the canvas
      this.pos = Vector(
        (this.canvas.width - this.canvas?.width! * 0.8) / 2, // Centered horizontally
        0 // At the top of the canvas
      );

      // Calculate scroll area height (visible area for buttons)
      this.scrollAreaHeight =
        this.maxVisibleButtons * this.buttonHeight +
        (this.maxVisibleButtons - 1) * this.buttonSpacing;
    }
  }

  createOffscreenCanvas() {
    if (typeof document !== "undefined") {
      // Calculate total content height
      const totalContentHeight =
        this.totalLevels * this.buttonHeight +
        (this.totalLevels - 1) * this.buttonSpacing;

      // Create offscreen canvas large enough to hold all buttons
      this.offscreenCanvas = document.createElement("canvas");
      this.offscreenCanvas.width = 400; // List width
      this.offscreenCanvas.height = totalContentHeight;
      this.offscreenCtx = this.offscreenCanvas.getContext("2d");

      // Render all buttons to the offscreen canvas
      this.renderAllButtonsToOffscreen();
    }
  }

  renderAllButtonsToOffscreen() {
    if (!this.offscreenCtx || !this.offscreenCanvas) return;

    const ctx = this.offscreenCtx;
    const listWidth = this.offscreenCanvas.width;
    const shadowOffset = 12;

    // Clear the offscreen canvas
    ctx.clearRect(
      0,
      0,
      this.offscreenCanvas.width,
      this.offscreenCanvas.height
    );

    // Draw all level buttons
    for (let i = 0; i < this.totalLevels; i++) {
      const levelId = i + 1;
      const rectY = i * (this.buttonHeight + this.buttonSpacing);
      const rectX = 0;

      // Draw shadow first
      ctx.fillStyle = colorBlack;
      ctx.fillRect(
        rectX + shadowOffset,
        rectY + shadowOffset,
        listWidth,
        this.buttonHeight
      );

      // Draw level rectangle with white background
      ctx.fillStyle = colorWhite;
      ctx.fillRect(rectX, rectY, listWidth, this.buttonHeight);

      // Draw level border
      ctx.strokeStyle = colorBlack;
      ctx.lineWidth = 2;
      ctx.strokeRect(rectX, rectY, listWidth, this.buttonHeight);

      // Draw level text in red with larger font
      ctx.fillStyle = colorAccent;
      ctx.font = `${Math.min(this.buttonHeight * 0.6, 48)}px Impact`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const levelText = levelId.toString().padStart(3, "0");
      ctx.fillText(levelText, rectX + 20, rectY + this.buttonHeight / 2);
    }
  }

  getVisibleLevels() {
    // Calculate which levels are currently visible based on scroll position
    const totalContentHeight =
      this.totalLevels * this.buttonHeight +
      (this.totalLevels - 1) * this.buttonSpacing;
    const maxScrollOffset = Math.max(
      0,
      totalContentHeight - this.scrollAreaHeight
    );

    // Clamp scroll offset
    this.scrollOffset = Math.max(
      0,
      Math.min(this.scrollOffset, maxScrollOffset)
    );

    // Calculate which buttons are visible
    const buttonHeightWithSpacing = this.buttonHeight + this.buttonSpacing;
    const firstVisibleIndex = Math.floor(
      this.scrollOffset / buttonHeightWithSpacing
    );
    const lastVisibleIndex = Math.min(
      this.totalLevels - 1,
      Math.ceil(
        (this.scrollOffset + this.scrollAreaHeight) / buttonHeightWithSpacing
      )
    );

    const visibleLevels = [];
    for (let i = firstVisibleIndex; i <= lastVisibleIndex; i++) {
      if (i >= 0 && i < this.totalLevels) {
        visibleLevels.push({
          levelId: i + 1, // Level IDs are 1-based
          index: i,
          yOffset: i * buttonHeightWithSpacing - this.scrollOffset,
        });
      }
    }

    return visibleLevels;
  }

  getMaxScrollOffset() {
    const totalContentHeight =
      this.totalLevels * this.buttonHeight +
      (this.totalLevels - 1) * this.buttonSpacing;
    return Math.max(0, totalContentHeight - this.scrollAreaHeight);
  }

  // Scroll handling methods
  handleScroll(deltaY: number) {
    this.scrollOffset += deltaY;
    // Clamp scroll offset to valid range
    const maxScrollOffset = this.getMaxScrollOffset();
    this.scrollOffset = Math.max(
      0,
      Math.min(this.scrollOffset, maxScrollOffset)
    );
  }

  handleDragStart(mouseY: number) {
    this.isDragging = true;
    this.lastMouseY = mouseY;
  }

  handleDragMove(mouseY: number) {
    if (this.isDragging) {
      const deltaY = this.lastMouseY - mouseY; // Inverted for natural scroll direction
      this.handleScroll(deltaY);
      this.lastMouseY = mouseY;
    }
  }

  handleDragEnd() {
    this.isDragging = false;
  }

  isPointInScrollArea(x: number, y: number) {
    if (!this.canvas) return false;

    const centerX = this.canvas.width / 2;
    const listWidth = 400;
    const scrollAreaLeft = centerX - listWidth / 2;
    const scrollAreaRight = scrollAreaLeft + listWidth;
    const scrollAreaBottom = this.scrollAreaTop + this.scrollAreaHeight;

    return (
      x >= scrollAreaLeft &&
      x <= scrollAreaRight &&
      y >= this.scrollAreaTop &&
      y <= scrollAreaBottom
    );
  }

  isPointInMainMenu(x: number, y: number) {
    if (!this.canvas) return false;

    // Check if point is within the main menu background area
    const menuWidth = this.canvas.width * 0.8;
    const menuLeft = this.pos.x;
    const menuRight = menuLeft + menuWidth;
    const menuTop = this.pos.y;
    const menuBottom = menuTop + this.canvas.height;

    return x >= menuLeft && x <= menuRight && y >= menuTop && y <= menuBottom;
  }

  isPointInLevelButton(x: number, y: number) {
    if (!this.canvas) return null;

    const centerX = this.canvas.width / 2;
    const listWidth = 400;
    const scrollAreaLeft = centerX - listWidth / 2;
    const scrollAreaRight = scrollAreaLeft + listWidth;

    // Check if point is within the scroll area bounds
    if (
      x < scrollAreaLeft ||
      x > scrollAreaRight ||
      y < this.scrollAreaTop ||
      y > this.scrollAreaTop + this.scrollAreaHeight
    ) {
      return null;
    }

    // Convert screen coordinates to offscreen canvas coordinates
    const relativeY = y - this.scrollAreaTop + this.scrollOffset;
    const buttonHeightWithSpacing = this.buttonHeight + this.buttonSpacing;

    // Calculate which button was clicked
    const buttonIndex = Math.floor(relativeY / buttonHeightWithSpacing);
    const buttonTopY = buttonIndex * buttonHeightWithSpacing;
    const buttonBottomY = buttonTopY + this.buttonHeight;

    // Check if the click is within the button (not in spacing)
    if (
      buttonIndex >= 0 &&
      buttonIndex < this.totalLevels &&
      relativeY >= buttonTopY &&
      relativeY <= buttonBottomY
    ) {
      return buttonIndex + 1; // Level IDs are 1-based
    }

    return null;
  }

  handleClick(x: number, y: number) {
    // Check if click is on a level button
    const clickedLevel = this.isPointInLevelButton(x, y);

    if (clickedLevel !== null) {
      console.log(`Level ${clickedLevel} clicked!`);
      // TODO: Emit level selection event or handle level selection
      return true;
    }

    return false;
  }

  update() {}

  render(ctx: CanvasRenderingContext2D) {
    // Update position in case canvas size changed
    this.updatePosition();

    // Save current transform to render in screen coordinates
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to identity matrix

    // Draw main menu background
    ctx.fillStyle = "#333";
    ctx.fillRect(
      this.pos.x,
      this.pos.y,
      this.canvas?.width! * 0.8,
      this.canvas?.height!
    );

    // Draw level selection area
    this.drawLevelList(ctx);

    // Restore the previous transform
    ctx.restore();
  }

  drawLevelList(ctx: CanvasRenderingContext2D) {
    if (!this.canvas || !this.offscreenCanvas) return;

    const centerX = this.canvas.width / 2;
    const listWidth = 400;
    const scrollAreaLeft = centerX - listWidth / 2;

    // Set up clipping region for the scroll area
    ctx.save();
    ctx.beginPath();
    ctx.rect(
      scrollAreaLeft,
      this.scrollAreaTop,
      listWidth,
      this.scrollAreaHeight
    );
    ctx.clip();

    // Draw the portion of the offscreen canvas that should be visible
    ctx.drawImage(
      this.offscreenCanvas,
      0, // Source x
      this.scrollOffset, // Source y (scroll offset)
      listWidth, // Source width
      this.scrollAreaHeight, // Source height
      scrollAreaLeft, // Destination x
      this.scrollAreaTop, // Destination y
      listWidth, // Destination width
      this.scrollAreaHeight // Destination height
    );

    ctx.restore();
  }
}
