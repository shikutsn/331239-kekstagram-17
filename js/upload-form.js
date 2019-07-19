'use strict';

(function () {
  var ScaleConfig = {
    DEFAULT: 100,
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  var SliderConfig = {
    PRECISION: 3,
    DEFAULT_VALUE: 1,
    DEFAULT_PERCENT: 100
  };

  var NO_EFFECT_KEY = 'effect-none';
  var DATA_EFFECT = 'data-effect';
  var FILTERS_TABLE = {
    'effect-none': {
      CLASS: 'effects__preview--none',
      TEXT: 'none',
      MIN: 0,
      MAX: 0,
      UNIT: ''
    },
    'effect-chrome': {
      CLASS: 'effects__preview--chrome',
      TEXT: 'grayscale',
      MIN: 0,
      MAX: 1,
      UNIT: ''
    },
    'effect-sepia': {
      CLASS: 'effects__preview--sepia',
      TEXT: 'sepia',
      MIN: 0,
      MAX: 1,
      UNIT: ''
    },
    'effect-marvin': {
      CLASS: 'effects__preview--marvin',
      TEXT: 'invert',
      MIN: 0,
      MAX: 100,
      UNIT: '%'
    },
    'effect-phobos': {
      CLASS: 'effects__preview--phobos',
      TEXT: 'blur',
      MIN: 0,
      MAX: 3,
      UNIT: 'px'
    },
    'effect-heat': {
      CLASS: 'effects__preview--heat',
      TEXT: 'brightness',
      MIN: 1,
      MAX: 3,
      UNIT: ''
    }
  };
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var DEFAULT_PREVIEW_IMAGE = 'img/upload-default-image.jpg';
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';

  var uploadFileEl = document.querySelector('#upload-file');

  var imgEditWindowEl = document.querySelector('.img-upload__overlay');

  var imgEditWindowCloseEl = imgEditWindowEl.querySelector('#upload-cancel');
  var scaleValueEl = imgEditWindowEl.querySelector('.scale__control--value');
  var imgUploadPreviewEl = imgEditWindowEl.querySelector('.img-upload__preview img');
  var scaleDecrementEl = imgEditWindowEl.querySelector('.scale__control--smaller');
  var scaleIncrementEl = imgEditWindowEl.querySelector('.scale__control--bigger');
  var effectSelectorsEl = imgEditWindowEl.querySelectorAll('.effects__radio');
  var sliderEl = imgEditWindowEl.querySelector('.effect-level');
  var sliderPinEl = imgEditWindowEl.querySelector('.effect-level__pin');
  var sliderLineEl = imgEditWindowEl.querySelector('.effect-level__line');
  var sliderDepthEl = imgEditWindowEl.querySelector('.effect-level__depth');
  var sliderValueEl = imgEditWindowEl.querySelector('.effect-level__value');
  var imgUploadFormEl = document.querySelector('.img-upload__form');
  var commentEl = imgEditWindowEl.querySelector('.text__description');
  var hashTagsEl = imgEditWindowEl.querySelector('.text__hashtags');
  var mainEl = document.querySelector('main');
  var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var getFilterValue = function (key, value) {
    // превращает значение [0, 1] в корректный диапазон значений фильтра
    return (FILTERS_TABLE[key].MAX - FILTERS_TABLE[key].MIN) * value + FILTERS_TABLE[key].MIN;
  };

  var getFilterIntensity = function (key, value) {
    return key === NO_EFFECT_KEY ? FILTERS_TABLE[key].TEXT : FILTERS_TABLE[key].TEXT + '(' + getFilterValue(key, value) + FILTERS_TABLE[key].UNIT + ')';
  };

  var getSliderVisibilityText = function (key) {
    return key === NO_EFFECT_KEY ? 'hidden' : 'visible';
  };

  var applyEffect = function (key) {
    imgUploadPreviewEl.className = '';
    imgUploadPreviewEl.classList.add(FILTERS_TABLE[key].CLASS);
    imgUploadPreviewEl.style.filter = getFilterIntensity(key, SliderConfig.DEFAULT_VALUE);

    sliderPinEl.style.left = SliderConfig.DEFAULT_PERCENT + '%';
    sliderDepthEl.style.width = SliderConfig.DEFAULT_PERCENT + '%';
    sliderEl.style.visibility = getSliderVisibilityText(key);
    sliderValueEl.value = SliderConfig.DEFAULT_PERCENT;

    imgEditWindowEl.querySelector('#' + key).checked = true;
  };

  var onImgEditWindowEscPress = function (evt) {
    if (window.util.isEscPressed(evt)
    && document.activeElement !== commentEl
    && document.activeElement !== hashTagsEl) {
      closeImgEditWindow();
    }
  };

  var getImgScaleValue = function (scale, scaleMax) {
    return 'scale(' + scale / scaleMax + ')';
  };

  var openImgEditWindow = function () {
    imgEditWindowEl.classList.remove('hidden');
    imgEditWindowCloseEl.addEventListener('click', closeImgEditWindow);
    document.addEventListener('keydown', onImgEditWindowEscPress);

    imgUploadPreviewEl.style.transform = getImgScaleValue(ScaleConfig.DEFAULT, ScaleConfig.MAX);
    scaleValueEl.value = ScaleConfig.DEFAULT + '%';

    imgUploadPreviewEl.setAttribute(DATA_EFFECT, NO_EFFECT_KEY);
    applyEffect(NO_EFFECT_KEY);
  };

  var closeImgEditWindow = function () {
    imgEditWindowEl.classList.add('hidden');
    uploadFileEl.value = '';
    hashTagsEl.value = '';
    commentEl.value = '';
    imgUploadPreviewEl.src = DEFAULT_PREVIEW_IMAGE;
    imgEditWindowCloseEl.removeEventListener('click', closeImgEditWindow);
    document.removeEventListener('keydown', onImgEditWindowEscPress);
  };

  var getCurrentImgScale = function (element) {
    return parseInt(element.value, 10);
  };

  var decrementImgScale = function (imageEl, valueEl) {
    var currentScale = getCurrentImgScale(valueEl);
    if (currentScale > ScaleConfig.MIN) {
      imageEl.style.transform = getImgScaleValue(currentScale - ScaleConfig.STEP, ScaleConfig.MAX);
      valueEl.value = currentScale - ScaleConfig.STEP + '%';
    }
  };

  var incrementImgScale = function (imageEl, valueEl) {
    var currentScale = getCurrentImgScale(valueEl);
    if (currentScale < ScaleConfig.MAX) {
      imageEl.style.transform = getImgScaleValue(currentScale + ScaleConfig.STEP, ScaleConfig.MAX);
      valueEl.value = currentScale + ScaleConfig.STEP + '%';
    }
  };


  scaleDecrementEl.addEventListener('click', function () {
    decrementImgScale(imgUploadPreviewEl, scaleValueEl);
  });
  scaleIncrementEl.addEventListener('click', function () {
    incrementImgScale(imgUploadPreviewEl, scaleValueEl);
  });

  var loadImgFromDisc = function (fileEl, imageEl) {
    var file = fileEl.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imageEl.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  uploadFileEl.addEventListener('change', function () {
    loadImgFromDisc(uploadFileEl, imgUploadPreviewEl);
    openImgEditWindow();
  });


  var addEffectsChangeListeners = function (effectsEl) {
    effectsEl.forEach(function (item) {
      item.addEventListener('click', function () {
        imgUploadPreviewEl.setAttribute(DATA_EFFECT, item.id);
        applyEffect(item.id);
      });
    });
  };

  addEffectsChangeListeners(effectSelectorsEl);


  sliderPinEl.addEventListener('mousedown', function (evt) {
    var startX = evt.clientX;
    var sliderPinLeftX = sliderPinEl.offsetLeft;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftX = startX - moveEvt.clientX;
      sliderPinLeftX = sliderPinLeftX - shiftX;
      startX = moveEvt.clientX;

      if (sliderPinLeftX < 0) {
        sliderPinEl.style.left = 0;
      } else if (sliderPinLeftX > sliderLineEl.offsetWidth) {
        sliderPinEl.style.left = sliderLineEl.offsetWidth;
      } else {
        sliderPinEl.style.left = sliderPinLeftX + 'px';
      }
      sliderDepthEl.style.width = sliderPinEl.offsetLeft + 'px';

      var sliderValue = (sliderPinEl.offsetLeft / sliderLineEl.offsetWidth).toFixed(SliderConfig.PRECISION);

      sliderValueEl.value = Math.round(sliderValue * 100);
      var currentFilter = imgUploadPreviewEl.getAttribute(DATA_EFFECT);
      imgUploadPreviewEl.style.filter = getFilterIntensity(currentFilter, sliderValue);
    };

    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });


  var uploadSuccess = function () {
    closeImgEditWindow();

    var successPopupEl = successTemplate.cloneNode(true);
    mainEl.appendChild(successPopupEl);

    var successPopupCloseBtnEl = document.querySelector('.success__button');

    var removeSuccessPopup = function () {
      if (mainEl.contains(successPopupEl)) {
        mainEl.removeChild(successPopupEl);
      }
      successPopupCloseBtnEl.removeEventListener('click', removeSuccessPopup);
      window.removeEventListener('click', removeSuccessPopup);
      document.removeEventListener('keydown', onUploadSuccessEscPress);
    };

    var onUploadSuccessEscPress = function (evt) {
      if (window.util.isEscPressed(evt)) {
        removeSuccessPopup();
      }
    };

    successPopupCloseBtnEl.addEventListener('click', removeSuccessPopup);
    window.addEventListener('click', removeSuccessPopup);
    document.addEventListener('keydown', onUploadSuccessEscPress);
  };

  var uploadError = function () {
    imgEditWindowEl.classList.add('hidden');

    var errorPopupEl = errorTemplate.cloneNode(true);
    mainEl.appendChild(errorPopupEl);

    var errorPopupAgainBtnEl = document.querySelector('.error__button--again');
    var errorPopupAnotherBtnEl = document.querySelector('.error__button--another');

    var removeErrorEvtListeners = function () {
      window.removeEventListener('click', removeErrorPopup);
      document.removeEventListener('keydown', removeErrorPopup);
    };

    var removeErrorPopup = function () {
      if (mainEl.contains(errorPopupEl)) {
        mainEl.removeChild(errorPopupEl);
      }
      removeErrorEvtListeners();
    };

    var onUploadErrorEscPress = function (evt) {
      if (window.util.isEscPressed(evt)) {
        removeErrorPopup();
      }
    };

    window.addEventListener('click', removeErrorPopup);
    document.addEventListener('keydown', onUploadErrorEscPress);

    errorPopupAgainBtnEl.addEventListener('click', function (evt) {
      evt.stopPropagation();
      mainEl.removeChild(errorPopupEl);
      imgEditWindowEl.classList.remove('hidden');
      removeErrorEvtListeners();
    });

    errorPopupAnotherBtnEl.addEventListener('click', function (evt) {
      evt.stopPropagation();
      closeImgEditWindow();
      removeErrorPopup();
      // TODO: вызывать вручную событие обработки этого клика, потому что генерить события просто так - это плохая практика
      // но, с другой стороны, а как еще его именно что открыть?
      uploadFileEl.click();
    });
  };


  imgUploadFormEl.addEventListener('submit', function (evt) {
    var isformValid = window.validation.validateForm();
    var uploadData = new FormData(imgUploadFormEl);
    if (isformValid) {
      evt.preventDefault();
      window.backend.upload(UPLOAD_URL, uploadData, uploadSuccess, uploadError);
    }
  });
})();
