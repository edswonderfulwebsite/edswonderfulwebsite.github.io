let last = performance.now();

function loop(now) {
  const dt = (now - last) / 1000;
  last = now;

  updatePlayer(dt);
  render();

  requestAnimationFrame(loop);
}

loop(last);
