
// The following code is ran on initialization.

console.log('Initializing sbd extension...');

var extension_sbd = extension_sbd || { DEBUG: true };
if (extension_sbd.DEBUG) console.log('Created global extension variable.');

if (sessionStorage["postAutorunCheck"] != "true") {
  chrome.storage.local.get('autorun', function (storageObject) {
    if (storageObject.autorun) {
      if (extension_sbd.DEBUG) console.log('Autorunning highlight.');
      highlight();
    }
  });
  sessionStorage.setItem("postAutorunCheck", "true");
} else {
  if (extension_sbd.DEBUG) console.log('Autorunning highlight.');
  highlight();
}

// The following code is the core functionality of the extension.

// Returns all HTML elements to be processed by the extension.
function getParagraphs() {
  return document.getElementsByTagName('p');
}

// ASYNC: returns promise for the requested Chrome storage value.
function getStorageValue(value) {
  return new Promise((resolve, reject) => {
    if (extension_sbd.DEBUG) console.log('Acquiring via promise: ' + value);
    chrome.storage.local.get(value, (storageObject) => {
      resolve(storageObject[value]);
    });
  });
}

// Loaded function that handles the core functionality.
function handleParagraphs() {

  if (extension_sbd.DEBUG) console.log('Acquiring parameters.');

  // Get parameters
  Promise.all( [
    getStorageValue('paragraph'),
    getStorageValue('fontSize')] )
  .then((values) => {
    let parameters = {};
    parameters.paragraph = values[0];
    parameters.fontSize = values[1];
    parameters.hue = Math.floor(Math.random()*360);
    parameters.hueModifier = 70;
    parameters.nextSentence = function () {
      this.hue = (this.hue + this.hueModifier) % 360;
    };
    if (parameters.paragraph) {
      parameters.nextParagraph = function () {
        this.hue = (this.hue + this.hueModifier) % 360;
      };
    } else {
      parameters.nextParagraph = function () {};
    }

    if (extension_sbd.DEBUG) {
      console.log('Parameters acquired:');
      console.log(parameters);
    }

    return parameters;
  }).then((parameters) => {

    // Begin operation
    if (extension_sbd.DEBUG) console.log('Beginning core functionality.');

    // Paragraph or sentence mode?
    if (parameters.paragraph) {
      if (extension_sbd.DEBUG) console.log('Paragraph mode.');
      for (let i = 0; i < extension_sbd.paragraphs.length; i++) {
        let paragraph = extension_sbd.paragraphs[i];
        styleElement(paragraph.element, parameters);
        parameters.nextParagraph();
      }
    } else {
      if (extension_sbd.DEBUG) console.log('Sentence mode.');
      for (let i = 0; i < extension_sbd.paragraphs.length; i++) {
        let paragraph = extension_sbd.paragraphs[i];
        // Generate sentences if not already generated.
        if (typeof paragraph.sentences === 'undefined') {
          paragraph.sentences = generateSentences(paragraph.element);
        }
        for (let j = 0; j < paragraph.sentences.length; j++) {
          let sentence = paragraph.sentences[j];
          styleElement(sentence.element, parameters);
          parameters.nextSentence();
        }
        parameters.nextParagraph();
      }
    }

    if (extension_sbd.DEBUG) console.log('Core functionality completed.');

  });

}

// Styles the given element based on the given parameters
function styleElement(elem, parameters) {
  elem.style.backgroundColor = 'hsl(' + parameters.hue + ', 78%, 90%)';
  elem.style.boxDecorationBreak = 'clone';
  elem.style.webkitBoxDecorationBreak = 'clone';
  if (typeof parameters.fontSize !== 'undefined') {
    elem.style.fontSize = '' + parameters.fontSize + 'px';
  }
}

// Breaks down given element into an array of spans and returns the array.
function generateSentences(paragraph) {
  let tokenizer = require('sbd');
  let sentences = tokenizer.sentences(paragraph.innerText);
  paragraph.innerText = '';
  for (let i = 0; i < sentences.length; i++) {
    let line = document.createElement('span');
    line.innerText = sentences[i] + ' ';
    paragraph.appendChild(line);
    sentences[i] = { element: line };
  }
  return sentences;
}

// Core feature -> initiates standard operation.
function highlight() {

  // Store all paragraph elements globally if not already stored.
  if (typeof extension_sbd.paragraphs === 'undefined') {
    if (extension_sbd.DEBUG) console.log('Finding and storing paragraphs.');
    let paragraphs = getParagraphs();
    extension_sbd.paragraphs = [];
    for (let i = 0; i < paragraphs.length; i++) {
      extension_sbd.paragraphs.push({
        element: paragraphs[i]
      });
    }
  } else {
    if (extension_sbd.DEBUG) console.log('Paragraphs already found.');
  }

  if (extension_sbd.DEBUG) {
    console.log('Global Check:');
    console.log(extension_sbd);
  }

  // Handle all paragraphs.
  handleParagraphs();

  sessionStorage.removeItem("postAutorunCheck");
}

window.onbeforeunload = function() {
  sessionStorage.removeItem("postAutorunCheck");
}
