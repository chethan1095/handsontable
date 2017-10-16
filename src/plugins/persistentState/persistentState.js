import Hooks from './../../pluginHooks';
import {hasOwnProperty, objectEach} from './../../helpers/object';

function Storage(prefix) {
  var savedKeys;

  var saveSavedKeys = function() {
    window.localStorage[`${prefix}__persistentStateKeys`] = JSON.stringify(savedKeys);
  };

  var loadSavedKeys = function() {
    var keysJSON = window.localStorage[`${prefix}__persistentStateKeys`];
    var keys = typeof keysJSON === 'string' ? JSON.parse(keysJSON) : void 0;
    savedKeys = keys ? keys : [];
  };

  var clearSavedKeys = function() {
    savedKeys = [];
    saveSavedKeys();
  };

  loadSavedKeys();

  this.saveValue = function(key, value) {
    window.localStorage[`${prefix}_${key}`] = JSON.stringify(value);
    if (savedKeys.indexOf(key) === -1) {
      savedKeys.push(key);
      saveSavedKeys();
    }

  };

  this.loadValue = function(key, defaultValue) {

    key = typeof key === 'undefined' ? defaultValue : key;

    var value = window.localStorage[`${prefix}_${key}`];

    return typeof value === 'undefined' ? void 0 : JSON.parse(value);
  };

  this.reset = function(key) {
    window.localStorage.removeItem(`${prefix}_${key}`);
  };

  this.resetAll = function() {
    for (var index = 0; index < savedKeys.length; index++) {
      window.localStorage.removeItem(`${prefix}_${savedKeys[index]}`);
    }

    clearSavedKeys();
  };
}

/**
 * @private
 * @class PersistentState
 * @plugin PersistentState
 */
function HandsontablePersistentState() {
  var plugin = this;

  this.init = function() {
    var instance = this,
      pluginSettings = instance.getSettings().persistentState;

    plugin.enabled = !!(pluginSettings);

    if (!plugin.enabled) {
      removeHooks.call(instance);
      return;
    }

    if (!instance.storage) {
      instance.storage = new Storage(instance.rootElement.id);
    }

    instance.resetState = plugin.resetValue;

    addHooks.call(instance);

  };

  this.saveValue = function(key, value) {
    var instance = this;

    instance.storage.saveValue(key, value);
  };

  this.loadValue = function(key, saveTo) {
    var instance = this;

    saveTo.value = instance.storage.loadValue(key);
  };

  this.resetValue = function(key) {
    var instance = this;

    if (typeof key === 'undefined') {
      instance.storage.resetAll();
    } else {
      instance.storage.reset(key);
    }

  };

  var hooks = {
    persistentStateSave: plugin.saveValue,
    persistentStateLoad: plugin.loadValue,
    persistentStateReset: plugin.resetValue,
  };

  objectEach(hooks, (value, key) => {
    if (hasOwnProperty(hooks, key)) {
      Hooks.getSingleton().register(key);
    }
  });

  function addHooks() {
    var instance = this;

    objectEach(hooks, (value, key) => {
      if (hasOwnProperty(hooks, key)) {
        instance.addHook(key, hooks[key]);
      }
    });
  }

  function removeHooks() {
    var instance = this;

    objectEach(hooks, (value, key) => {
      if (hasOwnProperty(hooks, key)) {
        instance.removeHook(key, hooks[key]);
      }
    });
  }
}

var htPersistentState = new HandsontablePersistentState();

Hooks.getSingleton().add('beforeInit', htPersistentState.init);
Hooks.getSingleton().add('afterUpdateSettings', htPersistentState.init);

export default HandsontablePersistentState;
