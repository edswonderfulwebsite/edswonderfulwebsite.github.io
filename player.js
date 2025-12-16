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

function isSolid(tx, ty) {
  const t = world[ty]?.[tx];
  return (
    t === TILES.GRASS ||
    t === TILES.DIRT ||
    t === TILES.STONE ||
    t === TILES.WOOD
  );
}

function collide(px, py) {
  const left   = Math.floor(px - player.w / 2);
  const right  = Math.floor(px + player.w / 2);
  const top    = Math.floor(py - player.h);
  const bottom = Math.floor(py);

  for (let x = left; x <= right; x++) {
    for (let y = top; y <= bottom; y++) {
      if (isSolid(x, y)) return true;
    }
  }
  return false;
}

function updatePlayer(dt) {
  const accel = 100;
  const maxSpeed = 8;
  const gravity = 35;
  const jump = 14;

  // Horizontal input
  if (keys.a) player.vx -= accel * dt;
  if (keys.d) player.vx += accel * dt;
  player.vx *= 0.85;
  player.vx = Math.max(-maxSpeed, Math.min(maxSpeed, player.vx));

  // Gravity
  player.vy += gravity * dt;

  // Jump
  if (keys[' '] && player.onGround) {
    player.vy = -jump;
    player.onGround = false;
  }

  // X movement
  player.x += player.vx * dt;
  if (collide(player.x, player.y)) {
    player.x -= player.vx * dt;
    player.vx = 0;
  }

  // Y movement
  player.y += player.vy * dt;
  if (collide(player.x, player.y)) {
    player.y -= player.vy * dt;
    if (player.vy > 0) player.onGround = true;
    player.vy = 0;
  }
}
