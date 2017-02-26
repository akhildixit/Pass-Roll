var startPos = 0;
var n = 12;
var r = 150;
var angle = 360.0 / n;
var longestLengthTyped = 0;
var arrX = [];
var arrY = [];
var pattern = [];

function generate() {
	startPos = 0;
	pattern = [];
	if (n > longestLengthTyped)
		longestLengthTyped = n;
	n = document.getElementById('baseword').value.length;
	if (document.getElementById('incorrectPassword') != null) {
		document.getElementById('incorrectPassword').style.visibility = 'hidden';
	}
	/*
	 * if (n == 0) { document.getElementById('span-eye').style.visibility =
	 * 'hidden'; document.getElementById('btn-submit').style.visibility =
	 * 'hidden'; document.getElementById('preview-password').style.visibility =
	 * 'hidden'; } else { document.getElementById('span-eye').style.visibility =
	 * 'visible'; document.getElementById('btn-submit').style.visibility =
	 * 'visible'; document.getElementById('preview-password').style.visibility =
	 * 'visible'; }
	 */
	angle = 360.0 / n;
	for (var i = 0; i < n; i++) {
		arrX[i] = i * 35 - 200;
		arrY[i] = -100;
	}
	var btn = [];
	var input = [];
	var img = [];
	var label = [];
	for (var i = 0; i < longestLengthTyped; i++) {
		if (document.getElementById("button" + i) != null)
			document.getElementById("button" + i).remove();
		if (document.getElementById("char" + i) != null)
			document.getElementById("char" + i).remove();
		if (document.getElementById("pointingTriangle" + i) != null)
			document.getElementById("pointingTriangle" + i).remove();
		if (document.getElementById("label" + i) != null)
			document.getElementById("label" + i).remove();
	}
	var leftOffset = 1155 - 17*n;
	document.getElementById('fixedBody').setAttribute("style", "position: absolute; left: "+leftOffset+"px; top: 275px");
	for (var i = 0; i < n; i++) {
		/*
		 * btn[i] = document.createElement("BUTTON"); btn[i].setAttribute("id",
		 * "button" + i); btn[i].setAttribute("type", "button");
		 * btn[i].setAttribute("class", "square-btn");
		 * btn[i].setAttribute("style", "position: absolute; left:" + arrX[i] +
		 * "px; top:" + arrY[i] + "px;"); btn[i].setAttribute("onclick",
		 * "chooseStartPosition(" + i + ")"); btn[i].setAttribute("onmouseover",
		 * "refreshColorShading(" + i + ")");
		 * btn[i].setAttribute("onmouseleave", "refreshColorShading(" + startPos +
		 * ")"); document.getElementById('fixedBody').appendChild(btn[i]);
		 */

		input[i] = document.createElement("INPUT");
		input[i].setAttribute("id", "char" + i);
		input[i].setAttribute("class", "square-input");
		input[i].setAttribute("style", "position: absolute; left:"
				+ (arrX[i] + 10) + "px; top:" + (arrY[i] + 10) + "px;");
		input[i].setAttribute("type", "password");
		input[i].setAttribute("maxlength", "1");
		input[i].setAttribute("size", "1");
		input[i].setAttribute("readonly", "readonly");
		input[i].setAttribute("value",
				document.getElementById('baseword').value[i]);
		input[i].setAttribute("onclick", "chooseStartPosition(" + i + ")");
		input[i].setAttribute("onmouseover", "refreshColorShading(" + i + ")");
		input[i].setAttribute("onmouseleave", "refreshColorShading(" + startPos
				+ ")");
		document.getElementById('fixedBody').appendChild(input[i]);

		img[i] = document.createElement("IMG");
		img[i].setAttribute("id", "pointingTriangle" + i);
		img[i].setAttribute("width", "35px");
		img[i].setAttribute("height", "auto");
		img[i].setAttribute("src", "../images/pointingTriangle.png");
		img[i].setAttribute("style", "position: absolute; top:"
				+ (arrY[i] * 1.35 + 10) + "px; left:" + (arrX[i] + 7)
				+ "px; visibility: hidden");
		document.getElementById('fixedBody').appendChild(img[i]);

		label[i] = document.createElement("LABEL");
		label[i].setAttribute('id', 'label' + i);
		label[i].innerHTML = i + 1;
		label[i].setAttribute("style", "position: absolute; top:"
				+ (arrY[i] + 45) + "px; left:" + (arrX[i] + 20)
				+ "px; color: #aaa; font-size: 11px");
		document.getElementById('fixedBody').appendChild(label[i]);
	}
	refreshColorShading(startPos);
	document.getElementById('char' + startPos).setAttribute('class',
			'square-input selected');
	hideAll();
}

function refreshColorShading(position) {
	print(position);
	for (var j = 0; j < n; j++) {
		document.getElementById('pointingTriangle' + j).style.visibility = 'hidden';
		document.getElementById('char' + j).setAttribute('class',
				'square-input');
	}
	document.getElementById('char' + position).setAttribute('class',
			'square-input selected');
	document.getElementById('pointingTriangle' + position).style.visibility = 'visible';

	if (position != 0) {
		document.getElementById('revised-password').innerHTML = 'Revised password';
	} else {
		document.getElementById('revised-password').innerHTML = 'Initial password';
	}
}

function chooseStartPosition(position) {
	startPos = position;
/*	document.getElementById('triedPos').value += startPos + '-'
			+ ($.now() - $('#clientTimerStartTime').val()) + ', ';*/
	// alert($.now() - $('#clientTimerStartTime').val());
	//document.getElementById('startPos').value = startPos;
	for (var j = 0; j < n; j++) {
		document.getElementById('char' + j).setAttribute("onmouseleave",
				"refreshColorShading(" + startPos + ")");
	}
	refreshColorShading(position);	
	document.getElementById('char' + startPos).setAttribute('class',
			'square-input selected');
}

function print(position) {
	var pwd = "";
	for (var j = 0; j < n; j++) {
		console.log(n
				+ ' '
				+ startPos
				+ ' '
				+ position
				+ ' '
				+ j
				+ ' '
				+ document
						.getElementById('char' + (parseInt(position) + j) % n));
		pwd = pwd
				+ document
						.getElementById('char' + (parseInt(position) + j) % n).value;
	}
	document.getElementById('preview-password').value = pwd;
	document.getElementById('baseword').value = pwd;
}

function detectControl(e, currentId, previousId) {
	var pwd = "";
	if (event.keyCode == 8) {
		var c = document.getElementById(currentId).value;
		if (c != "")
			document.getElementById(currentId).value = "";
		else {
			document.getElementById(previousId).focus();
			document.getElementById(previousId).value = "";
		}
	}
	print(startPos);
}

function showAll() {

	for (var j = 0; j < n; j++) {
		document.getElementById("char" + j).type = "text";
	}

	document.getElementById("preview-password").type = "text";
	document.getElementById("baseword").type = "text";
	document.getElementById("span-eye").setAttribute("class",
			"glyphicon glyphicon-eye-close");
}
function hideAll() {

	for (var j = 0; j < n; j++) {
		document.getElementById("char" + j).type = "password";
	}

	document.getElementById("preview-password").type = "password";
	document.getElementById("baseword").type = "password";
	document.getElementById("span-eye").setAttribute("class",
			"glyphicon glyphicon-eye-open");
}
function toggleShowHidePassword() {
	/*
	 * document.getElementById('triedPos').value += 'e-' + ($.now() -
	 * $('#clientTimerStartTime').val()) + ', ';
	 */
	if (document.getElementById("preview-password").type == "password") {
		showAll();
	} else {
		hideAll();
	}
}