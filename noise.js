function rand(x) {
  return Math.sin(x * 127.1) * 43758.5453 % 1;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothNoise(x, seed) {
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const t = x - x0;

  const r0 = rand(x0 + seed);
  const r1 = rand(x1 + seed);

  return lerp(r0, r1, t);
}

function octaveNoise(x, octaves, persistence, scale, seed) {
  let total = 0;
  let frequency = scale;
  let amplitude = 1;
  let max = 0;

  for (let i = 0; i < octaves; i++) {
    total += smoothNoise(x * frequency, seed + i * 100) * amplitude;
    max += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return total / max;
}
