(function () {
  var canvas = document.getElementById("sweep");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w, h, cx, cy, radius, angle = -Math.PI / 2;

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w * 0.78;
    cy = h * 0.42;
    radius = Math.max(w, h) * 0.55;
  }

  function ring(r, alpha) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(122, 139, 153, " + alpha + ")";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawStatic() {
    ctx.clearRect(0, 0, w, h);
    ring(radius * 0.28, 0.28);
    ring(radius * 0.56, 0.2);
    ring(radius * 0.84, 0.13);
    var gx = cx + Math.cos(angle) * radius;
    var gy = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(gx, gy);
    ctx.strokeStyle = "rgba(122, 139, 153, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    ring(radius * 0.28, 0.22);
    ring(radius * 0.56, 0.15);
    ring(radius * 0.84, 0.1);

    var sweepWidth = 0.9;
    var grad = ctx.createConicGradient
      ? ctx.createConicGradient(angle - sweepWidth, cx, cy)
      : null;

    if (grad) {
      grad.addColorStop(0, "rgba(122, 139, 153, 0)");
      grad.addColorStop(1, "rgba(122, 139, 153, 0.22)");
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle - sweepWidth, angle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    var gx = cx + Math.cos(angle) * radius;
    var gy = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(gx, gy);
    ctx.strokeStyle = "rgba(122, 139, 153, 0.65)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    angle += 0.008;
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);

  if (reduceMotion) {
    drawStatic();
  } else {
    requestAnimationFrame(frame);
  }
})();
