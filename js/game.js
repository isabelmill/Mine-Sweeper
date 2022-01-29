'use script'

const BOMB = '💣'
const FLAG = '🚩'
const EMPTY = ''
const LIVES = '❤️'

var livesCount = 3;
var hintsCount = 3;
var safeClicksCount = 3;

var gBoard;
var gClicks = 0;
var victory = false;
var gInteval;
var totalSeconds = 0;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevelBasic = {
    SIZE: 4,
    MINES: 2
};

initGame()

function levelChange(size, mines) {
    gLevelBasic.SIZE = size
    gLevelBasic.MINES = mines
    restart()
    if (gLevelBasic.SIZE === 4 && gLevelBasic.MINES === 2) {
        var elLives = document.querySelector('.lives')
        elLives.innerHTML = LIVES
    }
}


function initGame() {
    gBoard = buildBoard(gLevelBasic.SIZE);
    renderBoard(gBoard);
    gGame.isOn = true
    var elLives = document.querySelector('.lives')
    elLives.innerHTML = LIVES
}

function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            var className = 'cell-' + i + '-' + j;
            if (!currCell.isShown) className += ' hidden';
            strHTML += `<td class="cell ${className}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, event, ${i}, ${j})"></td>`;
        }
        strHTML += `</tr>`
    }
    var elTable = document.querySelector('.board');
    elTable.innerHTML = strHTML;

}

//  "the neighbors" loop checking how many mines are around each cell within the board
function setMinesNegsCount(row, col, board) {
    var minesNegsCount = 0;
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > board[i].length - 1) continue;
            if (i === row && j === col) continue;
            if (board[i][j].isMine) minesNegsCount++;
        }
    }
    return minesNegsCount;
}

// implementing the mines inside the board randomly
// function setMines(row, col) {
//     for (var i = 0; i < gLevelBasic.MINES; i++) {
//         var row = getRandomInt(0, gBoard.length);
//         var col = getRandomInt(0, gBoard[0].length);
//         if (gBoard[row][col].isMine || gBoard[row][col].isShown) i--;
//         gBoard[row][col].isMine = true;
//     }
// }

// implementing the mines inside the board randomly - second function 
function setMines(row, col) {
    if (!gBoard[row][col].isMine || !gBoard[row][col].isShown) {
        for (var i = 0; i < gLevelBasic.MINES; i++) {
            var row = getRandomInt(0, gBoard.length);
            var col = getRandomInt(0, gBoard[0].length);
            console.log('row,col:', row, col);
            gBoard[row][col].isMine = true;
        }
    } else gBoard[row][col].isMine = false;
}



//   what happens whaen i click the cell and logics for diffrent situations
function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return;
    var clickedCell = gBoard[i][j];
    if (clickedCell.isShown) return;
    if (clickedCell.isMarked) return;
    gGame.shownCount++
    clickedCell.isShown = true;
    gClicks++
    if (clickedCell.isMine) {
        if (gLevelBasic.SIZE === 4) {
            livesCount === 1
            livesCount--
            var elLive = document.querySelector(`.lives`);
            elLive.innerHTML = ' '
            checkgameOver()
        } else {
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            elCell.innerHTML = BOMB;
            livesCount--
            decreaseLives()
        }
    }
    if (gClicks === 1) {
        gInteval = setInterval(setTime, 1000);
        setMines(i, j);
    }

    var minesNegsCount = setMinesNegsCount(i, j, gBoard);
    // if (minesNegsCount === 0) expandShown(elCell, i, j, minesNegsCount)
    if (minesNegsCount > 0 && !clickedCell.isMine) elCell.innerHTML = minesNegsCount;
    elCell.classList.remove('hidden');
    elCell.style.color = numColor(minesNegsCount);
    checkVictory()
}

// need to complete 
function expandShown(elCell, row, col, minesNegsCount) {
    // for (var i = row - 1; i <= row + 1; i++) {
    //     if (i < 0 || i > gBoard.length - 1) continue;
    //     for (var j = col - 1; j <= col + 1; j++) {
    //         if (j < 0 || j > gBoard[i].length - 1) continue;
    //         if (i === row && j === col) continue;
    //         var elCells = document.querySelector(`.cell-${i}-${j}`);
    //         elCells.classList.remove('hidden');
    //         elCells.style.color = numColor(minesNegsCount);
    //     }
    // }
}


