window.onload = function(){
	var mysl1 = new slider('sl', 300, 1, 100, 0); 
	Canvas.init('app', 'buffer');
	var clearButton = document.getElementById("clearButton");
	var saveButton = document.getElementById("saveButton");
	var toolSelect = document.getElementById("tool");
	var colorSelect = document.getElementById("selectColor");
	var widthSelect = document.getElementById("linewidthvalue");
	var filledCheck = document.getElementById("filled");
	clearButton.onclick = clearButtonHandler;
	saveButton.onclick = saveButtonHandler;
	toolSelect.onchange = toolSelectHandler;
	colorSelect.onchange = colorSelectHandler;
	widthSelect.onchange = widthSelectHandler;
	filledCheck.onclick = filledHandler;

	function filledHandler()
	{
		if(filledCheck.checked)
		{
			Canvas.filled = true;
		}
		else
		{
			Canvas.filled = false;
		}
	}

	function clearButtonHandler()
	{
		Canvas.clear(Canvas.ctx);
		drawRect(Canvas.ctx, 0 ,0, Canvas.ctx.canvas.width, Canvas.ctx.canvas.width, 0, "#FFFFFF", true); //TODO: add to function
		saveImageToLS(Canvas.canv);
	}

	function saveButtonHandler()
	{
		window.open(Canvas.canv.toDataURL());
	}

	function toolSelectHandler()
	{
		if(toolSelect.options[toolSelect.selectedIndex].value == "pencil")
		{
			Canvas.tool = Pencil;
		}
		if(toolSelect.options[toolSelect.selectedIndex].value == "line")
		{
			Canvas.tool = Line;
		}
		if(toolSelect.options[toolSelect.selectedIndex].value == "rectangle")
		{
			Canvas.tool = Rectangle;
		}
		if(toolSelect.options[toolSelect.selectedIndex].value == "circle")
		{
			Canvas.tool = Circle;
		}
		if(toolSelect.options[toolSelect.selectedIndex].value == "fill")
		{
			Canvas.tool = Fill;
		}
		if(toolSelect.options[toolSelect.selectedIndex].value == "ellipse")
		{
			Canvas.tool = Ellipse;
		}

	}

	function colorSelectHandler()
	{
		Canvas.selectedColor = colorSelect.options[colorSelect.selectedIndex].value;
	}

	function widthSelectHandler()
	{
		Canvas.selectedWidth = parseInt(widthSelect.value);
	}

}

function logb(number, base) 
{
    return Math.log(number) / Math.log(base);
};

function coordXY(e)
{
	if(window.navigator.userAgent.match(/Firefox\/\w+\.\w+/i))
	{
		return [e.layerX, e.layerY];
	}
	return [e.offsetX, e.offsetY];
}

function hexToRGB(hex) 
{
	cutHex = (hex.charAt(0)=="#") ? hex.substring(1,7):hex;
	var r = parseInt(cutHex.substring(0,2),16);
	var g = parseInt(cutHex.substring(2,4),16);
	var b = parseInt(cutHex.substring(4,6),16);
	return [r, g, b];
}

function drawLine(points, context)
{
	var width = Math.sqrt(Math.pow(points[1][0] - points[0][0], 2) + Math.pow(points[1][1] - points[0][1], 2));
	var counter = Math.round(logb(width, 2));

	var middlePoint = [((points[1][0] + points[0][0]) / 2), ((points[1][1] + points[0][1]) / 2)];
	if(counter <= 0)
	{	
		drawCircle(context, middlePoint[0], middlePoint[1], Canvas.selectedWidth * 0.5, 0, Canvas.selectedColor, true);
		return;
	}
	var nextPointsLeft = [points[0], middlePoint];
	var nextPointsRight = [middlePoint, points[1]];
	
	drawCircle(context, middlePoint[0], middlePoint[1], Canvas.selectedWidth * 0.5, 0, Canvas.selectedColor, true);

	drawLine(nextPointsLeft, context);
	drawLine(nextPointsRight, context);
}

function drawCircle(context, x, y, radius, lineWidth, color, filled)
{
	context.beginPath();
	context.strokeStyle = Canvas.selectedColor;
	context.lineWidth = lineWidth;
	context.arc(x, y, radius, 0, Math.PI * 2, true);
	if(filled)
	{
		context.fillStyle = color;
		context.fill()
	}
	else
	{
		context.stroke();
	}
	context.closePath();
}

