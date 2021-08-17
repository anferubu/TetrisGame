import Game from './game.js';
import Utils from './utils.js';


document.addEventListener('DOMContentLoaded', function() {

  const btnStart = document.querySelector('#btnStart');
  const btnPause = document.querySelector('#btnPause');
  const btnLeft = document.querySelector('#btnLeft');
  const btnDown = document.querySelector('#btnDown');
  const btnRight = document.querySelector('#btnRight');
  const btnRotate = document.querySelector('#btnRotate');
  const btnReset = document.querySelector('#btnReset');
  const scoreLabel = document.querySelector('#score span');
  const canvas = document.querySelector('#canvas');
  const ctx = canvas.getContext('2d');
  const game = new Game(ctx);

  canvas.width = Utils.BLOCK_SIZE * Utils.COLS;
  canvas.height = Utils.BLOCK_SIZE * Utils.ROWS;

  ctx.scale(Utils.BLOCK_SIZE, Utils.BLOCK_SIZE);
  ctx.lineWidth = 0.1;


  game.showControls(btnStart, btnPause);
  mainLoop();

  /**
   * Run the game each 500 ms.
   */
   function mainLoop() {
    setInterval(() => {
      if (!game.paused) {
        game.newGameState(scoreLabel, ctx);
      }
    }, 500);
  }


  document.addEventListener('keydown', (e) => {
    e.preventDefault();
    switch (e.code) {
      case 'ArrowUp': if (!game.paused) game.rotate(); break;
      case 'ArrowRight': if (!game.paused) game.move(true); break;
      case 'ArrowDown': if (!game.paused) game.moveDown(); break;
      case 'ArrowLeft': if (!game.paused) game.move(false); break;
      case 'KeyP': game.pauseOrResume(btnStart, btnPause);
    }
  });
  btnStart.onclick = () => {
    game.resume(btnStart, btnPause);
  }
  btnPause.onclick = () => {
    game.pause(btnStart, btnPause);
  }
  btnLeft.onclick = () => {
    if (!game.paused) game.move(false);
  }
  btnDown.onclick = () => {
    if (!game.paused) game.moveDown();
  }
  btnRight.onclick = () => {
    if (!game.paused) game.move(true);
  }
  btnRotate.onclick = () => {
    if (!game.paused) game.rotate();
  }
  btnReset.onclick = () => {
    game.confirmReset(btnStart, btnPause, ctx);
  }
});
