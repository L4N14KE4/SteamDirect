function updateBadge(isEnabled) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs.length > 0) {
      const tabId = tabs[0].id;
      const badgeText = isEnabled ? 'On' : 'Off';
      const badgeColor = isEnabled ? [70, 136, 241, 255] : [255, 165, 0, 255];
      const iconPath = isEnabled ? '../../assets/icons/icon_16.png' : '../../assets/icons/icon_16_off.png';

      chrome.action.setBadgeText({text: badgeText, tabId: tabId});
      chrome.action.setBadgeBackgroundColor({color: badgeColor, tabId: tabId});
      chrome.action.setIcon({path: iconPath, tabId: tabId});
    }
  });
}

// 확장 설치 시 초기 상태 설정 및 안내 페이지 열기
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    chrome.storage.local.set({enabled: true});
    // Github Pages로 만든 안내 페이지로 이동
    const startURL = "https://l4n14ke4.github.io/SteamDirect/";
    chrome.tabs.create({url: startURL});
  }
});

// 확장 활성화 상태 변경시 배지 업데이트
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.enabled) {
    updateBadge(changes.enabled.newValue);
  }
});


// 스팀에서 탭이 업데이트 될때 배지와 아이콘 업데이트
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  const sites = ['steamcommunity.com', 'store.steampowered.com', 'steamcommunity.com/chat'];
  const isMatched = sites.some(site => tab.url.includes(site));

  if (isMatched) {
    chrome.storage.local.get('enabled', function (data) {
      updateBadge(data.enabled !== undefined ? data.enabled : true);
    });
  } else {
    chrome.action.setBadgeText({ text: '', tabId: tabId });
    chrome.action.setIcon({path: "../../assets/icons/icon_16_disabled.png", tabId: tabId});
    chrome.action.setTitle({tabId: tabId, title: chrome.i18n.getMessage("unsupportedSiteTooltip")});
  }
});


// 메시지 수신 시 동작 처리 (배지 업데이트 또는 새 탭 열기)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method === 'updateBadge') {
    updateBadge(request.enabled);
  } else if (request.action === "openNewTab") {
    chrome.tabs.create({ url: request.url });
  }
});