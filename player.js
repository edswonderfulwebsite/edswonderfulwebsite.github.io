const keys = {};
addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

const player = {
  x: 5,
  y: 5,
  size: 1,          // square
  vx: 0,
  vy: 0,

  dashing: false,
  dashTime: 0,

  wallSide: 0,
  wallLock: 0,      // prevents wall climb abuse

  crouching: false,
  crouchOffset: 0
};

/* ================= CONSTANTS ================= */
const GRAVITY = 40;
const MOVE_ACCEL = 70;
const MAX_SPEED = 10;
const JUMP_FORCE = 15;

const DASH_SPEED = 20;
const DASH_DURATION = 0.12;

const WALL_JUMP_X = 12;
const WALL_JUMP_Y = 14;
const WALL_LOCK_TIME = 0.2;

const FRICTION = 0.82;

/* ================= UPDATE ================= */
function updatePlayer(dt, effects) {

  /* --- Crouch (top shrinks) --- */
  const wasCrouching = player.crouching;
  player.crouching = keys.s;

  if (player.crouching && !wasCrouching) {
    player.crouchOffset = 0.4;
    player.y += 0.4;
  }
  if (!player.crouching && wasCrouching) {
    player.y -= 0.4;
    player.crouchOffset = 0;
  }

  const size = player.size - player.crouchOffset;

  /* --- Dash input (arrow keys, cancellable) --- */
  const dx =
    (keys.arrowright ? 1 : 0) -
    (keys.arrowleft ? 1 : 0);
  const dy =
    (keys.arrowdown ? 1 : 0) -
    (keys.arrowup ? 1 : 0);

  if (dx || dy) {
    const mag = Math.hypot(dx, dy);
    player.vx = (dx / mag) * DASH_SPEED;
    player.vy = (dy / mag) * DASH_SPEED;
    player.dashing = true;
    player.dashTime = DASH_DURATION;
    effects.shake(4);
  }

  /* --- Dash movement --- */
  if (player.dashing) {
    player.dashTime -= dt;
    if (player.dashTime <= 0) {
      player.dashing = false;
    }
  } else {
    /* --- Normal movement --- */
    if (keys.a) player.vx -= MOVE_ACCEL * dt;
    if (keys.d) player.vx += MOVE_ACCEL * dt;

    player.vx *= FRICTION;
    player.vy += GRAVITY * dt;

    player.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, player.vx));
  }

  /* --- Jump / Wall Jump --- */
  if (keys[" "] && !player.dashing) {
    if (groundCollision(player, size)) {
      player.vy = -JUMP_FORCE;
    } else if (player.wallSide !== 0 && player.wallLock <= 0) {
      player.vx = -player.wallSide * WALL_JUMP_X;
      player.vy = -WALL_JUMP_Y;
      player.wallLock = WALL_LOCK_TIME;
      effects.shake(5);
    }
  }

  /* --- Move X --- */
  player.x += player.vx * dt;
  if (wallCollision(player, size)) {
    if (player.dashing) {
      player.vx *= -0.6;
      player.vy *= 0.4;
      player.dashing = false;
      effects.shake(8);
    } else {
      player.vx = 0;
    }
  }

  /* --- Move Y --- */
  player.y += player.vy * dt;
  if (groundCollision(player, size)) {
    player.vy = 0;
    player.dashing = false;
  }

  player.wallLock -= dt;
}

/* ================= DRAW ================= */
function drawPlayer(ctx, camX, camY) {
  ctx.fillStyle =
    player.dashing ? "#6be6ff" :
    player.wallSide !== 0 ? "#ffd166" :
    "#ff6b6b";

  const drawSize = player.size - player.crouchOffset;

  ctx.fillRect(
    player.x * TILE - camX,
    player.y * TILE - camY,
    drawSize * TILE,
    drawSize * TILE
  );
}
