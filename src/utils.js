class Utils {

  static BLOCK_SIZE = (screen.width > 420) ? 30 : 15;
  static COLS = 12;
  static ROWS = 20;
  static CANVAS_WIDTH = this.BLOCK_SIZE * this.COLS;
  static CANVAS_HEIGHT = this.BLOCK_SIZE * this.ROWS;
  static ROW_SCORE = 10;
  static COLORS = [
    '#242424',  // empty cell
    '#ffc6ff',  // I figure
    '#bdb2ff',  // J figure
    '#a0c4ff',  // L figure
    '#9bf6ff',  // O figure
    '#caffbf',  // S figure
    '#ffd6a5',  // T figure
    '#ffadad'   // Z figure
  ];
  static SHAPES = [
    [],
    [ // I figure
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [ // J figure
      [2, 0, 0],
      [2, 2, 2],
      [0, 0, 0]
    ],
    [ // L figure
      [0, 0, 3],
      [3, 3, 3],
      [0, 0, 0]
    ],
    [ // 0 figure
      [4, 4],
      [4, 4]
    ],
    [ // S figure
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0]
    ],
    [ // T figure
      [0, 6, 0],
      [6, 6, 6],
      [0, 0, 0]
    ],
    [ // Z figure
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0]
    ]
  ];


  /**
  * Displays an alert box indicating the game controls.
  */
  static controlAlert() {
    return swal({ // SweetAlert function
      title: 'controles',
      content: {
        element: 'div',
        attributes: {
          innerHTML: `
            <ul class="list-group">
              <li class="list-group-item"><kbd>P</kbd> Pausar o reanudar</li>
              <li class="list-group-item"><kbd>↑</kbd> Rotar</li>
              <li class="list-group-item"><kbd>←</kbd> <kbd>↓</kbd> <kbd>→</kbd> Mover figuras</li>
              <li class="list-group-item">También podemos utilizar los botones para jugar en el móvil</li>
            </ul>
          `
        }
      },
      button: 'Aceptar'
    });
  }


  /**
   * Displays an alert box indicating thet the game is over.
   */
  static lostGameAlert() {
    return swal('juego terminado', 'Inténtalo de nuevo');
  }
}

export default Utils;