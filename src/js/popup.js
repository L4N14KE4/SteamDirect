document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.querySelector('#toggleSwitch');
    const statusOn = document.querySelector('#status #on');
    const statusOff = document.querySelector('#status #off');

    // 요소 제대로 로드 안될때 에러 로깅
    if (!toggleSwitch || !statusOn || !statusOff) {
        console.error(chrome.i18n.getMessage("popupElementNotFound"));
        return;
    }

    // 확장 활성화 상태를 가져와 토글 스위치/상태 텍스트 업데이트
    chrome.storage.local.get('enabled', function (data) {
        const isEnabled = data.enabled !== undefined ? data.enabled : true;
        toggleSwitch.checked = isEnabled;
        statusOn.style.display = isEnabled ? 'inline' : 'none';
        statusOff.style.display = isEnabled ? 'none' : 'inline';
    });

    // 토글 스위치 변경시 확장 활성화 상태를 업데이트
    toggleSwitch.addEventListener('change', function () {
        const newEnabledState = this.checked;

        chrome.storage.local.set({ enabled: newEnabledState }, function() {
            if (chrome.runtime.lastError) {
                console.error(chrome.i18n.getMessage("errorSettingEnabledState"), chrome.runtime.lastError);
            } else {
                // 배경 페이지에 활성화 상태 변경 알리기
                chrome.runtime.sendMessage({ method: 'updateBadge', enabled: newEnabledState });
            }
        });

        statusOn.style.display = newEnabledState ? 'inline' : 'none';
        statusOff.style.display = newEnabledState ? 'none' : 'inline';
    });
});


// GitHub 로고 클릭 -> 해당 프로젝트 GitHub 페이지로 이동
document.querySelector('.githubLogo').addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: "openNewTab", url: "https://github.com/L4N14KE4/SteamDirect" });
});

// 언어 설정에 따라 Github 로고 tooltip 설정
document.addEventListener('DOMContentLoaded', function () {
    const githubLogo = document.querySelector('.githubLogo');
    githubLogo.title = chrome.i18n.getMessage("githubLinkTooltip");
});