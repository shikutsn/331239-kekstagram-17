'use strict';

(function () {
  var BUTTON_CLASS = '.img-filters__button';
  var BUTTON_ACTIVE_CLASS = 'img-filters__button--active';
  var NEW_PHOTOS_QUANTITY = 10;

  var imgFiltersFormEl = document.querySelector('.img-filters__form');
  var filterPopularEl = imgFiltersFormEl.querySelector('#filter-popular');
  var filterNewEl = imgFiltersFormEl.querySelector('#filter-new');
  var filterDiscussedEl = imgFiltersFormEl.querySelector('#filter-discussed');

  var currentFilteredPhotos = [];

  var switchActiveButton = function (activeButton) {
    imgFiltersFormEl.querySelectorAll(BUTTON_CLASS).forEach(function (element) {
      element.classList.remove(BUTTON_ACTIVE_CLASS);
    });
    activeButton.classList.add(BUTTON_ACTIVE_CLASS);
  };

  var removeCurrentPictures = function () {
    document.querySelectorAll('.picture').forEach(function (element) {
      element.remove();
    });
  };

  var filterDiscussed = function (photos) {
    return photos.slice().sort(function (a, b) {
      return b.comments.length - a.comments.length;
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

  var filterNew = function (photos) {
    return shuffleArray(photos.slice()).filter(function (it, i, arr) {
      return arr.indexOf(it) === i;
    }).slice(0, NEW_PHOTOS_QUANTITY);
  };

  // ДЕЛЕГИРОВАНИЕ РЕШИТ ПРОБЛЕМЫ! и сделает код обработчика красивым
  // см. https://learn.javascript.ru/event-delegation  (там в конце про делегирование)
  var renderNewPictures = function (evt) {
    var button = evt.target;

    removeCurrentPictures();
    switchActiveButton(button);

    if (button === filterPopularEl) {
      currentFilteredPhotos = window.data.photos;
    } else if (button === filterNewEl) {
      currentFilteredPhotos = filterNew(window.data.photos);
    } else if (button === filterDiscussedEl) {
      currentFilteredPhotos = filterDiscussed(window.data.photos);
    }
    window.gallery.renderGallery(currentFilteredPhotos);
  };

  var onFilterButtonClick = window.util.debounce(renderNewPictures);

  filterPopularEl.addEventListener('click', onFilterButtonClick);
  filterNewEl.addEventListener('click', onFilterButtonClick);
  filterDiscussedEl.addEventListener('click', onFilterButtonClick);

  // начало делегирования. Но тут как-то не особо, потому что от ИФа не уйти
  // разве что хранить названия функций в data-* атрибутах
  // и тогда сделать массив из айдишников, соответствующих им data-* атрибутов  и названий
  // функций-обработчиков. На инициализации навесить все нужные data-* атрибуты, а потом,
  // делегируя, вызывать нужный метод по содержимому data-* атрибута.
  // если будет время, попробовать
  // var onFiltersFormClick = function (evt) {
  //   var target = evt.target;
  //   var button = target.closest('.img-filters__button');
  //   if (button) {

  //   }

  // };

  // imgFiltersFormEl.addEventListener('click')

})();