// marking cell with flag 
function cellMarked(cell, event, i, j) {
    event.preventDefault();
    if (!gGame.isOn) return;
    var clickedCell = gBoard[i][j];
    clickedCell.isMarked = !clickedCell.isMarked;
    if (clickedCell.isShown) return;
    if (clickedCell.isMarked) {
        gGame.markedCount++
        cell.innerHTML = FLAG
    } else {
        cell.innerHTML = EMPTY
        gGame.markedCount--
    }
    checkVictory()
}

// function that checks if user lost the game 
function checkgameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine) {
                var elCell = document.querySelector(`.cell-${i}-${j}`);
                elCell.innerHTML = BOMB;
                elCell.classList.remove('hidden');
                clearInterval(gInteval)
                gGame.isOn = false;
            }
        }
    }
    var elimgplay = document.querySelector(`.smiley-play`)
    elimgplay.style.display = 'none';
    var elimg = document.querySelector(`.smiley-lost`)
    elimg.style.display = 'block';
}

// function that checks if user won the game 
function checkVictory() {
    if (gGame.shownCount + gGame.markedCount === gBoard.length ** 2 ||
        gGame.shownCount === (gLevelBasic.SIZE ** 2) - gLevelBasic.MINES) {
        gGame.isOn = false;
        clearInterval(gInteval)
        var elimgplay = document.querySelector(`.smiley-play`)
        elimgplay.style.display = 'none';
        var elimg = document.querySelector(`.smiley-Win`)
        elimg.style.display = 'block';
    }
}

// restarts only when i click the smile emojis
function restart() {
    initGame()
    livesCount = 3
    safeClicksCount = 3
    var elCell = document.querySelector(`.lives`);
    elCell.innerHTML = LIVES + LIVES + LIVES;
    var elSafe = document.querySelector('.safe-click')
    elSafe.innerText = 'Safe Clicks: ' +
        safeClicksCount
    totalSeconds = 0;
    clearInterval(gInteval)
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gClicks = 0
    var elimgplay = document.querySelector(`.smiley-play`)
    elimgplay.style.display = 'block';
    var elimg = document.querySelector(`.smiley-Win`)
    elimg.style.display = 'none';
    var elimgLost = document.querySelector(`.smiley-lost`)
    elimgLost.style.display = 'none';
    var minutes = document.querySelector(`#minutes`)
    minutes.innerHTML = '00';
    var seconds = document.querySelector(`#seconds`)
    seconds.innerHTML = '00';
    if (gLevelBasic.SIZE === 4) {
        var elLives = document.querySelector('.lives')
        elLives.innerHTML = LIVES
    }
}
// function that colors the "neighbor" nums like in the real game 
function numColor(num) {
    var color = '';

    switch (num) {
        case 1:
            color = 'blue';
            break;
        case 2:
            color = 'green';
            break;
        case 3:
            color = 'red';
            break;
        case 4:
            color = 'black';
            break;
        default:
            color = 'pink';
            break;
    }

    return color;
}

function decreaseLives() {
    var elCell = document.querySelector(`.lives`);
    if (livesCount === 3) {
        elCell.innerHTML = LIVES + LIVES + LIVES;
    } else if (livesCount === 2) {
        elCell.innerHTML = LIVES + LIVES;
    } else if (livesCount === 1) {
        elCell.innerHTML = LIVES;
    } else if (livesCount === 0) {
        elCell.innerHTML = ' ';
        checkgameOver()
    }
}


function safeClick() {
    if (gClicks > 0) {
        if (safeClicksCount === 0) return
        var i = getRandomInt(0, gBoard.length)
        var j = getRandomInt(0, gBoard[0].length)
        if (gBoard[i][j].isMine || gBoard[i][j].isShown) return
        else {
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.remove('hidden');
            elCell.isShown = true;
            var minesNegsCount = setMinesNegsCount(i, j, gBoard);
            if (minesNegsCount) elCell.innerHTML = minesNegsCount
            var elSafe = document.querySelector('.safe-click')
            safeClicksCount--
            elSafe.innerText = 'Safe Clicks: ' +
                safeClicksCount
            setTimeout(() => {
                elCell.isShown = false;
                elCell.classList.add('hidden');
            }, 700)
        }
    }
}