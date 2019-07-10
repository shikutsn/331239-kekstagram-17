'use strict';

(function () {
  var COMMENTS_PER_PAGE = 5;

  var bigPictureEl = document.querySelector('.big-picture');
  var bigPictureImgEl = bigPictureEl.querySelector('.big-picture__img img');
  var likesCountEl = bigPictureEl.querySelector('.likes-count');
  // список комментариев
  var commentsListEl = bigPictureEl.querySelector('.social__comments');
  // комментариев показано
  var commentsCountEl = bigPictureEl.querySelector('.social__comment-count');
  // комментариев всего
  var commentsTotalCountEl = bigPictureEl.querySelector('.comments-count');
  // кнопка загрузки доп. комментов
  var commentsLoaderEl = bigPictureEl.querySelector('.comments-loader');
  var pictureDescriptionEl = bigPictureEl.querySelector('.social__caption');
  var closeButtonEl = bigPictureEl.querySelector('.big-picture__cancel');
  // в качестве шаблона комментария запомним первый комментарий,
  // который всегда есть в исходной разметке
  var commentTemplateEl = bigPictureEl.querySelector('.social__comment');

  var renderedCommentsCount = 0;


  var getCommentElement = function (comment, template) {
    var result = template.cloneNode(true);
    var commentAvatar = result.querySelector('.social__picture');

    commentAvatar.src = comment.avatar;
    commentAvatar.alt = comment.name;
    result.querySelector('.social__text').textContent = comment.message;
    return result;
  };

  var onBigPictureEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      closeBigPicture();
    }
  };

  var closeBigPicture = function () {
    bigPictureEl.classList.add('hidden');
    document.body.classList.remove('modal-open');
    closeButtonEl.removeEventListener('click', closeBigPicture);
    document.removeEventListener('keydown', onBigPictureEscPress);
  };

  var clearComments = function () {
    commentsListEl.querySelectorAll('.social__comment').forEach(function (element) {
      element.remove();
    });
  };

  var renderComments = function (comments) {
    clearComments();

    // как-то тут надо обновлять число отрисованных комментов

    comments.forEach(function (item) {
      commentsListEl.appendChild(getCommentElement(item, commentTemplateEl));
    });
  };


  var openBigPicture = function (evt) {
    // эту функцию поделить на мелкие для логичности
    // пока что тут прототип
    var clickedPicture = evt.target.closest('.picture');
    if (clickedPicture) {
      var renderedPhotos = window.data.getRenderedPhotos();
      var index = Array.from(document.querySelectorAll('.picture')).indexOf(clickedPicture);

      bigPictureEl.classList.remove('hidden');
      document.body.classList.add('modal-open');

      bigPictureImgEl.src = renderedPhotos[index].url;
      likesCountEl.textContent = renderedPhotos[index].likes;
      commentsTotalCountEl.textContent = renderedPhotos[index].comments.length;
      pictureDescriptionEl.textContent = renderedPhotos[index].description;

      // commentsCountEl.classList.add('visually-hidden');
      // commentsLoaderEl.classList.add('visually-hidden');

      renderComments(renderedPhotos[index].comments);

      closeButtonEl.addEventListener('click', closeBigPicture);
      document.addEventListener('keydown', onBigPictureEscPress);
    }
  };

  document.querySelector('.pictures').addEventListener('click', openBigPicture);


  // убедиться, что все функции нужны снаружи (особенно openBigPicture)
  // window.bigPicture = {
  //   openBigPicture: openBigPicture
  // };
})();
