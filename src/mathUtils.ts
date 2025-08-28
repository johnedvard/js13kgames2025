export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
