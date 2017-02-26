/**
 * 
 */
var currentURL;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('O3');
	if (request.greeting == 'newPageLoaded') {
		currentURL = request.data;
		sendResponse({
			val : currentURL
		});
	} else if (request.greeting == 'saveURL') {
		console.log(currentURL + ' to be saved');
		alert(currentURL + ' to be saved');
		sendResponse({
			val : currentURL
		});
	}
});
