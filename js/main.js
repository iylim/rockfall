/*----- constants -----*/
var boardSize = 8;
var rocks = ['images/rock1.png', 'images/rock2.png', 'images/Stone_Icon.png', 'images/rock3.png', 'images/rock4.png', 'images/rock4.png'];


/*----- app's state (variables) -----*/
var board, time, firstRockSelected, score;
//player

/*----- cached element references -----*/
var boardImages = document.querySelectorAll('#board td img');

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleBoardClick);
//document.querySelector()

/*----- functions -----*/
function handleBoardClick(evt) {
    console.log(evt.target);

//first click check index function to check    
//  if first rock click = true then handle second click
// check clicks are adjacent 
} 

function clickCheck () {
    //nodeList
//     var el = getElementsByClassName('module');
// for (var i=0; i < el.length; i++) {
//     // Here we have the same onclick
//     el.item(i).onclick = clickerFn;
// }
}

// Match check to see if match 3 in a row or more 
// clear matched tiles
// add to score

function getMatches() {
 
}

// multiplier score

// countdown time

function initialize() {
    time = 60;
    score = 0;
    initBoard(); 
    render();
}

function render() {
    boardImages.forEach(function(img, idx) {
        img.src = rocks[board[idx]];
    });
} 

// play again

function initBoard() {
    board = new Array(boardSize * boardSize).fill(null);
    
    board = board.map(function() {
        return getRockIndex();
    });
}

//+ or - 1 and boardSize to check symbols  

//min and max array index

function getRockIndex() {
    return Math.floor(Math.random() * rocks.length);
}

initialize();

//function test in console

//IMPORTANT UPDATE STATE then CALL RENDER

// function handleUpdateScore(diff) {
//     score += diff;
//     render();
// }

