function clearCells() {
	$('#cells').html("");
	clearColorDisplay();
}

function clearColorDisplay() {
	$('.color_display_cell').css({
		'background-color': 'white',
		'border-color': 'white'});
	$('.color_display_text').html("");
}

//cell mouse over effect
function applyMouseOver() {
	$('.cell').mouseover(function() {
		$('.color_display_cell').css({
			'background-color': $(this).css('background-color'),
			'border-color': $(this).css('background-color')});
		$('.color_display_text').html($(this).css('background-color'));
	}).mouseout(function() {
		$('.color_display_cell').css({
			'background-color': 'white',
			'border-color': 'white'});
		$('.color_display_text').html("");
	});
}

function clickLock(lockedCell) {
	$('#' + lockedCell).click(function() { // anonymous function to unlock cell
		$(this).unbind('click');
		$(this).css({'border-color': $(this).css('background-color')});
		$('.color_display_cell').css({
			'border-color': $('.color_display_cell').css('background-color')});
		applyMouseOver();
		applyClick();
	});
}
 
//cell click effect
function applyClick() {
	$('.cell').click(function() {
		$('.cell').unbind('click');
		$('.cell').unbind('mouseover');
		$('.cell').unbind('mouseout');
		$(this).css({
			'border-color': 'black'});
		$('.color_display_cell').css({
			'border-color': 'black'});
		clickLock($(this).attr('id'));
	});
}


// converts a color in hex string format #RRBBGG to an array [r,b,g]
function colorStringToArray(color) {
	var r = parseInt(color.substring(1,3), 16);
	var b = parseInt(color.substring(3,5), 16);
	var g = parseInt(color.substring(5,7), 16);
	
	return [r, b, g];
}

//converts a color in an array [r,b,g] to hex string format #RRBBGG
function colorArrayToString(color) {
	var r = color[0].toString(16);
	if (r.length < 2) {
		r = '0' + r;
	}
	var b = color[1].toString(16);
	if (b.length < 2) {
		b = '0' + b;
	}
	var g = color[2].toString(16);
	if (g.length < 2) {
		g = '0' + g;
	}
	
	return '#' + r + b + g;
}

function blendColors(c1, c2, curPos, span) {
	var newR = Math.floor(((span-1-curPos)/(span-1))*c1[0] + (curPos/(span-1))*c2[0]);
	var newG = Math.floor(((span-1-curPos)/(span-1))*c1[1] + (curPos/(span-1))*c2[1]);
	var newB = Math.floor(((span-1-curPos)/(span-1))*c1[2] + (curPos/(span-1))*c2[2]);
	
	return [newR, newG, newB];
}

function doubleBlend(c1, c2) {
	var newR = Math.floor(0.5*c1[0] + 0.5*c2[0]);
	var newG = Math.floor(0.5*c1[1] + 0.5*c2[1]);
	var newB = Math.floor(0.5*c1[2] + 0.5*c2[2]);
	
	return [newR, newG, newB];
}

// generate grid of cells
function generateCells() {
	clearCells();
	
	var height = $('#height').val();
	var width = $('#width').val();
	var size = Math.min(50, Math.floor(500/height), Math.floor(500/width)) + 'px';
	
	var color1 = colorStringToArray($('#color1').val());
	var color2 = colorStringToArray($('#color2').val());
	var color3 = colorStringToArray($('#color3').val());
	var color4 = colorStringToArray($('#color4').val());
	 
	
	var cellColors = new Array(height);
	for (var i = 0; i < height; i++) {
		cellColors[i] = new Array(width);
	}
	
	cellColors[0][0]              = color1;
	cellColors[0][width-1]        = color2;
	cellColors[height-1][0]       = color3;
	cellColors[height-1][width-1] = color4;
	
	// generate initial rows
	for (var i = 1; i < width-1; i++) {
		cellColors[0][i] = blendColors(color1, color2, i, width);
		cellColors[height-1][i] = blendColors(color3, color4, i, width);
	}
	
	// generate initial columns
	for (var i = 1; i < height-1; i++) {
		cellColors[i][0] = blendColors(color1, color3, i, height);
		cellColors[i][width-1] = blendColors(color2, color4, i, height);
	}
	
	// generate colors
	for (var i = 1; i < width-1; i++) {
		for (var j = 1; j < height-1; j++) {
			var c1 = blendColors(cellColors[j][0], cellColors[j][width-1], i, width);
			var c2 = blendColors(cellColors[0][i], cellColors[height-1][i], j, height);
			cellColors[j][i] = doubleBlend(c1, c2);
		}
	}
	
	// create cell and add color
	for (var i = 0; i < height; i++) {
		var newRow = $('<div>').addClass('row').appendTo('#cells');
		for (var j = 0; j < width; j++) {
			var newCell = $('<div>', {id: "cell"+i+"_"+j}).addClass('cell')
				.css({
					'background-color': colorArrayToString(cellColors[i][j]),
					'border-color': colorArrayToString(cellColors[i][j]),
					'height': size,
					'width': size});
			
			newCell.appendTo(newRow);
		}
	}
	applyMouseOver();
	applyClick();
}

function color_test() {
}


