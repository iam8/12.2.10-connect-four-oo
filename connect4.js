/* Ioana Alex Mititean */
/* 10/27/22 */
/* Exercise 12.2.10: Connect Four OO */

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

/** Class representing a game of Connect Four. */
class Game {

    constructor(height, width, player1, player2) {

        this.isGameActive = true;

        this.HEIGHT = height;
        this.WIDTH = width;

        this.players = [player1, player2];
        this.currPlayer = player1; // Active player

        this.board = []; // Array of rows. Each row is an array of cells: board[y][x]

        this.makeBoard();
        this.makeHtmlBoard();
    }

    /** makeBoard: Create in-JS board structure:
     *   board = array of rows, each row is array of cells  (board[y][x])
     */
    makeBoard() {

        for (let y = 0; y < this.HEIGHT; y++) {
            this.board.push(Array.from({ length: this.WIDTH }));
        }
    }

    /** makeHtmlBoard: Make HTML table and row of column tops. */
    makeHtmlBoard() {

        const board = document.getElementById('board');
        board.innerHTML = "";

        // Make column tops (clickable area for adding a piece to that column)
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        top.addEventListener('click', this.handleClick.bind(this));

        for (let x = 0; x < this.WIDTH; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            top.append(headCell);
        }

        board.append(top);

        // Make main part of board
        for (let y = 0; y < this.HEIGHT; y++) {
            const row = document.createElement('tr');

            for (let x = 0; x < this.WIDTH; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }

            board.append(row);

        }
    }

    /** findSpotForCol: Given column x, return top empty y (null if filled). */
    findSpotForCol(x) {

        for (let y = this.HEIGHT - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
        }

        return null;
    }

    /** placeInTable: Update DOM to place piece into HTML table of board. */
    placeInTable(y, x) {

        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.top = -50 * (y + 2);
        piece.style.backgroundColor = this.currPlayer.color;

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    /** endGame: Announce game end. */
    endGame(msg) {

        alert(msg);
    }

    /** handleClick: Handle click of column top to play piece. Ignore clicks if game is not active.*/
    handleClick(evt) {

        if (!this.isGameActive) {
            return;
        }

        // Get x from ID of clicked cell
        const x = +evt.target.id;

        // Get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
            return;
        }

        // Place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);

        // Check for win
        if (this.checkForWin()) {
            this.isGameActive = false;
            return this.endGame(`Player ${this.currPlayer.color} won!`);
        }

        // Check for tie
        if (this.board.every(row => row.every(cell => cell))) {
            this.isGameActive = false;
            return this.endGame('Tie!');
        }

        // Switch players
        this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }

    /** checkForWin: check board cell-by-cell for "does a win start here?" */
    checkForWin() {

        const _win = (cells) => {

        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - Returns true if all are legal coordinates & all match currPlayer
            return cells.every(
            ([y, x]) =>
                y >= 0 &&
                y < this.HEIGHT &&
                x >= 0 &&
                x < this.WIDTH &&
                this.board[y][x] === this.currPlayer
            );
        }

        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
                // Get "check list" of 4 cells (starting here) for each of the different ways to win
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

                // Find winner (only checking each win-possibility as needed)
                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                }
            }
        }
    }
}

/** Class Player: Represents a Connect Four game player. */
class Player {

    constructor(color) {
        this.color = color;
    }
}

// Handling clicks to the start/reset game button and retrieving color inputs
const resetBtn = document.querySelector("#reset-button");
const colorInput1 = document.querySelector("#color1");
const colorInput2 = document.querySelector("#color2");

resetBtn.addEventListener("click", (event) => {

    event.preventDefault();

    const p1 = new Player(colorInput1.value);
    const p2 = new Player(colorInput2.value);
    new Game(6, 7, p1, p2);
})
