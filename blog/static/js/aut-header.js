(function () {
  var canvas = document.getElementById('aut-firework');
  if (!canvas) return;
  var height = 140;
  function resize() { canvas.width = canvas.parentElement.offsetWidth; canvas.height = height; }
  resize();
  window.addEventListener('resize', resize);

  var ctx = canvas.getContext('2d', { alpha: true });
  var points = [], on = true, mouse = { x: 0, y: 9999 };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { on = e.isIntersecting; });
    }, { threshold: 0 }).observe(canvas);
  }

  function P(x, y, s, w) {
    this.x = x; this.y = y; this.s = s; this.w = w;
    this.a = Math.random() - 0.1; this.live = true;
  }
  P.prototype.step = function () {
    this.y += this.s;
    if (this.y > canvas.height) this.live = false;
  };
  P.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.w, 0, Math.PI * 2, true);
    ctx.fillStyle = '#fff';
    ctx.save();
    ctx.globalAlpha = this.a;
    ctx.fill();
    ctx.restore();
  };

  function tick() {
    requestAnimationFrame(tick);
    if (!on) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (mouse.y < height && mouse.y > -200) {
      for (var i = 0; i < 5; i++) {
        points.push(new P(mouse.x + Math.random() * 10, mouse.y + Math.random() * 10, 1 + Math.random() * 2, 5));
      }
    }
    for (var j = points.length - 1; j >= 0; j--) {
      var p = points[j];
      if (!p.live) { points.splice(j, 1); continue; }
      p.draw(); p.step();
    }
  }

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) tick();

  document.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
})();
