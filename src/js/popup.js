// Set initial state of the toggle switch and handle change events
document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.querySelector('#toggleSwitch');
    const statusOn = document.querySelector('#status #on');
    const statusOff = document.querySelector('#status #off');

    if (!toggleSwitch || !statusOn || !statusOff) {
        console.error(chrome.i18n.getMessage("popupElementNotFound"));
        return;
    }

    chrome.storage.local.get('enabled', function (data) {
        const isEnabled = data.enabled !== undefined ? data.enabled : true;
        toggleSwitch.checked = isEnabled;
        statusOn.style.display = isEnabled ? 'inline' : 'none';
        statusOff.style.display = isEnabled ? 'none' : 'inline';

        toggleSwitch.addEventListener('change', function () {
            chrome.storage.local.set({ enabled: isEnabled });
            statusOn.style.display = isEnabled ? 'inline' : 'none';
            statusOff.style.display = isEnabled ? 'none' : 'inline';

            chrome.runtime.sendMessage({ method: 'updateBadge', enabled: isEnabled });
        });
    });
});


// Handles click event on GitHub logo to open a new tab
document.querySelector('.githubLogo').addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: "openNewTab", url: "https://github.com/L4N14KE4/SteamDirect" });
});