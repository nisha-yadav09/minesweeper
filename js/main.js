/*----- constants -----*/

const boardSize = {
    beginner:"8", 
    intermediate: "16" ,
    expert:"24"
};
const mines = {
    beginner :10, 
    intermediate: 40,
    expert:99
};
let boardChoice =  boardSize.beginner;
let mineChoice =  mines.beginner;


/*----- app's state (variables) -----*/

let arrBoard ;
let flagCount = null;
/*----- cached element references -----*/

/*----- event listeners -----*/

//document.querySelector()

//const difficultyDropboxEl = document. 

/*----- functions -----*/
init();

function init() {
    createArray(boardChoice);
    fillBoardWithRandomMines(boardChoice);
     
}

function createBoard(boardChoice)
{
    let boardRootEl = document.querySelector("div#table-div");
    let table = document.createElement('table');
    boardRootEl.appendChild(table);
    for (let i = 0; i < parseInt(boardChoice); i++) {
        let tr = document.createElement('tr');
        table.appendChild(tr);
        for (let i = 0; i < parseInt(boardChoice); i++) { 
            let td = document.createElement('td');
            tr.appendChild(td);
        }
    }  
}

function getRandomMinesIndex(boardChoice, idx) {
    const rndXIdx = Math.floor(Math.random() * (boardChoice-1));
    const rndYIdx = Math.floor(Math.random() * (boardChoice-1));
    console.log("Index" + rndXIdx, rndYIdx );
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
        let xMine = getRandomMinesIndex(boardChoice, "x");
        let yMine = getRandomMinesIndex(boardChoice, "y");
        arrBoard[xMine][yMine].value = arrBoard[xMine][yMine].value === "mine" ? "" : "mine";
        arrBoard[xMine][yMine].value === "mine" ? tempMineChoice -- : tempMineChoice;
        console.log("Array" + arrBoard );
    } while (tempMineChoice>=1);
}