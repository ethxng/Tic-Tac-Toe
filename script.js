class Player{
    constructor() {
        this.score = 0;
    }

    get getScore(){
        return this.score;
    }
    set updateScore(x){
        // increment before passing new score into the function
        this.score = x;
    }
}

class gameBoard {
    constructor() {
        this.ticTacToe = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        
        // this instance variable will lock the game once it's tied, won, or lost
        // and will unlock again on the next game
        this.done = false;
    }
    get isDone(){
        return this.done;
    }
    set setDoneStatus(status){
        this.done = status;
    }
    tie() {
        // in order to tie, both players must have NOT win AND grid must be full
        if (this.win(1) === false && this.win(2) === false){
            let grid = [...document.querySelectorAll('.grid')];
            for (let i = 0; i < grid.length; i++){
                if (grid[i].textContent.length === 0)
                    return false;
            }
            return true;
        }
        return false;
    }

    win(player){
        //(check player's mark only, ignore opponents)
        let arr = this.ticTacToe;

        // check for diagonals (both directions)
        if(arr[0][0] === player && arr[1][1] === player && arr[2][2] === player)
            return true;
        else if (arr[0][2] === player && arr[1][1] === player && arr[2][0] === player)
            return true;

        // check for row
        let counter = 0;
        for (let i = 0; i < arr.length; i++){
            for (let j = 0; j < arr.length; j++){
                if (arr[i][j] === player)
                    counter++;
            }
            if (counter === 3)
                return true;
            counter = 0;
        }
        //check for columns
        counter = 0;
        for (let i = 0; i < arr.length; i++){
            for (let j = 0; j < arr.length; j++){
                if (arr[j][i] === player)
                    counter++;
            }
            if (counter === 3)
                return true;
            counter = 0;
        }
        return false;
    }

    set updateBoard(arr){ // arr is an array in this format: arr = [i, j, x]
        // i, j represents position on board, x represent which player
        // if x = 1, player1; x = 2, player 2; x CANNOT be passed as any other num (why there's an if condition)
        if (arr[2] === 1 || arr[2] === 2)
            this.ticTacToe[arr[0]][arr[1]] = arr[2];
    }

    set resetBoard(x){
        this.ticTacToe = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    }
}

class displayPanel {
    // calling new displayPanel will construct the 3x3 grid
    constructor(){
        let container = document.querySelector('.container');
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                let tmp = document.createElement('div');
                tmp.className = 'grid';
                // id of each div will be in this format ([i][j] (i & j are positions on the board))
                tmp.setAttribute('id', '[' + i + '][' + j + ']');
                tmp.style.cssText = "border: 3px solid black; height: 100px; width: 100px; font-size: 100px; display: flex; justify-content: center";
                container.appendChild(tmp);
            }
        }

        // intialize the score on the screen b4 starting the game
        document.getElementById('p1').textContent = "Player 1 (x): 0";
        document.getElementById('p2').textContent = "Player 2 (o): 0";

        //the announcer box is initally not showing
        document.getElementById('announce').style.display = 'none';
    }

    displayScore(player1, player2) {
        // player1 and player2 are numeric parameters that represent the score of each player
        // display the score after win or lose for each player
        document.getElementById('p1').textContent = "Player 1 (x): " + player1;
        document.getElementById('p2').textContent = "Player 2 (o): " + player2;
    }
    
    announceResult(player) {
        // player will a string (Player 1 or Player 2, or tie)
        let announcer = document.querySelector('#announce');
        announcer.textContent = '';
        if (player.toLowerCase() === 'tie'){
            announcer.textContent = "TIE!";
        }
        else
            announcer.textContent = player + " is the winner!";
        announcer.style.display = 'block';
        announcer.style.cssText = "display: flex; justify-content: center; align-self: center";
    }

    newRound(){
        let grid = document.querySelectorAll(".grid");
        grid.forEach((slot) => {
            slot.textContent = '';
        });
        //when a new round started, change the annouce box display back to none
        document.getElementById('announce').style.display = 'none';
    }
}

function main(){
    // this will display the board
    let display = new displayPanel();
    let p1 = new Player(), p2 = new Player();
    let game = new gameBoard();
    let turns = 0;
    //where the game starts
    let grid = document.querySelectorAll(".grid");
        grid.forEach((slot) => {
            slot.addEventListener("click", () => {
                // only allow players to choose empty slots and play once
                if (slot.textContent.length === 0 && !game.isDone){
                    let id = slot.id;
                    let i = id[1], j = id[4];
                    let arr = [];
                    if (turns % 2 === 0){ // player 1
                        arr = [i, j, 1];
                        game.updateBoard = arr;
                        slot.textContent = 'x';
                    }
                    else{
                        arr = [i, j, 2];
                        game.updateBoard = arr;
                        slot.textContent = 'o';
                    }
                    turns++;
                    if (game.tie()){
                        display.announceResult("tie");
                        game.resetBoard = 0;
                        game.setDoneStatus = true;
                    }
                    else if (game.win(1)){
                        p1.updateScore = 1 + p1.getScore;
                        display.announceResult("Player 1");
                        display.displayScore(p1.getScore, p2.getScore);
                        game.resetBoard = 0;
                        game.setDoneStatus = true;
                    }
                    else if (game.win(2)){
                        p2.updateScore = 1 + p2.getScore;
                        display.announceResult("Player 2");
                        display.displayScore(p1.getScore, p2.getScore);
                        game.resetBoard = 0;
                        game.setDoneStatus = true;
                    }
                }

                //if click on new round button
                let newRound = document.querySelector("#newRound");
                newRound.addEventListener("click", () => {
                    display.newRound();
                    game.setDoneStatus = false;
                });

                // start over 
                let startOver = document.querySelector("#startOver");
                startOver.addEventListener("click", () => {
                    display.newRound();
                    //restart from the beginning
                    p1.updateScore = 0;
                    p2.updateScore = 0;
                    display.displayScore(p1.getScore, p2.getScore);
                    game.setDoneStatus = false;
                });
            });
        });
}
main();