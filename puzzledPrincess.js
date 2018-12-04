import { game, Sprite } from "../sgc/sgc.js";

game.setBackground("floor.png");

class Marker extends Sprite {
    constructor(board, imageFile, name) {
        super();
        this.setImage(imageFile);
        this.board = board;
        this.name = name;
        this.squareSymbol = this.name.substring(0, 1);
        this.x = this.startX = 150;
        this.y = this.startY = 275;
        this.inBoard = false;
    }

    playInSquare(row, col) {
        this.x = this.board.x + col * 150 + 50;
        this.y = this.board.y + row * 150 + 50;
        this.board.dataModel[row][col] = this.squareSymbol;
        this.board.debugBoard();
        this.inBoard = true;
    }
}

class PrincessMarker extends Marker {
    constructor(board) {
        super(board, 'annFace.png', 'PrincessAnn');
        this.dragging = false;
    }

    handleMouseLeftButtonDown() {
        if (this.inBoard) {
            return;
        }

        this.dragging = true;
    }

    handleMouseLeftButtonUp() {
        if (this.inBoard) {
            return;
        }

        this.dragging = false;
        let row = Math.floor((this.y - this.board.y) / this.board.squareSize);
        let col = Math.floor((this.x - this.board.x) / this.board.squareSize);

        if (row < 0 || row > 2 || col < 0 || col > 2 ||
            this.board.dataModel[row][col] != this.board.emptySquareSymbol) {
            this.x = this.startX;
            this.y = this.startY;
            return;
        }

        this.playInSquare(row, col);
        this.board.takeTurns();
    }


    handleGameLoop() {
        if (this.dragging === true) {
            this.x = game.getMouseX() - this.width / 2;
            this.y = game.getMouseY() - this.height / 2;
        }
    }
}


class StrangerMarker extends Marker {
    constructor(board) {
        super(board, 'strangerFace.png', 'Stranger');

    }

    handleGameLoop() {
        if (this.inBoard) {
            return;
        }
        // Mark a random empty square.
        let row, col;
        do {
            row = Math.round(Math.random() * (this.board.size - 1));
            col = Math.round(Math.random() * (this.board.size - 1));
        } while (this.board.dataModel[row][col] !==
            this.board.emptySquareSymbol);

        this.board.dataModel[row][col] = this.squareSymbol;
        this.playInSquare(row, col);
        this.board.takeTurns();
    }
}


class TicTacToe extends Sprite {
    constructor() {
        super();
        this.name = "Board";
        this.setImage('board.png');
        this.x = 300;
        this.y = 85;
        this.squareSize = 150;
        this.size = 3;
        this.activeMarker; // variable exists, but value is undefined
        this.emptySquareSymbol = '-';
        this.dataModel = [];
        for (let row = 0; row < this.size; row = row + 1) {
            this.dataModel[row] = [];
            for (let col = 0; col < this.size; col = col + 1) {
                this.dataModel[row][col] = this.emptySquareSymbol;
            }
        }
    }

    gameIsWon() {
        // are there three of the same markers diagonally from the upper left
        if (this.dataModel[0][0] === this.dataModel[1][1] &&
            this.dataModel[1][1] === this.dataModel[2][2] &&
            this.dataModel[2][2] !== this.emptySquareSymbol) {
            return true;
        }

        // are there three of the same markers diagonally from the upper right
        if (this.dataModel[0][2] === this.dataModel[1][1] &&
            this.dataModel[1][1] === this.dataModel[2][0] &&
            this.dataModel[2][0] !== this.emptySquareSymbol) {
            return true;
        }

        // are there three of the same markers horizontally
        for (let row = 0; row < 3; row++) {
            if (this.dataModel[row][0] === this.dataModel[row][1] &&
                this.dataModel[row][1] === this.dataModel[row][2] &&
                this.dataModel[row][2] !== this.emptySquareSymbol) {
                return true;
            }
        }

        // are there three of the same markers vertically
        for (let col = 0; col < 3; col++) {
            if (this.dataModel[0][col] === this.dataModel[1][col] &&
                this.dataModel[1][col] === this.dataModel[2][col] &&
                this.dataModel[2][col] !== this.emptySquareSymbol) {
                return true;
            }

        }

        return false;
    }

    gameIsDrawn() {
        for (let row = 0; row !== this.emptySquareSymbol; row = row + 1) {
            for (let col = 0; col !== this.emptySquareSymbol; col = col + 1) {
                if (this.dataModel[row][col] === this.emptySquareSymbol) {
                    return false;
                }
            }
        }

        return true;
    }

    takeTurns() {
        if (!this.activeMarker) {
            if (Math.random() < .5)
                this.activeMarker = new PrincessMarker(this);
            else this.activeMarker = new StrangerMarker(this);
        }

        else if (this.activeMarker instanceof PrincessMarker) {
            // princess has moved; now it's stranger's turn
            this.activeMarker = new StrangerMarker(this);
        }

        else if (this.activeMarker instanceof StrangerMarker) {
            // stranger has moved; now it's princess's turn
            this.activeMarker = new PrincessMarker(this);
        }


    }

    debugBoard() {
        if (this.gameIsWon()) {
            let message = 'Game Over. \n';
            if (this.activeMarker instanceof PrincessMarker) {
                message = message + 'The Princess Wins';
            }
            else if (this.activeMarker instanceof StrangerMarker) {
                message = message + 'The Stranger Wins';
            }
            game.end(message);
            return;
        }

        if (this.gameIsDrawn()) {
            game.end('Game Over \n The Game Ends in a Draw');
            return;
        }

        let moveCount = 0;
        let boardString = '\n';
        for (let row = 0; row < this.size; row = row + 1) {
            for (let col = 0; col < this.size; col = col + 1) {
                boardString = boardString + this.dataModel[row][col] + ' ';
                if (this.dataModel[row][col] !== this.emptySquareSymbol) {
                    moveCount++;
                }
            }
            boardString = boardString + '\n';
        }

        console.log('The Data Model After ' + moveCount + ' Move(s):' + boardString);
    }
}
let theBoard = new TicTacToe();
theBoard.takeTurns();
