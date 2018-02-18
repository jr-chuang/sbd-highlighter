chrome.storage.local.get('autorun', function (storageObject) {
   if (storageObject.autorun) {
    highlight();
   }
});

function highlight() {
  let tokenizer = require('sbd');
  let paragraphs = document.getElementsByTagName('p');
  let hue = Math.floor(Math.random()*360);

  for (let i = 0; i < paragraphs.length; i++) {
    let element = paragraphs[i];
    let sentences = tokenizer.sentences(element.innerHTML);
    element.innerHTML = '';
    for (let j = 0; j < sentences.length; j++) {
      let line = document.createElement('span');
      line.style.backgroundColor = 'hsl(' + hue + ', 75%, 97.5%)';
      line.style.boxDecorationBreak = 'clone';
      line.style.webkitBoxDecorationBreak = 'clone';
      hue = (hue + 130) % 360;
      line.innerHTML = sentences[j] + ' ';
      element.appendChild(line);
    }
  }
}
