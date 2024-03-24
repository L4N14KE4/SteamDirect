window.onload = function () {
  chrome.storage.local.get('enabled', function (data) {
    if (!data.enabled) return; // 활성화되지 않았으면 아무 동작도 하지 않음

    const encodedUrl = new URLSearchParams(window.location.search).get('u'); // URL 파라미터에서 'u' 값(인코딩된 URL)을 가져옴
    if (!encodedUrl) return; // 인코딩된 URL이 없으면 아무 동작도 하지 않음

    try {
      const decodedUrl = decodeURIComponent(encodedUrl); // URL 디코딩 시도
      handleWarnings(decodedUrl); // 경고 유형에 따라 처리
    } catch (error) {
      console.error(chrome.i18n.getMessage("unableToDecodeURL"));
      window.history.back();
    }
  });
};


// 경고 유형에 따라 처리하는 함수
function handleWarnings(decodedUrl) {
  const noticeDiv = document.querySelector('.warningPanel.friendlyInterstital');
  const linkBlockedDiv = document.querySelector('.warningPanel:not(.friendlyInterstital)');

  if (noticeDiv) {
    window.location.href = decodedUrl; // 일반 경고일때
  } else if (linkBlockedDiv) {
    handleLinkBlockedWarning(decodedUrl); // 링크 차단일때
  }
}


// 링크 차단 경고 처리
function handleLinkBlockedWarning(decodedUrl) {
  const cleanedUrl = decodedUrl.replace(/(^\w+:|^)\/\//, '').trim();
  const escapedUrl = 'page.domain:' + encodeURIComponent(`"${cleanedUrl}"`);
  // URL 열기 버튼
  const btnGoToUrl = createButton(decodedUrl, 'btn_grey_white_innerfade btn_medium', chrome.i18n.getMessage("goToExternalSite"), true);
  // urlscan.io 검색
  const btnSearchUrl = createButton(`https://urlscan.io/search/#${escapedUrl}`, 'btn_blue_white_innerfade btn_medium', chrome.i18n.getMessage("searchURL"));

  // DOM에 버튼 추가
  const warningActions = document.createElement('div');
  warningActions.id = 'warningActions';
  warningActions.className = 'centering';
  warningActions.appendChild(btnGoToUrl);
  warningActions.appendChild(btnSearchUrl);

  const warningExplanation = document.querySelector('.warningExplanation');
  warningExplanation.appendChild(warningActions);
}


// 동적으로 버튼 생성
function createButton(href, className, textContent, marginRight = false) {
  const btn = document.createElement('a');
  btn.href = href;
  btn.className = className;
  marginRight ? btn.style.marginRight = '10px' : btn.style.marginLeft = '10px';
  const span = document.createElement('span');
  span.textContent = textContent;
  btn.appendChild(span);
  return btn;
}