function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

function makeTabs(baseUrl, callback, errorCallback) {
  console.log('baseUrl is ' + baseUrl);

  if (baseUrl.search('#') > 0) {
    // Use # to verify that the url is a feedhenry/redhat one.  Doesn't work in some cases though.
    var newTab = baseUrl.substring(0, baseUrl.search('#')) + 'api/v2/info/';

    //renderStatus('Opening Info Tab');

    var req = new XMLHttpRequest();
    req.open('GET', newTab);

    req.onload = function() {
      // Parse and process the response.
      var response = JSON.parse(req.response);

      chrome.tabs.create({'url': newTab, 'active': true});
      chrome.tabs.create( {'url': response.solution.core.id + '-mgt1.feedhenry.net:8811', 'active': false});
      chrome.tabs.create( {'url': response.solution.core.id + '-mgt1.feedhenry.net:8810/munin', 'active': false});
      window.close();
  /*
      if (!response || !response.responseData || !response.responseData.results ||
          response.responseData.results.length === 0) {
        errorCallback('No response from Google Image search!');
        return;
      }
  */
    }
  };
  req.onerror = function() {
    errorCallback('Network error.');
  };
  req.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content has loaded');
  getCurrentTabUrl(function(url) {
    makeTabs(url, function(imageUrl, width, height) {
    }, function(errorMessage) {
      //renderStatus('Cannot display image. ' + errorMessage);
    })
  });
});
