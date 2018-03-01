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

    chrome.storage.local.get('autorun', function (storageObject) {
      document.getElementById("autorun").checked = storageObject.autorun;
    });
    chrome.storage.local.get('paragraph', function (storageObject) {
      document.getElementById('paragraph').checked = storageObject.paragraph;
    });
    chrome.storage.local.get('dyslexic', function (storageObject) {
      document.getElementById('dyslexic').checked = storageObject.dyslexic;
    });
    chrome.storage.local.get('fontSize', function (storageObject) {
      document.getElementById('fontSize').value = storageObject.fontSize;
    });

    var element = document.getElementById('enable');
    element.addEventListener('click', () => {
      runScript();
    });

    element = document.getElementById('autorun');
    element.addEventListener('change', function () {
      chrome.storage.local.set( {'autorun': this.checked }, () => {
        runScript();
      });
    });

    element = document.getElementById('paragraph');
    element.addEventListener('change', function () {
      chrome.storage.local.set( {'paragraph': this.checked }, () => {
        runScript();
      });
    });
    
    element = document.getElementById('dyslexic');
    element.addEventListener('change', function () {
      chrome.storage.local.set( {'dyslexic': this.checked }, () => {
        runScript();
      });
    });

    element = document.getElementById('fontSize');
    element.addEventListener('change', function () {
      chrome.storage.local.set( {'fontSize': this.value }, () => {
        runScript();
      });
    });

  });
});
