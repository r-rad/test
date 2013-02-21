var canvas, ctx;
var draw = false;
var points, pointer;

var drawFunction = null;

window.onload = function(){

	points = new Array(10);
	canvas = document.getElementById("app");
	buffer = document.getElementById("buffer");
	ctx = canvas.getContext("2d");
	bufferCtx = buffer.getContext("2d");
	
	pencil();
}

function pencil()
{
	$("#buffer").mousedown(function(e){
		var canvasPosition = $(this).offset();
		var mouseX = e.originalEvent.layerX || 0;
		var mouseY = e.originalEvent.layerY || 0;

		ctx.beginPath();
		ctx.arc(mouseX, mouseY, 0.5, 0, Math.PI*2, true);
		ctx.fill();
		draw = true;
		points[0] = [mouseX, mouseY];
		pointer = 0;
	});	

	$("#buffer").mousemove(function(e){
		if(draw)
		{
			var canvasPosition = $(this).offset();
			var mouseX = e.originalEvent.layerX || 0;
			var mouseY = e.originalEvent.layerY || 0;

			var nextPoint = pointer + 1;
			if(nextPoint > 9)
			{
				nextPoint = 0;
			}

			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.moveTo(points[pointer][0], points[pointer][1]);
			ctx.lineTo(mouseX, mouseY);
			ctx.stroke();	
			pointer = nextPoint;
			points[pointer] = [mouseX, mouseY];
		}
	});

	$("#buffer").mouseup(function(){
		points = new Array(10);
		draw = false;
	});
}

function drawLine()
{
	$("#buffer").mousedown(function(e){
		var canvasPosition = $(this).offset();
		var mouseX = e.originalEvent.layerX || 0;
		var mouseY = e.originalEvent.layerY || 0;

		draw = true;
		points[0] = [mouseX, mouseY];
	});

	$("#buffer").mousemove(function(e){
		if(draw){
			bufferCtx.clearRect(0, 0, bufferCtx.canvas.width, bufferCtx.canvas.height);
			var canvasPosition = $(this).offset();
			var mouseX = e.originalEvent.layerX || 0;
			var mouseY = e.originalEvent.layerY || 0;
			bufferCtx.beginPath();
			bufferCtx.moveTo(points[0][0], points[0][1]);
			bufferCtx.lineTo(mouseX, mouseY);
			bufferCtx.stroke();
			points[1] = [mouseX, mouseY];
		}
	});

	$("#buffer").mouseup(function(e){
		bufferCtx.clearRect(0, 0, bufferCtx.canvas.width, bufferCtx.canvas.height);
		ctx.beginPath();
		ctx.moveTo(points[0][0], points[0][1]);
		ctx.lineTo(points[1][0], points[1][1]);
		ctx.stroke();
		points = new Array(10);
		draw = false;
	});
}

function drawRectangle()
{
	$("#buffer").mousedown(function(e){
		var canvasPosition = $(this).offset();
		var mouseX = e.originalEvent.layerX || 0;
		var mouseY = e.originalEvent.layerY || 0;

		draw = true;
		points[0] = [mouseX, mouseY];
	});

	$("#buffer").mousemove(function(e){
		if(draw){
			bufferCtx.clearRect(0, 0, bufferCtx.canvas.width, bufferCtx.canvas.height);
			var canvasPosition = $(this).offset();
			var mouseX = e.originalEvent.layerX || 0;
			var mouseY = e.originalEvent.layerY || 0;
			points[1] = [mouseX, mouseY];
			var width = points[1][0] - points[0][0];
			var height = points[1][1] - points[0][1];

			bufferCtx.strokeRect(points[0][0], points[0][1], width, height);

		}
	});

	$("#buffer").mouseup(function(e){
		bufferCtx.clearRect(0, 0, bufferCtx.canvas.width, bufferCtx.canvas.height);

		var width = points[1][0] - points[0][0];
		var height = points[1][1] - points[0][1];

		ctx.strokeRect(points[0][0], points[0][1], width, height);

		points = new Array(10);
		draw = false;
	});	
}

function drawCircle()
{
	$("#buffer").mousedown(function(e){
		var canvasPosition = $(this).offset();
		var mouseX = e.originalEvent.layerX || 0;
		var mouseY = e.originalEvent.layerY || 0;

		draw = true;
		points[0] = [mouseX, mouseY];
	});

	$("#buffer").mousemove(function(e){
		if(draw)
		{
			bufferCtx.clearRect(0, 0, bufferCtx.canvas.width, bufferCtx.canvas.height);
			var canvasPosition = $(this).offset();
			points[1] = e.originalEvent.layerY || 0;
			var x = points[0][0];
			var y = points[0][1];
			var radius = points[1] - points[0][1];
			if(radius <= 0)
				radius = 0

			bufferCtx.beginPath();
			bufferCtx.arc(x, y, radius, 0, Math.PI*2, false);
			bufferCtx.stroke();
			bufferCtx.closePath();
		}
		
	});

	$("#buffer").mouseup(function(e){
		bufferCtx.clearRect(0, 0, bufferCtx.canvas.width, bufferCtx.canvas.height);
		var x = points[0][0];
		var y = points[0][1];
		var radius = points[1] - points[0][1];
		if(radius <= 0)
				radius = 0

		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI*2, false);
		ctx.stroke();
		ctx.closePath();
		draw = false;
	});
}