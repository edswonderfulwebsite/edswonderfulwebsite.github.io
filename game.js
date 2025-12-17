const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener("resize", resize);
resize();

/* -------------------------
   INPUT
-------------------------- */
const keys = {};
addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

/* -------------------------
   LEVEL (simple test map)
-------------------------- */
const TILE = 32;
const level = [
  "########################",
  "#......................#",
  "#......................#",
  "#..........###.........#",
  "#......................#",
  "#.....###..............#",
  "#......................#",
  "#..................###.#",
  "#......................#",
  "########################"
];

const SOLID = "#";

/* -------------------------
   PLAYER
-------------------------- */
const player = {
  x: 2,
  y: 7,
  w: 0.8,
  h: 0.8,
  vx: 0,
  vy: 0,
  onGround: false,
  canDash: true,
  dashTime: 0
};

/* -------------------------
   PHYSICS CONSTANTS
-------------------------- */
const GRAVITY = 35;
const MOVE_ACCEL = 60;
const MAX_SPEED = 10;
const JUMP_FORCE = 14;
const DASH_SPEED = 18;
const DASH_DURATION = 0.12;

/* -------------------------
   COLLISION
-------------------------- */
function solid(tx, ty) {
  return level[ty]?.[tx] === SOLID;
}

function collide(px, py) {
  const left   = Math.floor(px);
  const right  = Math.floor(px + player.w);
  const top    = Math.floor(py);
  const bottom = Math.floor(py + player.h);

  for (let y = top; y <= bottom; y++)
    for (let x = left; x <= right; x++)
      if (solid(x, y)) return true;

  return false;
}

/* -------------------------
   UPDATE
-------------------------- */
function update(dt) {
  // Horizontal movement
  if (keys.a) player.vx -= MOVE_ACCEL * dt;
  if (keys.d) player.vx += MOVE_ACCEL * dt;

  player.vx *= 0.85;
  player.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, player.vx));

  // Gravity
  if (player.dashTime <= 0)
    player.vy += GRAVITY * dt;

  // Jump
  if (keys.w && player.onGround) {
    player.vy = -JUMP_FORCE;
    player.onGround = false;
  }

  // Dash
  if (keys[" "] && player.canDash) {
    const dx = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    const dy = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
    if (dx || dy) {
      const mag = Math.hypot(dx, dy);
      player.vx = (dx / mag) * DASH_SPEED;
      player.vy = (dy / mag) * DASH_SPEED;
      player.dashTime = DASH_DURATION;
      player.canDash = false;
    }
  }

  if (player.dashTime > 0)
    player.dashTime -= dt;

  // X axis
  player.x += player.vx * dt;
  if (collide(player.x, player.y)) {
    player.x -= player.vx * dt;
    player.vx = 0;
  }

  // Y axis
  player.y += player.vy * dt;
  if (collide(player.x, player.y)) {
    player.y -= player.vy * dt;
    if (player.vy > 0) {
      player.onGround = true;
      player.canDash = true;
    }
    player.vy = 0;
  } else {
    player.onGround = false;
  }
}

/* -------------------------
   RENDER
-------------------------- */
function draw() {
  ctx.fillStyle = "#0f1020";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const camX = player.x * TILE - canvas.width / 2;
  const camY = player.y * TILE - canvas.height / 2;

  // Tiles
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      if (level[y][x] === SOLID) {
        ctx.fillStyle = "#3a3a5e";
        ctx.fillRect(
          x * TILE - camX,
          y * TILE - camY,
          TILE,
          TILE
        );
      }
    }
  }

  // Player cube
  ctx.fillStyle = "#ff6b6b";
  ctx.fillRect(
    player.x * TILE - camX,
    player.y * TILE - camY,
    player.w * TILE,
    player.h * TILE
  );
}

/* -------------------------
   GAME LOOP
-------------------------- */
let last = 0;
function loop(t) {
  const dt = Math.min(0.016, (t - last) / 1000);
  last = t;

  update(dt);
  draw();
  requestAnimationFrame(loop);
}

loop(0);
