# SteamDirect
> 이 프로젝트는 제 첫 js 프로젝트입니다. </br>배포보단 공부목적으로 올린 Repo로 코드가 더럽고, 개선할 점이 많습니다.</br>issues나 pull request로 피드백을 주시면 감사하겠습니다.
</br>

## 소개

SteamDirect는 [Steam]의 리다이렉트 경고창을 건너뛰는 브라우저 확장프로그램 입니다.

Steam에서 링크를 누르면 https://steamcommunity.com/linkfilter/?u= <span style="color:green">**URL**</span> 형태의 리다이렉트 경고창이 뜨는데, 이를 무시하고 바로 사이트로 이동할 수 있습니다.

## 동작 사이트

SteamDirect는 Steam 서비스(Steam store, Community, Steam Chat)에서 활성화됩니다.</br>
확장프로그램 아이콘 색깔로 동작 여부를 확인할 수 있습니다.</br>

### 활성화<span style="color:#3498DB">(파란색)</span>

<img src="./assets/icons/icon_128.png" width="7%" height="7%" alt="Enable_icon"></br>

Steam 서비스(Steam store, Community, Steam Chat) 접속시 파란색 아이콘이 표시됩니다.</br>

### 비활성화<span style="color:#E74C3C">(붉은색)</span>

<img src="./assets/icons/icon_red.png" width="7%" height="7%" alt="Disable_icon"></br>

그 외의 사이트 접속시 붉은색 아이콘이 표시됩니다.</br>

## 설치
### 다운로드
[Releases]에서 `SteamDirect v0.1.0.zip`을 다운받아 설치합니다.</br>

### 지원 브라우저
Manifest v3를 지원하는 Cromium 기반의 브라우저를 지원합니다.</br>

<!-- release 배포 전까지는 아래 내용을 사용
SteamDirect Github Repository에서 `Code` > `Download ZIP`을 눌러 압축파일을 다운 받습니다.</br>
압축을 풀고, 브라우저의 확장프로그램 페이지에서 `개발자 모드`를 활성화한 후 `압축해제된 확장프로그램을 로드합니다.` 를 눌러 설치합니다. -->


## 사용법
> 사용전 SteamDirect를 툴바에 고정해주세요.</br>

Steamdirect 확장프로그램 아이콘을 눌러 `ON / OFF` 토글로 실행 여부를 선택할 수 있습니다.</br>
설치시 기본값은 `ON`입니다.</br>
Steam 리다이렉트 경고창은 `알림`과 `링크 차단!` 두 가지가 있으며 각각 노란색과, 빨간색으로 표시됩니다.

### 1. 알림(Notice)

SteamDirect가 `ON`인 경우 SteamDirect가 자동으로 해당 알림창을 건너뜁니다.</br>
해당창은 몇초 내로 자동으로 사라지고, 리디렉트 URL로 이동합니다.</br>

<img src="./imgs/Notice.png" width="70%" height="70%" alt="알림">
</br>
<img src="./imgs/Demo_Notice!.gif" width="70%" height="70%" alt="Demo_Notice!"></br>

SteamDirect가 `ON`인 경우 SteamDirect가 자동으로 해당 알림창을 건너뜁니다.</br>
해당창은 몇초 내로 자동으로 사라지고, 리디렉트 URL로 이동합니다.


---
### 2. 링크차단(Link Blocked!)

해당 경고의 경우 사용자의 판단에 맡깁니다.</br>
`외부창으로 이동`, `URL 검색하기` 버튼을 통해 사이트로 이동할지, [urlscan.io] 검색창으로 이동할지 선택할 수 있습니다.</br>

<img src="./imgs/Link_Blocked!.png" width="70%" height="70%" alt="링크 차단! 경고">
</br>
<img src="./imgs/Demo_Link_Blocked!.gif" width="70%" height="70%" alt="Demo_Link_Blocked!"></br>



## 개인정보 처리방침
SteamDirect는 사용자의 개인정보를 수집하지 않습니다.</br>
확장 기능을 수행하기 위해 https://steamcommunity.com/* 형태의 URL만 엑세스합니다.


## 면책 조항
### 1. 보안 경고

> 이 확장프로그램을 사용함으로써 발생하는 <span style="color:#E74C3C"><u>**모든 문제에 대해서는 책임지지 않습니다.**</u></span>

Steam에서는 사용자의 안전을 위해 리다이렉트 경고창을 띄우고 있습니다. 이 확장프로그램은 해당 경고창을 건너뛰는 기능을 수행합니다.</br>
이에 보안에 취약해질 수 있으며, [Google Safe Browsing]과 같은 보안 서비스와 함께 사용하길 권장합니다.


### 2. URL 검색하기 기능([urlscan.io])
URL 검색하기 기능은 완벽하지 않고, `URL 검색하기` 버튼을 누르면 urlscan.io의 검색 페이지로 이동합니다. 해당 개인정보의 취급에 대해서는 urlscan.io의 개인정보 보호정책을 참고해 주세요.


### 3. 로고 및 상표
[Steam]은 Valve Corporation의 상표입니다. 이 확장프로그램은 Valve Corporation과 관련이 없습니다.

[urlscan.io]는 urlscan GmbH의 서비스입니다. 이 확장프로그램은 urlscan GmbH와 관련이 없습니다.

Demo에 나온 웹페이지와 게임은 임의로 선택된 것으로, 이 확장프로그램은 해당 웹페이지와 게임의 개발사와 관련이 없습니다.


## 작동 원리

- **백그라운드 스크립트(`service_worker`)**: `background.js`가 실행되면서 현재 페이지가 Steam 사이트인지 판단하고, 그에 따라 확장 프로그램 아이콘의 색상을 변경합니다. 스위치 버튼의 상태에 따라 아이콘에 `ON/OFF`를 표시합니다.

- **팝업**: 확장 프로그램 아이콘을 클릭하면 팝업 페이지(`popup.html`)가 뜹니다. 팝업 페이지에는 `popup.js` 스크립트가 포함되어 있어, 스위치 버튼의 상태를 관리합니다. 기본 상태는 활성화 상태입니다.

- **콘텐츠 스크립트 실행**: `https://steamcommunity.com/linkfilter/*`에 매칭되는 페이지에서 콘텐츠 스크립트인 `steam.js`가 작동합니다. 이 스크립트는 웹 페이지가 로딩된 후에 실행됩니다.

    1. **확장 프로그램 활성화 여부 확인**: `steam.js` 스크립트는 확장 프로그램이 활성화된 상태인지 확인합니다.

    2. **리디렉션 수행**
    #### 경고 메시지에 따른 동작 차이
    `steam.js` 스크립트는 linkfilter 페이지의 경고 메시지의 유무에 따라 다르게 동작합니다.

    - **경고가 없는 경우(알림)**: 경고 메시지가 없는 경우, URL 파라미터 'u'에 포함된 URL로 리디렉션을 수행합니다.

    - **링크 차단 경고**: h1 태그에 '링크 차단!' 또는 'Link Blocked!' 경고 메시지가 있는 경우, 링크 차단 경고가 감지되었다는 로그를 출력합니다.</br>이 경우, URL 파라미터 'u'에 포함된 URL로 이동하는 것을 막고, `외부 사이트로 이동`과 `URL 검색하기` 버튼을 생성합니다.


[steam]: https://store.steampowered.com/ "Steam"
[urlscan.io]: https://urlscan.io/ "urlscan.io"
[Google Safe Browsing]: https://safebrowsing.google.com/ "Google Safe Browsing"
[Releases]: https://github.com/L4N14KE4/SteamDirect/releases "Releases"