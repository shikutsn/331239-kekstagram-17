'use strict';

(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/kekstagram/data';

  var onLoadingError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.padding = '20px';
    node.style.width = '100%';
    node.style.left = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var onLoadingSuccess = function (photos) {
    window.data.photos = photos;
    window.data.discussedPhotos = [];
    window.gallery.renderGallery(photos);
    window.filters.showFiltersForm();
  };


  window.backend.load(DOWNLOAD_URL, onLoadingSuccess, onLoadingError);
})();