function drawRect(context, x, y, width, height, lineWidth, color, filled)
{
	context.strokeStyle = color;
	context.lineWidth = lineWidth;
	if(filled)
	{
		context.fillStyle = color;
		context.fillRect(x, y, width, height);
	}
	else
	{
		context.strokeRect(x, y, width, height);
	}
}

function drawEllipse(context, x, y, w, h, lineWidth, color, filled) 
{
  var kappa = .5522848;
  var ox = (w / 2) * kappa;
  var oy = (h / 2) * kappa;
  var xe = x + w;
  var ye = y + h;
  var xm = x + w / 2;
  var ym = y + h / 2;       

  context.beginPath();
  context.lineWidth = lineWidth;
  context.strokeStyle = color;
  context.moveTo(x, ym);
  context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  context.closePath();
  if(filled)
  {
  	context.fillStyle = color;
  	context.fill();
  }
  else
  {
  	context.stroke();
  }
}

function floodFill(canvasData, x, y, newColor)
{
	var pos = ((y - 1) * Canvas.canv.width + x) * 4;
	var points = []
	var oldColor = [canvasData.data[pos + 0], canvasData.data[pos + 1], canvasData.data[pos + 2]];
	var newColorRGB = hexToRGB(newColor);
	points.push(pos)
	while(points.length != 0)
	{
		if(newColorRGB[0] == oldColor[0] && newColorRGB[1] == oldColor[1] && newColorRGB[2] == oldColor[2])
		{
			return;
		}
		else
		{
			if(canvasData.data[points[0] + 0] == oldColor[0] && canvasData.data[points[0] + 1] == oldColor[1] && canvasData.data[points[0] + 2] == oldColor[2] && canvasData.data[points[0]] != undefined)
			{
				canvasData.data[points[0] + 0] = newColorRGB[0];
				canvasData.data[points[0] + 1] = newColorRGB[1];
				canvasData.data[points[0] + 2] = newColorRGB[2];
				var leftPoint = points[0] - 4;
				var rightPoint = points[0] + 4;
				var topPoint = points[0] + 854 * 4;
				var bottomPoint = points[0] - 854 * 4;
				if(canvasData.data[leftPoint + 0] == oldColor[0] && canvasData.data[leftPoint + 1] == oldColor[1] && canvasData.data[leftPoint + 2] == oldColor[2] && canvasData.data[leftPoint] != undefined)
				{
					points.push(leftPoint);
				}
				if(canvasData.data[rightPoint + 0] == oldColor[0] && canvasData.data[rightPoint + 1] == oldColor[1] && canvasData.data[rightPoint + 2] == oldColor[2] && canvasData.data[rightPoint] != undefined)
				{
					points.push(rightPoint)
				}
				if(canvasData.data[topPoint + 0] == oldColor[0] && canvasData.data[topPoint + 1] == oldColor[1] && canvasData.data[topPoint + 2] == oldColor[2] && canvasData.data[topPoint] != undefined)
				{
					points.push(topPoint)
				}
				if(canvasData.data[bottomPoint + 0] == oldColor[0] && canvasData.data[bottomPoint + 1] == oldColor[1] && canvasData.data[bottomPoint + 2] == oldColor[2] && canvasData.data[bottomPoint] != undefined)
				{
					points.push(bottomPoint)
				}
			}	
			points.shift();
		}
	}
}

function saveImageToLS(canvas)
{
	localStorage.setItem('image', canvas.toDataURL("image/png"));
}
function loadImageFromLS(context)
{
	if(localStorage['image']){
		var img = new Image();
		img.addEventListener("load", function (event) {
        	context.drawImage(img, 0, 0);
        }, false);
		img.src = localStorage.getItem('image');
	}
}

/***********************************************************************************************
*                                         CANVAS                                               *
***********************************************************************************************/

var Canvas = {};

