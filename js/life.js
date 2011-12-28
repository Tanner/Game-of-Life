const ROWS = 160;
const COLS = 240;

const ALIVE = true;
const DEAD = false;

const PIXEL_SIZE = 8;

const PIXEL_ROWS = ROWS / PIXEL_SIZE;
const PIXEL_COLS = COLS / PIXEL_SIZE;

const DELAY = 250;

Mode = {
	TITLE : 0,
	STEP : 1,
	STOP : 2,
	RUN : 3
}

Selection = {
	FREE : 0,
	ONE: 1,
	TWO: 2
}

var currentMode = Mode.TITLE;
var selection = Selection.FREE;

var timer;
var cells;
var cursorPosition = [PIXEL_ROWS / 2, PIXEL_COLS / 2];

function init() {
	cells = new Array(PIXEL_ROWS);
	for (var i = 0; i < cells.length; i++) {
		cells[i] = new Array(PIXEL_COLS);
		
		for (var j = 0; j < cells[i].length; j++) {
			cells[i][j] = new Cell(DEAD, DEAD);
		}
	}

	update();
}

function update() {
	var canvas = document.getElementById("gameboy");  
	if (canvas.getContext) {
		var context = canvas.getContext("2d");
		
		if (currentMode == Mode.TITLE) {
			var titleImage = new Image();
			titleImage.onload = function() {
				context.drawImage(titleImage, 0, 0);
			};
			titleImage.src = 'images/title.png';
			
			var newCell = new Image();
			newCell.onload = function() {
				context.drawImage(newCell, 71, 86 + selection * 20);
			};
			newCell.src = 'images/new_cell.png';
		}
		
		if (currentMode == Mode.RUN) {
			updateCells();
			
			render(context);
		}
	}
}

function render(context) {

}

function updateCells() {
	for (var row = 0; row < PIXEL_ROWS; row++) {
		for (var column = 0; column < PIXEL_COLS; column++) {
			cells[row][column].currentStatus = cells[row][column].nextStatus;
		}
	}

	for (var row = 0; row < PIXEL_ROWS; row++) {
		for (var column = 0; column < PIXEL_COLS; column++) {
			var numberOfNeighbors = getNeighborCount(row, column);
			
			if (cells[row][column].currentStatus == ALIVE) {
				if (numberOfNeighbors < 2 || numberOfNeighbors > 3) {
					cells[row][column].nextStatus = DEAD;
				}
			} else {
				if (numberOfNeighbors == 3) {
					cells[row][column].nextStatus = ALIVE;
				}
			}
		}
	}
}

function getNeighborCount(row, column) {
    var count = 0;

    // Above
    count += getCellAtPosition(row - 1, column).currentStatus ? 1 : 0;

    // Below
    count += getCellAtPosition(row + 1, column).currentStatus ? 1 : 0;

    // Left
    count += getCellAtPosition(row, column - 1).currentStatus ? 1 : 0;

    // Right
    count += getCellAtPosition(row, column + 1).currentStatus ? 1 : 0;

    // Top Left
    count += getCellAtPosition(row - 1, column - 1).currentStatus ? 1 : 0;

    // Top Right
    count += getCellAtPosition(row - 1, column + 1).currentStatus ? 1 : 0;

    // Bottom Right
    count += getCellAtPosition(row + 1, column + 1).currentStatus ? 1 : 0;

    // Bottom Left
    count += getCellAtPosition(row + 1, column - 1).currentStatus ? 1 : 0;

    return count;
}

function getCellAtPosition(row, column) {
    if (row < 0) {
        row = PIXEL_ROWS - 1;
    } else if (row >= PIXEL_ROWS) {
        row = 0;
    }

    if (column < 0) {
        column = PIXEL_COLS - 1;
    } else if (column >= PIXEL_COLS) {
        column = 0;
    }

    return cells[row][column];
}

function clearAllCells() {
	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].currentStatus = DEAD;
			cells[row][col].nextStatus = DEAD;
		}
	}
}

function Cell(currentStatus, nextStatus) {
	this.currentStatus = currentStatus;
	this.nextStatus = nextStatus;
}

key('down', function() {
	if (currentMode == Mode.TITLE) {
		if (selection != Selection.TWO) {
			selection++;
		}
	
		update();
	}
});

key('up', function() {
	if (currentMode == Mode.TITLE) {
		if (selection != Selection.FREE) {
			selection--;
		}
	
		update();
	}
});

key('z', function() {
	// A Button
	if (currentMode == Mode.TITLE) {
		clearAllCells();
		cursorPosition[0] = PIXEL_ROWS / 2;
		cursorPosition[1] = PIXEL_COLS / 2;
		
		currentMode = Mode.RUN;
		timer = window.setInterval(update, DELAY);
	}
});