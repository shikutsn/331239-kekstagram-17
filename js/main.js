'use strict';

var PHOTOS_COUNT = 25;
var COMMENTS_MAX_COUNT = 2;
var AVATARS_COUNT = 6;
var LIKES_MIN_COUNT = 15;
var LIKES_MAX_COUNT = 200;

var ESC_KEYCODE = 27;

var SCALE_MIN = 25;
var SCALE_MAX = 100;
var SCALE_STEP = 25;
var SCALE_DEFAULT = 100;
var SLIDER_PRECISION = 3;
var SLIDER_DEFAULT_VALUE = 1;
var SLIDER_DEFAULT_PERCENT = 100;

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

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var NAMES = [
  'Артём',
  'Сергей',
  'Всеволод',
  'Александр',
  'Леонид',
  'Пётр',
  'Демьян',
  'Гаррий',
  'Михал',
  'Олег',
  'Юлия',
  'Ксения',
  'Ирина',
  'Татьяна',
  'Александра',
  'Марфа',
  'Ольга',
  'Наталья',
  'Виктория',
  'Евгения'
];

var getRandomNumber = function (min, max) {
  // случайное целое число из полуинтервала [min, max)
  return Math.floor(Math.random() * (max - min)) + min;
};

var getRandomArrayElement = function (arr) {
  return arr[getRandomNumber(0, arr.length)];
};

var getRandomComment = function (quantity) {
  var comments = [];

  for (var j = 0; j < quantity; j++) {
    comments.push({
      avatar: 'img/avatar-' + getRandomNumber(1, AVATARS_COUNT + 1) + '.svg',
      message: getRandomArrayElement(COMMENTS),
      name: getRandomArrayElement(NAMES)
    });
  }

  return comments;
};

var getRandomPhoto = function (index) {
  return {
    url: 'photos/' + index + '.jpg',
    likes: getRandomNumber(LIKES_MIN_COUNT, LIKES_MAX_COUNT),
    comments: getRandomComment(getRandomNumber(1, COMMENTS_MAX_COUNT + 1))
  };
};

var getPhotos = function (quantity) {
  var output = [];

  for (var i = 1; i <= quantity; i++) {
    output.push(getRandomPhoto(i));
  }

  return output;
};

var renderPicture = function (photo, template) {
  var pictureElement = template.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = photo.url;
  pictureElement.querySelector('.picture__likes').textContent = photo.likes;
  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

  return pictureElement;
};

var fillFragment = function (photosList, template) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photosList.length; i++) {
    fragment.appendChild(renderPicture(photosList[i], template));
  }

  return fragment;
};


var photos = getPhotos(PHOTOS_COUNT);
var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
var fragment = fillFragment(photos, pictureTemplate);
var picturesEl = document.querySelector('.pictures');

picturesEl.appendChild(fragment);

// ------------------------------
// Задание 7, подробности

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
  imgUploadPreviewEl.style.filter = getFilterIntensity(key, SLIDER_DEFAULT_VALUE);

  sliderPinEl.style.left = SLIDER_DEFAULT_PERCENT + '%';
  sliderDepthEl.style.width = SLIDER_DEFAULT_PERCENT + '%';
  sliderEl.style.visibility = getSliderVisibilityText(key);
  sliderValueEl.value = SLIDER_DEFAULT_PERCENT;

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

  imgUploadPreviewEl.style.transform = getImgScaleValue(SCALE_DEFAULT, SCALE_MAX);
  scaleValueEl.value = SCALE_DEFAULT + '%';

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
  if (currentScale > SCALE_MIN) {
    imageEl.style.transform = getImgScaleValue(currentScale - SCALE_STEP, SCALE_MAX);
    valueEl.value = currentScale - SCALE_STEP + '%';
  }
};

var incrementImgScale = function (imageEl, valueEl) {
  var currentScale = getCurrentImgScale(valueEl);
  if (currentScale < SCALE_MAX) {
    imageEl.style.transform = getImgScaleValue(currentScale + SCALE_STEP, SCALE_MAX);
    valueEl.value = currentScale + SCALE_STEP + '%';
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

    var sliderValue = (sliderPinEl.offsetLeft / sliderLineEl.offsetWidth).toFixed(SLIDER_PRECISION);

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

// ------------------------------
// Задание 8. Валидация форм

commentEl.setAttribute('maxlength', 140);
