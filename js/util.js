'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var ESC_KEYCODE = 27;

  var getRandomNumber = function (min, max) {
    // случайное целое число из полуинтервала [min, max)
    // BUG: используется после удаления мок-данных?
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var shuffleArray = function (arr) {
    // перемешивание алгоритмом Фишера — Йетса
    var result = arr.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = getRandomNumber(0, i + 1);
      var tmp = result[j];
      result[j] = result[i];
      result[i] = tmp;
    }
    return result;
  };

  var debounce = function (debouncedAction) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        debouncedAction.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  var isEscPressed = function (evt) {
    return evt.keyCode === ESC_KEYCODE;
  };


  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomArrayElement: getRandomArrayElement,
    shuffleArray: shuffleArray,
    debounce: debounce,
    isEscPressed: isEscPressed,
  };
})();
