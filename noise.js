// Simple 2D value noise (deterministic)
function rand(x, y) {
  return Math.sin(x * 127.1 + y * 311.7) * 43758.5453 % 1;
}

function lerp(a, b, t) { return a + (b - a) * t; }

function noise2D(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  const r1 = rand(xi, yi);
  const r2 = rand(xi + 1, yi);
  const r3 = rand(xi, yi + 1);
  const r4 = rand(xi + 1, yi + 1);

  const i1 = lerp(r1, r2, xf);
  const i2 = lerp(r3, r4, xf);

  return lerp(i1, i2, yf);
}
