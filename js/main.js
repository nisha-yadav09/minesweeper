/*----- constants -----*/

const boardSize = {
    Beginner: 8, 
    Intermediate: 12,
    Expert: 18
};

const mines = {
    Beginner : 10, 
    Intermediate: 35,
    Expert:60
};

/*----- app's state (variables) -----*/

let arrBoard;
let flagCount;
let boardChoice;
let mineChoice;
let gameStatus;
let startTime;
let intervalId;

/*----- cached element references -----*/

const tableEl = document.querySelector("#table-div");
const overlayEl = document.getElementById('overlay');
const boardSelectedEl = document.querySelector("select");
const minesCountToDisplayEl = document.querySelector(".container > div#mines-div > span");
const counterToDisplayEl = document.querySelector(".container > div#counter-div > span");
const openModalButtonsEl = document.querySelectorAll('[data-modal-target]');
const closeModalButtonsEl = document.querySelectorAll('[data-close-button]');

/*----- event listeners -----*/

tableEl.addEventListener("click", handleCellClick);
tableEl.addEventListener("contextmenu", handleCellRightClick);

openModalButtonsEl.forEach(function(button) {
    button.addEventListener('click', function() {
      const modal = document.querySelector(button.dataset.modalTarget);
      openModal(modal);
    });
  });

overlayEl.addEventListener('click', function() {
    const modal = document.querySelector('.modal.active');
    closeModal(modal);
});
  
closeModalButtonsEl.forEach(function(button) {
button.addEventListener('click', function() {
    const modal = button.closest('.modal');
    closeModal(modal);
});
});

document.querySelector("select").addEventListener('change', function() {
    let val = document.querySelector("select").value;
    boardChoice =  boardSize[val];
    mineChoice =  mines[val];
    minesCountToDisplayEl.textContent = mineChoice;
    init();
});

/*----- functions -----*/

function init() {
    setStartTime();
    intervalId = setInterval(function() {
        counterToDisplayEl.textContent = getElapsedTime(startTime).toString();
    }, 1000);
    createBoard(boardChoice);
    createArray(boardChoice);
    fillBoardWithRandomMines(boardChoice);
    fillBoardWithNumbers(); 
}

/*----- create dynamic board for UI based on the difficulty level selected -----*/

function createBoard(boardChoice) {
    let boardRootEl = document.querySelector("div#table-div");
    let table = document.createElement('table');
    boardRootEl.appendChild(table);
    for (let i = 0; i < parseInt(boardChoice); i++) {
        let tr = document.createElement('tr');
        table.appendChild(tr);
        for (let j = 0; j < parseInt(boardChoice); j++) { 
            let td = document.createElement('td');
            tr.appendChild(td);
            td.setAttribute("x-index" , i); //set attribute to map with array
            td.setAttribute("y-index" , j); //set attribute to map with array
        }
    }  
}

/*----- function to return random x and y indexes to place the mines -----*/

function getRandomMinesIndex(boardChoice, idx) {
    const rndXIdx = Math.floor(Math.random() * (boardChoice-1));
    const rndYIdx = Math.floor(Math.random() * (boardChoice-1));
    return idx === 'x' ? rndXIdx : rndYIdx;
}

/*----- create 2D array of objects to map with the board all th eproperties to be set as null initially -----*/
/*----- TODO : This can be moved to Class (board with cell objects) -----*/

function createArray(boardChoice) {
    arrBoard = new Array(boardChoice);
    for (let i = 0; i < parseInt(boardChoice); i++) {
        arrBoard[i] = [];
    }
    for(let i = 0; i < arrBoard.length; i++) {
        for(let j = 0; j < arrBoard.length; j++) {
            arrBoard[i][j] = {
                value: "",
                hasFlag: false,
                reveal: false
            }
        }
    }
}

/*----- function to fill array with mines at random places -----*/

function fillBoardWithRandomMines(boardChoice) {
    let tempMineChoice = mineChoice;
    do {
        tempMineChoice --;
        let xMine = getRandomMinesIndex(boardChoice, "x");
        let yMine = getRandomMinesIndex(boardChoice, "y");
        let initVal = arrBoard[xMine][yMine].value;
        arrBoard[xMine][yMine].value = arrBoard[xMine][yMine].value === "" ? "mine" : "mine";
        initVal === "mine" ? tempMineChoice ++ : tempMineChoice;
    } while (tempMineChoice>=1);
}

/*----- event listner callback function to handle Cell click -----*/

