const TILE = 16;
const WORLD_W = 256;
const WORLD_H = 128;
const SEA_LEVEL = 50;

const TILES = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  COAL: 4,
  IRON: 5
};

const COLORS = {
  1: '#4CAF50',
  2: '#8B5A2B',
  3: '#7a7a7a',
  4: '#1b1b1b',
  5: '#c49b6a'
};

const world = Array.from({ length: WORLD_H }, () => Array(WORLD_W).fill(TILES.AIR));

function generateWorld() {
  const heightMap = [];
  for (let x = 0; x < WORLD_W; x++) {
    const h = noise2D(x * 0.05, 0) * 12 + noise2D(x * 0.01, 10) * 20;
    heightMap[x] = Math.floor(SEA_LEVEL + h);
  }

  for (let x = 0; x < WORLD_W; x++) {
    for (let y = 0; y < WORLD_H; y++) {
      if (y > heightMap[x]) {
        if (y === heightMap[x] + 1) world[y][x] = TILES.GRASS;
        else if (y < heightMap[x] + 5) world[y][x] = TILES.DIRT;
        else world[y][x] = TILES.STONE;
      }
    }
  }

  // Caves
  for (let x = 0; x < WORLD_W; x++) {
    for (let y = SEA_LEVEL + 8; y < WORLD_H; y++) {
      if (noise2D(x * 0.1, y * 0.1) > 0.65) world[y][x] = TILES.AIR;
    }
  }

  // Ores
  for (let x = 0; x < WORLD_W; x++) {
    for (let y = 0; y < WORLD_H; y++) {
      if (world[y][x] === TILES.STONE) {
        const d = y / WORLD_H;
        if (d > 0.3 && Math.random() < 0.02) world[y][x] = TILES.COAL;
        if (d > 0.5 && Math.random() < 0.01) world[y][x] = TILES.IRON;
      }
    }
  }
}

generateWorld();
