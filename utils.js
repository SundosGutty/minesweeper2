function printBoard(selector) {
    var strHTML = ``
    for (var i = 0; i < gLevel.boardLength; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.boardLength; j++) {
            var className = getClassName({ i: i, j: j })
            strHTML += `<td class="${className} cell${i}-${j}" onmousedown="handleClick(this, ${i}, ${j}, event)"></td>`
        }
        strHTML += '</tr>'
    }
    var elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}


function renderCell(location, value) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`)
    elCell.classList.add('revealed')
    elCell.innerHTML = value
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}


function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}


function startTimer() {
    var elTimer = document.querySelector('.timerDisplay')
    var date = Date.now()
    gTimerInterval = setInterval(function () {
        var time = ((Date.now() - date) / 1000).toFixed(2)
        elTimer.innerText = time
    }, 100)
}


function setMinesNegsCount() {
    var count = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            count = minesNegsCoun(gBoard, i, j);
            gBoard[i][j].minesAroundCount = count;
        }
    }
    return count
}


function minesNegsCoun(board, rowIdx, colIdx) {
    var count = 0;

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            if (gBoard[i][j].isMine) count++
        }
    }
    return count
}

function revealNegsOfZ(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue

            if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
                gBoard[i][j].isShown = !gBoard[i][j].isShown
                gGame.shownCount++;

                var location = { i, j }
                var minesAroundCount = gBoard[i][j].minesAroundCount;
                if (minesAroundCount === 0) {
                    renderCell(location, EMPTY)
                } else if (minesAroundCount > 0) {
                    renderCell(location, minesAroundCount)
                }
                if (minesAroundCount === EMPTY) {
                    revealNegsOfZ(location.i, location.j)
                }
            }
        }
    }
}
