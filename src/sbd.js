
// The following code is ran on the start of initialization.
// console.log('Running extension_sbd extension script...');

// Global variable for extension
window.extension_sbd = window.extension_sbd || { DEBUG: false, TIME: new Date().getTime() };
extension_sbd = window.extension_sbd;

extension_sbd.lineHeight = extension_sbd.lineHeight || require('line-height');
extension_sbd.sbd = extension_sbd.sbd || require('sbd');

if (typeof extension_sbd.styleNode === 'undefined') {
  extension_sbd.styleNode = document.createElement('style');
  extension_sbd.styleNode.type = 'text/css';
  extension_sbd.styleNode.textContent   = "@font-face { font-family: OpenDyslexic; src: url('"
    + chrome.extension.getURL("OpenDyslexic-Regular.otf")
    + "'); }";
  document.head.appendChild(extension_sbd.styleNode);
}

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
    this.getStorageValue('enabled'),
    this.getStorageValue('paragraph'),
    this.getStorageValue('font'),
    this.getStorageValue('fontsize'),
    this.getStorageValue('vspace'),
    this.getStorageValue('padding'),
    this.getStorageValue('width'),
    this.getStorageValue('fontsize_slider'),
    this.getStorageValue('vspace_slider'),
    this.getStorageValue('padding_slider'),
    this.getStorageValue('colors')
  ] )
  .then((values) => {

    // Store parameters.
    let parameters = {};
    parameters.enabled = values[0];
    parameters.paragraph = values[1];
    parameters.font = values[2];
    parameters.fontsize = values[3];
    parameters.vspace = values[4];
    parameters.padding = values[5];
    parameters.width = values[6];
    parameters.fontsize_slider = values[7];
    parameters.vspace_slider = values[8];
    parameters.padding_slider = values[9];
    parameters.colors = values[10];
    parameters.hue = Math.floor(Math.random()*360);
    parameters.hueModifier = 70;
    parameters.nextSentence = function () {
      this.hue = (this.hue + this.hueModifier) % 360;
    };
    parameters.nextParagraph = function () {
      if (this.paragraph) {
        this.hue = (this.hue + this.hueModifier) % 360;
      }
    };

    if (extension_sbd.DEBUG) extension_sbd.log(parameters, 'parameters');
    return parameters;

  }).then((parameters) => {

    // Begin operation
    if (extension_sbd.DEBUG) extension_sbd.log('Beginning core functionality.');

    for (let i = 0; i < extension_sbd.paragraphs.length; i++) {
      let paragraph = extension_sbd.paragraphs[i];
      this.styleParagraph(paragraph, parameters);
    }

    if (extension_sbd.DEBUG) extension_sbd.log('Core functionality completed.');

  });

}

// Styles the given element based on the given parameters
extension_sbd.styleParagraph = extension_sbd.styleParagraph || function (paragraph, parameters) {

  let elem = paragraph.element;

  if (parameters.paragraph === 'disabled') {
    paragraph.resetStyle();
    if (parameters.enabled) {
      switch (parameters.width) {
        case 'disabled':
          elem.style.maxWidth = paragraph.style.maxWidth;
          break;
        case 'condensed':
          elem.style.maxWidth = '36em';
          break;
      }
    }
    this.styleSentence(paragraph, parameters);
  } else {
    if (typeof paragraph.sentences !== 'undefined') {
      for (let i = 0; i < paragraph.sentences.length; i++) {
        paragraph.sentences[i].resetStyle();
      }
    }
    if (parameters.enabled) {
      if (parameters.colors == 'enabled') {
        elem.style.backgroundColor = 'hsl(' + parameters.hue + ', 78%, 90%)';
      } else {
        elem.style.backgroundColor = paragraph.style.backgroundColor;
      }
      elem.style.textShadow = 'none';
      switch (parameters.font) {
        case 'disabled':
          elem.style.fontFamily = paragraph.style.fontFamily;
          break;
        case 'default':
          elem.style.fontFamily = paragraph.style.fontFamily;
          break;
        case 'arial':
          elem.style.fontFamily = 'Arial, Helvetica, sans-serif';
          break;
        case 'opendys':
          elem.style.fontFamily = 'OpenDyslexic, Arial, sans-serif';
          break;
        case 'courier':
          elem.style.fontFamily = '"Courier New", Courier, monospace';
          break;
        case 'verdana':
          elem.style.fontFamily = 'Verdana, Geneva, sans-serif';
          break;
        case 'os':
          elem.style.fontFamily = '-apple-technique, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';
          break;
      }
      switch (parameters.fontsize) {
        case 'disabled':
          elem.style.fontSize = paragraph.style.fontSize;
          break;
        case 'automatic':
          elem.style.fontSize = paragraph.style.fontSize;
          break;
        case 'custom':
          elem.style.fontSize = (10 + parseInt(parameters.fontsize_slider)/3) + 'pt';
          break;
      }
      switch (parameters.vspace) {
        case 'disabled':
          elem.style.lineHeight = paragraph.style.lineHeight + 'px';
          break;
        case 'automatic':
          elem.style.lineHeight = 'normal';
          break;
        case 'custom':
          elem.style.lineHeight = (100 + 4*parseInt(parameters.vspace_slider)) + '%';
          break;
      }
      switch (parameters.padding) {
        case 'disabled':
          elem.style.paddingTop = paragraph.style.paddingTop + 'px';
          elem.style.paddingRight = paragraph.style.paddingRight + 'px';
          elem.style.paddingBottom = paragraph.style.paddingBottom + 'px';
          elem.style.paddingLeft = paragraph.style.paddingLeft + 'px';
          break;
        case 'automatic':
          elem.style.paddingTop = paragraph.style.paddingTop + 'px';
          elem.style.paddingRight = paragraph.style.paddingRight + 'px';
          elem.style.paddingBottom = paragraph.style.paddingBottom + 'px';
          elem.style.paddingLeft = paragraph.style.paddingLeft + 'px';
          break;
        case 'custom':
          let modifier = parseInt(parameters.padding_slider) / 5;
          elem.style.paddingTop = (paragraph.style.paddingTop + modifier) + 'px';
          elem.style.paddingRight = (paragraph.style.paddingRight + modifier) + 'px';
          elem.style.paddingBottom = (paragraph.style.paddingBottom + modifier) + 'px';
          elem.style.paddingLeft = (paragraph.style.paddingLeft + modifier) + 'px';
          break;
      }
      switch (parameters.width) {
        case 'disabled':
          elem.style.maxWidth = paragraph.style.maxWidth;
          break;
        case 'condensed':
          elem.style.maxWidth = '36em';
          break;
      }
    } else {
      paragraph.resetStyle();
    }
  }
  parameters.nextParagraph();
}

