/*******
  sessionStorage stuff allows this page to be 
  both autoran and manually ran.
********/
if (sessionStorage["postAutorunCheck"] != "true") {
  chrome.storage.local.get('autorun', function (storageObject) {
    if (storageObject.autorun) {
      highlight();
    }
  });
  sessionStorage.setItem("postAutorunCheck", "true");
}
else {
  highlight();
}

function handleSentences(paragraph, hue) {
  let tokenizer = require('sbd');
  let sentences = tokenizer.sentences(paragraph.innerHTML);
  paragraph.innerHTML = '';
  
  for (let j = 0; j < sentences.length; j++) {
    let line = document.createElement('span');
    line.style.backgroundColor = 'hsl(' + hue + ', 75%, 97.5%)';
    line.style.boxDecorationBreak = 'clone';
    line.style.webkitBoxDecorationBreak = 'clone';
    hue = (hue + 130) % 360;
    line.innerHTML = sentences[j] + ' ';
    paragraph.appendChild(line);
  }
}

function highlight() {
  let paragraphs = document.getElementsByTagName('p');
  let hue = Math.floor(Math.random()*360);

  for (let i = 0; i < paragraphs.length; i++) {
    chrome.storage.local.get('paragraph', function (storageObject) {
      if (storageObject.paragraph) {
        console.log("Here!");
      }
      else {
        handleSentences(paragraphs[i], hue);
      }
    });
  }
  sessionStorage.removeItem("postAutorunCheck");
}
