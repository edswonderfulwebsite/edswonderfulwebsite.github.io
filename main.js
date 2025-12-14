// Beta 1.7.3–style octave noise utilities
// Emulates classic Minecraft terrain feel (continents + hills)

function rand(seed) {
  return Math.sin(seed) * 10000 % 1;
}

function smoothNoise(x, seed) {
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const t = x - x0;
  const r0 = rand(x0 + seed);
  const r1 = rand(x1 + seed);
  return r0 * (1 - t) + r1 * t;
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
