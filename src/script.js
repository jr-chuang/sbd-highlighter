function getCurrentTabUrl(callback) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    callback(tabs[0].url);
  });
}

function runScript() {
  chrome.tabs.executeScript({
    file: 'sbd.js'
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var button = document.getElementById('enable');
    button.addEventListener('click', () => {
      runScript();
    });
  });
});
