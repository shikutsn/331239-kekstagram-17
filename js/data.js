'use strict';

(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/kekstagram/data';

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

  var onLoadingError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.padding = '20px';
    node.style.width = '100%';
    node.style.left = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var photoFilters = {
    filterNew: function (photos, quantity) {
      return window.util.shuffleArray(photos).slice(0, quantity);
    },

    filterDiscussed: function (photos) {
      return photos.slice().sort(function (a, b) {
        return b.comments.length - a.comments.length;
      });
    },

    filterPopular: function (photos) {
    // бессмысленная функция, но она нужна для унификации обработки нажатий на кнопки фильтров
      return photos;
    }
  };


  window.data = {
    photos: [],
    getMockData: function (onDataLoaded) {
      onDataLoaded(getPhotos(PHOTOS_COUNT));
    },
    getData: function (onDataLoaded) {
      window.backend.load(DOWNLOAD_URL, onDataLoaded, onLoadingError);
    },
    photoFilters: photoFilters
  };

})();
