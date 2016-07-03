$(document).ready(function() {

	chrome.runtime.onMessage.addListener(function(request, sender) {
	  if (request.action == "getSource") {
	    console.log(request.source);
	  }
	});

	chrome.tabs.create({'active': true, 'url': 'https://support.us.feedhenry.com/'}),
	function(tab){
		console.log('tab created');
	  chrome.tabs.executeScript(null, {
	    file: "getPagesSource.js"
	  }, function() {
	    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
	    if (chrome.runtime.lastError) {
	      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
	    }
	  });


	}


});

