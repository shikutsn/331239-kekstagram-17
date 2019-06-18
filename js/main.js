'use strict';

var PHOTOS_COUNT = 25;
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
var picturesContainer = document.querySelector('.pictures');

picturesContainer.appendChild(fragment);
