import { emit } from "kontra";
import { GameEvent } from "./GameEvent";
// import { playBackgroundMusic } from "./myAudio";
import { playSong } from "./audio";
import { Vector } from "./Vector";

let isTouching = false;
let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let _canvas: HTMLCanvasElement;

export function initializeInputController(canvas: HTMLCanvasElement) {
  _canvas = canvas;
  // Mouse events
  _canvas.addEventListener("mousedown", onMouseDown);
  _canvas.addEventListener("mouseup", onMouseUp);
  _canvas.addEventListener("mousemove", onMouseMove);
  _canvas.addEventListener("wheel", onWheel, { passive: false });

  // Touch events
  _canvas.addEventListener("touchstart", onTouchStart, { passive: false });
  _canvas.addEventListener("touchend", onTouchEnd);
  _canvas.addEventListener("touchmove", onTouchMove);

  // Keyboard events
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
}

function onMouseDown(e: MouseEvent) {
  isTouching = true;
  isDragging = false;

  // Convert screen coordinates to canvas coordinates
  const rect = _canvas.getBoundingClientRect();
  const scaleX = _canvas.width / rect.width;
  const scaleY = _canvas.height / rect.height;

  startX = (e.clientX - rect.left) * scaleX;
  startY = (e.clientY - rect.top) * scaleY;

  emit(GameEvent.down, Vector(startX, startY));
}

function onMouseUp(e: MouseEvent) {
  // Convert screen coordinates to canvas coordinates
  const rect = _canvas.getBoundingClientRect();
  const scaleX = _canvas.width / rect.width;
  const scaleY = _canvas.height / rect.height;

  const canvasX = (e.clientX - rect.left) * scaleX;
  const canvasY = (e.clientY - rect.top) * scaleY;

  emit(GameEvent.up, Vector(canvasX, canvasY));

  isTouching = false;
  isDragging = false;
  playSong();
  // playBackgroundMusic();
}

function onMouseMove(e: MouseEvent) {
  if (isTouching) {
    // Convert screen coordinates to canvas coordinates
    const rect = _canvas.getBoundingClientRect();
    const scaleX = _canvas.width / rect.width;
    const scaleY = _canvas.height / rect.height;

    currentX = (e.clientX - rect.left) * scaleX;
    currentY = (e.clientY - rect.top) * scaleY;

    if (!isDragging) {
      isDragging = true;
    }
    emitDragEvent();
  }
}

function onTouchStart(e: TouchEvent) {
  isTouching = true;
  isDragging = false;
  const touch = e.touches[0];

  // Convert screen coordinates to canvas coordinates
  const rect = _canvas.getBoundingClientRect();
  const scaleX = _canvas.width / rect.width;
  const scaleY = _canvas.height / rect.height;

  startX = (touch.clientX - rect.left) * scaleX;
  startY = (touch.clientY - rect.top) * scaleY;

  emit(GameEvent.down, Vector(startX, startY));
  e.preventDefault();
  playSong();
  // playBackgroundMusic();
  return false;
}

function onTouchEnd(e: TouchEvent) {
  const touch = e.changedTouches[0];

  // Convert screen coordinates to canvas coordinates
  const rect = _canvas.getBoundingClientRect();
  const scaleX = _canvas.width / rect.width;
  const scaleY = _canvas.height / rect.height;

  const canvasX = (touch.clientX - rect.left) * scaleX;
  const canvasY = (touch.clientY - rect.top) * scaleY;

  emit(GameEvent.up, Vector(canvasX, canvasY));
  isTouching = false;
  isDragging = false;
}

function onTouchMove(e: TouchEvent) {
  if (isTouching) {
    const touch = e.touches[0];

    // Convert screen coordinates to canvas coordinates
    const rect = _canvas.getBoundingClientRect();
    const scaleX = _canvas.width / rect.width;
    const scaleY = _canvas.height / rect.height;

    currentX = (touch.clientX - rect.left) * scaleX;
    currentY = (touch.clientY - rect.top) * scaleY;

    if (!isDragging) {
      isDragging = true;
    }
    emitDragEvent();
  }
}

function onWheel(e: WheelEvent) {
  e.preventDefault(); // Prevent page scrolling

  // Convert screen coordinates to canvas coordinates
  const rect = _canvas.getBoundingClientRect();
  const scaleX = _canvas.width / rect.width;
  const scaleY = _canvas.height / rect.height;

  const canvasX = (e.clientX - rect.left) * scaleX;
  const canvasY = (e.clientY - rect.top) * scaleY;

  emit(GameEvent.wheel, {
    deltaY: e.deltaY,
    x: canvasX,
    y: canvasY,
  });
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === " ") {
    e.preventDefault(); // Prevent page scrolling
    if (!isTouching) {
      // Prevent multiple events if already touching
      isTouching = true;
      isDragging = false;
      // Use canvas center as the position for keyboard events
      const centerX = _canvas.width / 2;
      const centerY = _canvas.height / 2;
      emit(GameEvent.down, Vector(centerX, centerY));
      playSong();
      // playBackgroundMusic();
    }
  }
}

function onKeyUp(e: KeyboardEvent) {
  if (e.key === " ") {
    e.preventDefault(); // Prevent page scrolling
    if (isTouching) {
      // Only emit up if we were touching
      // Use canvas center as the position for keyboard events
      const centerX = _canvas.width / 2;
      const centerY = _canvas.height / 2;
      emit(GameEvent.up, Vector(centerX, centerY));
      isTouching = false;
      isDragging = false;
    }
  }
}

function emitDragEvent() {
  const diffX = currentX - startX;
  const diffY = currentY - startY;
  emit(GameEvent.drag, {
    detail: { diffX, diffY },
  });
}

export function isUserTouching(): boolean {
  return isTouching;
}
