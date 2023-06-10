// size of board (n x n)
let size = 3;

let game = {
    board: [],
    moves: 0,
};

/** 
 * Set the game board based on chosen size (3 or 4) by adding cells.
 * @param size is board dimension (n by n)
 */
let initBoard = (size) =>{
    let gameContainer = document.getElementById("game-container");
    for(let i=0;i<size;i++){
        // create div row
        let cellRow = document.createElement("div");
        cellRow.className = "boardRow";
        game.board.push([]);
        for(let j=0;j<size;j++){
            // create and append cells for i-th row
            let cell = document.createElement("div");
            cell.className = "grid-cell";
            cell.addEventListener("click", () => moveHandle(cell,i,j));
            cellRow.appendChild(cell);
            game.board[i].push(null);
        }
        // append row with cells to game container
        gameContainer.appendChild(cellRow);
    }
};


/**
 * On-click function, handles move.
 * @param cell Indvidiual box to mark X/O
 * @param row Row of box/cell (starting at 0)
 * @param column Column of box/cell (starting at 0)
 */
let moveHandle = (cell, row, column) => {
    console.log(`Clicked cell ${cell} at row ${row} column ${column}.`);
    let turnIndicator = document.querySelector('.turn-indicator');
    if(cell.innerHTML==="" && !checkWin() && !isBoardFull()){
        // even number of moves means clicked cell should be X and odd is O so mark grid and update turn indicator
        if(game.moves%2==0){
            // mark cell
            cell.innerHTML = "X";
            cell.classList.add("playerX");
            // update game object
            game.moves++;
            game.board[row][column] = 1;
            // console.log(checkWin());
            if(!checkWin() && !isBoardFull()){
                // update indicator
                turnIndicator.innerHTML = "O";
                turnIndicator.classList.remove("playerX");
                turnIndicator.classList.add("playerO");
            }
            else if(checkWin()){
                let announceResult = document.querySelector('.progress-display');
                announceResult.innerHTML = "Winner is Player ";
            }
            else{
                let announceResult = document.querySelector('.progress-display');
                announceResult.innerHTML = "Draw!";
                turnIndicator.innerHTML = "";
            }
        }
        else{
            cell.innerHTML = "O";
            cell.classList.add("playerO");
            game.moves++;
            game.board[row][column] = -1;
            // console.log(checkWin());
            if(!checkWin() && !isBoardFull()){
                turnIndicator.innerHTML = "X";
                turnIndicator.classList.remove("playerO");
                turnIndicator.classList.add("playerX");
            }
            else if(checkWin()){
                let announceResult = document.querySelector('.progress-display');
                announceResult.innerHTML = "Winner is Player ";
            }
            else{
                let announceResult = document.querySelector('.progress-display');
                announceResult.innerHTML = "Draw";
                turnIndicator.innerHTML = "";
            }
        }
    }
};

/**
 * Checks if there is a winner.
 */
let checkWin = () => {
    // check win horizontally
    let horizontalCheck = () => {
        for(let row=0;row<size;row++){
            let sum=0;
            for(let column=0;column<size;column++){
                sum += game.board[row][column];
            }
            // console.log(sum);
            if(sum === size || sum === -size){
                return [true, row];
            }
        }
        return [false,-1];
    };
    // check win vertically
    let verticalCheck = () => {
        // if vertical sum = size, then winner
        for(let column=0;column<size;column++){
            let sum=0;
            for(let row=0;row<size;row++){
                sum += game.board[row][column];
            }
            // console.log(sum);
            if(sum === size || sum === -size){
                return [true, column];
            }
        }
        return [false,-1];
    };
    // check win diagonally
    let diagonalCheck = () => {
        // store into two arrays for both diagonal check
        let firstDiagonal = [];
        let secondDiagonal = [];
        for(let i=0;i<size;i++){
            firstDiagonal.push(game.board[i][i]);
            secondDiagonal.push(game.board[i][size - 1 - i]);
        }
        // check each diagonal array and see if they have same elements that are not null
        // return (firstDiagonal.every(element => element === firstDiagonal[0] && firstDiagonal[0] !== null ) || secondDiagonal.every(element => element === secondDiagonal[0] && secondDiagonal[0] !== null ))
        if(firstDiagonal.every(element => element === firstDiagonal[0] && firstDiagonal[0] !== null )){
            return [true, 1];
        }
        else if(secondDiagonal.every(element => element === secondDiagonal[0] && secondDiagonal[0] !== null )){
            return [true, 2];
        }
        else{
            return [false, -1];
        }
    };

    let grids = document.querySelectorAll('.grid-cell');
    if(verticalCheck()[0]){
        let column = verticalCheck()[1];
        for(let i=0;i<size;i++){
            console.log(column+size*i);
            grids[column+size*i].classList.add("winningCell");
        }
        return true;
    }
    else if(horizontalCheck()[0]){
        // console.log(horizontalCheck()[1]);
        let row = horizontalCheck()[1];
        for(let i=0;i<size;i++){
            console.log(i+row*size);
            grids[i+row*size].classList.add("winningCell");
        }
        return true;
    }
    else if(diagonalCheck()[0]){
        let diagonal = diagonalCheck()[1];
        if(diagonal==1){
            for(let i=0;i<size;i++){
                console.log(i*(size+1));
                grids[i*(size+1)].classList.add("winningCell");
            }
            return true;
        }
        else if(diagonal==2){
            for(let i=0;i<size;i++){
                // console.log((size-1) + i*(size-1));
                grids[(size-1) + i*(size-1)].classList.add("winningCell");
            }
            return true;
        }
    }
    else{
        return false;
    }
    // return diagonalCheck();

};

/**
 * Checks if all cells are taken.
 * @returns true if board is full, false otherwise
 */
let isBoardFull = () => {
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            if(game.board[i][j]==null){
                return false;
            }
        }
    }
    return true;
};

/**
 * Change board size based on user selection
 */
let changeBoard = () => {
    let selectedOption = document.querySelector('#boardSizeSelect').value;
    selectedOption = Number(selectedOption)
    if((size===3 && selectedOption === 3) || (size===4 && selectedOption === 4)){
        console.log("No change.");
    }
    else{
        resetBoard();
        game.board = [];
        size = selectedOption;
        console.log(size);
        destroyBoard();
        initBoard(size);
    }
    
};


/**
 * Reset the game board.
 */
let resetBoard = () => {
    let cells = document.querySelectorAll('.grid-cell');
    let turnIndicator = document.querySelector('.turn-indicator');
    let gameProgress = document.querySelector('.progress-display');
    // reset cells
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove('playerX');
        cell.classList.remove('playerO');
        cell.classList.remove('winningCell');
    });
    gameProgress.innerHTML = "Turn For ";
    turnIndicator.innerHTML = "X";
    turnIndicator.classList.remove("playerO");
    turnIndicator.classList.add("playerX");
    // reset game object
    game.moves = 0;
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            if(game.board[i][j]!=null){
                game.board[i][j] = null;
            }
        }
    }
}

/**
 * Destroy board.
 */
let destroyBoard = () =>{
    let gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = "";
};

initBoard(size);