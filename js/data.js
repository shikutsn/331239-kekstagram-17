'use strict';

(function () {
  var PHOTOS_COUNT = 25;
  var LIKES_MIN_COUNT = 15;
  var LIKES_MAX_COUNT = 200;
  var COMMENTS_MAX_COUNT = 2;
  var AVATARS_COUNT = 6;

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

  var NEW_PHOTOS_QUANTITY = 10;

  var photos = [];
  var discussedPhotos = [];


  var getRandomComment = function (quantity) {
    var comments = [];

    for (var j = 0; j < quantity; j++) {
      comments.push({
        avatar: 'img/avatar-' + window.util.getRandomNumber(1, AVATARS_COUNT + 1) + '.svg',
        message: window.util.getRandomArrayElement(COMMENTS),
        name: window.util.getRandomArrayElement(NAMES)
      });
    }

    return comments;
  };

  var getRandomPhoto = function (index) {
    return {
      url: 'photos/' + index + '.jpg',
      likes: window.util.getRandomNumber(LIKES_MIN_COUNT, LIKES_MAX_COUNT),
      comments: getRandomComment(window.util.getRandomNumber(1, COMMENTS_MAX_COUNT + 1))
    };
  };

  var getPhotos = function (quantity) {
    var output = [];

    for (var i = 1; i <= quantity; i++) {
      output.push(getRandomPhoto(i));
    }

    return output;
  };

  var getNew = function () {
    return window.util.shuffleArray(photos).slice(0, NEW_PHOTOS_QUANTITY);
  };

  var getDiscussed = function () {
    if (!discussedPhotos.length) {
      discussedPhotos = photos.slice().sort(function (a, b) {
        return b.comments.length - a.comments.length;
      });
    }
    return discussedPhotos;
  };

  var getPopular = function () {
    return photos;
  };

  var setData = function (data) {
    photos = data;
    getDiscussed();
  };


  window.data = {
    getNew: getNew,
    getDiscussed: getDiscussed,
    getPopular: getPopular,
    setData: setData,
    getMockData: function (onDataLoaded) {
      onDataLoaded(getPhotos(PHOTOS_COUNT));
    }
  };
})();
