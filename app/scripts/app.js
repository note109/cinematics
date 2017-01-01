let ctx;
let stage;

$(() => {
  const canvas = document.getElementById('stage');
  ctx = canvas.getContext('2d');

  const segment = new Segment(100, 50, 100, 20);

  stage = new Stage([segment]);
});

$('#getPin').on('click', (e) => {
  const segment = stage.contents[0];

  console.log(segment.getPin());
});

const getSlider = () => {
  return parseInt($('#slider').val(), 10);
};

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
    this.rotation = getSlider();
    this.width = width;
    this.height = height;
  }

  /**
    Draw segment
  */
  render() {
    ctx.save();

    const halfHeight = this.height / 2;
    ctx.translate(this.x + halfHeight, this.y + halfHeight);

    this.rotation = getSlider();
    ctx.rotate(this.rotation * Math.PI / 180);

    ctx.beginPath();
    ctx.rect(-halfHeight, -halfHeight, this.width, this.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2, true);
    ctx.stroke();

    const rightXPos = this.width - halfHeight * 2;

    ctx.beginPath();
    ctx.arc(rightXPos, 0, 2, 0, Math.PI * 2, true);
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

