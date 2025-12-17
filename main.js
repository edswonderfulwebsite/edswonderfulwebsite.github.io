const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener("resize", resize);
resize();

/* Camera shake */
let shake = 0;
const effects = {
  shake(v) {
    shake = Math.min(shake + v, 12);
  }
};

let last = 0;
function loop(t) {
  const dt = Math.min(0.016, (t - last) / 1000);
  last = t;

  updatePlayer(dt, effects);

  shake *= 0.85;
  const camX =
    player.x * TILE - canvas.width / 2 +
    (Math.random() - 0.5) * shake;
  const camY =
    player.y * TILE - canvas.height / 2 +
    (Math.random() - 0.5) * shake;

  ctx.fillStyle = "#0b0e14";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawLevel(ctx, camX, camY);
  drawPlayer(ctx, camX, camY);
  gui.draw(ctx);

  requestAnimationFrame(loop);
}

loop(0);