Canvas.init = function(canvasId, bufferId)
{
	this.canv = document.getElementById(canvasId);
	this.buffer = document.getElementById(bufferId);

	this.ctx = this.canv.getContext("2d");
	this.bufferCtx = this.buffer.getContext("2d");
	this.selectedColor = "#000000";
	this.selectedFillColor = "#FFFFFF";
	this.selectedWidth = 1;
	this.tool = Pencil;
	this.drawing = false;
	this.filled = true;

	drawRect(Canvas.ctx, 0 ,0, this.canv.width, this.canv.height, 0, "#FFFFFF", true);
	loadImageFromLS(Canvas.ctx)

	/*var grad = Canvas.ctx.createLinearGradient(0, 0, 500, 0);
	var grad = Canvas.ctx.createRadialGradient(0, 0, 400, 0, 0, 250);
    grad.addColorStop(0.2, 'white');
    
    grad.addColorStop(0.5, 'gray');
    grad.addColorStop(0, 'white');
    grad.addColorStop(0.2, 'orange');
    grad.addColorStop(0.4, 'yellow');
    grad.addColorStop(0.6, 'green');
    grad.addColorStop(0.8, 'lightblue');
    grad.addColorStop(1, 'blue');
    grad.addColorStop(0.6, 'violet');
    grad.addColorStop(1, 'white');
    grad.addColorStop(0.4, 'green');
    grad.addColorStop(0.8, 'black');
    grad.addColorStop(0, 'black');

    Canvas.bufferCtx.fillStyle = grad;
    Canvas.bufferCtx.fillRect(0, 0, 500, 300);*/

	this.buffer.onmousedown = function(e)
	{
		Canvas.tool.start(e);
	
	};

	this.buffer.onmouseup = function(e)
	{
		Canvas.tool.finish(e);
		saveImageToLS(Canvas.canv);
	};

	this.buffer.onmousemove = function(e)
	{
		if(Canvas.drawing)
		{
			Canvas.tool.move(e);
		}
		//Canvas.tool.preview(e); maybe in future
	};
};

Canvas.setTool = function(tool)
{
	Canvas.tool = tool;
};

Canvas.setWidth = function(width)
{
	Canvas.selectedWidth = width;
};

Canvas.setColor = function(color)
{
	Canvas.selectedColor = color;
};

Canvas.clear = function(context)
{
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};

/***********************************************************************************************
*                                         PENCIL                                               *
***********************************************************************************************/

var Pencil = {};

Pencil.start = function(e)
{
	Pencil.points = new Array(2)
	Pencil.points[0] = coordXY(e);

	drawCircle(Canvas.ctx, Pencil.points[0][0], Pencil.points[0][1], Canvas.selectedWidth * 0.5, 0, Canvas.selectedColor, true);

	Canvas.ctx.beginPath();
	Canvas.ctx.lineCap = 'round';
   	Canvas.ctx.strokeStyle = Canvas.selectedColor;
   	Canvas.ctx.lineWidth = Canvas.selectedWidth;
   	Canvas.ctx.moveTo(Pencil.points[0][0], Pencil.points[0][1]);

	Canvas.drawing = true;
};

Pencil.move = function(e)
{
	Pencil.points[1] = coordXY(e);

	Canvas.ctx.lineTo(Pencil.points[1][0], Pencil.points[1][1]);
   	Canvas.ctx.stroke();

   	Canvas.ctx.beginPath();
   	Canvas.ctx.moveTo(Pencil.points[1][0], Pencil.points[1][1]);
};

Pencil.finish = function(e)
{
	Pencil.points[1] = coordXY(e);

    Canvas.ctx.lineTo(Pencil.points[1][0], Pencil.points[1][1]);
    Canvas.ctx.stroke();

	Canvas.drawing = false;
};

//This function now isn't used
Pencil.preview = function(e)
{
	Canvas.clear(Canvas.bufferCtx);
	Pencil.points = new Array(1);
	Pencil.points[0] = coordXY(e);

	drawCircle(Canvas.bufferCtx, Pencil.points[0][0], Pencil.points[0][1], Canvas.selectedWidth * 0.5, 0, Canvas.selectedColor, false);
}

/***********************************************************************************************
*                                         LINE                                                 *
***********************************************************************************************/

var Line = {};

Line.start = function(e)
{
	Line.points = new Array(2);
	Line.points[0] = coordXY(e);

	Canvas.drawing = true;
};

Line.move = function(e)
{
	Canvas.clear(Canvas.bufferCtx);

	Line.points[1] = coordXY(e);	

	Canvas.bufferCtx.beginPath();
	Canvas.bufferCtx.lineCap = 'butt';
	Canvas.bufferCtx.strokeStyle = Canvas.selectedColor;
	Canvas.bufferCtx.lineWidth = Canvas.selectedWidth;
	Canvas.bufferCtx.moveTo(Line.points[0][0], Line.points[0][1]);
	Canvas.bufferCtx.lineTo(Line.points[1][0], Line.points[1][1]);
	Canvas.bufferCtx.stroke();
};

