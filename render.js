const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener('resize', resize);
resize();

function render() {
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const camX = player.x * TILE - canvas.width / 2;
  const camY = player.y * TILE - canvas.height / 2;

  // Clouds
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  for (let i = 0; i < 20; i++)
    ctx.fillRect((i * 200 - camX * 0.3) % canvas.width, 40, 120, 30);

  // Background layer
  for (let y = 0; y < WORLD_H; y++) {
    for (let x = 0; x < WORLD_W; x++) {
      if (background[y][x] === TILES.BACK) {
        ctx.fillStyle = COLORS[TILES.BACK];
        ctx.fillRect(x * TILE - camX, y * TILE - camY, TILE, TILE);
      }
    }
  }

  // Foreground blocks
  for (let y = 0; y < WORLD_H; y++) {
    for (let x = 0; x < WORLD_W; x++) {
      const t = world[y][x];
      if (t === TILES.AIR) continue;
      ctx.fillStyle = COLORS[t];
      ctx.fillRect(x * TILE - camX, y * TILE - camY, TILE, TILE);
    }
  }

  // Player
  ctx.fillStyle = '#fff';
  ctx.fillRect(
    player.x * TILE - camX,
    player.y * TILE - camY,
    TILE,
    TILE * 2
  );
}
