const player = { x: WORLD_W / 2, y: 10, vx: 0, vy: 0 };

const keys = {};
addEventListener('keydown', e => keys[e.key] = true);
addEventListener('keyup', e => keys[e.key] = false);

function updatePlayer(dt) {
  player.vy += 30 * dt;
  if (keys.a) player.vx -= 20 * dt;
  if (keys.d) player.vx += 20 * dt;
  if (keys[' '] && player.vy === 0) player.vy = -12;

  player.x += player.vx * dt;
  player.y += player.vy * dt;
}
