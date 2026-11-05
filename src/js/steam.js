// document_start 에서 실행됨 — storage 읽기가 HTML 파싱과 동시에 진행됨
const encodedUrl = new URLSearchParams(location.search).get('u'); // URL 파라미터에서 'u' 값(인코딩된 URL)을 가져옴
if (encodedUrl) {
  chrome.storage.local.get('enabled', ({ enabled }) => {
    if (!enabled) return; // 활성화되지 않았으면 아무 동작도 하지 않음

    let decodedUrl;
    try {
      decodedUrl = decodeURIComponent(encodedUrl); // URL 디코딩 시도
    } catch (error) {
      console.error(chrome.i18n.getMessage("unableToDecodeURL"));
      history.back();
      return;
    }
    waitFor('.warningPanel', panel => handleWarnings(decodedUrl, panel));
  });
}


// 요소가 파서에 의해 삽입되는 순간 콜백 — 나머지 페이지 로드(이미지/폰트/스크립트)를 기다리지 않음
function waitFor(selector, cb) {
  const found = document.querySelector(selector);
  if (found) return cb(found);
  const obs = new MutationObserver(() => {
    const el = document.querySelector(selector);
    if (el) { obs.disconnect(); cb(el); }
  });
  obs.observe(document, { childList: true, subtree: true });
}


// 경고 유형에 따라 처리하는 함수
function handleWarnings(decodedUrl, panel) {
  if (panel.classList.contains('friendlyInterstital')) {
    location.replace(decodedUrl); // 일반 경고: 즉시 이동 (replace → 뒤로가기 시 필터 페이지로 안 돌아옴)
  } else if (document.readyState === 'loading') {
    // 링크 차단: 버튼 삽입은 급하지 않으니 .warningExplanation 이 확실히 있는 DOM 완성 후
    document.addEventListener('DOMContentLoaded', () => handleLinkBlockedWarning(decodedUrl));
  } else {
    handleLinkBlockedWarning(decodedUrl);
  }
}


// 버튼 문구는 Steam 페이지 언어(<html lang>)를 따름 — Steam 자체 버튼과 나란히 놓이므로.
// 해당 언어의 _locales 가 없으면 chrome.i18n(Chrome UI 언어)으로 폴백
async function pageMessages() {
  const lang = document.documentElement.lang.replace('-', '_');
  const table = lang
    ? await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`))
        .then(r => r.ok ? r.json() : {})
        .catch(() => ({}))
    : {};
  return key => table[key]?.message ?? chrome.i18n.getMessage(key);
}


// 링크 차단 경고 처리
async function handleLinkBlockedWarning(decodedUrl) {
  const msg = await pageMessages();
  const cleanedUrl = decodedUrl.replace(/(^\w+:|^)\/\//, '').trim();
  const escapedUrl = 'page.domain:' + encodeURIComponent(`"${cleanedUrl}"`);
  // URL 열기 버튼
  const btnGoToUrl = createButton(decodedUrl, 'btn_grey_white_innerfade btn_medium', msg("goToExternalSite"), true);
  // urlscan.io 검색
  const btnSearchUrl = createButton(`https://urlscan.io/search/#${escapedUrl}`, 'btn_blue_white_innerfade btn_medium', msg("searchURL"));

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
