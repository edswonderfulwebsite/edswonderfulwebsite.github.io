const player = {
  x: WORLD_W / 2,
  y: 10,
  vx: 0,
  vy: 0,
  w: 0.8,
  h: 1.8,
  onGround: false
};

const keys = {};
addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function solid(x, y) {
  if (x < 0 || y < 0 || x >= WORLD_W || y >= WORLD_H) return true;
  return world[y][x] !== TILES.AIR;
}

function updatePlayer(dt) {
  const acc = 100;
  const grav = 40;
  const jump = 14;

  if (keys['a']) player.vx -= acc * dt;
  if (keys['d']) player.vx += acc * dt;

  player.vx *= 0.85;
  player.vy += grav * dt;

  if (keys[' '] && player.onGround) {
    player.vy = -jump;
    player.onGround = false;
  }

  player.x += player.vx * dt;
  if (collide()) player.x -= player.vx * dt, player.vx = 0;

  player.y += player.vy * dt;
  if (collide()) {
    player.y -= player.vy * dt;
    if (player.vy > 0) player.onGround = true;
    player.vy = 0;
  }
}

function collide() {
  const l = Math.floor(player.x - player.w / 2);
  const r = Math.floor(player.x + player.w / 2);
  const t = Math.floor(player.y - player.h);
  const b = Math.floor(player.y);

  for (let x = l; x <= r; x++)
    for (let y = t; y <= b; y++)
      if (solid(x, y)) return true;
  return false;
}
