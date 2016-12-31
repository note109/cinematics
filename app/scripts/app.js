let ctx = null;

$(() => {
  const canvas = document.getElementById('stage');
  ctx = canvas.getContext('2d');

  new Segment(100, 50);
});

/**
  Create segment
*/
class Segment {
  /**
    Initialize parameters
    @param {number} width
    @param {number} height
    @param {string} color
  */
  constructor(width, height, color = '#fff') {
    this.x = height / 2;
    this.y = height / 2;
    this.width = width;
    this.height = height;

    this.init();
  }

  /**
    Draw segment
  */
  init() {
    ctx.beginPath();

    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();

    const halfHeight = this.height / 2;

    ctx.beginPath();
    ctx.arc(this.x + halfHeight, this.y + halfHeight, 2, 0, Math.PI * 2, true);
    ctx.stroke();

    const rightXPos = this.x + this.width - halfHeight;

    ctx.beginPath();
    ctx.arc(rightXPos, this.y + halfHeight, 2, 0, Math.PI * 2, true);
    ctx.stroke();
  }
}

