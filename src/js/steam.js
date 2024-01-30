// Executes actions when the page loads based on the extension's enabled state
window.onload = function () {
  chrome.storage.local.get('enabled', function (data) {
    if (data.enabled) {
      const params = new URLSearchParams(window.location.search);
      const encodedUrl = params.get('u');

      // Selectors for different types of warnings
      const noticeDiv = document.querySelector('.warningPanel.friendlyInterstital');
      const linkBlockedDiv = document.querySelector('.warningPanel:not(.friendlyInterstital)');

      function createButton(href, className, textContent, marginRight = false) {
        const btn = document.createElement('a');
        btn.href = href;
        btn.className = className;
        if (marginRight) {
          btn.style.marginRight = '10px';
        } else {
          btn.style.marginLeft = '10px';
        }
        const span = document.createElement('span');
        span.textContent = textContent;
        btn.appendChild(span);
        return btn;
      }

      // Handle notice warning
      if (noticeDiv) {
        // console.log(chrome.i18n.getMessage("noticeWarningDetected"));
        try {
          const decodedUrl = decodeURIComponent(encodedUrl);
          window.location.href = decodedUrl;
        } catch (error) {
          console.error(chrome.i18n.getMessage("unableToDecodeURL"));
          window.history.back();
        }
      }
      // Handle link blocking warning
      else if (linkBlockedDiv) {
        // console.log(chrome.i18n.getMessage("linkBlockedWarningDetected"));

        try {
          const decodedUrl = decodeURIComponent(encodedUrl);
          const cleanedUrl = decodedUrl.replace(/(^\w+:|^)\/\//, '').trim();
          const escapedUrl = 'page.domain:' + encodeURIComponent(`"${cleanedUrl}"`);

          const btnGoToUrl = createButton(decodedUrl, 'btn_grey_white_innerfade btn_medium', chrome.i18n.getMessage("goToExternalSite"), true);
          const btnSearchUrl = createButton(`https://urlscan.io/search/#${escapedUrl}`, 'btn_blue_white_innerfade btn_medium', chrome.i18n.getMessage("searchURL"));

          // Add buttons to the DOM
          const warningActions = document.createElement('div');
          warningActions.id = 'warningActions';
          warningActions.className = 'centering';
          warningActions.appendChild(btnGoToUrl);
          warningActions.appendChild(btnSearchUrl);

          const warningExplanation = document.querySelector('.warningExplanation');
          warningExplanation.appendChild(warningActions);
        } catch (error) {
          console.error(chrome.i18n.getMessage("unableToDecodeURL"));
          window.history.back();
        }
      }
      else {
        // console.log(chrome.i18n.getMessage("noWarningDetected"));
      }
    }
  });
};