/*----- constants -----*/
var boardSize = 8;
var rocks = ['images/rock1.png', 'images/rock2.png', 'images/Stone_Icon.png', 'images/rock3.png', 'images/rock4.png', null];
var diff = {
3: 10,
4: 20,
5: 30,
6: 50
};

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
    var matches = getMatches();

    render();    
} 

// function score() {
    
//     //update score 
     
//     // 2 matches in a row = +10pt bonus
//     // 3 matches in a row = +20pt bonus 
//     //4 matches in a row = +30pt bonus

//    //clear matched tiles
//     }
//     render();
// }

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

function getMatches() {
    // return an array of "match" arrays [10, 11, 12] or [2, 10, 18]
    var matches = getColumnMatches();
    matches.push(...getRowMatches());
}

function getColumnMatches() {
    var matches = [];
    for (var col = 0; col < boardSize; col++) {
        var nextOffset = 0;
        while (nextOffset < boardSize - 2) {
            nextOffset = getVerticalMatch(matches, col, nextOffset);
        }
    }
    return matches;
}

function getVerticalMatch(matches, col, offsetRow) {
    if (board[col + offsetRow * boardSize] === board[col + offsetRow * boardSize + boardSize] && board[col + offsetRow * boardSize] === board[col + offsetRow * boardSize + boardSize * 2]) {
        var numRocks = 3;
        while (board[col + offsetRow * boardSize + boardSize * numRocks] === board[col + offsetRow * boardSize]) {
            numRocks++;
        }
        var match = [];
        for (var i = 0; i < numRocks; i++) {
            match.push(col + offsetRow * boardSize + boardSize * i);
        }
        matches.push(match);
        return offsetRow + numRocks;
    } else {
        return offsetRow + 1;
    }
}

function getRowMatches() {
    var matches = [];
    for (var row = 0; row < boardSize; row++) {
        var nextOffset = 0;
        while (nextOffset < boardSize - 2) {
            nextOffset = getHorizontalMatch(matches, row, nextOffset);
        }
    }
    return matches;
}

function getHorizontalMatch(matches, row, offsetCol) {
    if (board[row * boardSize + offsetCol] === board[row * boardSize + offsetCol + 1] && board[row * boardSize + offsetCol] === board[row * boardSize + offsetCol + 2]) {
        var numRocks = 3;
        while (board[row * boardSize + offsetCol + numRocks] === board[row * boardSize + offsetCol]) {
            numRocks++;
        }
        var match = [];
        for (var i = 0; i < numRocks; i++) {
            match.push(row * boardSize + offsetCol + i);
        }
        matches.push(match);
        return offsetCol + numRocks;
    } else {
        return offsetCol + 1;
    }
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

//scoring
//go backwards if null fill from the spot above
