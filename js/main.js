'use strict';

(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/kekstagram/data';


  var onLoadingError = function (errorMessage) {
    var loadingErrorEl = document.createElement('div');
    loadingErrorEl.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    loadingErrorEl.style.position = 'absolute';
    loadingErrorEl.style.padding = '20px';
    loadingErrorEl.style.width = '100%';
    loadingErrorEl.style.left = 0;
    loadingErrorEl.style.fontSize = '30px';

    loadingErrorEl.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', loadingErrorEl);
  };

  var onLoadingSuccess = function (photos) {
    window.data.setData(photos);
    window.gallery.renderGallery(photos);
    window.filters.showFiltersForm();
  };


  window.backend.download(DOWNLOAD_URL, onLoadingSuccess, onLoadingError);
})();
