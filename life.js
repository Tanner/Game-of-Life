Mode = {
	TITLE : 0,
	STEP : 1,
	STOP : 2,
	RUN : 3
}

var currentMode = Mode.TITLE;

function init() {
	var canvas = document.getElementById("gameboy");  
	if (canvas.getContext) {
		var context = canvas.getContext("2d");
		
		update(context);
	} else {
		
	}
}

function update(context) {
	if (currentMode == Mode.TITLE) {
		var titleImage = new Image();
		titleImage.onload = function() {
			context.drawImage(titleImage, 0, 0);
		};
		titleImage.src = 'images/title.png';
	}
}