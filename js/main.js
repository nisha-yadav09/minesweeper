/*----- constants -----*/

const boardSize = {beginner:"8", 
                intermediate: "16" ,
                expert:"24"};
const mines = {beginner :10, intermediate: 40 ,expert:99};


/*----- app's state (variables) -----*/

let arrBoard = [];
arrBoard = [
    [{value}],
    []
]
let flagCount = null;
/*----- cached element references -----*/

/*----- event listeners -----*/

//const difficultyDropboxEl = document. 

/*----- functions -----*/

let boardChoice = boardSize.beginner;
createBoard(boardChoice);
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