'use strict';

(function () {
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

  var renderGallery = function (photos) {
    // TODO: или хранить массив текущих отрендеренных фоток тут, в модуле галереи?
    // TODO: ну и функцию по возврату тоже

    var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');
    var fragment = fillFragment(photos, pictureTemplate);
    var picturesEl = document.querySelector('.pictures');

    picturesEl.appendChild(fragment);
  };


  window.gallery = {
    renderGallery: renderGallery
  };
})();
