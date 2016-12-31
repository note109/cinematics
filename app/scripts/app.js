let ctx = null;

$(() => {
  const canvas = document.getElementById('stage');
  ctx = canvas.getContext('2d');

  const segment = new Segment(100, 50, 100, 20);
  console.log(segment.getPin());
});

/**
  Create segment
*/
class Segment {
  /**
    Initialize parameters
    @param {number} x
    @param {number} y
    @param {number} width
    @param {number} height
    @param {string} color
  */
  constructor(x, y, width, height, color = '#fff') {
    this.x = x;
    this.y = y;
    this.rotation = 0;
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

  /**
    Get pin center position.
    @return {object} {x, y} for pin right side.
  */
  getPin() {
    const angle = this.rotation * Math.PI / 180;
    const x = this.x + Math.cos(angle) * this.width;
    const y = this.y + Math.sin(angle) * this.width;

    return {x, y};
  }
}

