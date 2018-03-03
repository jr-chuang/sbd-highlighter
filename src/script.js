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
    chrome.storage.local.get('fontSize', function (storageObject) {
      document.getElementById('fontSize').value = storageObject.fontSize;
    });
    chrome.storage.local.get('lineHeight', function (storageObject) {
      var elem = document.getElementById('lineHeight');
      for (var i = 0; i < elem.options.length; i++) {
        if (elem.options[i].value = storageObject.lineHeight) {
          elem.selectedIndex = i;
          break;
        }
      }
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

    element = document.getElementById('fontSize');
    element.addEventListener('change', function () {
      chrome.storage.local.set( {'fontSize': this.value }, () => {
        runScript();
      });
    });

    element = document.getElementById('lineHeight');
    element.addEventListener('change', function () {
      chrome.storage.local.set( {'lineHeight': this.options[this.selectedIndex].value }, () => {
        runScript();
      });
    });

  });
});
