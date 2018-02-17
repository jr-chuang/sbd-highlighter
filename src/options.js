function loadOptions() {
	var isAutorunOn = localStorage["autorun"];

	if (isAutorunOn == undefined) {
		isAutorunOn = false;
	}

	document.getElementById("autorun").checked = isAutorunOn;
}

function saveOptions() {
	var isAutorunOn = document.getElementById("autorun").checked;
	localStorage["autorun"] = isAutorunOn;
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