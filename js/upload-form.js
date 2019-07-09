'use strict';

(function () {
  var ESC_KEYCODE = 27;

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
  var commentEl = imgEditWindowEl.querySelector('.text__description');


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
    if (evt.keyCode === ESC_KEYCODE && document.activeElement !== commentEl) {
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

  uploadFileEl.addEventListener('change', openImgEditWindow);


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
})();
