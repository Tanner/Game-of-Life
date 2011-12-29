const ROWS = 160;
const COLS = 240;

const ALIVE = true;
const DEAD = false;

const PIXEL_SIZE = 8;

const PIXEL_ROWS = ROWS / PIXEL_SIZE;
const PIXEL_COLS = COLS / PIXEL_SIZE;

const FPS = 20;
const DELAY = 250;

Mode = {
	TITLE : 0,
	STEP : 1,
	STOP : 2,
	RUN : 3
}

DisplayMode = {
	NORMAL : 0,
	NEXT : 1
}

Selection = {
	FREE : 0,
	ONE: 1,
	TWO: 2
}

var currentMode = Mode.TITLE;
var currentDisplayMode = Mode.NORMAL;
var selection = Selection.FREE;

var renderTimer;
var stepTimer;

var cells;
var cursorPosition = [PIXEL_ROWS / 2, PIXEL_COLS / 2];
var repaint;

function init() {
	cells = new Array(PIXEL_ROWS);
	for (var i = 0; i < cells.length; i++) {
		cells[i] = new Array(PIXEL_COLS);
		
		for (var j = 0; j < cells[i].length; j++) {
			cells[i][j] = new Cell(DEAD, DEAD);
		}
	}
	
	repaint = true;
	
	renderTimer = window.setInterval(update, 1000 / FPS);
	update();
}

function update() {
	var canvas = document.getElementById("gameboy");  
	if (canvas.getContext) {
		var context = canvas.getContext("2d");
		
		if (repaint) {
			render(context);
			repaint = false;
		}
	}
}

function step() {
	updateCells();
	repaint = true;
}

function render(context) {
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
	} else {
		context.clearRect(0, 0, COLS, ROWS);
		
		for (var row = 0; row < PIXEL_ROWS; row++) {
			for (var column = 0; column < PIXEL_COLS; column++) {
				var cell = cells[row][column];
				if (!(cell.currentStatus == DEAD && cell.nextStatus == DEAD)) {
					drawCell(context, cell, row, column);
				}
			}
		}
		
		if (currentMode == Mode.STOP) {
			drawCursor(context, cursorPosition[1], cursorPosition[0]);
		}
	}
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

function drawCell(context, cell, row, column) {
	var cellImage = new Image();
	cellImage.onload = function() {
		context.drawImage(cellImage, column * PIXEL_SIZE, row * PIXEL_SIZE);
	};

    if (currentDisplayMode == DisplayMode.NEXT) {
        if (cell.currentStatus && cell.nextStatus) {
        	cellImage.src = 'images/cell.png';
        } else if (cell.currentStatus && !cell.nextStatus) {
        	cellImage.src = 'images/dying_cell.png';
        } else if (!cell.currentStatus && cell.nextStatus) {
        	cellImage.src = 'images/new_cell.png';
        }
    } else if (currentDisplayMode == DisplayMode.NORMAL && cell.currentStatus) {
    	cellImage.src = 'images/cell.png';
	}
}

function drawCursor(context, row, column) {
    row *= PIXEL_SIZE;
    column *= PIXEL_SIZE;
    
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.strokeRect(row, column, PIXEL_SIZE, PIXEL_SIZE);
}

function Cell(currentStatus, nextStatus) {
	this.currentStatus = currentStatus;
	this.nextStatus = nextStatus;
}

key('down', function() {
	if (currentMode == Mode.TITLE) {
		if (selection != Selection.TWO) {
			selection++;
			repaint = true;
		}
	} else if (currentMode == Mode.STOP && cursorPosition[0] < PIXEL_ROWS - 1) {
		cursorPosition[0]++;
		repaint = true;
	}
});

key('up', function() {
	if (currentMode == Mode.TITLE) {
		if (selection != Selection.FREE) {
			selection--;
			repaint = true;
		}
	} else if (currentMode == Mode.STOP && cursorPosition[0] > 0) {
		cursorPosition[0]--;
		repaint = true;
	}
});

key('left', function() {
	if (currentMode == Mode.STOP && cursorPosition[0] > 0) {
		cursorPosition[1]--;
		repaint = true;
	}
});

key('right', function() {
	if (currentMode == Mode.STOP && cursorPosition[0] < PIXEL_COLS - 1) {
		cursorPosition[1]++;
		repaint = true;
	}
});

key('enter', function() {
	if (currentMode == Mode.TITLE) {
		clearAllCells();
		cursorPosition[0] = PIXEL_ROWS / 2;
		cursorPosition[1] = PIXEL_COLS / 2;
		
		switch (selection) {
			case Selection.ONE:
				cells[4][5] = new Cell(DEAD, ALIVE);
				cells[4][6] = new Cell(DEAD, ALIVE);
				cells[4][7] = new Cell(DEAD, ALIVE);
				cells[3][7] = new Cell(DEAD, ALIVE);
				cells[2][6] = new Cell(DEAD, ALIVE);
		
				break;
			case Selection.TWO:
				cells[4][5] = new Cell(DEAD, ALIVE);
				cells[6][5] = new Cell(DEAD, ALIVE);
				cells[7][6] = new Cell(DEAD, ALIVE);
				cells[7][7] = new Cell(DEAD, ALIVE);
				cells[7][8] = new Cell(DEAD, ALIVE);
				cells[7][9] = new Cell(DEAD, ALIVE);
				cells[6][9] = new Cell(DEAD, ALIVE);
				cells[5][9] = new Cell(DEAD, ALIVE);
				cells[4][8] = new Cell(DEAD, ALIVE);
				
				break;
		}
		
		currentMode = Mode.RUN;
		currentDisplayMode = DisplayMode.NORMAL;
		
		repaint = true;
		
		stepTimer = window.setInterval(step, DELAY);
	} else if (currentMode == Mode.STOP) {
		var cell = cells[cursorPosition[0]][cursorPosition[1]];
		cell.currentStatus = !cell.currentStatus;
		cell.nextStatus = !cell.nextStatus;
		
		repaint = true;
	}
});

key('esc', function() {
	selection = Selection.FREE;
	currentMode = Mode.TITLE;
	
	window.clearInterval(stepTimer);
	
	repaint = true;
});

key('m', function() {
	switch (currentMode) {
		case Mode.STEP:
			currentMode = Mode.RUN;
			stepTimer = window.setInterval(step, DELAY);
			break;
		case Mode.RUN:
			currentMode = Mode.STOP;
			window.clearInterval(stepTimer);
			break;
		case Mode.STOP:
			currentMode = Mode.STEP;
			break;
	}
	
	repaint = true;
});

key('d', function() {
	if (currentDisplayMode == DisplayMode.NORMAL) {
		currentDisplayMode = DisplayMode.NEXT;
	} else if (currentDisplayMode == DisplayMode.NEXT) {
		currentDisplayMode = DisplayMode.NORMAL;
	}
	
	
	repaint = true;
});

key('s', function() {
	if (currentMode == Mode.STEP) {
		step();
	}
});

key('e', function() {
	if (currentMode == Mode.STOP) {
		clearAllCells();
		repaint = true;
	}
});