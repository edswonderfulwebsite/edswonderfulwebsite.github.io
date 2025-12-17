const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener("resize", resize);
resize();

/* ================= INPUT ================= */
const keys = {};
addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

/* ================= WORLD ================= */
const TILE = 32;
const groundY = 12;
const wallX = 15;

/* ================= CAMERA ================= */
let shake = 0;
function addShake(v) {
  shake = Math.min(shake + v, 12);
}

/* ================= PLAYER ================= */
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
  wallSide: 0 // -1 = left, 1 = right
};

/* ================= CONSTANTS ================= */
const GRAVITY = 40;
const MOVE_ACCEL = 70;
const MAX_SPEED = 10;
const JUMP_FORCE = 15;
const WALL_JUMP_X = 12;
const WALL_JUMP_Y = 14;
const DASH_SPEED = 22;
const FRICTION = 0.82;
const WALL_SLIDE_SPEED = 3;

/* ================= PARTICLES ================= */
const particles = [];

function spawnParticles(x, y, count, color) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      life: 20,
      color
    });
  }
}

/* ================= COLLISION ================= */
function groundCollision() {
  if (player.y + player.h >= groundY) {
    if (player.vy > 8) addShake(6);
    player.y = groundY - player.h;
    player.vy = 0;
    player.dashing = false;
    player.wallSliding = false;
    return true;
  }
  return false;
}

function wallCollision() {
  if (player.x + player.w >= wallX) {
    player.x = wallX - player.w;
    player.wallSide = 1;

    if (player.dashing) {
      player.vx *= -0.6;
      player.vy *= 0.4;
      addShake(8);
      spawnParticles(wallX, player.y + 0.5, 12, "#ff6b6b");
      player.dashing = false;
    } else {
      player.vx = 0;
    }
    return true;
  }

  if (player.x <= 0) {
    player.x = 0;
    player.wallSide = -1;
    return true;
  }

  player.wallSide = 0;
  return false;
}

/* ================= UPDATE ================= */
function update(dt) {

  /* --- Crouch --- */
  player.crouching = keys.s;
  player.h = player.crouching ? 0.6 : 1;

  /* --- Horizontal Movement --- */
  if (!player.dashing && !player.wallSliding) {
    if (keys.a) player.vx -= MOVE_ACCEL * dt;
    if (keys.d) player.vx += MOVE_ACCEL * dt;
    player.vx *= FRICTION;
    player.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, player.vx));
  }

  /* --- Gravity --- */
  if (!player.dashing)
    player.vy += GRAVITY * dt;

  /* --- Wall Slide --- */
  player.wallSliding =
    player.wallSide !== 0 &&
    player.vy > 0 &&
    !groundCollision() &&
    ((player.wallSide === 1 && keys.d) ||
     (player.wallSide === -1 && keys.a));

  if (player.wallSliding) {
    player.vy = Math.min(player.vy, WALL_SLIDE_SPEED);
  }

  /* --- Jump & Wall Jump --- */
  if (keys[" "]) {
    if (groundCollision()) {
      player.vy = -JUMP_FORCE;
    } else if (player.wallSliding) {
      player.vy = -WALL_JUMP_Y;
      player.vx = -player.wallSide * WALL_JUMP_X;
      player.wallSliding = false;
      addShake(5);
      spawnParticles(player.x + 0.4, player.y + 0.5, 10, "#ffd166");
    }
  }

  /* --- Dash (Arrow Keys, Infinite) --- */
  const dx = (keys.arrowright ? 1 : 0) - (keys.arrowleft ? 1 : 0);
  const dy = (keys.arrowdown ? 1 : 0) - (keys.arrowup ? 1 : 0);

  if ((dx || dy) && !player.dashing) {
    const mag = Math.hypot(dx, dy);
    player.vx = (dx / mag) * DASH_SPEED;
    player.vy = (dy / mag) * DASH_SPEED;
    player.dashing = true;
    addShake(4);
    spawnParticles(player.x + 0.4, player.y + 0.5, 14, "#6be6ff");
  }

  /* --- Movement --- */
  player.x += player.vx * dt;
  wallCollision();

  player.y += player.vy * dt;
  groundCollision();

  /* --- Dash decay --- */
  if (player.dashing) {
    player.vx *= 0.98;
    player.vy *= 0.98;
    if (Math.abs(player.vx) < 3 && Math.abs(player.vy) < 3)
      player.dashing = false;
  }

  /* --- Particles --- */
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 20 * dt;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }

  /* --- Camera shake decay --- */
  shake *= 0.85;
}

/* ================= DRAW ================= */
function draw() {
  ctx.fillStyle = "#0b0e14";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const offsetX = (Math.random() - 0.5) * shake;
  const offsetY = (Math.random() - 0.5) * shake;

  const camX = player.x * TILE - canvas.width / 2 + offsetX;
  const camY = player.y * TILE - canvas.height / 2 + offsetY;

  /* Ground */
  ctx.fillStyle = "#2d334d";
  ctx.fillRect(-camX, groundY * TILE - camY, 2000, TILE);

  /* Wall */
  ctx.fillRect(wallX * TILE - camX, 0, TILE, 2000);

  /* Particles */
  for (const p of particles) {
    ctx.fillStyle = p.color;
    ctx.fillRect(
      p.x * TILE - camX,
      p.y * TILE - camY,
      4, 4
    );
  }

  /* Player */
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

/* ================= LOOP ================= */
let last = 0;
function loop(t) {
  const dt = Math.min(0.016, (t - last) / 1000);
  last = t;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}
loop(0);
