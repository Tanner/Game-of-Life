Mode = {
	TITLE : 0,
	STEP : 1,
	STOP : 2,
	RUN : 3
}

var currentMode = Mode.TITLE;

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
		}
	}
}

