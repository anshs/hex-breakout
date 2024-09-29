/** @type {HTMLCanvasElement} */

const cvs = document.getElementById('hexbreakout');
const ctx = cvs.getContext('2d');
console.log(cvs.width + " " + cvs.height);

// Create a 3d array to store hexagonal coordinate system
var grid = new Array();
grid[0] = new Array();
grid[0][0] = new Array();

console.log(getArrayDimensions(grid));

// TEMP CODE BEGIN
ctx.beginPath();
ctx.moveTo(100,100);
ctx.lineTo(900,100);
ctx.lineTo(900,550);
ctx.lineTo(100,550);
ctx.closePath();
ctx.stroke();
ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // Dim red color
ctx.setLineDash([5, 5]); // Dotted line (5px dash, 5px gap)
ctx.moveTo(cvs.width/2,0);
ctx.lineTo(cvs.width/2,cvs.height);
ctx.moveTo(0,cvs.height/2);
ctx.lineTo(cvs.width,cvs.height/2);
ctx.stroke();
ctx.strokeStyle = '#000000';  // Reset to black (default)
ctx.setLineDash([]);          // Reset to solid line (default)
// TEMP CODE END

//fillHexPattern(cvs.width,cvs.height,25);
fillHexPattern(800,450,25,100,100);

function fillHexPattern(w,h,r,xoff = 0, yoff=0){
    let gap = 2*r*Math.cos(Math.PI/3);
    let xoffset = w%(2*r+gap)/2-xoff;
    let yoffset = h%(2*r+gap)/2-yoff;
    let xstart = r+gap/2-xoffset;
    let ystart = r+gap/2-yoffset;
    
    //Start drawing hexs
    for (i=0;i<parseInt(w/(2*r+gap))+1;i++){
        for(j=0; j<parseInt(h/(2*r+gap))+1;j++){
            drawHex(xstart+i*(2*r+gap),ystart+j*(2*r+gap),r);
           // drawHex(xstart+i*(2*r+gap),ystart+j*(2*r+gap),r);
        }
    }

    //for(i=0;i<)
}



function drawHex(x,y,r){
    ctx.beginPath();
    ctx.moveTo(x+r*Math.cos(Math.PI/3),y-r*Math.sin(Math.PI/3));
    ctx.lineTo(x+r,y);
    ctx.lineTo(x+r*Math.cos(Math.PI/3),y+r*Math.sin(Math.PI/3));
    ctx.lineTo(x-r*Math.cos(Math.PI/3),y+r*Math.sin(Math.PI/3));
    ctx.lineTo(x-r,y);
    ctx.lineTo(x-r*Math.cos(Math.PI/3),y-r*Math.sin(Math.PI/3));
    ctx.closePath();
    ctx.stroke();
}


// Extra functions
function getArrayDimensions(arr) {
    let dimensions = [];
    let current = arr;

    while (Array.isArray(current)) {
        dimensions.push(current.length);
        current = current[0]; // Move to the next level
    }

    return dimensions;
}


// Old TTT code - DELETE LATER
/*
function checkWin(arr,marker){
    let r=c=d1=d2=n=0;
    for(i=0;i<3;i++){
        for (j=0;j<3;j++){
            arr[i][j] == marker ? r++ : null;
            arr[j][i] == marker ? c++ : null;
            (i==j && arr[i][j] == marker) ? d1++ : null;
            (i+j==2 && arr[i][j] == marker) ? d2++ : null;
            arr[i][j] == null ? n+=1 : null;
        }
        if (r==3) return 'r'; // keeping the return values for row and column separate for future highlighting of the winning combination
        if (c==3) return 'c';
        r = c = 0;
    }
    if (d1==3) return 'd1';
    if (d2==3) return 'd2';
    if (n==0) return 'draw';
    return false;
}

const gameBoard = {
    board: [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ],
    turnInfo: document.getElementById("turn-info"),
    updateGameboard: function (){
        let e=null;
        for (i=0;i<3;i++){
            for (j=0;j<3;j++){
                e=document.getElementById(i+''+j);
                document.getElementById(i+''+j).innerHTML = this.board[i][j] || '';
                if (this.board[i][j]==null) {
                    document.getElementById(i+''+j).classList.add('empty');
                }
                else {
                    document.getElementById(i+''+j).classList.remove('empty');
                }
            }
        }
    }
}

class Player {
    constructor(name, marker, wins = 0) {
        this.name = name;
        this.marker = marker;
        this.wins = wins;
    }
}

const game = {
    player1: new Player('Player 1', 'X'),
    player2: new Player('Player 2', 'O'),
    draws: 0,
    turn: null,
    startingPlayer: null,
    gameOver: true, //by default game is over and needs to be started using the Start button
    reset: function(){
        gameBoard.board = gameBoard.board.map(row => row.map (element=>null));
        gameBoard.updateGameboard(); 
        this.startingPlayer === this.player1 ? this.startingPlayer = this.player2 : this.startingPlayer = this.player1;
        this.turn = this.startingPlayer;
        document.getElementById('turn-info').innerHTML = this.turn.name + '\'s turn [' + this.turn.marker + ']'
        this.gameOver = false;
    },
    getInput: function(divId){
        if (this.gameOver) return;
        document.getElementById('turn-info').innerHTML = this.turn.name + '\'s turn [' + this.turn.marker + ']'
        let rowIndex = Number(divId.substring(0,1));
        let columnIndex = Number(divId.substring(divId.length-1));
        if (gameBoard.board[rowIndex][columnIndex]==null) { // Check if the cell which is clicked is empty
            gameBoard.board[rowIndex][columnIndex] = this.turn.marker; // Add the marker of player who has their turn
            gameBoard.updateGameboard(); // Update GameBoard display
            let chk = checkWin(gameBoard.board,this.turn.marker); // check for winner
            if ((chk == 'r')||(chk == 'c')||(chk == 'd1')||(chk == 'd2')) {
                this.turn.wins++;
                document.getElementById('player1').innerHTML = 'Wins: ' + this.player1.wins; 
                document.getElementById('player2').innerHTML = 'Wins: ' + this.player2.wins;  
                document.getElementById('turn-info').innerHTML = this.turn.name + ' is the winner!';
                document.getElementById('start-button').innerHTML = 'Restart';
                this.gameOver = true;
            }
            else if (chk == 'draw') {
                this.draws++;
                document.getElementById('turn-info').innerHTML = 'Game is a draw!';
                document.getElementById('game-draws').innerHTML = 'Draws: ' + this.draws;
                document.getElementById('start-button').innerHTML = 'Restart'; 
                this.gameOver = true;
            }
            else {
                this.turn === this.player1 ? this.turn = this.player2 : this.turn = this.player1;
                document.getElementById('turn-info').innerHTML = this.turn.name + '\'s turn [' + this.turn.marker + ']';
            }
        }
    }
    
}

*/
