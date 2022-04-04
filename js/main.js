/*----- constants -----*/

const boardSize = {
    beginner: 8, 
    intermediate: 16,
    expert: 20
};

const mines = {
    beginner : 10, 
    intermediate: 40,
    expert:90
};

const boardChoice =  boardSize.beginner;
const mineChoice =  mines.beginner;

/*----- app's state (variables) -----*/

let arrBoard ;
let flagCount = null;

/*----- cached element references -----*/

const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

/*----- event listeners -----*/

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = document.querySelector(button.dataset.modalTarget)
      openModal(modal)
    })
  })

  overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
      closeModal(modal)
    })
  })
  
  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal')
      closeModal(modal)
    })
  })

document.querySelector("#table-div").addEventListener("click", handleCellClick);
document.querySelector("#table-div").addEventListener("contextmenu", handleCellRightClick);

/*----- functions -----*/

init();

function init() {
    createBoard(boardChoice);
    createArray(boardChoice);
    fillBoardWithRandomMines(boardChoice);
    fillBoardWithNumbers(); 
}

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
            td.setAttribute("x-index" , i);
            td.setAttribute("y-index" , j);
        }
    }  
}

function getRandomMinesIndex(boardChoice, idx) {
    const rndXIdx = Math.floor(Math.random() * (boardChoice-1));
    const rndYIdx = Math.floor(Math.random() * (boardChoice-1));
    return idx === 'x' ? rndXIdx : rndYIdx;
}

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

function handleCellClick(evt) {
    if (evt.target.tagName !== 'TD') return;
    let cellXIndex = parseInt(evt.target.getAttribute("x-index"));
    let cellYIndex = parseInt(evt.target.getAttribute("y-index"));
    if (arrBoard[cellXIndex][cellYIndex].value === "mine" ) evt.target.innerHTML = "<img src='images/bomb.png'/>";
    if (typeof(arrBoard[cellXIndex][cellYIndex].value) === "number" && arrBoard[cellXIndex][cellYIndex].value !== 0) {
        evt.target.innerHTML = arrBoard[cellXIndex][cellYIndex].value;
        evt.target.style.backgroundColor = "#bfc7a4";
    } 
    if (arrBoard[cellXIndex][cellYIndex].value === 0 ) showAllVacantCells(evt,cellXIndex,cellYIndex);
}

function handleCellRightClick(evt) {
    if (evt.target.tagName !== 'TD') return;
    evt.preventDefault();
    let cellXIndex = parseInt(evt.target.getAttribute("x-index"));
    let cellYIndex = parseInt(evt.target.getAttribute("y-index"));
    arrBoard[cellXIndex][cellYIndex].hasFlag = true;
    evt.target.innerHTML="<img src='images/flag.png'/>";
}

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
                        if (arrBoard[itrI][itrJ].value === "mine") {
                            counter++;
                        }
                    }
                }
                arrBoard[i][j].value = arrBoard[i][j].value === "mine" ?"mine" : counter;
                counter = 0;
            }
        }
    }
}

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
        }
    }

    for (let i = cellXIndex; i <= cellXIndex; i++) {
        for (let j = cellYIndex; j<= jNum; j++) {
           document.querySelector(`[x-index = "${i.toString()}"][y-index = "${j.toString()}"]`).innerHTML = arrBoard[i][j].value;
           document.querySelector(`[x-index = "${i.toString()}"][y-index = "${j.toString()}"]`).style.background = "#bfc7a4";
        }
    }
    showAllVacantCells1(evt,cellXIndex,cellYIndex);
    document.querySelector("#table-div").classList.add("active");
    setTimeout(function() {
        document.querySelector("#table-div").classList.remove("active");
    }, 1200);
    
}

function showAllVacantCells1(evt,cellXIndex,cellYIndex) {
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
        }
    } 
    for (let i = cellXIndex; i <= cellXIndex; i++) {
        for (let j = jNum; j< cellYIndex; j++) {
            document.querySelector(`[x-index = "${i.toString()}"][y-index = "${j.toString()}"]`).innerHTML = arrBoard[i][j].value;
            document.querySelector(`[x-index = "${i.toString()}"][y-index = "${j.toString()}"]`).style.background = "#bfc7a4";
        }
    }
}

function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}
  
function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}