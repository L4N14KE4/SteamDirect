// Updates the badge text and color based on extension status
function updateBadge(isEnabled) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      if (isEnabled) {
        // Set badge to 'On' with blue background
        chrome.action.setBadgeText({ text: 'On', tabId: tabId }); // 활성화 -> 뱃지 텍스트 On
        chrome.action.setBadgeBackgroundColor({ color: [70, 136, 241, 255], tabId: tabId }); // 활성화 -> 파란색
      } else {
        // Set badge to 'Off' with orange background
        chrome.action.setBadgeText({ text: 'Off', tabId: tabId }); // 비활성화 -> 뱃지 텍스트 Off
        chrome.action.setBadgeBackgroundColor({ color: [255, 165, 0, 255], tabId: tabId }); // 비활성화 -> 주황색
      }
    }
  });
}


// Sets initial state to 'enabled' when extension is installed
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ enabled: true }); // 초기상태 활성화(On)
});


// Updates the badge when the 'enabled' value changes in storage
chrome.storage.onChanged.addListener(function (changes, namespace) {
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

// Listens for messages to update badge or open a new tab
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.method === 'updateBadge') {
    updateBadge(request.enabled);
  } else if (request.action == "openNewTab") {
    chrome.tabs.create({ url: request.url });
  }
});