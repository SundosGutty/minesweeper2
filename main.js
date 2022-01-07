'use strict'

//icons
const MINE_ICON = '💣'
const FLAG_ICON = '🏳️'
const SAFE = '🥞'
const EMPTY = ''

//html-elements
const WIN_DISPLAY = document.querySelector('.win-dis')
const LOOSE_DISPLAY = document.querySelector('.lose-dis')
const elLivesCont = document.querySelector('.lives-container')

//globals
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
var gTimerInterval
var gSafeClicksInterval
var gLives = 2 //given 2 lives - at 2 the player looses


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
            }
        }
    }
    return board
}


function setDifficultyLevel(boardSize) {
    gLevel.boardSize = boardSize
    gLevel.boardLength = Math.sqrt(gLevel.boardSize)
    if (gLevel.boardSize === 16) gLevel.numOfMines = 2
    else if (gLevel.boardSize === 64) gLevel.numOfMines = 8
    else if (gLevel.boardSize === 144) gLevel.numOfMines = 16
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


//checks witch click and points to the correct function
//stops clicks when game is over
//starts the timer & placing the mineson first click
function handleClick(elCell, i, j, event) {
    if (!gGame.isOn) return
    if (gGame.shownCount === 0) {
        startTimer()
        placeMines(i, j)
        setMinesNegsCount()
    }
    if (event.button === 2) {
        markCell(i, j)
    } else {
        revealCell(elCell, i, j)
        gGame.shownCount++
    }
    checkVictory()
}



// left click
function revealCell(elCell, i, j) {
    let currCell = gBoard[i][j]
    console.log(currCell)
    if (currCell.isMarked || currCell.isShown) return
    if (!currCell.isShown) {
        currCell.isShown = !currCell.isShown
        var randLocation = { i: i, j: j }
        if (currCell.isMine) {
            renderCell(randLocation, MINE_ICON)
            gLives--
            currCell.minesAroundCount++
            usersLives()
        } else {
            if (currCell.minesAroundCount === 0) {
                renderCell(randLocation, EMPTY);
                revealNegsOfZ(i, j)
                return;
            } else {
                renderCell(randLocation, currCell.minesAroundCount);
                return;
            }
        }
    }
}

//right click
function markCell(i, j) {
    let newBoard = gBoard[i][j]

    if (newBoard.isShown) return
    var location = { i, j }
    if (newBoard.isMarked) {
        newBoard.isMarked = false
        gGame.markedCount--
        renderCell(location, EMPTY)
        var elCell = document.querySelector(`.cell${location.i}-${location.j}`)
        elCell.classList.remove('revealed')
    } else {
        newBoard.isMarked = true
        renderCell(location, FLAG_ICON)
        gGame.markedCount++

    }
}



function usersLives() {
    if (gLives === 1) elLivesCont.innerText = ' Lives: ❤️||'
    else {
        elLivesCont.innerText = 'You have no Lives||'
        gameOver()
    }
}



function checkVictory() {
    if (gGame.shownCount + gGame.markedCount === gLevel.boardSize && gLives > 0) {
        gGame.isOn = false
        clearInterval(gTimerInterval)
        WIN_DISPLAY.style.display = 'block'
        document.querySelector('.smiley').innerText = '😎'
    }
}

function gameOver() {
    LOOSE_DISPLAY.style.display = 'block'
    document.querySelector('.smiley').innerText = '😔'
    clearInterval(gTimerInterval)
    gGame.isOn = false;
    gGame.shownCount = 0
}

function resetGame() {
    document.querySelector('.timerDisplay').innerText = '00.00'
    LOOSE_DISPLAY.style.display = 'none'
    WIN_DISPLAY.style.display = 'none'
    document.querySelector('.smiley').innerText = '😊'
    clearInterval(gTimerInterval)
    gBoard = createBoard(gLevel.boardLength)
    elLivesCont.innerText = 'Lives: ❤️❤️||'
    printBoard('.board')
    gGame.isOn = true
    gLives = 2
    gGame.shownCount = 0
    gGame.markedCount = 0
}



