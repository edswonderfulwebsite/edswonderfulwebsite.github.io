let last = performance.now();

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;

  updatePlayer(dt);
  render();

  requestAnimationFrame(loop);
}

loop(last);
