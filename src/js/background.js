function updateBadge(isEnabled) {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      if (isEnabled) {
        chrome.action.setBadgeText({text: 'On', tabId: tabId});
        chrome.action.setBadgeBackgroundColor({color: [70, 136, 241, 255], tabId: tabId});
      } else {
        chrome.action.setBadgeText({text: 'Off', tabId: tabId});
        chrome.action.setBadgeBackgroundColor({color: [255, 165, 0, 255], tabId: tabId});
      }
    }
  });
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({enabled: true});
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === 'enabled') {
      updateBadge(newValue);
    }
  }
});


// Updates badge and icon based on specific sites when a tab is updated
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  const sites = ['steamcommunity.com', 'store.steampowered.com', 'steamcommunity.com/chat'];
  const isMatched = sites.some(site => tab.url.includes(site));

  if (isMatched) {
    chrome.storage.local.get('enabled', function (data) {
      const isEnabled = data.enabled !== undefined ? data.enabled : true;
      updateBadge(isEnabled);
    });
  } else {
    chrome.action.setBadgeText({ text: '', tabId: tabId });
    // Set icon to disabled version
    chrome.action.setIcon({
      path: {
        "16": "../../assets/icons/icon_16_disabled.png"
      },
      tabId: tabId
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method === 'updateBadge') {
    updateBadge(request.enabled);
  } else if (request.action == "openNewTab") {
    chrome.tabs.create({ url: request.url });
  }
});