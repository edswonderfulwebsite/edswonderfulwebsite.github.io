const TILE = 16;
const WORLD_W = 512;
const WORLD_H = 128;
const SEA_LEVEL = 66;

const WORLD_SEED = Math.floor(Math.random() * 1e9);
console.log("Seed:", WORLD_SEED);

const rng = mulberry32(WORLD_SEED);

const TILES = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  WATER: 4,
  WOOD: 5,
  LEAF: 6,
  BACK: 7
};

const COLORS = {
  1: '#4caf50',
  2: '#8b5a2b',
  3: '#7a7a7a',
  4: '#3f76e4',
  5: '#8d6e63',
  6: '#2e7d32',
  7: '#555' // background stone
};

const world = Array.from({ length: WORLD_H }, () =>
  Array(WORLD_W).fill(TILES.AIR)
);

const background = Array.from({ length: WORLD_H }, () =>
  Array(WORLD_W).fill(TILES.AIR)
);

function generateWorld() {
  const height = [];

  // Terrain
  for (let x = 0; x < WORLD_W; x++) {
    const base = octaveNoise(x, 3, 0.5, 0.002, WORLD_SEED);
    const hills = octaveNoise(x, 4, 0.5, 0.04, WORLD_SEED + 99);
    height[x] = Math.floor(SEA_LEVEL + base * 18 + hills * 12);
  }

  // Strata
  for (let x = 0; x < WORLD_W; x++) {
    for (let y = height[x]; y < WORLD_H; y++) {
      if (y === height[x]) world[y][x] = TILES.GRASS;
      else if (y < height[x] + 4) world[y][x] = TILES.DIRT;
      else world[y][x] = TILES.STONE;

      background[y][x] = TILES.BACK;
    }
  }

  // Caves
  function carve(x, y, len, angle) {
    for (let i = 0; i < len; i++) {
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++) {
          const cx = Math.floor(x + dx);
          const cy = Math.floor(y + dy);
          if (world[cy]?.[cx] === TILES.STONE)
            world[cy][cx] = TILES.AIR;
        }

      x += Math.cos(angle);
      y += Math.sin(angle) * 0.5;
      angle += (rng() - 0.5) * 0.3;

      if (y < 30 || y > WORLD_H - 5) break;
      if (rng() < 0.015)
        carve(x, y, len * 0.6, angle + (rng() < 0.5 ? -1 : 1));
    }
  }

  for (let i = 0; i < 28; i++)
    carve(rng() * WORLD_W, 40 + rng() * 50, 30 + rng() * 40, rng() * Math.PI * 2);

  // Water (ONLY surface lakes)
  for (let x = 0; x < WORLD_W; x++) {
    for (let y = height[x] + 1; y < SEA_LEVEL; y++) {
      if (world[y][x] === TILES.AIR)
        world[y][x] = TILES.WATER;
    }
  }

  // Trees
  for (let x = 2; x < WORLD_W - 2; x++) {
    if (rng() < 0.05) {
      const y = height[x];
      if (world[y][x] === TILES.GRASS) {
        for (let i = 1; i <= 4; i++) world[y - i][x] = TILES.WOOD;
        for (let dx = -2; dx <= 2; dx++)
          for (let dy = -2; dy <= 0; dy++)
            world[y - 4 + dy][x + dx] = TILES.LEAF;
      }
    }
  }
}

generateWorld();