function handleCellClick(evt) {
    if (evt.target.tagName !== 'TD') return;
    let cellXIndex = parseInt(evt.target.getAttribute("x-index"));
    let cellYIndex = parseInt(evt.target.getAttribute("y-index"));
    if (arrBoard[cellXIndex][cellYIndex].value === "mine" ) {
        evt.target.innerHTML = "<img src='images/mines.png'/>";
        revealAllMines();
    }
    if (typeof(arrBoard[cellXIndex][cellYIndex].value) === "number" && arrBoard[cellXIndex][cellYIndex].value !== 0) {
        evt.target.innerHTML = arrBoard[cellXIndex][cellYIndex].value;
        evt.target.style.backgroundColor = "#bfc7a4";
        arrBoard[cellXIndex][cellYIndex].reveal = true;
    } 
    if (arrBoard[cellXIndex][cellYIndex].value === 0 ) showAllVacantCells(evt,cellXIndex,cellYIndex);
    mineSweeperStatus();
}

function handleCellRightClick(evt) {
    if (evt.target.tagName !== 'TD') return;
    evt.preventDefault();
    let cellXIndex = parseInt(evt.target.getAttribute("x-index"));
    let cellYIndex = parseInt(evt.target.getAttribute("y-index"));
    arrBoard[cellXIndex][cellYIndex].hasFlag = true;
    evt.target.innerHTML="<img src='images/flagged.png'/>";
    arrBoard[cellXIndex][cellYIndex].hasFlag = true;
}

/*----- function to fill the array with -----*/

function fillBoardWithNumbers() {
    let counter = 0;
    for(let i = 0; i < arrBoard.length; i++) {
        for(let j = 0; j < arrBoard.length; j++) {
            if (arrBoard[i][j].value === "") {
                let xLowerLimit = i-1;
                xLowerLimit = xLowerLimit < 0 ? 0 : xLowerLimit;
                xLowerLimit = xLowerLimit > arrBoard.length-1 ? arrBoard.length-1 : xLowerLimit;
                let yLowerLimit = j-1;
                yLowerLimit = yLowerLimit < 0 ? 0 : yLowerLimit;
                yLowerLimit = yLowerLimit > arrBoard.length-1  ? arrBoard.length-1  : yLowerLimit;
                let xUpperLimit = (i-1)+2;
                xUpperLimit = xUpperLimit < 0 ? 0 : xUpperLimit;
                xUpperLimit = xUpperLimit > arrBoard.length-1  ? arrBoard.length-1  : xUpperLimit;
                let yUpperLimit = (j-1)+2;
                yUpperLimit = yUpperLimit < 0 ? 0 : yUpperLimit;
                yUpperLimit = yUpperLimit > arrBoard.length-1  ? arrBoard.length-1  : yUpperLimit;
                for (let itrI = xLowerLimit; itrI <= xUpperLimit; itrI++) {
                    for (let itrJ = yLowerLimit; itrJ <= yUpperLimit; itrJ++) {
                        if (arrBoard[itrI][itrJ].value === "mine") counter++;
                    }
                }
                arrBoard[i][j].value = arrBoard[i][j].value === "mine" ?"mine" : counter;
                counter = 0;
            }
        }
    }
}

/*----- function to reveal all the mines if a cell with mine is clicked-----*/

function revealAllMines() {
    arrBoard.forEach(function(row, i) {
        row.forEach(function(col, j) {
            if (col.value === "mine") {
                document.querySelector(`table [x-index = "${i}"][y-index = "${j}"]`).innerHTML = "<img src='images/mines.png'/>";
                tableEl.classList.add("activate");
                col.reveal = true;
            }
        });
    });
    gameStatus = -1;
}

/*----- function to handle game status-----*/

function mineSweeperStatus() {
    if (gameStatus === -1) {
        stopWatch();
        document.querySelector('#status-div').innerHTML = "TRY AGAIN!!";
        tableEl.style.pointerEvents = "none";
    }
    let revealedMineCounter = 0;
    let nonMineCounter = (arrBoard.length*arrBoard.length) - mineChoice;
    arrBoard.forEach(function(row) {
        row.forEach(function(col) {
            if (col.value !== "mine" && col.reveal === true) revealedMineCounter++;
        });
    });
    revealedMineCounter === nonMineCounter ? gameStatus = 1 : gameStatus = 0;
    if (gameStatus === 1) {
        stopWatch();
        document.querySelector('#status-div').innerHTML = "BRAVO! YOU WIN!!";
        tableEl.style.pointerEvents = "none";
    }  
}

/*----- function to handle if a cell with zero mines is clicked positive indexes-----*/

