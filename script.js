var btnStart = document.querySelector("#btnStart");
var boardElement = document.querySelector("#board");
var rows = 15;
var columns = 15;
const dWin = [[1,0],[1,1],[0,1],[1,-1]];
var player_1_moves = [];
var player_2_moves = [];
var turn = 1;


function newGame(){
    player_1_moves = [];
    player_2_moves = [];
    rows = document.querySelector("#row").value;
    columns = document.querySelector("#col").value;
    turn = 1;
    loadBoard();
}
function loadBoard() {
    boardElement.textContent = '';
    for(let i = 0;i < rows;i++){
        let row = document.createElement("tr");
        for(let j = 0;j < columns;j++){
            let col = document.createElement("td");
            col.classList.add(`row-${i}`);
            col.classList.add(`col-${j}`);
            col.addEventListener("click",placeMove);
            row.appendChild(col);
        }
        boardElement.appendChild(row);
    }
}
function placeMove(e){
    let box = e.target;
    let cord = getCord(box.classList);
    if (turn==1) {
        player_1_moves.push(cord);
        turn=2;
        box.classList.add("x");
        if(checkWin(player_1_moves)){
            alert("X wins!");
        } 
    }else if(turn==2){
        player_2_moves.push(cord);
        turn=1;
        box.classList.add("o");
        if(checkWin(player_2_moves)){
            alert("O wins!");
        }
    }
    box.removeEventListener("click",placeMove);
}
function getCord(class_list){
    return [parseInt(class_list[1].split("-")[1]),parseInt(class_list[0].split("-")[1])]
}
function changeWincolor(move,d){
    for (let i = 0; i < 5; i++) {
        let box = document.querySelector(`.col-${move[0]+i*d[0]}.row-${move[1]+i*d[1]}`);
        box.classList.add("win");  
    }
    
}
function checkWin(pMoves){
    
    return false;
}

newGame();
