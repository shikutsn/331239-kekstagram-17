'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var getRandomNumber = function (min, max) {
    // случайное целое число из полуинтервала [min, max)
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var getRandomArrayElement = function (arr) {
    return arr[getRandomNumber(0, arr.length)];
  };

  var debounce = function (debouncedFunction) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        debouncedFunction.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomArrayElement: getRandomArrayElement,
    debounce: debounce
  };

})();
