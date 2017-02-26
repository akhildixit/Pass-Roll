var circleSize1 = '2';
var startPointArrow = true;
var startPointHighlight = true;
var numberQues = true;
var eyeIcon = true;
var object;
var startPos = 0;
var n = 12;
var r = 60;
var dia = 20;
var angle = 360.0 / n;
var longestLengthTyped = 0;
var arrX = [];
var arrY = [];
var pattern = [];
var labelXOffset = 17;
var labelYOffset = 15;
var imgXOffset = 62;
var imgYOffset = 62;

function refreshSettings() {
	var inputs = document.getElementsByTagName('input');
	chrome.storage.sync.get({
		circleSize : '2',
		startPointArrow : true,
		startPointHighlight : true,
		numberQues : true,
		eyeIcon : true,
		url : ""
	}, function(items) {
		var urlArray = items.url.split(",");
		for (var j = 0; j < urlArray.length; j++) {
			if (urlArray[j] == "")
				continue;
			if (location.hostname.indexOf(urlArray[j]) != -1) {
				for (var i = 0; i < inputs.length; i++) {
					if (inputs[i].type.toLowerCase() == 'password'
							&& inputs[i].id.indexOf('pass-o') == -1
							&& inputs[i].id.indexOf('pass-roll') == -1) {
						inputs[i].addEventListener("focus", foo);
						inputs[i].addEventListener("blur", bar);
						inputs[i].addEventListener("keyup", doom);
						/*
						 * inputs[i].onfocus = foo; inputs[i].onblur = bar;
						 * inputs[i].onkeyup = doom;
						 */
					}
				}
			}
		}
		circleSize1 = items.circleSize;
		startPointArrow = items.startPointArrow;
		startPointHighlight = items.startPointHighlight;
		numberQues = items.numberQues;
		eyeIcon = items.eyeIcon;

		switch (parseInt(circleSize1)) {
			case 1 :
				r = 60;
				dia = 20;
				break;
			case 2 :
				r = 81;
				dia = 27;
				break;
			case 3 :
				r = 102;
				dia = 34;
				break;
			default :
				r = 60;
				dia = 20;
				break;
		}
	});
	setTimeout(refreshSettings, 1000);
}

refreshSettings();
/*
 * chrome.runtime.sendMessage({ greeting : 'newPageLoaded', data :
 * window.top.location.protocol + '//' + window.top.location.hostname },
 * function(response) { console.log(response.val); });
 */

function foo() {
	var box = document.getElementById('pass-o-box');
	var flag = false;
	if (object == this) {
		flag = true;
	}
	object = this;
	var rect = this.getBoundingClientRect();
	if (box != null) {
		if (object.value.length == 0) {
			$("#pass-o-box").fadeOut(400);
		}
		if (box.style.left != rect.left + 'px'
				&& box.style.top != (rect.top + rect.height) + 'px') {
			$(box).animate({
				left : rect.left + 'px',
				top : (rect.top + rect.height) + 'px'
			}, 100, function() {
				// Animation complete.
			});
		}
		if (object.value.length != 0) {
			$("#pass-o-box").fadeIn(400);
		}
		if (!flag)
			reDraw(object.value, true);
		return;
	}
	box = document.createElement('div');
	box.id = 'pass-o-box';
	switch (r) {
		case 60 :
			box.style.width = (2 * r + 40) + 'px';
			box.style.height = (2 * r + 40) + 'px';
			labelXOffset = 17;
			labelYOffset = 12;
			imgXOffset = r + 2;
			imgYOffset = r + 2;
			break;
		case 81 :
			box.style.width = (2 * r + 45) + 'px';
			box.style.height = (2 * r + 45) + 'px';
			labelXOffset = 20;
			labelYOffset = 15;
			imgXOffset = r + 5;
			imgYOffset = r + 6;
			break;
		case 102 :
			box.style.width = (2 * r + 53) + 'px';
			box.style.height = (2 * r + 53) + 'px';
			labelXOffset = 24;
			labelYOffset = 19;
			imgXOffset = r + 9;
			imgYOffset = r + 9;
			break;
		default :
			box.style.width = (2 * r + 40) + 'px';
			box.style.height = (2 * r + 40) + 'px';
			break;
	}

	// box.style.border = '3px solid #046300'
	//box.style.background = 'rgba(255,255,255,0.5)';
	box.style.background = 'white';
	//box.style.opacity = '0.6';
	box.style.borderRadius = '50%';
	box.style.boxShadow = "5px 5px 5px #000";
	box.style.position = 'absolute';
	box.style.left = rect.left + 'px';
	box.style.top = (rect.top + rect.height) + 'px';
	box.style.zIndex = 99999;

	var eye = document.createElement('img');
	eye.setAttribute("id", "pass-o-eye");
	eye.style.position = 'absolute';
	eye.style.left = r + 10 + 'px';
	eye.style.top = r + 10 + 'px';
	eye.addEventListener("click", bush);
	var eyeimageURL = chrome.extension.getURL("/img/eye.png");
	eye.setAttribute("src", eyeimageURL);
	eye.setAttribute("width", r / 3 + "px");
	box.appendChild(eye);
	if (!eyeIcon) {
		eye.style.visibility = 'hidden';
	}
	$(box).hide().appendTo('body');
	reDraw(object.value, true);
	refreshColorShading(startPos);
}

function bar() {
	// $("#pass-o-box").fadeOut(400);
}

function doom() {
	if (object == null || object == undefined)
		return;
	if (object.value.length == 0) {
		$("#pass-o-box").fadeOut(400);
	} else {
		$("#pass-o-box").fadeIn(400);
		reDraw(object.value, true);
	}
}

