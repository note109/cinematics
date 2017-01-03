let ctx;
let stage;

// Init shapes and stage
$(() => {
  const canvas = document.getElementById('stage');
  ctx = canvas.getContext('2d');

  const segment0 = new Segment(180, 120, 50, 15);
  const {x: s0x, y: s0y} = segment0.getPin();
  const segment1 = new Segment(s0x - 10, s0y - 10, 50, 15);

  const segment2 = new Segment(180, 120, 50, 15);
  const {x: s2x, y: s2y} = segment2.getPin();
  const segment3 = new Segment(s2x - 10, s2y - 10, 50, 15);

  stage = new Stage();
  stage.contents = [segment0, segment1, segment2, segment3];
});

// Debugger for position.
$('#stage').on('click', (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  console.log(x, y);
});

// Add button click event.
$('#getBounds').on('click', (e) => {
  const segment = stage.contents[1];

  console.log(segment.getBounds());
});

// Slider value getter.
// const getSlider = (id) => {
//   return parseInt($(`#slider${id}`).val(), 10);
// };

const getId = (() => {
  let id = 0;

  return () => {
    return id++;
  };
})();

let VY = 0;
let VX = 0;

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
    this.vx = 0;
    this.vy = 0;

    this.id = getId();

    this.width = width;
    this.height = height;

    this.rotation = 0;
  }

  /**
    Draw segment
  */
  render() {
    const wall = stage.width + 200;
    if (this.x > stage.width + 100) {
      stage.contents.forEach((cnt) => {
        cnt.x -= wall;
      });
    }

    ctx.save();

    const halfHeight = this.height / 2;
    ctx.translate(this.x + halfHeight, this.y + halfHeight);

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
    Get left side pin position.
    @return {object} {x, y} position of left pin.
  */
  getLeftPin() {
    const halfHeight = this.height / 2;
    const x = this.x + halfHeight;
    const y = this.y + halfHeight;

    return {x, y};
  }

  /**
    Get right side pin position.
    @return {object} {x, y} position of right pin.
  */
  getPin() {
    const {x: leftX, y: leftY} = this.getLeftPin();
    // Sum of pin's horizontal margin is this.height
    const distance = this.width - this.height;
    const angle = this.rotation * Math.PI / 180;
    const x = (leftX + Math.cos(angle) * distance);
    const y = (leftY + Math.sin(angle) * distance);

    return {x, y};
  }

  /**
    Get bottom position of segment.
    @return {object} {bottom}
  */
  getBounds() {
    const leftTopY = this.y;
    const leftBottomY = this.y + Math.sin(90) + this.height;
    const rightTopY = this.y + Math.sin(0) + this.width;
    const rightBottomY = rightTopY + Math.sin(90) + this.height;

    return {
      bottom: Math.max(leftTopY, leftBottomY, rightTopY, rightBottomY),
    };
  }
}

/**
  Stage for draw shapes
*/
class Stage {
  /**
    @param {array} contents - instanses of shapes. Each has render() method.
  */
  constructor(contents = []) {
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
    this.cycle = 0;

    this.render();
  }

  /**
    Render contents to canvas every animationFrame.
  */
  render() {
    ctx.clearRect(0, 0, this.width, this.height);

    this.doVelocity();
    this.walk(this.contents[0], this.contents[1], this.cycle);
    this.walk(this.contents[2], this.contents[3], this.cycle + Math.PI);
    this.cycle += parseFloat($('#cycleSlider').val());
    this.checkFloor(this.contents[1]);
    this.checkFloor(this.contents[3]);

    this.contents.forEach((cnt) => {
      cnt.render();
    });
    requestAnimationFrame(::this.render);
  }

  /**
    Add gravity & forwarding.
  */
  doVelocity() {
    VY += 0.2;

    this.contents.forEach((cnt) => {
      if (cnt.id === 0 || cnt.id === 2) {
        cnt.x += VX;
        cnt.y += VY;
      }
    });
  }

  /**
    @param {Segment} foot foot segment
    @param {Segment} leg leg segment
    @param {number} cycle walk cycle
  */
  walk(foot, leg, cycle) {
    if (!foot || !leg) {
      return;
    }

    const footPosition = foot.getPin();

    const footAngle = Math.sin(cycle) * 45 + 90;
    const legAngle = Math.sin(cycle + Math.PI / 2) * 45 + 45;

    foot.rotation = footAngle;
    leg.rotation = foot.rotation + legAngle;

    leg.x = foot.getPin().x - foot.height / 2;
    leg.y = foot.getPin().y - foot.height / 2;

    leg.vx = foot.getPin().x - footPosition.x; // require - height / 2 ?
    leg.vy = foot.getPin().y - footPosition.y;
  }

  /**
    Check segment reach floor or not.
    @param {Segment} segment
  */
  checkFloor(segment) {
    if (!segment) {
      return;
    }

    const yMax = segment.getBounds().bottom;
    if (yMax > this.height) {
      const dy = yMax - this.height;
      this.contents.forEach((cnt) => {
        cnt.y -= dy;

        VX -= segment.vx;
        VY -= segment.vy;
      });
    }
  }
}

