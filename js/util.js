'use strict';


(function () {
  var getRandomNumber = function (min, max) {
    // случайное целое число из полуинтервала [min, max)
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var getRandomArrayElement = function (arr) {
    return arr[getRandomNumber(0, arr.length)];
  };

  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomArrayElement: getRandomArrayElement
  };

})();
