const PI2 = Math.PI * 2;
const TARGET_VELOCITY_THRESHOLD = 0.015;
const SMOOTH_ROTATION_SPEED = 0.05;

const COLORS = [
  "#4b45ab",
  "#554fb8",
  "#605ac7",
  "#2a91a8",
  "#2e9ab2",
  "#32a5bf",
  "#81b144",
  "#85b944",
  "#8fc549",
  "#e0af27",
  "#eeba2a",
  "#fec72e",
  "#bf342d",
  "#ca3931",
  "#d7423a",
];

export class Polygon {
  constructor(x, y, radius, sides, images, fillColor = 'rgba(0, 0, 0, 0)') {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.sides = sides;
    this.rotate = 0;
    this.fillColor = fillColor;
    this.images = images; // Receive images as a parameter
    this.velocity = 0;
    this.targetRotation = 0;
    this.smoothRotation = false;
    this.maxXVertexIndex = -1;
    this.backgroundImage = null;
  }

  getBackgroundImageURL() {
    if (this.maxXVertexIndex >= 0 && this.images && this.images[this.maxXVertexIndex]) {
      return this.images[this.maxXVertexIndex].src;
    }
    return null;
  }

  getVertexAngles() {
    const angles = [];
    const angle = PI2 / this.sides;

    for (let i = 0; i < this.sides; i++) {
      const x = this.radius * Math.cos(angle * i);
      const y = this.radius * Math.sin(angle * i);
      angles.push({ x, y });
    }
    return angles;
  }

  rotatePoint(x, y, angle) {
    return {
      x: x * Math.cos(angle) - y * Math.sin(angle),
      y: x * Math.sin(angle) + y * Math.cos(angle)
    };
  }

  calculateAlignmentRotation() {
    const vertexAngles = this.getVertexAngles();
    const angle = this.rotate;

    const rotatedVertices = vertexAngles.map(vertex => this.rotatePoint(vertex.x, vertex.y, angle));
    
    const maxXVertexData = rotatedVertices.reduce((max, vertex, index) => vertex.x > max.vertex.x ? { vertex, index } : max, { vertex: { x: -Infinity, y: 0 }, index: -1 });

    this.maxXVertexIndex = maxXVertexData.index;

    const angleToAlign = Math.atan2(maxXVertexData.vertex.y, maxXVertexData.vertex.x);

    this.backgroundImage = new Image();
    const bgImageURL = this.getBackgroundImageURL();
    if (bgImageURL) {
      this.backgroundImage.src = bgImageURL;
      this.backgroundImage.onerror = () => {
        console.log('Failed to load background image from URL:', bgImageURL);
      };
    }

    return -angleToAlign;
  }

  animate(ctx, moveX, moveY) {
    ctx.save();

    const angle = PI2 / this.sides;
    const angle2 = PI2 / 4;

    ctx.translate(this.x, this.y);

    const newVelocity = (moveX - moveY) * 0.003;
    this.velocity = newVelocity;

    if (Math.abs(this.velocity) < TARGET_VELOCITY_THRESHOLD) {
      if (!this.smoothRotation) {
        this.smoothRotation = true;
        const alignmentRotation = this.calculateAlignmentRotation();
        this.targetRotation = this.rotate + alignmentRotation;
      }

      const diff = (this.targetRotation - this.rotate) % PI2;
      if (Math.abs(diff) > SMOOTH_ROTATION_SPEED) {
        this.rotate += Math.sign(diff) * SMOOTH_ROTATION_SPEED;
      } else {
        this.rotate = this.targetRotation;
        this.smoothRotation = false;
      }
    } else {
      this.rotate -= this.velocity;
      this.smoothRotation = false;
    }

    ctx.rotate(this.rotate);

    ctx.fillStyle = this.fillColor;
    ctx.beginPath();
    for (let i = 0; i < this.sides; i++) {
      const x = this.radius * Math.cos(angle * i);
      const y = this.radius * Math.sin(angle * i);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.fill();
    ctx.closePath();

    for (let i = 0; i < this.sides; i++) {
      const x = this.radius * Math.cos(angle * i);
      const y = this.radius * Math.sin(angle * i);

      ctx.save();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.translate(x, y);
      ctx.rotate((((360 / this.sides) * i + 45) * Math.PI) / 180);
      ctx.beginPath();

      const squareSize = 260;
      const halfSize = squareSize / 2;

      for (let j = 0; j < 4; j++) {
        const x2 = halfSize * Math.cos(angle2 * j);
        const y2 = halfSize * Math.sin(angle2 * j);
        j === 0 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
      }
      ctx.closePath();

      if (this.images[i % this.images.length]) {
        ctx.clip();
        ctx.rotate(-Math.PI / 4);

        const img = this.images[i % this.images.length];
        const imgAspect = img.width / img.height;
        const boxAspect = squareSize / squareSize;

        let drawWidth, drawHeight;
        if (imgAspect > boxAspect) {
          drawWidth = squareSize * imgAspect;
          drawHeight = squareSize;
        } else {
          drawWidth = squareSize;
          drawHeight = squareSize / imgAspect;
        }

        drawHeight *= 0.7;
        drawWidth *= 0.7;

        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
      } else {
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  
}
  