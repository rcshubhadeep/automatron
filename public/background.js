/* global chrome */


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Check for a complete page load
    if (changeInfo.status === 'complete' && tab.active) {
      console.log(tab.url); // Prints the URL of the loaded page in the active tab
    }
});