'use strict';


(function () {
  var URL = {
    DOWNLOAD: 'https://js.dump.academy/kekstagram/data'
  };

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


  window.data = {
    getMockData: function (cb) {
      cb(getPhotos(PHOTOS_COUNT));
    },
    getData: function (cb) {
      window.backend.load(URL.DOWNLOAD, cb);
    }
  };

})();
