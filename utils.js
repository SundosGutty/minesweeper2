function printBoard(selector) {
    var strHTML = ``
    for (var i = 0; i < gLevel.boardLength; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.boardLength; j++) {
            var className = getClassName({ i: i, j: j })

            strHTML += `<td class="${className} cell${i}-${j} clicked" onmousedown="revealCell(this, ${i}, ${j}, event)"></td>`
        }
        strHTML += '</tr>'
    }

    var elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}


function renderCell(location, value) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`)
    elCell.innerHTML = value;
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
        var time = ((Date.now() - date) / 1000).toFixed(3)
        elTimer.innerText = time
    }, 10)
}



function countNegs(mat, rowIdx, colIdx) {
    var negs = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            if (mat[i][j].isMine) {
                negs.push({ i, j })
            }
        }
    }
    return negs
}



// function revealNonBomb(mat, rowIdx, colIdx) {
//     var nonbombNegs = []
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i > mat.length - 1) continue
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j < 0 || j > mat[0].length - 1) continue
//             if (i === rowIdx && j === colIdx) continue
//             nonbombNegs.push({ i, j })
//         }
//     }
//     console.log()
//     for (var k = 0; k < nonbombNegs.length; k++) {
//         displayCount(nonbombNegs[k])
//     }


// }

// function displayCount(nonbombNeg) {
//     countNegs(nonbombNeg)
//     console.log(nonbombNeg)
//     nonbombNeg.isShown = True

// }