Line.finish = function(e)
{
	Canvas.clear(Canvas.bufferCtx);

	Canvas.ctx.beginPath();
	Canvas.ctx.lineCap = 'butt';
	Canvas.ctx.strokeStyle = Canvas.selectedColor;
	Canvas.ctx.lineWidth = Canvas.selectedWidth;
	Canvas.ctx.moveTo(Line.points[0][0], Line.points[0][1]);
	Canvas.ctx.lineTo(Line.points[1][0], Line.points[1][1]);
	Canvas.ctx.stroke();

	Canvas.drawing = false;
};

/***********************************************************************************************
*                                         RECTANGLE                                            *
***********************************************************************************************/

var Rectangle = {};

Rectangle.start = function(e)
{
	Rectangle.points = new Array(2);
	Rectangle.points[0] = coordXY(e);

	Canvas.drawing = true;
};

Rectangle.move = function(e)
{
	Canvas.clear(Canvas.bufferCtx);

	Rectangle.points[1] = coordXY(e);
	Rectangle.width = Rectangle.points[1][0] - Rectangle.points[0][0];
	Rectangle.height = Rectangle.points[1][1] - Rectangle.points[0][1];	

	drawRect(Canvas.bufferCtx, Rectangle.points[0][0], Rectangle.points[0][1], Rectangle.width, Rectangle.height, Canvas.selectedWidth, Canvas.selectedColor, Canvas.filled);
};

Rectangle.finish = function(e)
{
	Canvas.clear(Canvas.bufferCtx);

	drawRect(Canvas.ctx, Rectangle.points[0][0], Rectangle.points[0][1], Rectangle.width, Rectangle.height, Canvas.selectedWidth, Canvas.selectedColor, Canvas.filled);

	Canvas.drawing = false;
};

/***********************************************************************************************
*                                         CIRCLE                                               *
***********************************************************************************************/

var Circle = {};

Circle.start = function(e)
{
	Circle.points = new Array(2);
	Circle.points[0] = coordXY(e);

	Canvas.drawing = true;
};

Circle.move = function(e)
{
	Canvas.clear(Canvas.bufferCtx);

	Circle.points[1] = coordXY(e);
	Circle.radius = Circle.points[1][1] - Circle.points[0][1];
	if(Circle.radius <= 0)
		Circle.radius = 0

	drawCircle(Canvas.bufferCtx, Circle.points[0][0], Circle.points[0][1], Circle.radius, Canvas.selectedWidth, Canvas.selectedColor, Canvas.filled);
};

Circle.finish = function(e)
{
	Canvas.clear(Canvas.bufferCtx);

	drawCircle(Canvas.ctx, Circle.points[0][0], Circle.points[0][1], Circle.radius, Canvas.selectedWidth, Canvas.selectedColor, Canvas.filled);

	Circle.radius = 0;
	Canvas.drawing = false;
};

/***********************************************************************************************
*                                         ELLIPSE                                              *
***********************************************************************************************/

var Ellipse = {}

Ellipse.start = function(e)
{
	Ellipse.points = new Array(2);
	Ellipse.points[0] = coordXY(e);
	Canvas.drawing = true;
}

Ellipse.move = function(e)
{
	Canvas.clear(Canvas.bufferCtx);
	Ellipse.points[1] = coordXY(e);
	Ellipse.width = Ellipse.points[1][0] - Ellipse.points[0][0];
	Ellipse.height = Ellipse.points[1][1] - Ellipse.points[0][1];

	drawEllipse(Canvas.bufferCtx, Ellipse.points[0][0], Ellipse.points[0][1], Ellipse.width, Ellipse.height, Canvas.selectedWidth, Canvas.selectedColor, Canvas.filled);

}

Ellipse.finish = function(e)
{
	Canvas.clear(Canvas.bufferCtx);

	drawEllipse(Canvas.ctx, Ellipse.points[0][0], Ellipse.points[0][1], Ellipse.width, Ellipse.height, Canvas.selectedWidth, Canvas.selectedColor, Canvas.filled);

	Canvas.drawing = false;
}

/***********************************************************************************************
*                                          FILL                                                *
* Supported after adding backend                                                               *
***********************************************************************************************/

var Fill = {};

