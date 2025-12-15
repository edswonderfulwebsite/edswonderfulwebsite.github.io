const TILE = 16;
const WORLD_W = 512;
const WORLD_H = 128;
const SEA_LEVEL = 64;

// ===== WORLD SEED =====
const WORLD_SEED = Math.floor(Math.random() * 1e9);
const rng = mulberry32(WORLD_SEED);
console.log("WORLD SEED:", WORLD_SEED);

const TILES = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  COAL: 4,
  IRON: 5,
  GOLD: 6
};

const COLORS = {
  1: '#4caf50',
  2: '#8b5a2b',
  3: '#7a7a7a',
  4: '#2b2b2b',
  5: '#c49b6a',
  6: '#f1c232'
};

const world = Array.from({ length: WORLD_H }, () =>
  Array(WORLD_W).fill(TILES.AIR)
);

function generateWorld() {
  const heightMap = [];

  // ===== TERRAIN =====
  for (let x = 0; x < WORLD_W; x++) {
    const continents = octaveNoise(x, 3, 0.5, 0.0015, WORLD_SEED);
    const hills = octaveNoise(x, 5, 0.5, 0.035, WORLD_SEED + 999);

    heightMap[x] = Math.floor(
      SEA_LEVEL + continents * 22 + hills * 16
    );
  }

  // ===== STRATA =====
  for (let x = 0; x < WORLD_W; x++) {
    const h = heightMap[x];
    for (let y = 0; y < WORLD_H; y++) {
      if (y > h) {
        if (y === h + 1) world[y][x] = TILES.GRASS;
        else if (y <= h + 4) world[y][x] = TILES.DIRT;
        else world[y][x] = TILES.STONE;
      }
    }
  }

  // ===== BRANCHING CAVES =====
  function carveCave(x, y, length, angle, radius) {
    for (let i = 0; i < length; i++) {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          const cx = Math.floor(x + dx);
          const cy = Math.floor(y + dy);
          if (
            cx >= 0 && cx < WORLD_W &&
            cy >= 0 && cy < WORLD_H &&
            Math.hypot(dx, dy) <= radius
          ) {
            world[cy][cx] = TILES.AIR;
          }
        }
      }

      x += Math.cos(angle);
      y += Math.sin(angle) * 0.6;

      angle += (rng() - 0.5) * 0.25;

      if (y < 32 || y > WORLD_H - 5) break;

      if (rng() < 0.04 && length > 20) {
        carveCave(
          x, y,
          length * 0.6,
          angle + (rng() < 0.5 ? -1 : 1),
          Math.max(1, radius - 1)
        );
      }
    }
  }

  for (let i = 0; i < 120; i++) {
    carveCave(
      Math.floor(rng() * WORLD_W),
      Math.floor(40 + rng() * (WORLD_H - 60)),
      30 + rng() * 50,
      rng() * Math.PI * 2,
      2 + rng() * 2
    );
  }

  // ===== ORE VEINS =====
  function vein(type, count, minY, maxY) {
    for (let i = 0; i < count; i++) {
      let x = Math.floor(rng() * WORLD_W);
      let y = Math.floor(minY + rng() * (maxY - minY));

      for (let j = 0; j < 8; j++) {
        if (world[y]?.[x] === TILES.STONE) world[y][x] = type;
        x += Math.floor(rng() * 3) - 1;
        y += Math.floor(rng() * 3) - 1;
      }
    }
  }

  vein(TILES.COAL, 420, 20, 110);
  vein(TILES.IRON, 260, 20, 75);
  vein(TILES.GOLD, 90, 5, 40);
}

generateWorld();