// Styles the given element based on the given parameters (only paragraph mode)
extension_sbd.styleSentence = extension_sbd.styleSentence || function (paragraph, parameters) {
  let elem = paragraph.element;
  if (typeof paragraph.sentences === 'undefined') {
    paragraph.sentences = this.generateSentences(elem);
  }
  for (let i = 0; i < paragraph.sentences.length; i++) {
    let sentence = paragraph.sentences[i].element;
    if (parameters.enabled) {
      if (parameters.colors == 'enabled') {
        sentence.style.backgroundColor = 'hsl(' + parameters.hue + ', 78%, 90%)';
      } else {
        sentence.style.backgroundColor = paragraph.sentences[i].style.backgroundColor;
      }
      sentence.style.boxDecorationBreak = 'clone';
      sentence.style.webkitBoxDecorationBreak = 'clone';
      switch (parameters.font) {
        case 'disabled':
          sentence.style.fontFamily = paragraph.sentences[i].style.fontFamily;
          break;
        case 'arial':
          sentence.style.fontFamily = 'Arial, Helvetica, sans-serif';
          break;
        case 'opendys':
          sentence.style.fontFamily = 'OpenDyslexic, Arial, sans-serif';
          break;
        case 'courier':
          sentence.style.fontFamily = '"Courier New", Courier, monospace';
          break;
        case 'verdana':
          sentence.style.fontFamily = 'Verdana, Geneva, sans-serif';
          break;
        case 'os':
          sentence.style.fontFamily = '-apple-technique, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';
          break;
      }
      switch (parameters.fontsize) {
        case 'disabled':
          sentence.style.fontSize = paragraph.sentences[i].style.fontSize;
          break;
        case 'automatic':
          sentence.style.fontSize = paragraph.sentences[i].style.fontSize;
          break;
        case 'custom':
          elem.style.fontSize = (10 + parseInt(parameters.fontsize_slider)/3) + 'pt';
          break;
      }
      switch (parameters.vspace) {
        case 'disabled':
          sentence.style.lineHeight = paragraph.sentences[i].style.lineHeight + 'px';
          break;
        case 'automatic':
          sentence.style.lineHeight = 'normal';
          break;
        case 'custom':
          sentence.style.lineHeight = (100 + 4*parseInt(parameters.vspace_slider)) + '%';
          break;
      }
      switch (parameters.padding) {
        case 'disabled':
          sentence.style.paddingTop = paragraph.sentences[i].style.paddingTop + 'px';
          sentence.style.paddingRight = paragraph.sentences[i].style.paddingRight + 'px';
          sentence.style.paddingBottom = paragraph.sentences[i].style.paddingBottom + 'px';
          sentence.style.paddingLeft = paragraph.sentences[i].style.paddingLeft + 'px';
          break;
        case 'automatic':
          sentence.style.paddingTop = paragraph.sentences[i].style.paddingTop + 'px';
          sentence.style.paddingRight = paragraph.sentences[i].style.paddingRight + 'px';
          sentence.style.paddingBottom = paragraph.sentences[i].style.paddingBottom + 'px';
          sentence.style.paddingLeft = paragraph.sentences[i].style.paddingLeft + 'px';
          break;
        case 'custom':
          let modifier = parseInt(parameters.padding_slider) / 5;
          sentence.style.paddingTop = (paragraph.sentences[i].style.paddingTop + modifier) + 'px';
          sentence.style.paddingRight = (paragraph.sentences[i].style.paddingRight + modifier) + 'px';
          sentence.style.paddingBottom = (paragraph.sentences[i].style.paddingBottom + modifier) + 'px';
          sentence.style.paddingLeft = (paragraph.sentences[i].style.paddingLeft + modifier) + 'px';
          break;
      }
    } else {
      paragraph.sentences[i].resetStyle();
    }
    parameters.nextSentence();
  }
}

