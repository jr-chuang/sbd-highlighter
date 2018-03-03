function getCurrentTabUrl(callback) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    callback(tabs[0].url);
  });
}

document.addEventListener('DOMContentLoaded', () => {

  getCurrentTabUrl( (url) => {

    function configureSelect(id) {
      chrome.storage.local.get(id, (storageObject) => {
          let elem = document.getElementById(id);
          // Select default or previously loaded.
          if (typeof storageObject[id] === 'undefined') {
            elem.selectedIndex = 0;
            elem.options[elem.selectedIndex].selected = true;
            let def = {};
            def[id] = elem.options[0].value;
            chrome.storage.local.set(def, undefined);
          } else {
            for (let i = 0; i < elem.options.length; i++) {
              if (elem.options[i].value == storageObject[id]) {
                elem.selectedIndex = i;
                elem.options[elem.selectedIndex].selected = true;
                break;
              }
            }
          }
          // Add EventListener.
          elem.addEventListener('change', function () {
            let def = {};
            def[this.id] = this.options[this.selectedIndex].value;
            chrome.storage.local.set(def, () => {
              chrome.tabs.executeScript({
                file: 'sbd.js'
              });
            });
          });
      });
    }

    function configureSlider(id, def_value) {
      chrome.storage.local.get(id, (storageObject) => {
        let elem = document.getElementById(id);
        // Select default or previously Loaded.
        if (typeof storageObject[id] === 'undefined') {
          elem.value = def_value;
          let def = {};
          def[id] = def_value;
          chrome.storage.local.set(def, undefined);
        } else {
          elem.value = storageObject[id];
        }
        // Add EventListener
        elem.addEventListener('change', function () {
          let def = {};
          def[this.id] = this.value;
          chrome.storage.local.set(def, () => {
            chrome.tabs.executeScript({
              file: 'sbd.js'
            });
          });
        });
      });
    }

    chrome.storage.local.get('enabled', (storageObject) => {

      let enabled = document.getElementById('enabled');

      // Select default
      if (typeof storageObject.enabled === 'undefined') {
        enabled.checked = false;
        chrome.storage.local.set({'enabled': false}, undefined);
      }

    });

    chrome.storage.local.get('autorun', (storageObject) => {

      let autorun = document.getElementById('autorun');
      let enabled = document.getElementById('enabled');

      // Select default or previously loaded.
      if (typeof storageObject.autorun === 'undefined') {
        autorun.checked = false;
        chrome.storage.local.set({'autorun': false}, undefined);
      } else {
        autorun.checked = storageObject.autorun;
        enabled.checked = storageObject.autorun;
      }

      // Add EventListener.
      autorun.addEventListener('change', function () {
        chrome.storage.local.set({'autorun': this.checked}, () => {
          chrome.tabs.executeScript({
            file: 'sbd.js'
          });
        });
      });

      enabled.addEventListener('change', function () {
        chrome.storage.local.set({'enabled': this.checked}, () => {
          chrome.tabs.executeScript({
            file: 'sbd.js'
          });
        });
      });

    });

    configureSelect('colors');
    configureSelect('paragraph');
    configureSelect('font');
    configureSelect('fontsize');
    configureSelect('vspace');
    configureSelect('padding');
    configureSelect('width');

    configureSlider('fontsize_slider', 20);
    configureSlider('vspace_slider', 20);
    configureSlider('padding_slider', 20);

  });
});
