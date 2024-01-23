// 문서 로드되면 실행
document.addEventListener('DOMContentLoaded', function () {
    // 토글 스위치 on/off 찾기
    const toggleSwitch = document.querySelector('#toggleSwitch');
    const statusOn = document.querySelector('#status #on');
    const statusOff = document.querySelector('#status #off');

    // 요소 못찾으면 에러 메시지 출력
    if (!toggleSwitch || !statusOn || !statusOff) {
        console.error('요소를 찾을 수 없습니다. ID가 올바른지 확인하세요.');
        return;
    }

    // 초기 스위치 상태 설정 및 스위치 변경시마다 상태 업데이트
    // storage에서 'enabled' 값 가져오기
    chrome.storage.local.get('enabled', function (data) {
        const isEnabled = data.enabled !== undefined ? data.enabled : true;
        toggleSwitch.checked = isEnabled; // 체크박스의 상태를 'enabled'로
        // on/off 상태 텍스트 표시 여부 결정
        statusOn.style.display = isEnabled ? 'inline' : 'none';
        statusOff.style.display = isEnabled ? 'none' : 'inline';

        // 체크박스의 상태가 변경될 때 실행
        toggleSwitch.addEventListener('change', function () {
            const isEnabled = this.checked; // 체크박스의 상태를 가져옴
            chrome.storage.local.set({ enabled: isEnabled }); // 'enabled' 값을 체크박스의 상태로 설정
            // on/off 상태 텍스트 표시 여부 결정
            statusOn.style.display = isEnabled ? 'inline' : 'none';
            statusOff.style.display = isEnabled ? 'none' : 'inline';

            // 뱃지를 업데이트하도록 메시지를 보냄
            chrome.runtime.sendMessage({ method: 'updateBadge', enabled: isEnabled });
        });
    });
});


// Github 로고 클릭시 링크로 이동
document.querySelector('.githubLogo').addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: "openNewTab", url: "https://github.com/L4N14KE4/SteamDirect" });
});