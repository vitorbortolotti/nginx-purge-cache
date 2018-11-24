/**
 * Dispatched when user clicks on the extension popup
 */
document.addEventListener('DOMContentLoaded', function() {

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        const urlParser = document.createElement('a');
        const currentTab = tabs[0];
        urlParser.href = currentTab.url;

        const url = urlParser.protocol + '//' + urlParser.hostname + '/purge' + urlParser.pathname;

        requestURL(url).then((responseStatus) => {

            if (responseStatus === 200) {
                setPopupText('Successful purge');
            } else if (responseStatus === 404) {
                setPopupText('404 - No cache found');
            }

            chrome.tabs.reload(currentTab.id);
        });
    });

}, false);

/**
 * Performs a GET request to param url and returns a Promise
 * @param url
 * @returns {Promise<any>}
 */
function requestURL(url) {

    return new Promise(resolve => {

        const request = new XMLHttpRequest();

        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                resolve(request.status);
            }
        };

        request.open('GET', url, true);
        request.send();

    });

}

/**
 * Set the text displayed on the extension popup
 * @param text
 */
function setPopupText(text) {
    document.getElementById('response-status').innerHTML = text;
}