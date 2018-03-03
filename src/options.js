function getCurrentTabUrl(callback) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    callback(tabs[0].url);
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
    /*
    chrome.storage.local.get('font', function (storageObject) {
      document.getElementById('font').checked = storageObject.dyslexic;
    });
    */
    chrome.storage.local.get('fontsize', function (storageObject) {
      document.getElementById('fontsize').value = storageObject.fontSize;
    });

    element = document.getElementById('autorun');
    element.addEventListener('change', function () {
      chrome.storage.local.set( {'autorun': this.checked }, () => {

      });
    });

    element = document.getElementById('paragraph');
    element.addEventListener('change', function () {
      chrome.storage.local.set( {'paragraph': this.checked }, () => {

      });
    });

    element = document.getElementById('dyslexic');
    element.addEventListener('change', function () {
      chrome.storage.local.set( {'font': (this.checked ? 'arial' : 'disabled') }, () => { });
    });

    element = document.getElementById('fontsize');
    element.addEventListener('change', function () {
      chrome.storage.local.set( {'fontsize': this.value }, () => {

      });
    });

  });
});