Fill.start = function(e)
{
	Fill.points = new Array(1);
	Fill.points[0] = coordXY(e);
	var canvasData = Canvas.ctx.getImageData(0, 0, Canvas.canv.width, Canvas.canv.height);
	
	floodFill(canvasData, Fill.points[0][0], Fill.points[0][1], Canvas.selectedColor);
	Canvas.ctx.putImageData(canvasData, 0, 0);
}

Fill.move = function(e) {}
Fill.finish = function(e) {}

function slider(elemId, sliderWidth, range1, range2, step) {
	var knobWidth = 17;				// ширина и высота бегунка
	var knobHeight = 21;			// изменяются в зависимости от используемых изображений
	var sliderHeight = 21;			// высота slider'а
	
	var offsX,tmp;					// вспомагательные переменные
	var d = document;
	var isIE = d.all || window.opera;	// определяем модель DOM
	var point = (sliderWidth-knobWidth-3)/(range2-range1);
	// point - количество пикселей на единицу значения
	
	var slider = d.createElement('div'); // создаем slider
	slider.id = elemId + '_slider';
	slider.className = 'slider';
	d.getElementById('sl').appendChild(slider);	
	
	var knob = d.createElement('DIV');	// создаем ползунок
	knob.id = elemId + '_knob';
	knob.className = 'knob';
	slider.appendChild(knob); // добавляем его в документ
	
	knob.style.left = 0;			// бегунок в нулевое значение
	knob.style.width = knobWidth+'px';	
	knob.style.height = knobHeight+'px';
	slider.style.width = sliderWidth+'px';
	slider.style.height = sliderHeight+'px';
	
	var sliderOffset = slider.offsetLeft;			// sliderOffset - абсолютное смещение slider'а
	tmp = slider.offsetParent;		// от левого края в пикселях (в IE не работает)
	while(tmp.tagName != 'BODY') {
		sliderOffset += tmp.offsetLeft;		// тут его и находим
		tmp = tmp.offsetParent;
	}
	
	if(isIE)						// в зависимости от модели DOM
	{								// назначаем слушателей событий
		knob.onmousedown = startCoord;		
		slider.onclick = sliderClick;		
		knob.onmouseup = endCoord;		
		slider.onmouseup = endCoord;			
	}
	else {
		knob.addEventListener("mousedown", startCoord, true);		
		slider.addEventListener("click", sliderClick, true);		
		knob.addEventListener("mouseup", endCoord, true);	
		slider.addEventListener("mouseup", endCoord, true);	
	}


// далее подробно не описываю, кто захочет - разберется
//////////////////// функции установки/получения значения //////////////////////////

	function setValue(x)	// установка по пикселям
	{
		if(x < 0) knob.style.left = 0; 
		else if(x > sliderWidth-knobWidth-3) knob.style.left = (sliderWidth-3-knobWidth)+'px';
		else {
			if(step == 0) knob.style.left = x+'px';			
			else knob.style.left = Math.round(x/(step*point))*step*point+'px';
		}
		d.getElementById('linewidthvalue').value = getValue();	// это вывод значения для примера
		Canvas.selectedWidth = parseInt(d.getElementById('linewidthvalue').value);
	}
	function setValue2(x)	// установка по значению
	{
		if(x < range1 || x > range2) alert('Value is not included into a slider range!');
		else setValue((x-range1)*point);
		
		d.getElementById('linewidthvalue').value = getValue();
	}

	function getValue() 
	{return Math.round(parseInt(knob.style.left)/point)+range1;}

//////////////////////////////// слушатели событий ////////////////////////////////////

	function sliderClick(e) {	
		var x;
		if(isIE) {
			if(event.srcElement != slider) return; //IE onclick bug
			x = event.offsetX - Math.round(knobWidth/2);
		}	
		else x = e.pageX-sliderOffset-knobWidth/2;
		setValue(x);
	}

	function startCoord(e) {				
		if(isIE) {	
			offsX = event.clientX - parseInt(knob.style.left);
			slider.onmousemove = mov;
		}
		else {				
			slider.addEventListener("mousemove", mov, true);
		}
	}
	
	function mov(e)	{
		var x;	
		if(isIE) x = event.clientX-offsX;
		else x = e.pageX-sliderOffset-knobWidth/2;
		setValue(x);
	}

	function endCoord()	{
		if(isIE) slider.onmousemove = null;	
		else slider.removeEventListener("mousemove", mov, true);
	}

	// объявляем функции setValue2 и getValue как методы класса
	this.setValue = setValue2;
	this.getValue = getValue;
} // конец класса