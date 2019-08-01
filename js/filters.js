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

  var imgFiltersFormEl = document.querySelector('.img-filters__form');
  var buttonsEl = imgFiltersFormEl.querySelectorAll('.' + ButtonCls.DEFAULT);

  var getCurrentFilter = function () {
    return imgFiltersFormEl.querySelector('.' + ButtonCls.ACTIVE).id;
  };

  var switchActiveButton = function (activeButton) {
    buttonsEl.forEach(function (button) {
      if (button === activeButton) {
        return button.classList.add(ButtonCls.ACTIVE);
      }
      return button.classList.remove(ButtonCls.ACTIVE);
    });
  };

  var onFiltersFormClick = function (evt) {
    var pressedButton = evt.target.closest('.' + ButtonCls.DEFAULT);

    if (pressedButton) {
      window.gallery.clearCurrentPictures();
      switchActiveButton(pressedButton);
      window.gallery.render(FiltersMap[pressedButton.id]());
    }
  };

  var onFiltersFormClickDebounced = window.util.debounce(onFiltersFormClick);

  var showFiltersForm = function () {
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  };

  imgFiltersFormEl.addEventListener('click', onFiltersFormClickDebounced);

  window.filters = {
    showForm: showFiltersForm,
    getCurrent: getCurrentFilter,
    Map: FiltersMap
  };
})();
