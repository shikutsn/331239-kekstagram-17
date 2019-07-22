'use strict';

(function () {
  console.log('fix this');
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram1';

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

    successPopupCloseBtnEl.addEventListener('click', onSuccessPopupClose);
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

    // Сообщение должно исчезать после нажатия на кнопки .error__button
    var errorPopupAgainBtnEl = errorPopupEl.querySelector('.error__button--again');
    var errorPopupAnotherBtnEl = errorPopupEl.querySelector('.error__button--another');

    var removeErrorEvtListeners = function () {
      document.removeEventListener('click', onErrorPopupClose);
      document.removeEventListener('keydown', onUploadErrorEscPress);
    };

    var removeErrorPopup = function () {
      // зачем этот иф?
      if (mainEl.contains(errorPopupEl)) {
        mainEl.removeChild(errorPopupEl);
      }
      removeErrorEvtListeners();
    };

    var onErrorPopupClose = removeErrorPopup;

    var onUploadErrorEscPress = function (evt) {
      if (window.util.isEscPressed(evt)) {
        removeErrorPopup();
      }
    };

    document.addEventListener('click', onErrorPopupClose);
    document.addEventListener('keydown', onUploadErrorEscPress);

    errorPopupAgainBtnEl.addEventListener('click', function (evt) {
      evt.stopPropagation();
      mainEl.removeChild(errorPopupEl);
      imgEditWindowEl.classList.remove('hidden');
      removeErrorEvtListeners();
    });

    errorPopupAnotherBtnEl.addEventListener('click', function (evt) {
      evt.stopPropagation();
      window.imgUploadForm.closeImgEditWindow();
      removeErrorPopup();
    });
  };

  // TODO все-таки, окна с ошибками и предложениями попробовать снова работают криво. Со включенным отладчиком разобраться
  // TODO здесь я перемудрил, окна должны просто закрываться, этого достаточно
  // TODO с закрыващихся (удаляемых из ДОМ) элементов снимать обработчики не обязательно?

  imgUploadFormEl.addEventListener('submit', function (evt) {
    var uploadData = new FormData(imgUploadFormEl);
    if (window.validation.validateForm()) {
      evt.preventDefault();
      window.backend.upload(UPLOAD_URL, uploadData, uploadSuccess, uploadError);
    }
  });
})();
