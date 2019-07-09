'use strict';

(function () {
  var FiltersMap = {
    'filter-popular': 'filterPopular',
    'filter-new': 'filterNew',
    'filter-discussed': 'filterDiscussed'
  };
  var ButtonCls = {
    DEFAULT: 'img-filters__button',
    ACTIVE: 'img-filters__button--active'
  };
  var FILTER_BTN_STORE_ATTR = 'data-action';
  var NEW_PHOTOS_QUANTITY = 10;

  var imgFiltersFormEl = document.querySelector('.img-filters__form');
  var buttonsEl = imgFiltersFormEl.querySelectorAll('.' + ButtonCls.DEFAULT);

  var currentFilteredPhotos = [];

  var setButtonsDataAttributes = function () {
    buttonsEl.forEach(function (element) {
      element.setAttribute(FILTER_BTN_STORE_ATTR, FiltersMap[element.id]);
    });
  };

  var switchActiveButton = function (activeButton) {
    buttonsEl.forEach(function (element) {
      if (element === activeButton) {
        element.classList.add(ButtonCls.ACTIVE);
      } else {
        element.classList.remove(ButtonCls.ACTIVE);
      }
    });
  };

  var clearCurrentPictures = function () {
    document.querySelectorAll('.picture').forEach(function (element) {
      element.remove();
    });
  };

  var onFiltersFormClick = function (evt) {
    var pressedButton = evt.target.closest('.' + ButtonCls.DEFAULT);
    var action = pressedButton.getAttribute(FILTER_BTN_STORE_ATTR);
    currentFilteredPhotos = window.data.photoFilters[action](window.data.photos, NEW_PHOTOS_QUANTITY);

    clearCurrentPictures();
    switchActiveButton(pressedButton);

    window.gallery.renderGallery(currentFilteredPhotos);
  };

  var onFiltersFormClickDebounced = window.util.debounce(onFiltersFormClick);

  setButtonsDataAttributes();
  imgFiltersFormEl.addEventListener('click', onFiltersFormClickDebounced);

})();
