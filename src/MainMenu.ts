import { emit } from "kontra";
import { GameObjectType } from "./GameObjectType";
import { MyGameEntity } from "./MyGameEntity";
import { numLevels } from "./levelutils";
import {
  colorWhite,
  colorAccent,
  colorBlack,
  colorGray,
  colorDarkGray,
  colorWall,
  fontFamily,
} from "./colorUtils";
import { getItem } from "./storageUtils";
import { Pickup } from "./Pickup";
import { GameEvent } from "./GameEvent";
import { playButtonDisable, playGoal } from "./audio";
import { Vector } from "./Vector";

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
  targetScrollOffset = 0; // Target scroll position for smooth scrolling
  scrollSpeed = 0.15; // Lerp factor for smooth scrolling (0.1 = slower, 0.3 = faster)
  maxVisibleButtons = 5; // Max buttons visible at once
  buttonHeight = 120;
  buttonSpacing = 60;
  totalLevels = 0;

  // Scroll area properties
  scrollAreaTop = 380; // Moved further down (was 320)
  scrollAreaHeight = 0; // Will be calculated

  // Scroll button properties
  scrollButtonHeight = 40;
  scrollButtonWidth = 100;

  // Drag/scroll state
  isDragging = false;
  lastMouseY = 0;

  // Offscreen canvas for scrollable content
  private offscreenCanvas: HTMLCanvasElement | null = null;
  private offscreenCtx: CanvasRenderingContext2D | null = null;

  // Pickup instances for pickups in buttons
  private buttonPickups: Pickup[][] = [];

  // Shake animation properties
  private shakeButtonId: number | null = null;
  private shakeTimer = 0;
  private shakeDuration = 0.5; // Total shake duration in seconds
  private shakeIntensity = 5; // Rotation intensity in degrees
  private shakeFrequency = 20; // Shake frequency

  // Button press animation properties
  private pressedLevelButton: number | null = null;
  private pressedScrollButton: "u" | "d" | null = null;
  private isMouseDown = false; // Track if mouse is currently held down

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
    // Calculate total content height
    const totalContentHeight =
      this.totalLevels * this.buttonHeight +
      (this.totalLevels - 1) * this.buttonSpacing;

    const shadowOffset = 12; // Shadow offset used in button rendering

    // Create offscreen canvas large enough to hold all buttons
    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCanvas.width = 400 + shadowOffset; // List width + shadow offset
    // Add extra space for the shadow of the final button
    this.offscreenCanvas.height = totalContentHeight + shadowOffset;
    this.offscreenCtx = this.offscreenCanvas.getContext("2d");

    // Render all buttons to the offscreen canvas
    this.renderAllButtonsToOffscreen();
  }

  renderAllButtonsToOffscreen() {
    if (!this.offscreenCtx || !this.offscreenCanvas) return;

    const ctx = this.offscreenCtx;
    const listWidth = 400; // Keep original button width
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

      // Get completion data to determine button color
      const completionData = getItem<string>(`c-${levelId}`);
      const hasBeenPlayed = !!completionData;
      const numCollected = completionData ? parseInt(completionData, 10) : 0;
      const isPlayable = this.isLevelPlayable(levelId);

      // Check if this button is being pressed (only while mouse is held down)
      const isPressedButton =
        this.isMouseDown && this.pressedLevelButton == levelId;
      const pressOffset = isPressedButton ? shadowOffset : 0;

      // Draw shadow first (always draw shadow like arrow buttons)
      ctx.fillStyle = colorBlack;
      ctx.fillRect(
        rectX + shadowOffset,
        rectY + shadowOffset,
        listWidth,
        this.buttonHeight
      );

      // Draw level rectangle - use white for played levels and next unlocked level, dark gray for locked levels
      ctx.fillStyle = hasBeenPlayed || isPlayable ? colorWhite : colorDarkGray;
      ctx.fillRect(
        rectX + pressOffset,
        rectY + pressOffset,
        listWidth,
        this.buttonHeight
      );

      // Draw level text in red with larger font
      ctx.fillStyle = colorAccent;
      ctx.font = `${Math.min(this.buttonHeight * 0.6, 48)}px ${fontFamily}`;

      const levelText = levelId.toString().padStart(3, "0");
      ctx.fillText(
        levelText,
        rectX + 20 + pressOffset,
        rectY + this.buttonHeight / 2 + 20 + pressOffset
      );

      // Always create pickups for each level (3 total)
      this.createPickupsForLevel(
        levelId,
        rectX,
        rectY,
        numCollected,
        pressOffset
      );
    }
  }

  private createPickupsForLevel(
    levelId: number,
    rectX: number,
    rectY: number,
    numCollected: number,
    pressOffset: number = 0
  ) {
    const pickupSpacing = 60; // Further increased space between pickups
    const startX = rectX + 200 + pressOffset; // Move even further to the right of the button
    const pickupY = rectY + this.buttonHeight / 2 - 15 + pressOffset; // Center vertically in button

    // Clear existing pickups for this level
    const levelIndex = levelId - 1; // Convert to 0-based index
    this.buttonPickups[levelIndex] = [];

    const pickups: Pickup[] = [];
    const totalPickups = 3; // Always show 3 pickups

    for (let i = 0; i < totalPickups; i++) {
      const pickupX = startX + i * pickupSpacing;
      // Use normal color for collected pickups, gray for uncollected ones
      const pickupColor = i < numCollected ? colorAccent : colorGray;
      const pickup = new Pickup(
        Vector(pickupX - 64, pickupY - 64),
        pickupColor
      );
      pickup.setScale(0.7);
      // Keep pickup in active state "a" to show the pickup normally
      pickups.push(pickup);
    }

    this.buttonPickups[levelIndex] = pickups;
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
    const shadowOffset = 12; // Shadow offset for the final button
    return Math.max(
      0,
      totalContentHeight + shadowOffset - this.scrollAreaHeight
    );
  }

  // Scroll handling methods
  handleScroll(deltaY: number) {
    this.targetScrollOffset += deltaY;
    // Clamp target scroll offset to valid range
    const maxScrollOffset = this.getMaxScrollOffset();
    this.targetScrollOffset = Math.max(
      0,
      Math.min(this.targetScrollOffset, maxScrollOffset)
    );
  }

  handleDragStart(mouseY: number) {
    this.isDragging = true;
    this.lastMouseY = mouseY;
  }

  handleDragMove(mouseY: number) {
    if (this.isDragging) {
      const deltaY = this.lastMouseY - mouseY; // Inverted for natural scroll direction
      // For drag operations, update both target and current for immediate response
      this.targetScrollOffset += deltaY;
      const maxScrollOffset = this.getMaxScrollOffset();
      this.targetScrollOffset = Math.max(
        0,
        Math.min(this.targetScrollOffset, maxScrollOffset)
      );
      // Also update current scroll offset for immediate visual feedback during drag
      this.scrollOffset = this.targetScrollOffset;
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

  private isLevelPlayable(levelId: number): boolean {
    // Level 1 is always playable
    if (levelId == 1) return true;

    // Find the highest completed level
    let highestCompleted = 0;
    for (let i = 1; i < levelId; i++) {
      const completionData = getItem<string>(`c-${i}`);
      if (completionData) {
        highestCompleted = i;
      }
    }

    // Allow playing the next level after the highest completed
    return levelId <= highestCompleted + 1;
  }

  private isVisibleInScrollArea(screenY: number): boolean {
    return (
      screenY > this.scrollAreaTop - this.buttonHeight &&
      screenY < this.scrollAreaTop + this.scrollAreaHeight
    );
  }

  handleClick(x: number, y: number) {
    // Check if click is on scroll buttons first
    const scrollButtonClick = this.isPointInScrollButton(x, y);
    if (scrollButtonClick) {
      if (scrollButtonClick == "u") {
        this.handleScroll(-750); // Scroll up by much more pixels (5x faster)
      } else if (scrollButtonClick == "d") {
        this.handleScroll(750); // Scroll down by much more pixels (5x faster)
      }
      return true;
    }

    // Check if click is on a level button
    const clickedLevel = this.isPointInLevelButton(x, y);

    if (clickedLevel != null) {
      // Check if the level is playable before allowing the click
      if (this.isLevelPlayable(clickedLevel)) {
        // Emit play event with the selected level ID
        playGoal();
        emit(GameEvent.play, { levelId: clickedLevel });
        return true;
      } else {
        // Play disabled button sound
        playButtonDisable();
        // Start shake animation for the disabled button
        this.startShakeAnimation(clickedLevel);
        return false;
      }
    }

    return false;
  }

  handleMouseDown(x: number, y: number) {
    // Check if mouse down is on scroll buttons first
    const scrollButtonClick = this.isPointInScrollButton(x, y);
    if (scrollButtonClick) {
      this.startPress("s", scrollButtonClick);
      return true;
    }

    // Check if mouse down is on a level button
    const clickedLevel = this.isPointInLevelButton(x, y);
    if (clickedLevel != null) {
      // Make all level buttons pressable, regardless of whether they're playable
      this.startPress("l", clickedLevel);
      return true;
    }

    return false;
  }

  handleMouseUp() {
    this.endPress();
  }

  isPointInScrollButton(x: number, y: number): "u" | "d" | null {
    if (!this.canvas) return null;

    const centerX = this.canvas.width / 2;
    const buttonSpacing = 60; // Match the spacing from drawScrollButtons
    const triangleSize = 50; // Match triangle size from drawScrollButtons
    const clickableSize = triangleSize + 20; // Add some padding for easier clicking

    const buttonLeft = centerX - clickableSize / 2;
    const buttonRight = centerX + clickableSize / 2;

    // Check if x is within button width
    if (x < buttonLeft || x > buttonRight) return null;

    // Check top scroll button (above the scroll area)
    const topButtonTop =
      this.scrollAreaTop - this.scrollButtonHeight - buttonSpacing;
    const topArrowY = topButtonTop + this.scrollButtonHeight / 2;
    const topClickTop = topArrowY - clickableSize / 2;
    const topClickBottom = topArrowY + clickableSize / 2;
    if (y >= topClickTop && y <= topClickBottom) {
      return "u";
    }

    // Check bottom scroll button (below the scroll area)
    const bottomButtonTop =
      this.scrollAreaTop + this.scrollAreaHeight + buttonSpacing;
    const bottomArrowY = bottomButtonTop + this.scrollButtonHeight / 2;
    const bottomClickTop = bottomArrowY - clickableSize / 2;
    const bottomClickBottom = bottomArrowY + clickableSize / 2;
    if (y >= bottomClickTop && y <= bottomClickBottom) {
      return "d";
    }

    return null;
  }

  private startShakeAnimation(levelId: number) {
    this.shakeButtonId = levelId;
    this.shakeTimer = 0;
  }

  private startPress(type: "l" | "s", id: number | "u" | "d") {
    this.isMouseDown = true;
    if (type == "l") {
      this.pressedLevelButton = id as number;
    } else {
      this.pressedScrollButton = id as "u" | "d";
    }
    // Regenerate the offscreen canvas to show the press effect
    this.renderAllButtonsToOffscreen();
  }

  private endPress() {
    this.isMouseDown = false;
    this.pressedLevelButton = null;
    this.pressedScrollButton = null;
    // Regenerate the offscreen canvas to remove the press effect
    this.renderAllButtonsToOffscreen();
  }

  private getShakeRotation(): number {
    if (this.shakeButtonId == null || this.shakeTimer >= this.shakeDuration) {
      return 0;
    }

    // Create oscillating rotation that decreases over time
    const progress = this.shakeTimer / this.shakeDuration;
    const decay = 1 - progress; // Decay over time
    const oscillation = Math.sin(
      this.shakeTimer * this.shakeFrequency * Math.PI
    );
    return oscillation * this.shakeIntensity * decay * (Math.PI / 180); // Convert to radians
  }

  update() {
    // Smooth scrolling interpolation
    const scrollDiff = this.targetScrollOffset - this.scrollOffset;
    if (Math.abs(scrollDiff) > 0.5) {
      this.scrollOffset += scrollDiff * this.scrollSpeed;
    } else {
      this.scrollOffset = this.targetScrollOffset;
    }

    // Update shake animation
    if (this.shakeButtonId != null) {
      this.shakeTimer += 1 / 60; // Assuming 60 FPS
      if (this.shakeTimer >= this.shakeDuration) {
        this.shakeButtonId = null;
        this.shakeTimer = 0;
      }
    }
  }

  // Method to refresh the button rendering (call this when completion data changes)
  refreshButtons() {
    // Clear existing pickup instances
    this.buttonPickups = [];
    this.renderAllButtonsToOffscreen();
  }

  render(ctx: CanvasRenderingContext2D) {
    // Update position in case canvas size changed

    this.updatePosition();

    // Save current transform to render in screen coordinates
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to identity matrix

    // Draw main menu background
    ctx.fillStyle = colorWall;
    ctx.fillRect(
      this.pos.x,
      this.pos.y,
      this.canvas?.width! * 0.8,
      this.canvas?.height!
    );

    // Draw title
    this.drawTitle(ctx);

    // Draw level selection area
    this.drawLevelList(ctx);

    // Draw pickup instances
    this.renderPickupInstances(ctx);

    // Draw scroll buttons
    this.drawScrollButtons(ctx);

    // Restore the previous transform
    ctx.restore();
  }

  private renderPickupInstances(ctx: CanvasRenderingContext2D) {
    if (!this.canvas) return;

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

    // Render pickup instances for each level
    for (let i = 0; i < this.totalLevels; i++) {
      const pickups = this.buttonPickups[i]; // Use array index directly

      if (pickups) {
        // Calculate button position in the scrolled view
        const buttonY = i * (this.buttonHeight + this.buttonSpacing);
        const screenY = buttonY - this.scrollOffset + this.scrollAreaTop;

        // Only render if the button is visible
        if (this.isVisibleInScrollArea(screenY)) {
          for (const pickup of pickups) {
            ctx.save();
            // Position relative to the screen coordinates
            const originalPosX = pickup.pos.x;
            const originalPosY = pickup.pos.y;
            pickup.pos.x = scrollAreaLeft + pickup.pos.x;
            pickup.pos.y =
              screenY + (pickup.pos.y - (buttonY + this.buttonHeight / 2 - 64));

            pickup.render(ctx);

            // Restore original position
            pickup.pos.x = originalPosX;
            pickup.pos.y = originalPosY;
            ctx.restore();
          }
        }
      }
    }

    ctx.restore();
  }

  drawLevelList(ctx: CanvasRenderingContext2D) {
    if (!this.canvas || !this.offscreenCanvas) return;

    const centerX = this.canvas.width / 2;
    const listWidth = 400;
    const shadowOffset = 12; // Must match the shadowOffset used in renderAllButtonsToOffscreen
    const scrollAreaLeft = centerX - listWidth / 2;

    // Set up clipping region for the scroll area - include space for shadows
    ctx.save();
    ctx.beginPath();
    ctx.rect(
      scrollAreaLeft,
      this.scrollAreaTop,
      listWidth + shadowOffset, // Include shadow space in clipping
      this.scrollAreaHeight
    );
    ctx.clip();

    // If there's a shaking button, we need to draw it separately with rotation
    if (this.shakeButtonId != null) {
      // Draw the offscreen canvas but exclude the shaking button area
      ctx.drawImage(
        this.offscreenCanvas,
        0, // Source x
        this.scrollOffset, // Source y (scroll offset)
        listWidth + shadowOffset, // Source width - include shadow space
        this.scrollAreaHeight, // Source height
        scrollAreaLeft, // Destination x
        this.scrollAreaTop, // Destination y
        listWidth + shadowOffset, // Destination width - include shadow space
        this.scrollAreaHeight // Destination height
      );

      // Draw the shaking button with rotation
      this.drawShakingButton(ctx, scrollAreaLeft, listWidth);
    } else {
      // Normal drawing when no button is shaking
      ctx.drawImage(
        this.offscreenCanvas,
        0, // Source x
        this.scrollOffset, // Source y (scroll offset)
        listWidth + shadowOffset, // Source width - include shadow space
        this.scrollAreaHeight, // Source height
        scrollAreaLeft, // Destination x
        this.scrollAreaTop, // Destination y
        listWidth + shadowOffset, // Destination width - include shadow space
        this.scrollAreaHeight // Destination height
      );
    }

    ctx.restore();
  }

  private drawShakingButton(
    ctx: CanvasRenderingContext2D,
    scrollAreaLeft: number,
    listWidth: number
  ) {
    if (this.shakeButtonId == null) return;

    const levelId = this.shakeButtonId;
    const buttonIndex = levelId - 1; // Convert to 0-based index
    const buttonY = buttonIndex * (this.buttonHeight + this.buttonSpacing);
    const screenY = buttonY - this.scrollOffset + this.scrollAreaTop;

    // Only draw if the button is visible in the scroll area
    if (this.isVisibleInScrollArea(screenY)) {
      const shadowOffset = 12;
      const rotation = this.getShakeRotation();

      // Get button data
      const completionData = getItem<string>(`c-${levelId}`);
      const hasBeenPlayed = !!completionData;
      const isPlayable = this.isLevelPlayable(levelId);

      // Save context for rotation
      ctx.save();

      // Translate to button center for rotation
      const buttonCenterX = scrollAreaLeft + listWidth / 2;
      const buttonCenterY = screenY + this.buttonHeight / 2;
      ctx.translate(buttonCenterX, buttonCenterY);
      ctx.rotate(rotation);

      // Draw button from center (translate coordinates)
      const rectX = -listWidth / 2;
      const rectY = -this.buttonHeight / 2;

      // Draw shadow first
      ctx.fillStyle = colorBlack;
      ctx.fillRect(
        rectX + shadowOffset,
        rectY + shadowOffset,
        listWidth,
        this.buttonHeight
      );

      // Draw level rectangle
      ctx.fillStyle = hasBeenPlayed || isPlayable ? colorWhite : colorDarkGray;
      ctx.fillRect(rectX, rectY, listWidth, this.buttonHeight);

      // Draw level text
      ctx.fillStyle = colorAccent;
      ctx.font = `${Math.min(this.buttonHeight * 0.6, 48)}px ${fontFamily}`;

      const levelText = levelId.toString().padStart(3, "0");
      ctx.fillText(levelText, rectX + 20, rectY + this.buttonHeight / 2);

      ctx.restore();
    }
  }

  private drawTitle(ctx: CanvasRenderingContext2D) {
    if (!this.canvas) return;

    const centerX = this.canvas.width / 2 - 550;
    const titleY = 220; // Position from top of screen
    const shadowOffset = 16;
    const font = `148px ${fontFamily}`;
    const title = "Triska the Ninja Cat";
    // Draw title shadow first
    ctx.fillStyle = colorBlack;
    ctx.font = font;

    ctx.fillText(title, centerX + shadowOffset, titleY + shadowOffset);

    // Draw main title
    ctx.fillStyle = colorWhite;
    ctx.font = font;

    ctx.fillText(title, centerX, titleY);
  }

  private drawTriangle(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    size: number,
    rotation: number,
    color: string
  ) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5); // Top point
    ctx.lineTo(-size, size); // Bottom left
    ctx.lineTo(size, size); // Bottom right
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  private drawScrollButtons(ctx: CanvasRenderingContext2D) {
    if (!this.canvas) return;

    const centerX = this.canvas.width / 2;
    const shadowOffset = 10; // Shadow offset for both X and Y directions
    const triangleSize = 50; // Increased triangle size for wider arrows (was 35)
    const buttonSpacing = 60; // Increased spacing from scroll area (was 10)

    // Check scroll limits to determine if arrows should be enabled
    const maxScrollOffset = this.getMaxScrollOffset();
    const canScrollUp = this.scrollOffset > 0;
    const canScrollDown = this.scrollOffset < maxScrollOffset;

    // Always draw both arrows but change color based on scroll state

    // Draw top scroll button (UP triangle) - always visible
    const topButtonTop =
      this.scrollAreaTop - this.scrollButtonHeight - buttonSpacing;
    const arrowY = topButtonTop + this.scrollButtonHeight / 2;

    // Draw shadow triangle first (black triangle with offset)
    this.drawTriangle(
      ctx,
      centerX + shadowOffset,
      arrowY + shadowOffset,
      triangleSize,
      0, // 0 rotation for UP triangle
      colorBlack
    );

    // Draw main UP triangle - white if can scroll up, dark gray if disabled
    // Apply press offset if this button is being pressed (only while mouse is held down)
    const upPressOffsetX =
      this.isMouseDown && this.pressedScrollButton == "u" ? shadowOffset : 0;
    const upPressOffsetY =
      this.isMouseDown && this.pressedScrollButton == "u" ? shadowOffset : 0;
    this.drawTriangle(
      ctx,
      centerX + upPressOffsetX,
      arrowY + upPressOffsetY,
      triangleSize,
      0, // 0 rotation for UP triangle
      canScrollUp ? colorWhite : colorDarkGray
    );

    // Draw bottom scroll button (DOWN triangle) - always visible
    const bottomButtonTop =
      this.scrollAreaTop + this.scrollAreaHeight + buttonSpacing;
    const bottomArrowY = bottomButtonTop + this.scrollButtonHeight / 2;

    // Draw shadow triangle first (black triangle with offset)
    this.drawTriangle(
      ctx,
      centerX + shadowOffset,
      bottomArrowY + shadowOffset,
      triangleSize,
      Math.PI, // 180 degrees rotation for DOWN triangle
      colorBlack
    );

    // Draw main DOWN triangle - white if can scroll down, dark gray if disabled
    // Apply press offset if this button is being pressed (only while mouse is held down)
    const downPressOffsetX =
      this.isMouseDown && this.pressedScrollButton == "d" ? shadowOffset : 0;
    const downPressOffsetY =
      this.isMouseDown && this.pressedScrollButton == "d" ? shadowOffset : 0;
    this.drawTriangle(
      ctx,
      centerX + downPressOffsetX,
      bottomArrowY + downPressOffsetY,
      triangleSize,
      Math.PI, // 180 degrees rotation for DOWN triangle
      canScrollDown ? colorWhite : colorDarkGray
    );
  }
}
