// 뱃지 업데이트 함수. 확장 프로그램의 상태(on/off)에 따라 텍스트/색상 변경
function updateBadge(isEnabled) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs.length > 0) {
          const tabId = tabs[0].id;
          if (isEnabled) {
              chrome.action.setBadgeText({text: 'On', tabId: tabId}); // 활성화 -> 뱃지 텍스트 On
              chrome.action.setBadgeBackgroundColor({color: [70, 136, 241, 255], tabId: tabId}); // 활성화 -> 파란색
          } else {
              chrome.action.setBadgeText({text: 'Off', tabId: tabId}); // 비활성화 -> 뱃지 텍스트 Off
              chrome.action.setBadgeBackgroundColor({color: [255, 165, 0, 255], tabId: tabId}); // 비활성화 -> 주황색
          }
      }
  });
}


// 확장 프로그램 설치시 실행 - 초기 상태 설정
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({enabled: true}); // 초기상태 활성화(On)
});


// storage 값 변경시 실행
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key === 'enabled') { // 'enabled' 값 변경시 뱃지 업데이트
          updateBadge(newValue);
      }
  }
});


// 탭 업데이트시 실행
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // 확장프로그램이 작동하는 사이트 리스트
  const sites = ['steamcommunity.com', 'store.steampowered.com', 'steamcommunity.com/chat'];
  const isMatched = sites.some(site => tab.url.includes(site)); // 현재 탭의 URL이 위의 사이트들 중 하나인지 확인

  // 위 사이트에 해당된다면
  if (isMatched) {
      chrome.storage.local.get('enabled', function(data) { // storage에서 'enabled'값 가져오기
          const isEnabled = data.enabled !== undefined ? data.enabled : true;
          updateBadge(isEnabled);
      });
  } else { // 아니라면
      chrome.action.setBadgeText({text: '', tabId: tabId}); // 뱃지 텍스트 비우기
      // 비활성화(붉은색) 아이콘으로 변경
      chrome.action.setIcon({ 
        path: {
          "16": "../../assets/icons/icon_16_disabled.png"
        },
        tabId: tabId
      });
  }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method === 'updateBadge') { // 'updateBadge' 메시지를 받으면 뱃지 업데이트
      updateBadge(request.enabled);
  } else if (request.action == "openNewTab") { // 'openNewTab' 메시지를 받으면 새탭 열어서 얻은 URL로 이동
    chrome.tabs.create({ url: request.url });
  }
});


// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.action == "openNewTab") { // 'openNewTab' 메시지를 받으면 새탭 열어서 얻은 URL로 이동
//       chrome.tabs.create({ url: request.url });
//   }
// });