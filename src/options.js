function loadOptions() {
  chrome.storage.local.get('autorun', function (storageObject) {
    document.getElementById("autorun").checked = storageObject.autorun;
  });
}

function saveOptions() {
	var isAutorunOn = document.getElementById("autorun").checked;
  chrome.storage.local.set({'autorun': isAutorunOn}, undefined);
}

function restoreDefaultOptions() {
	localStorage.removeItem("autorun");
	location.reload();
}

window.onload = function() {
  localStorage;
  var options = document.getElementById('options');
  options.addEventListener('load', () => {
    loadOptions();
  });
  var saveButton = document.getElementById('saveButton');
  saveButton.addEventListener('click', () => {
    saveOptions();
  });
  var restoreButton = document.getElementById('restoreButton');
  restoreButton.addEventListener('click', () => {
    restoreDefaultOptions();
  });
}