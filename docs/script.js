function changeLanguage(lang) {
    updateContent(lang);
    updateButtonStyles(lang); // 언어 버튼 스타일 업데이트
    updateVideoSource(lang);
    localStorage.setItem('preferredLanguage', lang);

    // 사이트 제목 변경
    document.title = lang === 'ko' ? "SteamDirect - 시작하기" : "SteamDirect - Get Started";
}

function updateButtonStyles(lang) {
    const buttons = document.querySelectorAll('.language-button');
    buttons.forEach(button => {
        if (button.id === lang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// 언어 설정에 따른 콘텐츠 업데이트 함수
function updateContent(lang) {
    const contentDiv = document.getElementById('content');
    const texts = languages[lang];
    // 언어에 맞는 이미지 경로 설정
    const pinImagePath = lang === 'ko' ? 'imgs/extension_pin_ko.png' : 'imgs/extension_pin_en.png';
    const badgeImagePath = lang === 'ko' ? 'imgs/on&off_icon_ko.png' : 'imgs/on&off_icon_en.png';

    // 동적으로 콘텐츠 내용 업데이트

    contentDiv.innerHTML = `
        <h1>${texts.welcome}</h1>
        <p id="before-use">${texts.beforeUse}</p>
        <h2>${texts.setting}</h2>
        <h3>${texts.Pin}</h3>
        <p>${texts.pinInstruction_1.replace('imgs/extension_pin.png', pinImagePath)}</p>
        <video id="pin-instruction-video" controls style="width:100%; max-width:400px; margin-top:0px;">
        <source src="" type="video/mp4"></video>
        <p>${texts.pinInstruction_2}</p>
        <h2>${texts.usage}</h2>
        <p>${texts.usageDetails}</p>
        <h2>${texts.badge}</h2>
        <p>${texts.badgeDetails.replace('imgs/on&off_icon_ko.png', badgeImagePath)}</p>
        <h2>${texts.support}</h2>
        <p>${texts.supportDetails}</p>
        <p>${texts.additionalInfo}</p>
    `;

    updateVideoSource(lang); // Ensure the video source is updated too
}

// 페이지 로딩 시 사용자의 언어 설정 확인 및 적용
document.addEventListener('DOMContentLoaded', function() {
    let userLang = navigator.language || navigator.userLanguage;
    userLang = userLang.startsWith('ko') ? 'ko' : 'en';
    
    const preferredLanguage = localStorage.getItem('preferredLanguage') || userLang;
    changeLanguage(preferredLanguage);
});

// 언어 전환 버튼에 대한 이벤트 리스너 설정
document.getElementById('en').addEventListener('click', function() {
    changeLanguage('en');
});
document.getElementById('ko').addEventListener('click', function() {
    changeLanguage('ko');
});

// 언어에 따른 동영상 소스 변경 함수
function updateVideoSource(lang) {
    const video = document.getElementById('pin-instruction-video');
    video.src = lang === 'ko' ? 'imgs/videos/pin-instruction-ko.mp4' : 'imgs/videos/pin-instruction-en.mp4';
}