/*----- constants -----*/
var boardSize = 8;
var rocks = ['images/rock1.png', 'images/rock2.png', 'images/Stone_Icon.png', 'images/rock3.png', 'images/rock4.png', 'images/rock4.png'];
var diff = {
3: 10,
4: 20,
5: 30,
6: 50
}

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
} 

function score() {
    if (getMatches === true) {
    //update score 
        function handleUpdateScore(diff) {
        scoreEl += diff;
    
    // 2 matches in a row = +10pt bonus
    // 3 matches in a row = +20pt bonus 
    //4 matches in a row = +30pt bonus

}
   //clear matched tiles
    }
    render();
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

function getMatches(board) {
    var board = this.board;
    var amount = 3;
    var last = null;
    var count = 0;
    for (var i = 0; i < board.length; i++) {
        if (board[i] != last) {
            last = board[i];
            count = 0;
        }
        count += 1;
        if (amount <= count) {
            return true;
        }
    }
    return false;
}

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

function initBoard() {
    board = new Array(boardSize * boardSize).fill(null);
    
    board = board.map(function() {
        return getRockIndex();
    });
}

function getRockIndex() {
    return Math.floor(Math.random() * rocks.length);
}

// play again

initialize();
