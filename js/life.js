const ROWS = 160;
const COLS = 240;

const PIXEL_SIZE = 8;

const PIXEL_ROWS = ROWS / PIXEL_SIZE;
const PIXEL_COLS = COLS / PIXEL_SIZE;

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

var cells;
var cursorPosition = [PIXEL_ROWS / 2, PIXEL_COLS / 2];

function init() {
	cells = new Array(PIXEL_ROWS);
	for (var i = 0; i < cells.length; i++) {
		cells[i] = new Array(PIXEL_COLS);
		
		for (var j = 0; j < cells[i].length; j++) {
			cells[i][j] = new Cell(false, false);
		}
	}

	update();
}

function update(context) {
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
	}
}

function clearAllCells() {
	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].currentStatus = false;
			cells[row][col].nextStatus = false;
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
	}
});