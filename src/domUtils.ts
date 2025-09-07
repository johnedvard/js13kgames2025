let gameCanvases: HTMLCanvasElement[];

function scaleCanvas() {
  gameCanvases.forEach((canvas) => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const resolutionMultiplier = 2; // Increase this for higher resolution

    // Apply the calculated scale to the canvas with higher resolution
    canvas.width = window.innerWidth * devicePixelRatio * resolutionMultiplier;
    canvas.height =
      window.innerHeight * devicePixelRatio * resolutionMultiplier;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";

    // Scale the canvas context to match the device pixel ratio and resolution multiplier
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    context.scale(
      devicePixelRatio * resolutionMultiplier,
      devicePixelRatio * resolutionMultiplier
    );
  });
}

export function listenForResize(
  allCanvas: HTMLCanvasElement[],
  callbackFunctions?: Function[]
) {
  gameCanvases = allCanvas;
  function resize() {
    scaleCanvas();
    callbackFunctions?.forEach((callback) => callback());
  }

  // Listen for resize events
  window.addEventListener("resize", resize);
  scaleCanvas();
  callbackFunctions?.forEach((callback) => callback());
}
