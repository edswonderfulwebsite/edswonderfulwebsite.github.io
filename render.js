const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener('resize', resize);
resize();

// Pre-generate cloud puffs
const clouds = [];
for (let i = 0; i < 18; i++) {
  clouds.push({
    x: Math.random() * WORLD_W * TILE,
    y: 40 + Math.random() * 80,
    size: 60 + Math.random() * 80,
    speed: 5 + Math.random() * 10
  });
}

function render() {
  // Sky
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const camX = player.x * TILE - canvas.width / 2;
  const camY = player.y * TILE - canvas.height / 2;

  // Clouds (parallax)
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (const c of clouds) {
    const cx = (c.x - camX * 0.3) % (WORLD_W * TILE);
    ctx.beginPath();
    ctx.arc(cx, c.y, c.size * 0.4, 0, Math.PI * 2);
    ctx.arc(cx + c.size * 0.3, c.y + 10, c.size * 0.35, 0, Math.PI * 2);
    ctx.arc(cx - c.size * 0.3, c.y + 10, c.size * 0.35, 0, Math.PI * 2);
    ctx.fill();
    c.x += c.speed * 0.02;
  }

  // Background layer
  for (let y = 0; y < WORLD_H; y++) {
    for (let x = 0; x < WORLD_W; x++) {
      if (background[y][x] === TILES.BACK) {
        ctx.fillStyle = COLORS[TILES.BACK];
        ctx.fillRect(
          x * TILE - camX,
          y * TILE - camY,
          TILE,
          TILE
        );
      }
    }
  }

  // Foreground blocks
  for (let y = 0; y < WORLD_H; y++) {
    for (let x = 0; x < WORLD_W; x++) {
      const t = world[y][x];
      if (t === TILES.AIR) continue;
      ctx.fillStyle = COLORS[t];
      ctx.fillRect(
        x * TILE - camX,
        y * TILE - camY,
        TILE,
        TILE
      );
    }
  }

  // Player
  ctx.fillStyle = '#fff';
  ctx.fillRect(
    player.x * TILE - camX - player.w * TILE / 2,
    player.y * TILE - camY - player.h * TILE,
    player.w * TILE,
    player.h * TILE
  );
}
