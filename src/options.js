function loadOptions() {
  chrome.storage.local.get('autorun', function (storageObject) {
    document.getElementById("autorun").checked = storageObject.autorun;
  });
  chrome.storage.local.get('paragraph', function (storageObject) {
    document.getElementById('paragraph').checked = storageObject.paragraph;
  });
}

function saveOptions() {
	var isChecked = document.getElementById('autorun').checked;
  chrome.storage.local.set({'autorun': isChecked}, undefined);
  isChecked = document.getElementById('paragraph').checked;
  chrome.storage.local.set({'paragraph': isChecked}, undefined);
  location.reload();
}

function restoreDefaultOptions() {
	chrome.storage.local.clear();
	location.reload();
}

window.onload = function() {
  loadOptions();
  var saveButton = document.getElementById('saveButton');
  saveButton.addEventListener('click', () => {
    saveOptions();
  });
  var restoreButton = document.getElementById('restoreButton');
  restoreButton.addEventListener('click', () => {
    restoreDefaultOptions();
  });
}