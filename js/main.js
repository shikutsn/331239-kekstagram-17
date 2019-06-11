'use strict';

var PHOTOES_DESCRIPTION_COUNT = 25;
var COMMENTS_MAX_COUNT = 2;
var AVATARS_COUNT = 6;
var LIKES_MIN_COUNT = 15;
var LIKES_MAX_COUNT = 200;

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

var photoes = [];

var generateRandomPhoto = function (photoNumber) {
  var randomComment = [];
  var commentsCount = getRandomNumber(1, COMMENTS_MAX_COUNT + 1);

  for (var j = 0; j < commentsCount; j++) {
    randomComment.push({
      avatar: 'img/avatar-' + getRandomNumber(1, AVATARS_COUNT + 1).toString() + '.svg',
      message: COMMENTS[getRandomNumber(0, COMMENTS.length - 1)],
      name: NAMES[getRandomNumber(0, NAMES.length - 1)]
    });
  }

  return {
    url: 'photos/' + photoNumber.toString() + '.jpg',
    likes: getRandomNumber(LIKES_MIN_COUNT, LIKES_MAX_COUNT),
    comments: randomComment
  };
};

for (var i = 1; i <= PHOTOES_DESCRIPTION_COUNT; i++) {
  photoes.push(generateRandomPhoto(i));
}

var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

var renderPicture = function (photo) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = photo.url;
  pictureElement.querySelector('.picture__likes').textContent = photo.likes.toString();
  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

  return pictureElement;
};

var fragment = document.createDocumentFragment();
for (i = 0; i < photoes.length; i++) {
  fragment.appendChild(renderPicture(photoes[i]));
}

var picturesContainer = document.querySelector('.pictures');
picturesContainer.appendChild(fragment);
