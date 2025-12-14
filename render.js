const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener('resize', resize);
resize();

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const camX = player.x * TILE - canvas.width / 2;
  const camY = player.y * TILE - canvas.height / 2;

  const x0 = Math.max(0, Math.floor(camX / TILE) - 2);
  const y0 = Math.max(0, Math.floor(camY / TILE) - 2);
  const x1 = Math.min(WORLD_W, x0 + canvas.width / TILE + 4);
  const y1 = Math.min(WORLD_H, y0 + canvas.height / TILE + 4);

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const t = world[y][x];
      if (t === TILES.AIR) continue;
      ctx.fillStyle = COLORS[t];
      ctx.fillRect(x * TILE - camX, y * TILE - camY, TILE, TILE);
    }
  }

  ctx.fillStyle = '#fff';
  ctx.fillRect(
    player.x * TILE - camX - player.w * TILE / 2,
    player.y * TILE - camY - player.h * TILE,
    player.w * TILE,
    player.h * TILE
  );
}
