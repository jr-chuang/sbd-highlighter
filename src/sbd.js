// sessionStorage stuff allows this page to be 
//  both autoran and manually ran.
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

function getNextHue(hue) {
  return (hue + 130) % 360;
}

function styleElement(elem, hue) {
  elem.style.backgroundColor = 'hsl(' + hue + ', 75%, 97.5%)';
  elem.style.boxDecorationBreak = 'clone';
  elem.style.webkitBoxDecorationBreak = 'clone';
}

function handleSentences(paragraph, hue) {
  let tokenizer = require('sbd');
  let sentences = tokenizer.sentences(paragraph.innerHTML);
  paragraph.innerHTML = '';
  
  for (let j = 0; j < sentences.length; j++) {
    let line = document.createElement('span');
    styleElement(line, hue);
    hue = getNextHue(hue);
    line.innerHTML = sentences[j] + ' ';
    paragraph.appendChild(line);
  }
  // Return the hue so colors don't keep repeating.
  return hue;
}

function highlight() {
  let paragraphs = document.getElementsByTagName('p');
  let hue = Math.floor(Math.random()*360);

  chrome.storage.local.get('paragraph', function (storageObject) {
    for (let i = 0; i < paragraphs.length; i++) {
      if (storageObject.paragraph) {
        styleElement(paragraphs[i], hue);
        hue = getNextHue(hue);
      }
      else {
        hue = handleSentences(paragraphs[i], hue);
      }
    }
  });
  sessionStorage.removeItem("postAutorunCheck");
}
