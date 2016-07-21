// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          // Enable button only for those urls that contain feedhenry or redhat
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'feedhenry.com' }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'redhatmobile.com' }
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});


chrome.pageAction.onClicked.addListener(function(tab) {
  var newTab = tab.url.substring(0, tab.url.search('#')) + 'api/v2/info/';

  var req = new XMLHttpRequest();
  req.open('GET', newTab);

  req.onload = function() {
    // Parse and process the response.
    var response = JSON.parse(req.response);

    // Create tab for info page.
    chrome.tabs.create({'url': newTab, 'active': true});

    // Create tabs for core Nagios and Munin pages.
    chrome.tabs.create( {'url': response.solution.core.id + '-mgt1.feedhenry.net:8811', 'active': false});
    chrome.tabs.create( {'url': response.solution.core.id + '-mgt1.feedhenry.net:8810/munin', 'active': false});

    // Each info page has multiple mbaas ids.  Create a Nagios and Munin page for each one.
    for (var i = 0; i < response.solution.mbaas.length; i++) {
      chrome.tabs.create( {'url': response.solution.mbaas[i].id + '-mgt1.feedhenry.net:8811', 'active': false});
      chrome.tabs.create( {'url': response.solution.mbaas[i].id + '-mgt1.feedhenry.net:8810/munin', 'active': false});
    }

    window.close();
  }
  req.onerror = function() {
    errorCallback('Network error.');
  };
  
  req.send();

});
