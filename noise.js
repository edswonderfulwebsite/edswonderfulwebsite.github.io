function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothNoise(x, seed) {
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const t = x - x0;

  const r0 = Math.sin((x0 + seed) * 127.1) * 43758.5453 % 1;
  const r1 = Math.sin((x1 + seed) * 127.1) * 43758.5453 % 1;

  return lerp(r0, r1, t);
}

function octaveNoise(x, octaves, persistence, scale, seed) {
  let total = 0;
  let freq = scale;
  let amp = 1;
  let max = 0;

  for (let i = 0; i < octaves; i++) {
    total += smoothNoise(x * freq, seed + i * 100) * amp;
    max += amp;
    amp *= persistence;
    freq *= 2;
  }
  return total / max;
}
