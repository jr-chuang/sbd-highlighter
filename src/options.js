function loadOptions() {
  chrome.storage.local.get('autorun', function (storageObject) {
    document.getElementById("autorun").checked = storageObject.autorun;
  });
}

function saveOptions() {
	var isAutorunOn = document.getElementById("autorun").checked;
  chrome.storage.local.set({'autorun': isAutorunOn}, undefined);
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