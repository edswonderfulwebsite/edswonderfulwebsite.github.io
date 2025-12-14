const TILE = 16;
const WORLD_W = 512;
const WORLD_H = 128;
const SEA_LEVEL = 64;

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

  for (let x = 0; x < WORLD_W; x++) {
    const continents = octaveNoise(x, 3, 0.5, 0.002, 42);
    const hills = octaveNoise(x, 4, 0.5, 0.02, 1337);
    heightMap[x] = Math.floor(
      SEA_LEVEL + continents * 20 + hills * 10
    );
  }

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

  // Beta-style caves (tunnels, not blobs)
  for (let x = 0; x < WORLD_W; x++) {
    for (let y = 20; y < WORLD_H; y++) {
      const n = octaveNoise(x + y * 1000, 3, 0.5, 0.08, 999);
      if (n > 0.62) world[y][x] = TILES.AIR;
    }
  }

  // Ore veins
  function vein(type, attempts, minY, maxY) {
    for (let i = 0; i < attempts; i++) {
      let x = Math.floor(Math.random() * WORLD_W);
      let y = Math.floor(minY + Math.random() * (maxY - minY));
      for (let j = 0; j < 8; j++) {
        if (world[y]?.[x] === TILES.STONE)
          world[y][x] = type;
        x += Math.floor(Math.random() * 3) - 1;
        y += Math.floor(Math.random() * 3) - 1;
      }
    }
  }

  vein(TILES.COAL, 400, 20, 100);
  vein(TILES.IRON, 250, 20, 70);
  vein(TILES.GOLD, 80, 5, 35);
}

generateWorld();
