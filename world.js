const TILE = 16;
const WORLD_W = 512;
const WORLD_H = 128;
const SEA_LEVEL = 64;

// ===== WORLD SEED =====
const WORLD_SEED = Math.floor(Math.random() * 1e9);
console.log("WORLD SEED:", WORLD_SEED);

// Separate RNG streams (Beta-style)
const rngTerrain = mulberry32(WORLD_SEED + 1);
const rngCaves   = mulberry32(WORLD_SEED + 2);
const rngOres    = mulberry32(WORLD_SEED + 3);

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

  // ===== TERRAIN (Beta-style roughness) =====
  for (let x = 0; x < WORLD_W; x++) {
    const continents = octaveNoise(x, 3, 0.5, 0.0015, WORLD_SEED + 100);
    const hills      = octaveNoise(x, 5, 0.5, 0.035,  WORLD_SEED + 200);

    heightMap[x] = Math.floor(
      SEA_LEVEL +
      continents * 22 +
      hills * 16
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

  // ===== BRANCHING BETA-STYLE CAVES =====
  function carveCave(x, y, length, angle, radius) {
    for (let i = 0; i < length; i++) {
      const t = i / length;
      const r = Math.max(1, Math.floor(radius * (1 - t)));

      for (let dx = -r; dx <= r; dx++) {
        for (let dy = -r; dy <= r; dy++) {
          const cx = Math.floor(x + dx);
          const cy = Math.floor(y + dy);
          if (
            cx >= 0 && cx < WORLD_W &&
            cy >= 0 && cy < WORLD_H &&
            Math.hypot(dx, dy) <= r
          ) {
            world[cy][cx] = TILES.AIR;
          }
        }
      }

      // Move cave forward (horizontal bias)
      x += Math.cos(angle);
      y += Math.sin(angle) * 0.6;

      // Gentle drift
      angle += (rngCaves() - 0.5) * 0.25;

      // Depth limits
      if (y < 32 || y > WORLD_H - 5) break;

      // Rare early branching
      if (length > 25 && rngCaves() < 0.015) {
        carveCave(
          x,
          y,
          length * 0.5,
          angle + (rngCaves() < 0.5 ? -1 : 1) * (0.7 + rngCaves() * 0.5),
          Math.max(1, r - 1)
        );
      }
    }
  }

  // Cave systems (LOW density – Beta-like)
  for (let i = 0; i < 32; i++) {
    carveCave(
      Math.floor(rngCaves() * WORLD_W),
      Math.floor(40 + rngCaves() * (WORLD_H - 60)),
      30 + rngCaves() * 50,
      rngCaves() * Math.PI * 2,
      1 + rngCaves() * 1.5
    );
  }

  // ===== ORE VEINS =====
  function vein(type, count, minY, maxY) {
    for (let i = 0; i < count; i++) {
      let x = Math.floor(rngOres() * WORLD_W);
      let y = Math.floor(minY + rngOres() * (maxY - minY));

      for (let j = 0; j < 8; j++) {
        if (world[y]?.[x] === TILES.STONE) world[y][x] = type;
        x += Math.floor(rngOres() * 3) - 1;
        y += Math.floor(rngOres() * 3) - 1;
      }
    }
  }

  vein(TILES.COAL, 420, 20, 110);
  vein(TILES.IRON, 260, 20, 75);
  vein(TILES.GOLD, 90, 5, 40);
}

generateWorld();
