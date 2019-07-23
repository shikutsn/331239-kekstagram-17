'use strict';

(function () {
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';

  var imgUploadFormEl = document.querySelector('.img-upload__form');
  var imgEditWindowEl = imgUploadFormEl.querySelector('.img-upload__overlay');
  var mainEl = document.querySelector('main');


  var uploadSuccess = function () {
    window.imgUploadForm.closeImgEditWindow();

    var successPopupEl = document.querySelector('#success')
      .content
      .querySelector('.success')
      .cloneNode(true);
    mainEl.appendChild(successPopupEl);

    var successPopupCloseBtnEl = successPopupEl.querySelector('.success__button');

    var removeSuccessPopup = function () {
      mainEl.removeChild(successPopupEl);
      successPopupCloseBtnEl.removeEventListener('click', onSuccessPopupClose);
      document.removeEventListener('click', onSuccessPopupClose);
      document.removeEventListener('keydown', onUploadSuccessEscPress);
    };

    var onSuccessPopupClose = function () {
      removeSuccessPopup();
    };

    var onUploadSuccessEscPress = function (evt) {
      if (window.util.isEscPressed(evt)) {
        removeSuccessPopup();
      }
    };

    document.addEventListener('click', onSuccessPopupClose);
    document.addEventListener('keydown', onUploadSuccessEscPress);
  };

  var uploadError = function () {
    imgEditWindowEl.classList.add('hidden');

    var errorPopupEl = document.querySelector('#error')
      .content
      .querySelector('.error')
      .cloneNode(true);
    mainEl.appendChild(errorPopupEl);

    var errorButtonsEl = errorPopupEl.querySelectorAll('.error__button');

    var removeErrorPopup = function () {
      mainEl.removeChild(errorPopupEl);
      imgEditWindowEl.classList.remove('hidden');
      document.removeEventListener('click', onErrorPopupClose);
      document.removeEventListener('keydown', onUploadErrorEscPress);
    };

    var onErrorPopupClose = function () {
      removeErrorPopup();
    };

    var onUploadErrorEscPress = function (evt) {
      if (window.util.isEscPressed(evt)) {
        removeErrorPopup();
      }
    };

    document.addEventListener('click', onErrorPopupClose);
    document.addEventListener('keydown', onUploadErrorEscPress);
    errorButtonsEl.forEach(function (element) {
      element.addEventListener('click', onErrorPopupClose);
    });
  };


  imgUploadFormEl.addEventListener('submit', function (evt) {
    var uploadData = new FormData(imgUploadFormEl);
    if (window.validation.validateForm()) {
      evt.preventDefault();
      window.backend.upload(UPLOAD_URL, uploadData, uploadSuccess, uploadError);
    }
  });
})();
