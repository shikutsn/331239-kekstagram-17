'use strict';

(function () {
  var Buttons = {
    'ACTION': {
      'filter-popular': 'filterPopular',
      'filter-new': 'filterNew',
      'filter-discussed': 'filterDiscussed'
    },
    'CLASS': 'img-filters__button',
    'CLASS_ACTIVE': 'img-filters__button--active',
    'DATA_ATTRIBUTE': 'data-action'
  };
  var NEW_PHOTOS_QUANTITY = 10;

  var imgFiltersFormEl = document.querySelector('.img-filters__form');

  var currentFilteredPhotos = [];

  var setButtonsDataAttributes = function () {
    imgFiltersFormEl.querySelectorAll('.' + Buttons.CLASS).forEach(function (element) {
      element.setAttribute(Buttons.DATA_ATTRIBUTE, Buttons.ACTION[element.id]);
    });
  };

  var switchActiveButton = function (activeButton) {
    imgFiltersFormEl.querySelectorAll('.' + Buttons.CLASS).forEach(function (element) {
      element.classList.remove(Buttons.CLASS_ACTIVE);
    });
    activeButton.classList.add(Buttons.CLASS_ACTIVE);
  };

  var removeCurrentPictures = function () {
    document.querySelectorAll('.picture').forEach(function (element) {
      element.remove();
    });
  };

  var shuffleArray = function (arr) {
    // гугл довел до перемешивания алгоритмом Фишера — Йетса
    for (var i = arr.length - 1; i > 0; i--) {
      var j = window.util.getRandomNumber(0, i + 1);
      var tmp = arr[j];
      arr[j] = arr[i];
      arr[i] = tmp;
    }
    return arr;
  };

  var filtersActions = {
    filterNew: function (photos) {
      return shuffleArray(photos.slice()).filter(function (it, i, arr) {
        return arr.indexOf(it) === i;
      }).slice(0, NEW_PHOTOS_QUANTITY);
    },

    filterDiscussed: function (photos) {
      return photos.slice().sort(function (a, b) {
        return b.comments.length - a.comments.length;
      });
    },

    filterPopular: function (photos) {
    // бессмысленная функция, но она нужна для унификации обработки нажатий на кнопки фильтров
      return photos;
    }
  };

  var onFiltersFormClick = function (evt) {
    var pressedButton = evt.target.closest('.' + Buttons.CLASS);
    var action = pressedButton.getAttribute(Buttons.DATA_ATTRIBUTE);
    currentFilteredPhotos = filtersActions[action](window.data.photos);

    removeCurrentPictures();
    switchActiveButton(pressedButton);

    window.gallery.renderGallery(currentFilteredPhotos);
  };

  var onFiltersFormClickDebounced = window.util.debounce(onFiltersFormClick);

  setButtonsDataAttributes();
  imgFiltersFormEl.addEventListener('click', onFiltersFormClickDebounced);

})();
