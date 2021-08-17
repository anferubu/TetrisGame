import Utils from './utils.js';


class Piece {

  /**
   * Set a Tetris figure and its canvas 2d context. Also, set the
   * initial position (x, y) within the canvas.
   * @param {number[][]} shape - matrix corresponding to a figure.
   * @param {CanvasRenderingContext2D} ctx - canvas 2d context.
   */
  constructor(shape, ctx) {
    this.shape = shape;
    this.ctx = ctx;
    this.x = Math.floor(Utils.COLS / 2) - 1;
    this.y = 0;
  }


  /**
   * Draw the piece on the canvas.
   */
  render() {
    this.ctx.strokeStyle = '#2d2d2d';
    this.shape.map((row, i) => {
      row.map((cell, j) => {
        if (cell !== 0) {
          this.ctx.fillStyle = Utils.COLORS[cell];
          this.ctx.fillRect(this.x + j, this.y + i, 1, 1);
          this.ctx.strokeRect(this.x + j, this.y + i, 1, 1);
        }
      });
    });
  }
}


export default Piece;