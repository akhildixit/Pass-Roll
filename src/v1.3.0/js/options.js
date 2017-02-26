/**
 * 
 */
function save_options() {
	var circleSize = $('input[name="circleSize"]:checked').val();
	var startPointArrow = document.getElementById('startPointArrow').checked;
	var startPointHighlight = document.getElementById('startPointHighlight').checked;
	var numberQues = document.getElementById('numberQues').checked;
	var eyeIcon = document.getElementById('eyeIcon').checked;
	chrome.storage.sync.set({
		circleSize : circleSize,
		startPointArrow : startPointArrow,
		startPointHighlight : startPointHighlight,
		numberQues : numberQues,
		eyeIcon : eyeIcon
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 3000);
	});
}

function refreshTable() {
	var element1, element2, element3, element4;
	var tbody = document.getElementById('tbody');
	while (tbody.firstChild) {
		tbody.removeChild(tbody.firstChild);
	}
	chrome.storage.sync.get({
		url : null
	}, function(items) {
		if (items.url == null)
			return;
		var urlArray = items.url.split(",");
		for (var i = 0; i < urlArray.length; i++) {
			if (urlArray[i] == "")
				continue;
			element1 = document.createElement('tr');

			element2 = document.createElement('td');
			element2.style.border = 'none';

			element3 = document.createElement('label');
			element3.innerText = urlArray[i];
			element3.style.fontWeight = 'normal';

			element4 = document.createElement('span');
			element4.setAttribute('class',
					'glyphicon glyphicon-remove pull-right')
			element4.setAttribute('style', 'z-index: 1001');
			element4.addEventListener("click", remove);
			element2.appendChild(element3);
			element2.appendChild(element4);
			element1.appendChild(element2);
			tbody.appendChild(element1);
		}
	});
}

function remove() {
	var col = $(this).parent('td');
	var row = col.parent('tr');
	var toBeRemoved = col.children('label')[0].innerText;
	chrome.storage.sync.get({
		url : ","
	}, function(items) {
		chrome.storage.sync.set({
			url : items.url.replace("," + toBeRemoved + "," , ",")
		}, function() {
			// Update status to let user know options were saved.
			var status = document.getElementById('status');
			status.textContent = toBeRemoved + ' is no more Pass-O enabled.';
			setTimeout(function() {
				status.textContent = '';
			}, 3000);
		});
	});
	row.fadeOut(200, function() {
		$(this).remove();
	});
}

function add_url() {
	var urlToBeAdded = document.getElementById('urlToBeAdded').value;
	if (urlToBeAdded == "")
		return;
	chrome.storage.sync.get({
		url : ","
	}, function(items) {
		var set = items.url.split(',');
		console.log(set);
		for (var i = 0; i < set.length; i++) {
			if (set[i]!="" && urlToBeAdded.indexOf(set[i]) != -1) {
				var status = document.getElementById('status');
				status.textContent = urlToBeAdded
						+ ' is already Pass-O enabled.';
				setTimeout(function() {
					status.textContent = '';
				}, 3000);
				return;
			}
		}
		chrome.storage.sync.set({
			url : items.url + urlToBeAdded + ","
		}, function() {
			// Update status to let user know options were saved.
			var status = document.getElementById('status');
			status.textContent = urlToBeAdded + ' is now Pass-O enabled.';
			setTimeout(function() {
				status.textContent = '';
			}, 3000);
		});
	});
	document.getElementById('urlToBeAdded').value = '';
	setTimeout(function() {
		refreshTable();
	}, 1000);
}
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync
			.get(
					{
						circleSize : '2',
						startPointArrow : true,
						startPointHighlight : true,
						numberQues : true,
						eyeIcon : true,
						url : ""
					},
					function(items) {
						$(
								"input[name=circleSize][value="
										+ items.circleSize + "]").prop(
								'checked', true);
						document.getElementById('startPointArrow').checked = items.startPointArrow;
						document.getElementById('startPointHighlight').checked = items.startPointHighlight;
						document.getElementById('numberQues').checked = items.numberQues;
						document.getElementById('eyeIcon').checked = items.eyeIcon;
					});
}

function promptAddWebsite() {
	var urlToBeAdded = prompt("Please enter website URL",
			"Example: http://www.xyz.com/");
	if (urlToBeAdded != null) {
		add_url(urlToBeAdded);
	}
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('addWebsite').addEventListener("click", add_url);
document.getElementById('save').addEventListener('click', save_options);
refreshTable();