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

function fontSizeScript(fntValue) {
  console.log('the font value is ' + fntValue);

  chrome.tabs.executeScript({
    code: 'var sbd_fontvalue =' + fntValue + ';'
  })
  chrome.tabs.executeScript({

    file: 'fontchange.js'
  });
}


document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var button = document.getElementById('enable');
    button.addEventListener('click', () => {
      runScript();
    });


    var fontSizeBtn = document.getElementById('fntbtn');
    fontSizeBtn.addEventListener('click', () => {
      var fntValue = document.getElementById('fntSize').value;
      fontSizeScript(fntValue);
    });

  });
});
