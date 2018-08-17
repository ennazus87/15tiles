//stops multiple boards being displayed
let scriptAdded = false;

class Board {

    constructor(r, c) {
        this.row = r;
        this.col = c;        
        
        this.gameBoard = new Array(this.row); // array for gameboard
        this.blank = { x: this.col-1, y: this.row-1 } // stores position of blank tile
    }

    createBoardArray() {
        let count = 1;
    
        for (let i = 0; i < this.row; i++) {
            
            this.gameBoard[i] = new Array(this.row)

            for (let j = 0; j < this.col; j++) {
                if (i == this.row-1 && j == this.col-1) {
                    this.gameBoard[i][j] = 0;
                } else {
                    this.gameBoard[i][j] = count;
                } 

                count++;
            }
        }
    }

    renderBoard() {
        let table = document.createElement("table");
        table.id = "game-table";

        for (let i = 0; i < this.row; i++) {
            let tr = document.createElement('tr');
            let tile = this.gameBoard[i];

            for (var j = 0; j < this.col; j++) {
                let td = document.createElement('td');
                td.innerHTML = tile[j]

                if (tile[j] == 0) {
                    td.classList.add('blank');
                    td.id = 'blank'
                } else {
                    td.classList.add('tile');
                    td.id = 'tile-' + tile[j];
                }

                tr.appendChild(td);  
            }
            
            table.appendChild(tr);
        }
        
        if(scriptAdded == false) {
            document.getElementById('container').appendChild(table);
            scriptAdded = true;
        }
    }

    moveRight() {
        if (this.blank.x !== 0) {
            const temp = this.gameBoard[this.blank.y][this.blank.x-1] // store the value of the tile the blank is being swapped with

            this.gameBoard[this.blank.y][this.blank.x-1] = 0; // make the tile the new blank
            this.gameBoard[this.blank.y][this.blank.x] = temp; // make the blank the tile the other tile

            this.blank = { x: this.blank.x-1, y: this.blank.y } // update the position of the blank
        }
    }

    moveLeft() {
        if (this.blank.x !== this.col-1) {
            const temp = this.gameBoard[this.blank.y][this.blank.x+1] // store the value of the tile the blank is being swapped with

            this.gameBoard[this.blank.y][this.blank.x+1] = 0; // make the tile the new blank
            this.gameBoard[this.blank.y][this.blank.x] = temp; // make the blank the tile the other tile

            this.blank = { x: this.blank.x+1, y: this.blank.y } // update the position of the blank
        }

    }

    moveDown() {
        if (this.blank.y !== 0) {
            const temp = this.gameBoard[this.blank.y-1][this.blank.x] // store the value of the tile the blank is being swapped with

            this.gameBoard[this.blank.y-1][this.blank.x] = 0; // make the tile the new blank
            this.gameBoard[this.blank.y][this.blank.x] = temp; // make the blank the tile the other tile

            this.blank = { x: this.blank.x, y: this.blank.y-1 } // update the position of the blank
        }

    }

    moveUp() {
        if (this.blank.y !== this.row-1) {
            const temp = this.gameBoard[this.blank.y+1][this.blank.x] // store the value of the tile the blank is being swapped with

            this.gameBoard[this.blank.y+1][this.blank.x] = 0; // make the tile the new blank
            this.gameBoard[this.blank.y][this.blank.x] = temp; // make the blank the tile the other tile

            this.blank = { x: this.blank.x, y: this.blank.y+1 } // update the position of the blank
        }
        
    }

    resetScript() {
        scriptAdded = false;
        this.renderBoard()
    }

    shuffle() {
        for (let i = 0; i < 2500; i++) {
            let randomInt = Math.floor(Math.random() * 4) + 1 ; 

            switch (randomInt) {
                case 1:
                    this.moveLeft();
                    break;
                case 2:
                    this.moveUp();
                    break;
                case 3:
                    this.moveRight();
                    break;
                case 4:
                    this.moveDown();
                    break;
            }
        }
    }

    validate() {
        let board = new Array();
        let winner = new Array();

        for (let i = 0; i < this.gameBoard.length; i++) {
            for (let j = 0; j < this.gameBoard[i].length; j++) {           
                board.push(this.gameBoard[i][j])
            }
        }

        winner = board.slice(0)
        winner.sort(function(a, b) {
            return a - b;
          });

        winner = winner.filter(function(e) { return e !== 0 })
        winner.push(0)

        console.log('board: ' + board);
        console.log('winner: ' + winner);

        if (board.length === winner.length && board.every((value, index) => value === winner[index])) {
            console.log("winner winner chicken dinner")
        } else {
            console.log("not a winner")
        }
    }
}
