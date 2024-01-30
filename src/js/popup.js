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
        statusOn.style.display = isEnabled ? 'inline': 'none';
        statusOff.style.display = isEnabled ? 'none' : 'inline';

        toggleSwitch.addEventListener('change', function () {
            const newEnabledState = this.checked;

            chrome.storage.local.set({ enabled: newEnabledState }, function() {
                if (chrome.runtime.lastError) {
                    console.error(chrome.i18n.getMessage("errorSettingEnabledState"), chrome.runtime.lastError);
                } else {
                    chrome.runtime.sendMessage({ method: 'updateBadge', enabled: newEnabledState });
                }
            });

            statusOn.style.display = newEnabledState ? 'inline': 'none';
            statusOff.style.display = newEnabledState ? 'none' : 'inline';
        });
    });
});

document.querySelector('.githubLogo').addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: "openNewTab", url: "https://github.com/L4N14KE4/SteamDirect" });
});
