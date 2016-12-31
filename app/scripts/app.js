let ctx = null;

$(() => {
  const canvas = document.getElementById("stage");
  ctx = canvas.getContext("2d");

  new Segment(100, 50);
});

class Segment {
  constructor(width, height, color = "#fff") {
    this.x = height / 2;
    this.y = height / 2;
    this.width = width;
    this.height = height;

    this.init();
  }

  init() {
    ctx.beginPath();

    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.x + this.height / 2, this.y + this.height / 2, 2, 0, Math.PI * 2, true);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.x + this.width - this.height / 2, this.y + this.height / 2, 2, 0, Math.PI * 2, true);
    ctx.stroke();
  }
}

