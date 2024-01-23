// 페이지 로드시 실행
window.onload = function () {
  chrome.storage.local.get('enabled', function (data) { // storage에서 'enabled' 값을 가져옴
    // 활성화 여부 확인
    if (data.enabled) { // 활성화 상태라면
      const params = new URLSearchParams(window.location.search); // URL 쿼리 파라미터 가져옴
      const encodedUrl = params.get('u'); // 'u' 쿼리 파라미터의 값을 가져옴
      const warningSign = document.querySelector('.warningSign h1'); // h1 태그 경고 표시 찾기

      const text = warningSign.textContent.trim();
      // 경고 메시지 있는지 확인
      const warningExists =
        warningSign &&
        (text === '링크 차단!' || text === 'Link Blocked!');

      // 경고 메시지가 없고, 'u' 쿼리 파라미터가 있는 경우
      if (!warningExists && encodedUrl) {
        try {
          const decodedUrl = decodeURIComponent(encodedUrl); // 'u' 쿼리 파라미터의 값을 디코딩
          window.location.href = decodedUrl; // 디코딩된 URL로 리디렉션
        } catch (error) {

          console.error("URL을 Decoding할 수 없습니다. URL 상태를 확인하세요.");
          window.history.back(); // 에러 발생 시 이전 페이지로 이동
        }
      } else {
        // 경고가 있거나 'u' 쿼리 파라미터가 없는 경우
        console.log('링크 차단 경고가 감지되었거나, 유효한 URL이 없습니다.');
        if (warningExists && encodedUrl) {
          // 경고가 있고, 'u' 쿼리 파라미터가 있는 경우
          const decodedUrl = decodeURIComponent(encodedUrl);
          const cleanedUrl = decodedUrl.replace(/(^\w+:|^)\/\//, '').trim(); // 'http:// or https://' 부분 제거 및 공백 제거


          // 버튼 생성(외부사이트로 이동/URL 검색)
          // 외부 사이트로 이동 버튼 생성
          const btnGoToUrl = document.createElement('a');
          btnGoToUrl.href = decodedUrl;
          btnGoToUrl.className = 'btn_grey_white_innerfade btn_medium'; // steam 버튼 style
          btnGoToUrl.style.marginRight = '10px';
          const span1 = document.createElement('span');
          span1.textContent = '외부 사이트로 이동';
          btnGoToUrl.appendChild(span1);


          // URL 검색하기 버튼 생성
          const escapedUrl = 'page.domain:' + encodeURIComponent(`"${cleanedUrl}"`);
          const btnSearchUrl = document.createElement('a');
          btnSearchUrl.href = `https://urlscan.io/search/#${escapedUrl}`; // urlscan.io에 쿼리 삽입 -> URL 검색 페이지로 이동
          btnSearchUrl.className = 'btn_blue_white_innerfade btn_medium';
          btnSearchUrl.style.marginLeft = '10px';
          const span2 = document.createElement('span');
          span2.textContent = 'URL 검색하기';
          btnSearchUrl.appendChild(span2);

          const warningActions = document.createElement('div');
          warningActions.id = 'warningActions';
          warningActions.className = 'centering';
          warningActions.appendChild(btnGoToUrl);
          warningActions.appendChild(btnSearchUrl);

          const warningExplanation = document.querySelector('.warningExplanation');
          warningExplanation.appendChild(warningActions); // 경고 설명에 버튼 추가
        }
      }
    }
  });
};