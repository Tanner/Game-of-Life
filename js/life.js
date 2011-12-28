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

function init() {
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