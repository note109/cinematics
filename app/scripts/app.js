let ctx = null;

$(() => {
  const canvas = document.getElementById('stage');
  ctx = canvas.getContext('2d');

  const segment = new Segment(100, 50, 100, 20);

  new Stage([segment]);
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
    this.rotation = parseInt($('#slider').val(), 10);
    this.width = width;
    this.height = height;
  }

  /**
    Draw segment
  */
  render() {
    ctx.save();
    this.rotation = parseInt($('#slider').val(), 10);
    ctx.translate(0, 0);
    ctx.rotate(this.rotation * Math.PI / 180);

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

    ctx.restore();
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

/**
  Stage for draw shapes
*/
class Stage {
  /**
    @param {array} contents - instanses of shapes. Each has render() method.
  */
  constructor(contents) {
    this.canvas = document.getElementById('stage');
    this.contents = contents;

    this.init();
  }

  /**
    Initialize canvas and start render.
  */
  init() {
    this.width = $('.wrapper').width();
    this.height = $('.wrapper').height();
    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);

    this.render();
  }

  /**
    Render contents to canvas every animationFrame.
  */
  render() {
    ctx.clearRect(0, 0, this.width, this.height);

    this.contents.forEach((cnt) => {
      cnt.render();
    });
    requestAnimationFrame(::this.render);
  }
}

