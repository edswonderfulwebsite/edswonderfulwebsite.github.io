const keys = {};
addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

const player = {
  x: 5,
  y: 5,
  w: 0.8,
  h: 1,
  vx: 0,
  vy: 0,
  crouching: false,
  dashing: false,
  wallSliding: false,
  wallSide: 0
};

/* Physics */
const GRAVITY = 40;
const MOVE_ACCEL = 70;
const MAX_SPEED = 10;
const JUMP_FORCE = 15;
const WALL_JUMP_X = 12;
const WALL_JUMP_Y = 14;
const DASH_SPEED = 22;
const FRICTION = 0.82;
const WALL_SLIDE_SPEED = 3;

function updatePlayer(dt, effects) {
  // Crouch
  player.crouching = keys.s;
  player.h = player.crouching ? 0.6 : 1;

  // Horizontal movement
  if (!player.dashing && !player.wallSliding) {
    if (keys.a) player.vx -= MOVE_ACCEL * dt;
    if (keys.d) player.vx += MOVE_ACCEL * dt;
    player.vx *= FRICTION;
    player.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, player.vx));
  }

  // Gravity
  if (!player.dashing)
    player.vy += GRAVITY * dt;

  // Wall slide
  player.wallSliding =
    player.wallSide !== 0 &&
    player.vy > 0 &&
    ((player.wallSide === 1 && keys.d) ||
     (player.wallSide === -1 && keys.a));

  if (player.wallSliding)
    player.vy = Math.min(player.vy, WALL_SLIDE_SPEED);

  // Jump / Wall jump
  if (keys[" "]) {
    if (groundCollision(player)) {
      player.vy = -JUMP_FORCE;
    } else if (player.wallSliding) {
      player.vy = -WALL_JUMP_Y;
      player.vx = -player.wallSide * WALL_JUMP_X;
      player.wallSliding = false;
      effects.shake(5);
    }
  }

  // Dash (arrow keys)
  const dx = (keys.arrowright ? 1 : 0) - (keys.arrowleft ? 1 : 0);
  const dy = (keys.arrowdown ? 1 : 0) - (keys.arrowup ? 1 : 0);

  if ((dx || dy) && !player.dashing) {
    const mag = Math.hypot(dx, dy);
    player.vx = (dx / mag) * DASH_SPEED;
    player.vy = (dy / mag) * DASH_SPEED;
    player.dashing = true;
    effects.shake(4);
  }

  // Move X
  player.x += player.vx * dt;
  if (wallCollision(player) && player.dashing) {
    player.vx *= -0.6;
    player.vy *= 0.4;
    player.dashing = false;
    effects.shake(8);
  }

  // Move Y
  player.y += player.vy * dt;
  if (groundCollision(player)) {
    if (player.vy > 8) effects.shake(6);
    player.vy = 0;
    player.dashing = false;
  }

  // Dash decay
  if (player.dashing) {
    player.vx *= 0.98;
    player.vy *= 0.98;
    if (Math.abs(player.vx) < 3 && Math.abs(player.vy) < 3)
      player.dashing = false;
  }
}

function drawPlayer(ctx, camX, camY) {
  ctx.fillStyle =
    player.wallSliding ? "#ffd166" :
    player.dashing ? "#6be6ff" :
    "#ff6b6b";

  ctx.fillRect(
    player.x * TILE - camX,
    player.y * TILE - camY,
    player.w * TILE,
    player.h * TILE
  );
}
