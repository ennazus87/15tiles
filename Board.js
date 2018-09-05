class Board {
    constructor(r, c) {
        this.row = r;
        this.col = c;        
        
        this.gameBoard = new Array(this.row); // array for gameboard
        this.original = new Array();

        this.blank = { x: this.col-1, y: this.row-1 } // stores position of blank tile

        //stops multiple boards being displayed
        this.scriptAdded = false;
    }

    //creates the 2d array depending on the number of rows/cols that the user has specified
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

    //record original
    //     this.original = Object.assign({}, this.gameBoard)
    //     console.log(this.original)
    }

    //displays board
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
        
        if(this.scriptAdded == false) {
            document.getElementById('container').appendChild(table);
            this.scriptAdded = true;
        }
    }

    //the moves
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

    //avoids the game board from being rendered each time
    resetScript() {
        this.scriptAdded = false;
        this.renderBoard()
        
        let elem = document.getElementById("game-table");
        elem.parentNode.removeChild(elem);
    }

    //to ensure the board CAN be completed, it is first placed in order, then is shuffled
    //this shuffle is optimised to ensure that even really large boards are shuffled. 
    shuffle() {
        let numberOfShuffles = (Math.pow(this.row, 2) * (Math.pow(this.col, 2)));
        console.log(numberOfShuffles);

        //optimising shuffle
        let banned = 3; 
        let randomInt = 3;

        for (let i = 0; i < numberOfShuffles; i++) {
            do {
                randomInt = Math.floor(Math.random() * 4) + 1 ; 
            } while (banned === randomInt || i === 0 && randomInt === 4)

            switch (randomInt) {
                case 1:
                    this.moveLeft();
                    banned = 3;
                    break;
                case 2:
                    this.moveUp();
                    banned = 4;
                    break;
                case 3:
                    this.moveRight();
                    banned = 1;
                    break;
                case 4:
                    this.moveDown();
                    banned = 2
                    break;
            }
        }
    }

    //to know if something is shuffled, it should not still be in it's original position.
    // isShuffled() {
    //     let shuffled = new Array();

    //     // for (let i = 0; i < this.gameBoard.length; i++) {
    //     //     for (let j = 0; j < this.gameBoard[i].length; j++) {           
    //     //         shuffled.push(this.gameBoard[i][j])
    //     //     }
    //     // }

    //     // console.log("o: " + this.original)
    //     console.log("s: " + shuffled);
    // }

    //checks if the board array matches the winning array
    //i.e. if the player is a winner or not. 
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

        // console.log('board: ' + board);
        // console.log('winner: ' + winner);

        if (board.length === winner.length && board.every((value, index) => value === winner[index])) {  
            setTimeout(function() { 
                document.getElementById('game-table').innerHTML = "WELL PLAYED!";
                console.log("winner winner chicken dinner") 
            }, 1000);
        } else {
            console.log("not a winner")
        }
    }
}
