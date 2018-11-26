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

        if (row < 0 || row > 2  || col < 0 || col > 2 ||
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
        super(board,'strangerFace.png', 'Stranger');
        
    }
    
    handleGameLoop() {
        if (this.board) {
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
        this.boardSize = 3;
        this.activeMarker; // variable exists, but value is undefined
        this.emptySquareSymbol = '-';
        this.dataModel = [];
        for (let row = 0; row < this.boardSize; row = row + 1) {
            this.dataModel[row] = [];
            for (let col = 0; col < this.boardSize; col = col + 1) {
                this.dataModel[row][col] = this.emptySquareSymbol;
            }
        }
    }

    takeTurns() {
        //this.activeMarker = new PrincessMarker(this);
        if (!this.activeMarker){
            
        }
    }

    debugBoard() {
        let moveCount = 0;
        
        let boardString = '\n';
        for (let row = 0; row < this.boardSize; row = row + 1) {
            for (let col = 0; col < this.boardSize; col = col + 1) {
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
