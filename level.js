const TILE = 32;
const groundY = 12;
const wallX = 15;

function groundCollision(player, size) {
  if (player.y + size >= groundY) {
    player.y = groundY - size;
    return true;
  }
  return false;
}

function wallCollision(player, size) {
  if (player.x + size >= wallX) {
    player.x = wallX - size;
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