// Stores all of the current paragraphs on the page.
extension_sbd.generateParagraphs = extension_sbd.generateParagraphs || function () {
  let paragraphs = this.getParagraphs();
  extension_sbd.paragraphs = [];
  for (let i = 0; i < paragraphs.length; i++) {
    extension_sbd.paragraphs.push({
      element: paragraphs[i],
      style: {
        fontSize: paragraphs[i].style.fontSize,
        maxWidth: paragraphs[i].style.maxWidth,
        lineHeight: extension_sbd.lineHeight(paragraphs[i]),
        fontFamily: paragraphs[i].style.fontFamily,
        paddingTop: parseInt(window.getComputedStyle(paragraphs[i], null).getPropertyValue('padding-top')),
        paddingRight: parseInt(window.getComputedStyle(paragraphs[i], null).getPropertyValue('padding-right')),
        paddingBottom: parseInt(window.getComputedStyle(paragraphs[i], null).getPropertyValue('padding-bottom')),
        paddingLeft: parseInt(window.getComputedStyle(paragraphs[i], null).getPropertyValue('padding-left')),
        backgroundColor: paragraphs[i].style.backgroundColor
      },
      resetStyle: function () {
        Object.assign(this.element.style, this.style);
        this.element.style.lineHeight = this.style.lineHeight + 'px';
        this.element.style.paddingTop = this.style.paddingTop + 'px';
        this.element.style.paddingRight = this.style.paddingRight + 'px';
        this.element.style.paddingBottom = this.style.paddingBottom + 'px';
        this.element.style.paddingLeft = this.style.paddingLeft + 'px';
      }
    });
  }
}

// Breaks down given element into an array of spans and returns the array.
extension_sbd.generateSentences = extension_sbd.generateSentences || function (paragraph) {
  let sentences = extension_sbd.sbd.sentences(paragraph.innerText);
  paragraph.innerText = '';
  for (let i = 0; i < sentences.length; i++) {
    let line = document.createElement('span');
    line.innerText = sentences[i] + ' ';
    paragraph.appendChild(line);
    sentences[i] = {
      element: line,
      style: {
        fontSize: line.style.fontSize,
        lineHeight: extension_sbd.lineHeight(line),
        fontFamily: line.style.fontFamily,
        paddingTop: parseInt(window.getComputedStyle(line, null).getPropertyValue('padding-top')),
        paddingRight: parseInt(window.getComputedStyle(line, null).getPropertyValue('padding-right')),
        paddingBottom: parseInt(window.getComputedStyle(line, null).getPropertyValue('padding-bottom')),
        paddingLeft: parseInt(window.getComputedStyle(line, null).getPropertyValue('padding-left')),
        backgroundColor: line.style.backgroundColor
      },
      resetStyle: function () {
        Object.assign(this.element.style, this.style);
        this.element.style.lineHeight = this.style.lineHeight + 'px';
        this.element.style.paddingTop = this.style.paddingTop + 'px';
        this.element.style.paddingRight = this.style.paddingRight + 'px';
        this.element.style.paddingBottom = this.style.paddingBottom + 'px';
        this.element.style.paddingLeft = this.style.paddingLeft + 'px';
      }
    };
  }
  return sentences;
}

// Core feature -> initiates standard operation.
extension_sbd.highlight = extension_sbd.highlight || function () {

  // Store all paragraph elements globally if not already stored.
  if (typeof extension_sbd.paragraphs === 'undefined') {
    if (extension_sbd.DEBUG) extension_sbd.log('Finding and storing paragraphs.');
    extension_sbd.generateParagraphs();
  } else {
    if (extension_sbd.DEBUG) extension_sbd.log('Paragraphs already found.');
  }

  if (extension_sbd.DEBUG) extension_sbd.log(extension_sbd, 'paragraphs');

  // Handle all paragraphs.
  this.handleParagraphs();

}

// The following code is ran at the end of initialization.

// Autorun functionality
if (sessionStorage['postAutorunCheck'] !== 'true') {
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
  chrome.storage.local.set({'enabled': false}, undefined);
});
