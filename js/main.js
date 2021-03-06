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

/*----- app's state (variables) -----*/
var board, firstRockEl, firstRockIdx, score, turnScore, name;
var time, timerId;

/*----- cached element references -----*/
var boardImages = document.querySelectorAll('#board td img');
var timeEl = document.querySelector('.time');
var scoreEl = document.querySelector('.score');
var roundScore = document.querySelector('.updatedscore');
var currHS = document.querySelector('.highscore');
var nameEl = document.querySelector('div.winner input');
var gameOverModal = document.querySelector('.popup');
var highScoreModal = document.querySelector('.winner');

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleBoardClick);
document.querySelector('.close').addEventListener('click', close);
document.querySelector('.save').addEventListener('click', saveName);

/*----- functions -----*/
function handleBoardClick(evt) {
    if (time === 0) return;
    var boardIndex = parseInt(evt.target.id.replace('tile', '')); 
    if (time === null) {
        time = 60;
        timeEl.textContent = time;
        timerId = setInterval(function() {
            time--;
            timeEl.textContent = time;
            if (!time) {
                clearInterval(timerId);
                popup();
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
    // return an array of match arrays [10, 11, 12] or [2, 10, 18]
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

function initialize() {
    time = null;
    score = 0;
    turnScore = 0;
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
    currHS.textContent = `Name: ${localStorage.getItem('name')}, Score: ${localStorage.getItem('highscore')}`;
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

function popup() {
    firstRockEl.classList.remove('selected');  
    var highScore = parseInt(localStorage.getItem('highscore'));
    if (score > highScore) {
        localStorage.setItem('highscore', score);
        highScoreModal.style.visibility = 'visible';  
    } else {
        gameOverModal.style.visibility = 'visible';
    }  
}

function close() {
    gameOverModal.style.visibility = 'hidden';
    initialize();
}

function saveName() {
    localStorage.setItem('name', nameEl.value); 
    nameEl.value = '';
    highScoreModal.style.visibility = 'hidden'; 
    gameOverModal.style.visibility = 'visible';
}

initialize();