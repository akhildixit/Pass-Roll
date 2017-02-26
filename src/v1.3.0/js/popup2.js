/*window.addEventListener("DOMContentLoaded", function() {
	document.getElementById("addWebsiteButton").addEventListener("click",
			function() {
				chrome.runtime.sendMessage({
					greeting : 'saveURL'
				}, function(response) {
					console.log(response.val);
				});
			});
});*/
$(function() {
	$(".help").popover();
	$('.help').popover({
		trigger : 'focus'
	});
});