function showAllVacantCells(evt,cellXIndex,cellYIndex) {
    let iNum = 0;
    let jNum = 0;
    for (let j = cellYIndex; j < arrBoard.length; j++ ) {
        if (j === arrBoard.length - 1) {
            jNum = arrBoard.length - 1;
        } else if (arrBoard[cellXIndex][j].value !== 0  && arrBoard[cellXIndex][j].value !== "mine")  {
            jNum = j;
            break;
        } 
    } 
    for (let i = cellXIndex; i < arrBoard.length; i++ ) {
        if (i === arrBoard.length - 1) {
            iNum = arrBoard.length - 1;
        } else if (arrBoard[i][cellYIndex].value !== 0  && arrBoard[i][cellYIndex].value !== "mine") {
            iNum = i;
            break;
        }
    }
    for (let i = cellXIndex; i <= iNum; i++) {
        for (let j = cellYIndex; j<= cellYIndex; j++) {
           document.querySelector(`[x-index = "${i.toString()}"][y-index = "${j.toString()}"]`).innerHTML = arrBoard[i][j].value;
           document.querySelector(`[x-index = "${i.toString()}"][y-index = "${j.toString()}"]`).style.background = "#bfc7a4";
           arrBoard[i][j].reveal = true;
        }
    }

    for (let i = cellXIndex; i <= cellXIndex; i++) {
        for (let j = cellYIndex; j<= jNum; j++) {
           document.querySelector(`[x-index = "${i.toString()}"][y-index = "${j.toString()}"]`).innerHTML = arrBoard[i][j].value;
           document.querySelector(`[x-index = "${i.toString()}"][y-index = "${j.toString()}"]`).style.background = "#bfc7a4";
           arrBoard[i][j].reveal = true;
        }
    }
    showAllVacantCellsNegativeIndex(evt,cellXIndex,cellYIndex);
    tableEl.classList.add("activate");
    setTimeout(function() {
        tableEl.classList.remove("activate");
    }, 1200);   
}

/*----- function to handle if a cell with zero mines is clicked negative indexes-----*/

function showAllVacantCellsNegativeIndex(evt,cellXIndex,cellYIndex) {
    let iNum = 0;
    let jNum = 0;
    for (let j = cellYIndex; j >= 0; j-- ) {
        if (arrBoard[cellXIndex][j].value !== 0  && arrBoard[cellXIndex][j].value !== "mine")  {
            jNum = j;
            break;
        } 
    } 
    for (let i = cellXIndex; i >= 0 ; i-- ) {
         if (arrBoard[i][cellYIndex].value !== 0  && arrBoard[i][cellYIndex].value !== "mine") {
            iNum = i;
            break;
        }
    }
    for (let i = iNum; i < cellXIndex; i++) {
        for (let j = cellYIndex; j<= cellYIndex; j++) {
            document.querySelector(`[x-index = "${i.toString()}"][y-index = "${j.toString()}"]`).innerHTML = arrBoard[i][j].value;
            document.querySelector(`[x-index = "${i.toString()}"][y-index = "${j.toString()}"]`).style.background = "#bfc7a4";
            arrBoard[i][j].reveal = true;
        }
    } 
    for (let i = cellXIndex; i <= cellXIndex; i++) {
        for (let j = jNum; j< cellYIndex; j++) {
            document.querySelector(`[x-index = "${i.toString()}"][y-index = "${j.toString()}"]`).innerHTML = arrBoard[i][j].value;
            document.querySelector(`[x-index = "${i.toString()}"][y-index = "${j.toString()}"]`).style.background = "#bfc7a4";
            arrBoard[i][j].reveal = true;
        }
    }
}

/*----- function to set the class of modal to active-----*/

function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active');
    overlayEl.classList.add('active');
}

/*----- function to remove the class of modal from active-----*/

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active');
    overlayEl.classList.remove('active');
    window.location.reload();
}

/*----- function to get the start time of game-----*/

function setStartTime() {
    startTime = new Date();
}

/*----- function to get elapsed time of game-----*/

function getElapsedTime (startTime) {
    let endTime = new Date();
    let returnVal = ""
    let timeDiff = endTime.getTime() - startTime.getTime();
    timeDiff = timeDiff / 1000;
    let seconds = Math.floor(timeDiff % 60);
    let secondsAsString = seconds < 10 ? "0" + seconds : seconds + "";
    timeDiff = Math.floor(timeDiff / 60);
    let minutes = timeDiff % 60;
    let minutesAsString = minutes < 10 ? "0" + minutes : minutes + "";
    timeDiff = Math.floor(timeDiff / 60);
    let hours = timeDiff % 24;
    timeDiff = Math.floor(timeDiff / 24);
    let days = timeDiff;
    let totalHours = hours + (days * 24);
    let totalHoursAsString = totalHours < 10 ? "0" + totalHours : totalHours + "";
    returnVal = totalHoursAsString === "00" ? minutesAsString + ":" + secondsAsString : totalHoursAsString + ":" + minutesAsString + ":" + secondsAsString;
    return returnVal;
}

/*----- function to clear the set interval id if game is lost or won-----*/

function stopWatch() {
    clearInterval(intervalId);
}
