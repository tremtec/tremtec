export type Point = { x: number; y: number };

/** Smooth cubic path through the points (horizontal control handles). */
export function smoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  let d = `M${first.x.toFixed(1)},${first.y.toFixed(1)}`;
  let prev = first;
  for (const p of rest) {
    const mid = (prev.x + p.x) / 2;
    d += ` C${mid.toFixed(1)},${prev.y.toFixed(1)} ${mid.toFixed(1)},${p.y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    prev = p;
  }
  return d;
}

/** Picks a round upper bound so grid lines land on whole numbers. */
export function niceMax(value: number, minimum = 4): number {
  const target = Math.max(value, minimum);
  const step = target <= 10 ? 2 : 10 ** Math.floor(Math.log10(target));
  return Math.ceil(target / step) * step;
}
