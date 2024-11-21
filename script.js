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
    rows = parseInt(document.querySelector("#row").value);
    columns = parseInt(document.querySelector("#col").value);
    turn = 1;
    loadBoard();
}

function loadBoard() {
    boardElement.textContent = ''; // Clear the board

    // Add the main board rows with row numbers (bottom to top)
    for (let i = rows - 1; i >= 0; i--) {
        let row = document.createElement("tr");

        // Add row header (row numbers)
        let rowHeader = document.createElement("th");
        rowHeader.textContent = i + 1;
        row.appendChild(rowHeader);

        // Add cells
        for (let j = 0; j < columns; j++) {
            let col = document.createElement("td");
            col.classList.add(`row-${i}`);
            col.classList.add(`col-${j}`);
            col.addEventListener("click", placeMove);
            row.appendChild(col);
        }
        boardElement.appendChild(row);
    }

    // Add column headers (A-Z) at the bottom of the board
    let footerRow = document.createElement("tr");
    footerRow.appendChild(document.createElement("th")); // Empty corner cell

    for (let j = 0; j < columns; j++) {
        let th = document.createElement("th");
        th.textContent = String.fromCharCode(65 + j); // Convert number to letter
        footerRow.appendChild(th);
    }
    boardElement.appendChild(footerRow);
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
    if (moveHistory.length === 0) return; // No moves to undo

    let lastMove = moveHistory.pop(); // Get the last move
    redoStack.push(lastMove); // Save it in the redo stack

    let box = document.querySelector(`.col-${lastMove.cord[0]}.row-${lastMove.cord[1]}`);
    box.classList.remove(lastMove.player === 1 ? "x" : "o"); // Remove X or O
    box.addEventListener("click", placeMove); // Make the box clickable again

    // Remove the move from the respective player's moves list
    if (lastMove.player === 1) {
        player_1_moves.pop();
        turn = 1; // Set turn back to player 1
    } else {
        player_2_moves.pop();
        turn = 2; // Set turn back to player 2
    }
}

function redoMove() {
    if (redoStack.length === 0) return; // No moves to redo

    let nextMove = redoStack.pop(); // Get the last undone move
    moveHistory.push(nextMove); // Save it back to the move history

    let box = document.querySelector(`.col-${nextMove.cord[0]}.row-${nextMove.cord[1]}`);
    box.classList.add(nextMove.player === 1 ? "x" : "o"); // Add X or O
    box.removeEventListener("click", placeMove); // Make the box unclickable

    // Add the move back to the respective player's moves list
    if (nextMove.player === 1) {
        player_1_moves.push(nextMove.cord);
        turn = 2; // Set turn back to player 2
    } else {
        player_2_moves.push(nextMove.cord);
        turn = 1; // Set turn back to player 1
    }
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

function showCoordinates(e) {
    let box = e.target;

    // Ensure we're hovering over a valid cell
    if (box.tagName === "TD") {
        let cord = getCord(box.classList);
        let colLetter = String.fromCharCode(65 + cord[0]); // Convert column index to letter (A, B, ...)
        let rowNumber = cord[1] + 1; // Convert row index to row number

        // Display the coordinates (e.g., "A1")
        let coordDisplay = document.querySelector("#hover-coordinates");
        coordDisplay.textContent = `Coordinates: ${colLetter}${rowNumber}`;
    }
}

function clearCoordinates() {
    let coordDisplay = document.querySelector("#hover-coordinates");
    coordDisplay.textContent = ""; // Clear coordinates display when not hovering
}

// Attach event listeners for hovering
boardElement.addEventListener("mouseover", showCoordinates);
boardElement.addEventListener("mouseout", clearCoordinates);

// Attach event listeners to buttons
btnStart.addEventListener("click", newGame);
btnUndo.addEventListener("click", undoMove);
btnRedo.addEventListener("click", redoMove);

newGame();
