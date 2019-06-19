'use strict';

var PHOTOS_COUNT = 25;
var COMMENTS_MAX_COUNT = 2;
var AVATARS_COUNT = 6;
var LIKES_MIN_COUNT = 15;
var LIKES_MAX_COUNT = 200;

var ESC_KEYCODE = 27;
// var ENTER_KEYCODE = 13;

var SCALE_MIN = 25;
var SCALE_MAX = 100;
var SCALE_STEP = 25;
var SCALE_DEFAULT = 100;

var FILTERS_TABLE = [
  {
    text: 'none',
    min: 0,
    max: 0,
    unit: ''
  },
  {
    text: 'grayscale',
    min: 0,
    max: 1,
    unit: ''
  },
  {
    text: 'sepia',
    min: 0,
    max: 1,
    unit: ''
  },
  {
    text: 'invert',
    min: 0,
    max: 100,
    unit: '%'
  },
  {
    text: 'blur',
    min: 0,
    max: 3,
    unit: 'px'
  },
  {
    text: 'brightness',
    min: 1,
    max: 3,
    unit: ''
  }
];

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

var onImgEditWindowEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeImgEditWindow();
  }
};

var setImgScale = function (imgEl, scale, scaleMax) {
  scaleValueEl.value = scale + '%';
  imgEl.style.transform = 'scale(' + scale / scaleMax + ')';
};

var openImgEditWindow = function () {
  imgEditWindowEl.classList.remove('hidden');
  imgEditWindowCloseEl.addEventListener('click', closeImgEditWindow);
  document.addEventListener('keydown', onImgEditWindowEscPress);
  scaleValueEl.value = SCALE_DEFAULT + '%';
  setImgScale(imgUploadPreviewEl, SCALE_DEFAULT, SCALE_MAX);
};

var closeImgEditWindow = function () {
  imgEditWindowEl.classList.add('hidden');
  uploadFileEl.value = '';
  imgEditWindowCloseEl.removeEventListener('click', closeImgEditWindow);
  document.removeEventListener('keydown', onImgEditWindowEscPress);
};

var decrementImgScale = function () {
  var currentScale = parseInt(scaleValueEl.value, 10);
  if (currentScale > SCALE_MIN) {
    currentScale -= SCALE_STEP;
    setImgScale(imgUploadPreviewEl, currentScale, SCALE_MAX);
  }
};

var incrementImgScale = function () {
  var currentScale = parseInt(scaleValueEl.value, 10);
  if (currentScale < SCALE_MAX) {
    currentScale += SCALE_STEP;
    setImgScale(imgUploadPreviewEl, currentScale, SCALE_MAX);
  }
};

scaleDecrementEl.addEventListener('click', function () {
  decrementImgScale();
});

scaleIncrementEl.addEventListener('click', function () {
  incrementImgScale();
});

uploadFileEl.addEventListener('change', function () {
  openImgEditWindow();
});

openImgEditWindow(); // запускаем окно редактирования для отладки


// --------- эффекты
var effectSelectorsEl = imgEditWindowEl.querySelectorAll('.effects__radio');

var getFilterString = function (index, value) {
  if (index) {
    return FILTERS_TABLE[index].text + '(' + value + FILTERS_TABLE[index].unit + ')';
  } else {
    return 'none';
  }
};

var onEffectSelectorsChange = function (el, index) {
  el.addEventListener('click', function () {
    imgUploadPreviewEl.style.filter = getFilterString(index, FILTERS_TABLE[index].max);

  });
};

for (var i = 0; i < effectSelectorsEl.length; i++) {
  onEffectSelectorsChange(effectSelectorsEl[i], i);
}
