
// The following code is ran on the start of initialization.
console.log('Running sbd_extension extension script...');

// Global variable for extension
var extension_sbd = extension_sbd || { DEBUG: true };

// The following code is the core functionality of the extension.

// Debug/logging function
extension_sbd.log = extension_sbd.log || function (statement, comments) {
  if (comments === undefined) {
    console.log('extension_sbd debug: ' + statement);
  } else {
    console.log('extension_sbd debug object (' + comments + ')');
    console.log(statement);
  }

}

// Returns all HTML elements to be processed by the extension.
extension_sbd.getParagraphs = extension_sbd.getParagraphs || function () {
  return document.getElementsByTagName('p');
}

// ASYNC: returns promise for the requested Chrome storage value.
extension_sbd.getStorageValue = extension_sbd.getStorageValue || function (value) {
  return new Promise((resolve, reject) => {
    if (extension_sbd.DEBUG) extension_sbd.log('Acquiring via promise: ' + value);
    chrome.storage.local.get(value, (storageObject) => {
      resolve(storageObject[value]);
    });
  });
}

// Loaded function that handles the core functionality.
extension_sbd.handleParagraphs = extension_sbd.handleParagraphs || function () {

  if (extension_sbd.DEBUG) extension_sbd.log('Acquiring parameters.');

  // Get parameters
  Promise.all( [
    this.getStorageValue('paragraph'),
    this.getStorageValue('fontSize')] )
  .then((values) => {

    // Store parameters.
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
    if (extension_sbd.DEBUG) extension_sbd.log(parameters, 'parameters');
    return parameters;

  }).then((parameters) => {

    // Begin operation
    if (extension_sbd.DEBUG) extension_sbd.log('Beginning core functionality.');

    // Paragraph or sentence mode?
    if (parameters.paragraph) {
      if (extension_sbd.DEBUG) extension_sbd.log('Paragraph mode.');
      // Style each element.
      for (let i = 0; i < extension_sbd.paragraphs.length; i++) {
        let paragraph = extension_sbd.paragraphs[i];
        this.styleElement(paragraph.element, parameters);
        parameters.nextParagraph();
      }
    } else {
      if (extension_sbd.DEBUG) extension_sbd.log('Sentence mode.');
      for (let i = 0; i < extension_sbd.paragraphs.length; i++) {
        let paragraph = extension_sbd.paragraphs[i];
        // Generate sentences if not already generated.
        if (typeof paragraph.sentences === 'undefined') {
          paragraph.sentences = this.generateSentences(paragraph.element);
        }
        // Style each sentence.
        for (let j = 0; j < paragraph.sentences.length; j++) {
          let sentence = paragraph.sentences[j];
          this.styleElement(sentence.element, parameters);
          parameters.nextSentence();
        }
        parameters.nextParagraph();
      }
    }

    if (extension_sbd.DEBUG) extension_sbd.log('Core functionality completed.');

  });

}

// Styles the given element based on the given parameters
extension_sbd.styleElement = extension_sbd.styleElement || function (elem, parameters) {
  elem.style.backgroundColor = 'hsl(' + parameters.hue + ', 78%, 90%)';
  elem.style.boxDecorationBreak = 'clone';
  elem.style.webkitBoxDecorationBreak = 'clone';
  if (typeof parameters.fontSize !== 'undefined') {
    elem.style.fontSize = '' + parameters.fontSize + 'px';
  }
}

// Breaks down given element into an array of spans and returns the array.
extension_sbd.generateSentences = extension_sbd.generateSentences || function (paragraph) {
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
extension_sbd.highlight = extension_sbd.highlight || function () {

  // Store all paragraph elements globally if not already stored.
  if (typeof extension_sbd.paragraphs === 'undefined') {
    if (extension_sbd.DEBUG) extension_sbd.log('Finding and storing paragraphs.');
    let paragraphs = this.getParagraphs();
    extension_sbd.paragraphs = [];
    for (let i = 0; i < paragraphs.length; i++) {
      extension_sbd.paragraphs.push({
        element: paragraphs[i]
      });
    }
  } else {
    if (extension_sbd.DEBUG) extension_sbd.log('Paragraphs already found.');
  }

  if (extension_sbd.DEBUG) extension_sbd.log(extension_sbd, 'paragraphs');

  // Handle all paragraphs.
  this.handleParagraphs();

}

// The following code is ran at the end of initialization.

// Autorun functionality
if (sessionStorage["postAutorunCheck"] !== 'true') {
  chrome.storage.local.get('autorun', function (storageObject) {
    if (storageObject.autorun) {
      if (extension_sbd.DEBUG) extension_sbd.log('Autorunning highlight.');
      extension_sbd.highlight();
    }
  });
  sessionStorage.setItem('postAutorunCheck', 'true');
} else {
  if (extension_sbd.DEBUG) extension_sbd.log('Button pressed.');
  extension_sbd.highlight();
}

window.addEventListener('beforeunload', function () {
  sessionStorage.removeItem("postAutorunCheck");
});
