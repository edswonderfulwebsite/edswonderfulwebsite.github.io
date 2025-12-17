const TILE = 32;

// Simple test geometry
const groundY = 12;
const wallX = 15;

function groundCollision(player) {
  if (player.y + player.h >= groundY) {
    player.y = groundY - player.h;
    return true;
  }
  return false;
}

function wallCollision(player) {
  if (player.x + player.w >= wallX) {
    player.x = wallX - player.w;
    player.wallSide = 1;
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

function drawLevel(ctx, camX, camY) {
  ctx.fillStyle = "#2d334d";

  // Ground
  ctx.fillRect(-camX, groundY * TILE - camY, 2000, TILE);

  // Wall
  ctx.fillRect(wallX * TILE - camX, 0, TILE, 2000);
}
