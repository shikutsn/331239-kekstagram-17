'use strict';

(function () {
  var LoadingErrorStyles = {
    'z-index': '100',
    'margin': '0 auto',
    'text-align': 'center',
    'background-color': 'red',
    'position': 'absolute',
    'padding': '20px',
    'width': '100%',
    'left': '0',
    'fontSize': '30px'
  };


  var onLoadingError = function (errorMessage) {
    var loadingErrorEl = document.createElement('div');

    for (var key in LoadingErrorStyles) {
      if (LoadingErrorStyles.hasOwnProperty(key)) {
        loadingErrorEl.style[key] = LoadingErrorStyles[key];
      }
    }

    loadingErrorEl.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', loadingErrorEl);
  };

  var onLoadingSuccess = function (photos) {
    window.data.setData(photos);
    window.gallery.renderGallery(photos);
    window.filters.showFiltersForm();
  };


  window.backend.download(onLoadingSuccess, onLoadingError);
})();
