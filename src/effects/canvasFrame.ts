const CANVAS_WIDTH = 1512;
const CANVAS_HEIGHT = 861;

export function frameRatio(): { x: number; y: number } {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const scale = Math.min(w / CANVAS_WIDTH, h / CANVAS_HEIGHT);
  return {
    x: (CANVAS_WIDTH * scale) / w,
    y: (CANVAS_HEIGHT * scale) / h,
  };
}

const MIN_CANVAS_SCALE = 0.65;

export function isCanvasTooSmall(): boolean {
  const scale = Math.min(
    window.innerWidth / CANVAS_WIDTH,
    window.innerHeight / CANVAS_HEIGHT
  );
  return scale < MIN_CANVAS_SCALE;
}
