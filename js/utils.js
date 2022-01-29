'use script'


// creating a simple matrix 
function createMat(size) {
    var mat = []
    for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
            row.push(EMPTY)
        }
        mat.push(row)
    }

    return mat
}

// creating a board
function buildBoard(size) {
    var board = createMat(size)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isMine: false,
                isShown: false,
                isMarked: false
            }
        }
    }
    return board
}

var secondsLabel = document.getElementById("seconds");
var minutesLabel = document.getElementById("minutes");
var totalSeconds = 0;

//  timer function  that counts minutes and seconds 
function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}
// converting timer to a string 
function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

//  random num function 
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}