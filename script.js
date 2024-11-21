var btnStart = document.querySelector("#btnStart");
var btnUndo = document.querySelector("#btnUndo");
var btnRedo = document.querySelector("#btnRedo");
var boardElement = document.querySelector("#board");
var rows = 15;
var columns = 15;
const dWin = [[1, 0], [1, 1], [0, 1], [1, -1]];
var player_1_moves = [];
var player_2_moves = [];
var turn = 1;
var moveHistory = [];
var redoStack = [];

function newGame() {
    player_1_moves = [];
    player_2_moves = [];
    moveHistory = [];
    redoStack = [];
    rows = document.querySelector("#row").value;
    columns = document.querySelector("#col").value;
    turn = 1;
    loadBoard();
}

function loadBoard() {
    boardElement.textContent = '';
    for (let i = 0; i < rows; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < columns; j++) {
            let col = document.createElement("td");
            col.classList.add(`row-${i}`);
            col.classList.add(`col-${j}`);
            col.addEventListener("click", placeMove);
            row.appendChild(col);
        }
        boardElement.appendChild(row);
    }
}

function placeMove(e) {
    let box = e.target;
    let cord = getCord(box.classList);

    if (turn == 1) {
        player_1_moves.push(cord);
        moveHistory.push({ player: 1, cord });
        turn = 2;
        box.classList.add("x");
        if (checkWin(player_1_moves)) {
            alert("X wins!");
        }
    } else if (turn == 2) {
        player_2_moves.push(cord);
        moveHistory.push({ player: 2, cord });
        turn = 1;
        box.classList.add("o");
        if (checkWin(player_2_moves)) {
            alert("O wins!");
        }
    }
    box.removeEventListener("click", placeMove);
    redoStack = []; // Clear redo stack on a new move
}

function getCord(class_list) {
    return [parseInt(class_list[1].split("-")[1]), parseInt(class_list[0].split("-")[1])];
}

function undoMove() {
    // Undo two moves to maintain turn consistency
    if (moveHistory.length < 2) return;

    for (let i = 0; i < 2; i++) {
        let lastMove = moveHistory.pop();
        redoStack.push(lastMove);

        let box = document.querySelector(`.col-${lastMove.cord[0]}.row-${lastMove.cord[1]}`);
        box.classList.remove(lastMove.player === 1 ? "x" : "o");
        box.addEventListener("click", placeMove);

        if (lastMove.player === 1) {
            player_1_moves.pop();
        } else {
            player_2_moves.pop();
        }
    }
    turn = turn === 1 ? 2 : 1; // Switch turn after undo
}

function redoMove() {
    // Redo two moves to maintain turn consistency
    if (redoStack.length < 2) return;

    for (let i = 0; i < 2; i++) {
        let nextMove = redoStack.pop();
        moveHistory.push(nextMove);

        let box = document.querySelector(`.col-${nextMove.cord[0]}.row-${nextMove.cord[1]}`);
        box.classList.add(nextMove.player === 1 ? "x" : "o");
        box.removeEventListener("click", placeMove);

        if (nextMove.player === 1) {
            player_1_moves.push(nextMove.cord);
        } else {
            player_2_moves.push(nextMove.cord);
        }
    }
    turn = turn === 1 ? 2 : 1; // Switch turn after redo
}

function changeWincolor(move, d) {
    for (let i = 0; i < 5; i++) {
        let box = document.querySelector(`.col-${move[0] + i * d[0]}.row-${move[1] + i * d[1]}`);
        box.classList.add("win");
    }
}

function checkWin(pMoves) {
    // Placeholder: Add logic for checking win conditions
    return false;
}

// Event listeners for buttons
btnStart.addEventListener("click", newGame);
btnUndo.addEventListener("click", undoMove);
btnRedo.addEventListener("click", redoMove);

newGame();
