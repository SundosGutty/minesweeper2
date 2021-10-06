'use strict'

const MINE_ICON = '💣'
const FLAG_ICON = '🏳️'

var gLevel = {
    boardSize: 16,
    boardLength: Math.sqrt(16),
    numOfMines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gBoard
var gCount = 0  // in order to start after the first click 
var gTimerInterval
var gLives = 0 //given 2 lives - at 2 the player looses



function init() {
    gBoard = createBoard(gLevel.boardLength)
    printBoard('.board')
    gGame.isOn = true
    clearInterval(gTimerInterval)
}


function createBoard(boardLength) {
    var board = []

    for (var i = 0; i < boardLength; i++) {
        board[i] = []

        for (var j = 0; j < boardLength; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                i: i,
                j: j
            }
        }
    }
    return board
}


function setDifficultyLevel(boardSize) {
    gLevel.boardSize = boardSize
    gLevel.boardLength = Math.sqrt(gLevel.boardSize)
    if (gLevel.boardSize === 16) gLevel.numOfMines = 2
    if (gLevel.boardSize === 64) gLevel.numOfMines = 8
    if (gLevel.boardSize === 144) gLevel.numOfMines = 16
    clearInterval(gTimerInterval)
    resetGame()
}


function placeMines(firstCI, firstCJ) {
    for (var i = 0; i < gLevel.numOfMines; i++) {
        do {
            var randomI = getRandomIntInt(0, gLevel.boardLength)
            var randomJ = getRandomIntInt(0, gLevel.boardLength)
        } while (gBoard[randomI][randomJ].isMine || (firstCI === randomI && firstCJ === randomJ))
        gBoard[randomI][randomJ].isMine = true
    }
}


function revealCell(elCell, i, j, event) {
    checkVictory()
    gCount++
    if (gCount === 1) {
        startTimer()
        placeMines(i, j)
    }

    if (event.button === 2) {
        markCell(i, j)
        return
    }


    window.addEventListener('contextmenu', (event) => {
        console.log(event.button)
    })

    gBoard[i][j].isShown = true

    if (gBoard[i][j].isMine) {

        var randLocation = { i: i, j: j }
        renderCell(randLocation, MINE_ICON)
        gLives++
        if (gLives === 2) {
            gameOver()
            document.querySelector('.lives').innerText = 'You have no Lives||'
        }
        if (gLives === 1) document.querySelector('.lives').innerText = 'Lives: ❤️||'

    } else {
        var countedNegs = countNegs(gBoard, i, j)
        var count = 0
        for (var i = 0; i < countedNegs.length; i++) {
            count++

            if (count === 0) {
                revealNonBomb(gBoard, i, g)
                count++
            }
            elCell.innerText = count
        }
    }

}

// function revealNeigboors() {
//     var nonBomsnegs = revealNonBomb(gBoard, i, j)
//     var count = 0
//     for (var i = 0; i < nonBomsnegs; i++) {
//         var elCell = document.querySelector(`.clicked`)
//         count++
//     }
//     elCell.style.backgroundColor = 'blue'
//     elCell.innerText = count
// }

function markCell(i, j) {
    var location = { i, j }
    renderCell(location, FLAG_ICON)
    gBoard[i][j].isMarked = true
    gGame.markedCount++
    checkVictory()
}

function checkVictory() {
    var isVictory = true
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine && !cell.isMarked) {
                isVictory = false
            } else if (!cell.isMine && !cell.isShown) {
                isVictory = false
            }
        }
    }
    if (isVictory) {
        gGame.isOn = false
        clearInterval(gTimerInterval)
        document.querySelector('.win-dis').style.display = 'block'
        document.querySelector('.smiley').innerText = '😎'
    }
}


function gameOver() {
    var playerStat = document.querySelector('.lose-dis')
    document.querySelector('.lose-dis').style.display = 'block'
    document.querySelector('.smiley').innerText = '😔'
    playerStat.display = 'block'
    clearInterval(gTimerInterval)
    gGame.isOn = false;
}

function resetGame() {
    document.querySelector('.timerDisplay').innerText = '00.00'
    document.querySelector('.lose-dis').style.display = 'none'
    document.querySelector('.win-dis').style.display = 'none'
    document.querySelector('.smiley').innerText = '😊'
    clearInterval(gTimerInterval)
    gBoard = createBoard(gLevel.boardLength)
    document.querySelector('.lives').innerText = 'Lives: ❤️❤️||'
    printBoard('.board')
    gGame.isOn = true
    gLives = 0
    gCount = 0
}
