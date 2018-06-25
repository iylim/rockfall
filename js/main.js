/*----- constants -----*/
var boardSize = 8;
var rocks = ['images/rock1.png', 'images/rock2.png', 'images/Stone_Icon.png', 'images/rock3.png', 'images/rock4.png', 'images/rock4.png'];


/*----- app's state (variables) -----*/
var board, firstRockIdx, score;
var time, timerId;

/*----- cached element references -----*/
var boardImages = document.querySelectorAll('#board td img');
var timeEl = document.querySelector('.time');
var scoreEl = document.querySelector('.score');

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleBoardClick);
//document.querySelector()

/*----- functions -----*/
function handleBoardClick(evt) {
    var boardIndex = parseInt(evt.target.id.replace('tile', '')); 
    if (!time) {
        time = 60;
        timeEl.textContent = time;
        timerId = setInterval(function() {
            time--;
            timeEl.textContent = time;
            if (!time) {
                clearInterval(timerId);
                setTimeout(function() {alert('game over')});
            }
        }, 1000); 
    }

    if (!clickCheck(boardIndex)) firstRockIdx = null;
    render();
    getMatches();
} 

function clickCheck(clickedIdx) {
    if (firstRockIdx === null) {
        firstRockIdx = clickedIdx;
        return true;
    } else {
        if (clickedIdx === firstRockIdx + 1 || clickedIdx === firstRockIdx - 1 ||
            clickedIdx === firstRockIdx + 8 || clickedIdx === firstRockIdx - 8) {
                // swap
                var temp = board[clickedIdx];
                board[clickedIdx] = board[firstRockIdx];
                board[firstRockIdx] = temp;
                return true;
            }
    }
    return false;
}


// Match check to see if match 3 in a row or more 
// clear matched tiles
// add to score based on how many was removed

 function getMatches(board) {
    return board.forEach(function(a, i, aa) {
    if(i > 0 && a === aa[i-2] && a === aa[i-1]) {
        return 'match found!';
    }
});

render();
}


// multiplier score



function initialize() {
    time = 0;
    score = 0;
    firstRockIdx = null;
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


//IMPORTANT UPDATE STATE then CALL RENDER

// function handleUpdateScore(diff) {
//     score += diff;
//     render();
// }


initialize();

// swap values
// render