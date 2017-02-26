var startPos = 0;
var n = 12;
var r = 110;
var angle = 360.0 / n;
var longestLengthTyped = 0;
var arrX = [];
var arrY = [];
var pattern = [];

function generate(passwordVal) {
	startPos = 0;
	pattern = [];
	if (n > longestLengthTyped)
		longestLengthTyped = n;
	n = passwordVal.length;
	angle = 360.0 / n;
	for (var i = 0; i < n; i++) {
		arrX[i] = r * Math.sin(i * angle * Math.PI / 180);
		arrY[i] = -r * Math.cos(i * angle * Math.PI / 180);
	}
	var btn = [];
	var input = [];
	var img = [];
	var label = [];
	for (var i = 0; i < longestLengthTyped; i++) {
		if (document.getElementById("passo-button" + i) != null)
			document.getElementById("passo-button" + i).remove();
		if (document.getElementById("passo-char" + i) != null)
			document.getElementById("passo-char" + i).remove();
		if (document.getElementById("passo-pointingTriangle" + i) != null)
			document.getElementById("passo-pointingTriangle" + i).remove();
		if (document.getElementById("passo-label" + i) != null)
			document.getElementById("passo-label" + i).remove();
	}
	for (var i = 0; i < n; i++) {
		input[i] = document.createElement("INPUT");
		input[i].setAttribute("id", "passo-char" + i);
		input[i].setAttribute("passo-data-id", i);
		input[i].setAttribute("class", "passo-rounded-input");
		input[i].setAttribute("style", "position: absolute; left:"
				+ (arrX[i] + 15) + "px; top:" + (arrY[i] + 15) + "px");
		input[i].setAttribute("type", "password");
		input[i].setAttribute("maxlength", "1");
		input[i].setAttribute("size", "1");
		input[i].setAttribute("readonly", "readonly");
		input[i].setAttribute("value", passwordVal[i]);
		input[i].addEventListener("click", function(){chooseStartPosition(this.getAttribute("passo-data-id"))});
		//input[i].setAttribute("onclick", "chooseStartPosition(" + i + ")");
		input[i].addEventListener("mouseover", function(){refreshColorShading(this.getAttribute("passo-data-id"))});
		//input[i].setAttribute("onmouseover", "refreshColorShading(" + i + ")");
		input[i].addEventListener("mouseleave", function(){refreshColorShading(startPos)});
		//input[i].setAttribute("onmouseleave", "refreshColorShading(" + startPos + ")");
		input[i].setAttribute("title",
				"Click to choose starting point of your password");
		document.getElementById('passo-fixedBody').appendChild(input[i]);

		img[i] = document.createElement("IMG");
		img[i].setAttribute("id", "passo-pointingTriangle" + i);
		img[i].setAttribute("width", "35px");
		img[i].setAttribute("height", "auto");
		img[i].setAttribute("src", "img/pointingTriangle.png");
		img[i].setAttribute("style", "position: absolute; top:"
				+ (arrY[i] * 1.25 + 17) + "px; left:" + (arrX[i] * 1.25 + 17)
				+ "px;-ms-transform: rotate(" + (i * angle)
				+ "deg);-webkit-transform: rotate(" + (i * angle)
				+ "deg);transform: rotate(" + (i * angle)
				+ "deg); visibility: hidden");
		document.getElementById('passo-fixedBody').appendChild(img[i]);

		label[i] = document.createElement("LABEL");
		label[i].setAttribute('id', 'passo-label' + i);
		label[i].innerHTML = i + 1;
		label[i].setAttribute("style", "position: absolute; top:"
				+ (arrY[i] * 0.7 + 27) + "px; left:" + (arrX[i] * 0.7 + 32)
				+ "px;color: #aaa; font-size: 11px");
		document.getElementById('passo-fixedBody').appendChild(label[i]);
	}
	refreshColorShading(startPos);
	// showAll();
}

function refreshColorShading(position) {
	for (var j = 0; j < n; j++) {
		document.getElementById('passo-pointingTriangle' + j).style.visibility = 'hidden';
		document.getElementById('passo-char' + j).setAttribute('class',
				'passo-rounded-input');
		document.getElementById('passo-label'+j).style.color = "#aaa";
	}
	document.getElementById('passo-pointingTriangle' + position).style.visibility = 'visible';
	document.getElementById('passo-label'+position).style.color = "#123";
	document.getElementById('passo-char' + position).setAttribute('class',
			'passo-rounded-input passo-selected');
	print(position);
}

function chooseStartPosition(position) {
	startPos = position;
	document.getElementById('passo-startPos').value = startPos;
	for (var j = 0; j < n; j++) {
		//document.getElementById('char' + j).setAttribute("onmouseleave","refreshColorShading(" + startPos + ")");
		document.getElementById('passo-char' + j).addEventListener("mouseleave",function(){refreshColorShading(startPos)});
	}
	refreshColorShading(position);
}

function print(position) {
	var pwd = "";
	for (var j = 0; j < n; j++) {
		pwd = pwd
				+ document
						.getElementById('passo-char' + (parseInt(position) + j) % n).value;
	}
	document.getElementById("passo-preview-password").value = pwd;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {param: "setVal", passwordVal:pwd}, function(response) {
		console.log(response.value);
		});
	});
	//document.getElementById('preview-password').value = pwd;
	//document.getElementById('baseword').value = pwd;
}
/*
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
}*/
function showAll() {
	for (var j = 0; j < n; j++) {
		document.getElementById("passo-char" + j).type = "text";
	}
	document.getElementById("passo-preview-password").type = "text";
	if (document.getElementById("passo-span-eye") != null)
		document.getElementById("passo-span-eye").setAttribute("class",
				"glyphicon glyphicon-eye-close");
}
function hideAll() {
	for (var j = 0; j < n; j++) {
		document.getElementById("passo-char" + j).type = "password";
	}
	document.getElementById("passo-preview-password").type = "password";
	if (document.getElementById("passo-span-eye") != null)
		document.getElementById("passo-span-eye").setAttribute("class",
				"glyphicon glyphicon-eye-open");
}
function toggleShowHidePassword() {
	if (document.getElementById("passo-preview-password").type == "password") {
		showAll();
	} else {
		hideAll();
	}
}