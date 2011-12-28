function init() {
	var canvas = document.getElementById("gameboy");  
	if (canvas.getContext) {
		var context = canvas.getContext("2d");
		context.fillStyle = "rgb(200,0,0)";
        context.fillRect(10, 10, 55, 50);
	} else {
		
	}
}