'use strict';

(function () {
  var FiltersMap = {
    'filter-popular': window.data.getPopular,
    'filter-new': window.data.getNew,
    'filter-discussed': window.data.getDiscussed
  };
  var ButtonCls = {
    DEFAULT: 'img-filters__button',
    ACTIVE: 'img-filters__button--active'
  };
  var FILTER_BTN_STORE_ATTR = 'data-action';

  var imgFiltersFormEl = document.querySelector('.img-filters__form');
  var buttonsEl = imgFiltersFormEl.querySelectorAll('.' + ButtonCls.DEFAULT);


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
    var filter = pressedButton.getAttribute(FILTER_BTN_STORE_ATTR);

    clearCurrentPictures();
    switchActiveButton(pressedButton);

    console.log([filter]);
    window.gallery.renderGallery([filter]);
  };

  var onFiltersFormClickDebounced = window.util.debounce(onFiltersFormClick);

  var showFiltersForm = function () {
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  };


  setButtonsDataAttributes();
  imgFiltersFormEl.addEventListener('click', onFiltersFormClickDebounced);


  window.filters = {
    showFiltersForm: showFiltersForm
  };
})();
