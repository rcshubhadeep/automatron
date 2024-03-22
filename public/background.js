/* global chrome */


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Check for a complete page load
    if (changeInfo.status === 'complete' && tab.active) {
      console.log(tab.url); // Prints the URL of the loaded page in the active tab
    }
});

function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

var parent = chrome.contextMenus.create({"title": "tasks", "id": "tasks", contexts: ["all"]});
chrome.contextMenus.create(
  {"title": "Task 1", "parentId": parent, "id": "task1", contexts: ["all"]});
chrome.contextMenus.create(
  {"title": "Task 2", "parentId": parent, "id": "task2", contexts: ["all"]});

  chrome.contextMenus.onClicked.addListener((info, tab) => {genericOnClick(info, tab)});

  // console.log("parent:" + parent + " child1:" + child1 + " child2:" + child2);