function bush() {
	if (document.getElementById('pass-o-char0').type == "text") {
		for (var i = 0; i < n; i++) {
			document.getElementById('pass-o-char' + i).type = "password";
		}
	} else {
		for (var i = 0; i < n; i++) {
			document.getElementById('pass-o-char' + i).type = "text";
		}
	}
	$("#pass-o-box").fadeIn(400);
}

function reDraw(passwordVal, resetStartPos) {
	if (resetStartPos)
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
		if (document.getElementById("pass-o-button" + i) != null)
			document.getElementById("pass-o-button" + i).remove();
		if (document.getElementById("pass-o-char" + i) != null)
			document.getElementById("pass-o-char" + i).remove();
		if (document.getElementById("pass-o-pointingTriangle" + i) != null)
			document.getElementById("pass-o-pointingTriangle" + i).remove();
		if (document.getElementById("pass-o-label" + i) != null)
			document.getElementById("pass-o-label" + i).remove();
	}

	for (var i = 0; i < n; i++) {
		input[i] = document.createElement("INPUT");
		input[i].setAttribute("id", "pass-o-char" + i);
		input[i].setAttribute("pass-o-data-id", i);
		input[i].setAttribute("class", "pass-o-rounded-input");
		input[i]
				.setAttribute(
						"style",
						"position: absolute !important; left:"
								+ (arrX[i] + r + 10)
								+ "px !important; top:"
								+ (arrY[i] + r + 10)
								+ "px !important; z-index: 100000 !important; width: "
								+ dia
								+ "px !important; height: "
								+ dia
								+ "px !important; text-decoration: none !important; text-transform: none !important; padding: 0px !important; margin: 0px !important; font-size: 14px !important; line-height: "
								+ dia
								+ "px !important; border-radius: 50% !important; text-align: center !important");
		input[i].setAttribute("type", "password");
		input[i].setAttribute("maxlength", "1");
		input[i].setAttribute("size", "1");
		input[i].setAttribute("readonly", "readonly");
		input[i].setAttribute("value", passwordVal[i]);
		input[i].addEventListener("click", function() {
			chooseStartPosition(this.getAttribute("pass-o-data-id"))
		});
		// input[i].setAttribute("onclick", "chooseStartPosition(" + i + ")");
		input[i].addEventListener("mouseover", function() {
			refreshColorShading(this.getAttribute("pass-o-data-id"))
		});
		// input[i].setAttribute("onmouseover", "refreshColorShading(" + i +
		// ")");
		input[i].addEventListener("mouseleave", function() {
			refreshColorShading(startPos)
		});
		// input[i].setAttribute("onmouseleave", "refreshColorShading(" +
		// startPos + ")");
		input[i].setAttribute("title",
				"Click to choose starting point of your password");
		document.getElementById('pass-o-box').appendChild(input[i]);

		img[i] = document.createElement("IMG");
		img[i].setAttribute("id", "pass-o-pointingTriangle" + i);
		img[i].setAttribute("width", "35px");
		img[i].setAttribute("height", "auto");
		var imageURL = chrome.extension.getURL("/img/pointingTriangle.png");
		img[i].setAttribute("src", imageURL);
		img[i].setAttribute("style",
				"position: absolute; z-index:99999 !important; top:"
						+ (arrY[i] * 1.3 + imgYOffset) + "px; left:"
						+ (arrX[i] * 1.3 + imgXOffset)
						+ "px;-ms-transform: rotate(" + (i * angle)
						+ "deg) !important;-webkit-transform: rotate("
						+ (i * angle) + "deg) !important;transform: rotate("
						+ (i * angle)
						+ "deg) !important; visibility: hidden !important");
		document.getElementById('pass-o-box').appendChild(img[i]);

		label[i] = document.createElement("LABEL");
		label[i].setAttribute('id', 'pass-o-label' + i);
		label[i].innerHTML = i + 1;
		label[i]
				.setAttribute(
						"style",
						"position: absolute; z-index:99999; top:"
								+ (arrY[i] * 0.7 + r + labelYOffset)
								+ "px; left:"
								+ (arrX[i] * 0.7 + r + labelXOffset)
								+ "px;color: #aaa !important; font-size: 11px !important; padding: 0px !important; margin: 0px !important");
		if (!numberQues)
			label[i].style.visibility = 'hidden';
		document.getElementById('pass-o-box').appendChild(label[i]);
	}
	refreshColorShading(startPos);
}

function refreshColorShading(position) {
	for (var j = 0; j < n; j++) {
		document.getElementById('pass-o-pointingTriangle' + j).style.visibility = 'hidden';
		document.getElementById('pass-o-char' + j).setAttribute('class',
				'pass-o-rounded-input');
		document.getElementById('pass-o-label' + j).style.color = "#aaa";
	}
	if (n > 0) {
		if (startPointArrow)
			document.getElementById('pass-o-pointingTriangle' + position).style.visibility = 'visible';
		document.getElementById('pass-o-label' + position).style.color = "#123";
		if (startPointHighlight)
			document.getElementById('pass-o-char' + position).setAttribute(
					'class', 'pass-o-rounded-input pass-o-selected');
	}
}

function chooseStartPosition(position) {
	startPos = position;
	refreshColorShading(position);
	revisePassword(startPos);
	$("#pass-o-box").fadeOut(400);
}

function revisePassword(position) {
	var pwd = "";
	for (var j = 0; j < n; j++) {
		pwd = pwd
				+ document.getElementById('pass-o-char'
						+ (parseInt(position) + j) % n).value;
	}
	$(object).attr('value', pwd);
}