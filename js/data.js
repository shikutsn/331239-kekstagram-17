'use strict';

(function () {
  var NEW_PHOTOS_QUANTITY = 10;

  var photos = [];
  var discussedPhotos = [];
  var newPhotos = [];

  var getNew = function () {
    if (!newPhotos.length) {
      newPhotos = window.util.shuffleArray(photos).slice(0, NEW_PHOTOS_QUANTITY);
    }
    return newPhotos;
  };

  var getDiscussed = function () {
    if (!discussedPhotos.length) {
      discussedPhotos = photos.slice().sort(function (a, b) {
        return b.comments.length - a.comments.length;
      });
    }
    return discussedPhotos;
  };

  var getPopular = function () {
    return photos;
  };

  var setData = function (data) {
    photos = data;
  };

  window.data = {
    getNew: getNew,
    getDiscussed: getDiscussed,
    getPopular: getPopular,
    set: setData
  };
})();
