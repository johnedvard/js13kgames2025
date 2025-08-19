let resizeTimeout: number | undefined;
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
    const context = canvas.getContext("2d");
    if (context) {
      context.scale(
        devicePixelRatio * resolutionMultiplier,
        devicePixelRatio * resolutionMultiplier
      );
    }
  });
}

export function listenForResize(
  allCanvas: HTMLCanvasElement[],
  callbackFunctions?: Function[]
) {
  gameCanvases = allCanvas;
  function debouncedResize() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = window.setTimeout(() => {
      scaleCanvas();
      callbackFunctions?.forEach((callback) => callback());
    }, 50);
  }

  // Listen for resize events
  window.addEventListener("resize", debouncedResize);
  scaleCanvas();
  callbackFunctions?.forEach((callback) => callback());
}
