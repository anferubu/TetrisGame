import Utils from './utils.js';
import Piece from './piece.js';


class Game {

  /**
   * Set the canvas context and create an matrix of equivalent
   * numbers. Also, set 'fallingPiece' as null.
   * @param {CanvasRenderingContext2D} ctx - canvas 2d context.
   */
  constructor(ctx) {
    this.ctx = ctx;
    this.fallingPiece = null;
    this.grid = this.makeGrid();
    this.score = 0;
    this.paused = false;
    this.fullRowSound = new Audio('../assets/fullRowSound.wav');
    this.gameOverSound = new Audio('../assets/gameOver.wav');
  }


  /**
   * Returns a matrix full of zeros that corresponds to the
   * initial game board. Each zero equals one block on the board.
   * @returns {number[][]}
   */
  makeGrid() {
    let grid = [];
    for (let y = 0; y < Utils.ROWS; y++) {
      grid.push([]);
      for (let x = 0; x < Utils.COLS; x++) {
        grid[grid.length - 1].push(0);
      }
    }
    return grid;
  }


  /**
   * Check if the current piece collides with the other pieces
   * below or with the sides of the board in the point (x, y).
   * @param {number} x - coordinate x in the grid.
   * @param {number} y - coordinate y in the grid.
   * @param {number[][]} figure - matrix corresponding to a piece.
   * @returns {boolean} - true if the piece collides in P(x, y).
   */
  collision(x, y, figure=null) {
    const shape = figure || this.fallingPiece.shape;
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape.length; j++) {
        if (shape[i][j] !== 0) {
          let newGridX = x + j;
          let newGridY = y + i;
          // It collides if the new position is within the grid and is non-zero
          if (newGridX >= 0 && newGridX < Utils.COLS && newGridY < Utils.ROWS) {
            if (this.grid[newGridY][newGridX] !== 0) {
              return true;
            }
          }
          // It collides with the edges if the new position is outside the grid
          else {
            return true;
          }
        }
      }
    }
    return false;
  }


  /**
   * Draw the board together with the pieces.
   */
  renderBoard() {
    this.ctx.strokeStyle = '#2d2d2d';
    this.grid.map((row, i) => {
      row.map((cell, j) => {
        this.ctx.fillStyle = Utils.COLORS[cell];
        this.ctx.fillRect(j, i, 1, 1);
        this.ctx.strokeRect(j, i, 1, 1);
        }
      );
    });
    if (this.fallingPiece !== null) {
      this.fallingPiece.render();
    }
  }


  /**
   * Move current piece to down. Also check game over if the piece after
   * collides while going down, its Y position is zero.
   */
  async moveDown() {
    if (this.fallingPiece === null) {
      this.renderBoard();
      return;
    }
    else if (this.collision(this.fallingPiece.x, this.fallingPiece.y + 1)) {
      const shape = this.fallingPiece.shape;
      const x = this.fallingPiece.x;
      const y = this.fallingPiece.y;
      shape.map((row, i) => {
        row.map((cell, j) => {
          let newGridX = x + j;
          let newGridY = y + i;
          if (newGridX >= 0 && newGridX < Utils.COLS &&
          newGridY < Utils.ROWS && cell !== 0) {
            this.grid[newGridY][newGridX] = shape[i][j];
          }
        });
      });
      // Check game over
      if (this.fallingPiece.y === 0) {
        this.gameOverSound.play();
        await Utils.lostGameAlert();
        this.score = 0;
        this.grid = this.makeGrid();
      }
      this.fallingPiece = null;
    }
    else {
      this.fallingPiece.y += 1;
    }
    this.renderBoard();
  }


  /**
   * Move current piece to right or to left.
   * @param {boolean} toRight - true if the figure move to right
   */
  move(toRight) {
    if (this.fallingPiece === null) {
      return;
    }
    let x = this.fallingPiece.x;
    let y = this.fallingPiece.y;
    // Move to right
    if (toRight) {
      if (!this.collision(x+1, y)) {
        this.fallingPiece.x += 1;
      }
    }
    // Move to left
    else {
      if (!this.collision(x-1, y)) {
        this.fallingPiece.x -= 1;
      }
    }
    this.renderBoard();
  }


  /**
   * A copy of the matrix corresponding to the figure is created.
   * It is transposed and then the order of the rows is reversed.
   * If the new position does not collide, the figure rotates.
   */
  rotate() {
    if (this.fallingPiece !== null) {
      let shape = [...this.fallingPiece.shape.map((row) => [...row])];
      // Transpose the matrix
      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < i; j++) {
          [shape[i][j], shape[j][i]] = [shape[j][i], shape[i][j]];
        }
      }
      // Reverse order of rows
      for (let row of shape) {
        row.reverse();
      }
      if (!this.collision(this.fallingPiece.x, this.fallingPiece.y, shape)) {
        this.fallingPiece.shape = shape;
      }
      this.renderBoard();
    }
  }


  /**
   * Change the value of this.paused and hide the pause button and
   * show the resume button.
   * @param {object} btnStart - Resume button.
   * @param {object} btnPause - Pause button.
   */
  pause(btnStart=null, btnPause=null) {
    this.paused = true;
    btnStart.hidden = false;
    btnPause.hidden = true;
  }


  /**
   * Change the value of this.paused and hide the pause button and
   * show the resume button.
   * @param {object} btnStart - Resume button.
   * @param {object} btnPause - Pause button.
   */
  resume(btnStart=null, btnPause=null) {
    this.paused = false;
    btnStart.hidden = true;
    btnPause.hidden = false;
  }


  /**
   * Pause the game if it is active, or resume it if it is paused.
   * @param {object} btnStart - Resume button.
   * @param {object} btnPause - Pause button.
   */
  pauseOrResume(btnStart=null, btnPause=null) {
    if (this.paused) {
      this.resume(btnStart, btnPause);
    } else {
      this.pause(btnStart, btnPause);
    }
  }


  /**
   * Displays an alert box asking if you want to restart the game.
   * 'No' is null, and 'Si' is true.
   * @param {object} btnStart - Resume button.
   * @param {object} btnPause - Pause button.
   */
   async confirmReset(btnStart=null, btnPause=null, ctx) {
    this.pause(btnStart, btnPause);
    let option = await swal('¿Quieres reiniciar el juego?', {
      buttons: ['No', 'Si'],
      dangerMode: true
    });
    if (option) {
      this.reset(ctx);
    } else {
      this.resume(btnStart, btnPause);
    }
  }


  /**
   * Reset the game. To do this, create the board grid again with
   * a new random figure and set the score to zero.
   * @param {CanvasRenderingContext2D} ctx - canvas 2d context.
   */
  reset(ctx) {
    let random = Math.round(Math.random() * 6) + 1;  // 7 pieces
    let newPiece = new Piece(Utils.SHAPES[random], ctx);
    this.score = 0;
    this.paused = false;
    this.grid = this.makeGrid();
    this.fallingPiece = newPiece;
    this.renderBoard();
  }


  /**
   * Displays an alert box indicating the game control buttons.
   * @param {object} btnStart - Resume button.
   * @param {object} btnPause - Pause button.
   */
  async showControls(btnStart=null, btnPause=null) {
    this.pause(btnStart, btnPause);
    let accept = await Utils.controlAlert();
    if (accept) {
      this.resume(btnStart, btnPause);
    }
  }


  /**
  * Delete full rows, selected a random piece and move it to down.
  * @param {object} scoreLabel - Score HTML tag.
  * @param {CanvasRenderingContext2D} ctx - canvas 2d context.
  */
  newGameState(scoreLabel, ctx) {
    this.deleteFullRow(scoreLabel);
    if (this.fallingPiece === null) {
      let random = Math.round(Math.random() * 6) + 1;
      let newPiece = new Piece(Utils.SHAPES[random], ctx);
      this.fallingPiece = newPiece;
    }
    this.moveDown();
  }


  /**
  * Iterate the rows of the grid and if any of them are full, increase the
  * score, eliminate the row and add another row full of zeros.
  * @param {object} scoreLabel - Score HTML tag.
  */
  async deleteFullRow(scoreLabel) {
    for (let i = 0; i < this.grid.length; i++) {
      if (_isFullRow(this.grid[i])) {
        this.fullRowSound.play();
        this.score += Utils.ROW_SCORE;
        this.grid.splice(i, 1);
        this.grid.unshift(new Array(Utils.COLS).fill(0));
      }
    }
    scoreLabel.textContent = this.score;

    // Check if a row is full
    function _isFullRow(row) {
      for (let cell of row) {
        if (cell === 0) {
          return false;
        }
      }
      return true;
    }
  }
}


export default Game;