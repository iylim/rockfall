/*----- constants -----*/
var boardSize = 8;
var rocks = ['images/rock1.png', 'images/rock2.png', 'images/rock5.png', 'images/rock3.png', 'images/rock4.png', 'images/rock6.png'];
var points = {
3: 10,
4: 20,
5: 30,
6: 50,
7: 70,
8: 100
};
var multiplier = {
2: 10,
3: 20,
4: 30,
5: 50,
6: 70,
7: 100,
8: 150   
};
var sound = new Audio('https://freesound.org/data/previews/389/389618_6068748-lq.mp3');
var highScores = [];

/*----- app's state (variables) -----*/
var board, firstRockEl, firstRockIdx, score, turnScore;
var time, timerId;

/*----- cached element references -----*/
var boardImages = document.querySelectorAll('#board td img');
var timeEl = document.querySelector('.time');
var scoreEl = document.querySelector('.score');
var roundScore = document.querySelector(".updatedscore");
var currHS = document.querySelector(".highscore");

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleBoardClick);

/*----- functions -----*/
function handleBoardClick(evt) {
    var boardIndex = parseInt(evt.target.id.replace('tile', '')); 

    if (!time) {
        time = 6;
        timeEl.textContent = time;
        timerId = setInterval(function() {
            time--;
            timeEl.textContent = time;
            if (!time) {
                clearInterval(timerId);
                setTimeout(function() {
                alert('Game Over! Click anywhere to play again.')
                checkHighScore();
                firstRockEl.classList.remove('selected');   
                initialize();
            });
        }
        }, 1000); 
    }

    if (!clickCheck(boardIndex, evt.target)) {
        firstRockIdx = null; 
        var matches = getMatches();
        updateScore(matches);
        clearRocks(matches);
        collapseBoard();
        fillBoard();
    }
    render();
} 

function updateScore(matches) {
    var scoreA = 0;
    var scoreB = 0;
    if (multiplier[matches.length]) {
       scoreA = scoreA + multiplier[matches.length];
    }
    for (i = 0; i < matches.length; i++) {
        scoreB = scoreB + points[matches[i].length];
    }
    score = score + scoreA + scoreB;
    turnScore = scoreA + scoreB;
}
    
function clearRocks(matches) {
    matches.forEach(function(matchArr) {
        matchArr.forEach(function(boardIndex) {
            board[boardIndex] = null;
        });
    }); 
}

function collapseBoard() {
    for (var colIdx = 0; colIdx < boardSize; colIdx++) {
        collapseCol(colIdx);
    }   
    sound.play();
}

function collapseCol(colIdx) {
    var colArr = [];
    for (var rowIdx = 0; rowIdx < boardSize; rowIdx++) {
        colArr.push(board[colIdx + rowIdx * boardSize]);
    }
    colArr = colArr.reduce(function(newArr, rock) {
        if (rock !== null)  newArr.push(rock);
        return newArr;
    }, []);
    putArrAtBottomOfBoard(colArr, colIdx);
}

function putArrAtBottomOfBoard(arr, colIdx) {
    while (arr.length < 8) arr.unshift(null);
    for (var rowIdx = 0; rowIdx < boardSize; rowIdx++) {
        board[colIdx + rowIdx * boardSize] = arr[rowIdx];
    }
}

function fillBoard() {
    board = board.map(function(rock) {
        return rock === null ? getRockIndex() : rock;
    });
}

function clickCheck(clickedIdx, clickedEl) {
    if (firstRockIdx === null) {
        firstRockIdx = clickedIdx;
        clickedEl.classList.add('selected');
        firstRockEl = clickedEl;  
        return true;
    } else {
        firstRockEl.classList.remove('selected');  
        if (clickedIdx === firstRockIdx + 1 || clickedIdx === firstRockIdx - 1 ||
            clickedIdx === firstRockIdx + 8 || clickedIdx === firstRockIdx - 8) {
                // swap
                var temp = board[clickedIdx];
                board[clickedIdx] = board[firstRockIdx];
                board[firstRockIdx] = temp;
                return false;
            }
    }
    return false;
}

function getMatches() {
    // return an array of "match" arrays [10, 11, 12] or [2, 10, 18]
    var matches = getColumnMatches();
    matches.push(...getRowMatches());
    return matches;
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
    scoreEl.textContent = score;
    roundScore.textContent = turnScore;
    currHS.textContent = highScores;
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

function checkHighScore() {
    score = score;
    var highScore = localStorage.getItem("highscore");
    if (score > highScore) {
        localStorage.setItem("highscore", score);
        highScores.push({name: window.prompt('Enter name below to log High Score.'), 
        score: score 
    });
    }
}



initialize();