'use strict';

(function () {
  var COMMENTS_PER_PAGE = 5;

  var bigPictureEl = document.querySelector('.big-picture');
  var bigPictureImgEl = bigPictureEl.querySelector('.big-picture__img img');
  var likesCountEl = bigPictureEl.querySelector('.likes-count');
  var commentsListEl = bigPictureEl.querySelector('.social__comments');
  var commentsRenderedEl = bigPictureEl.querySelector('.comments-shown');
  var commentsTotalCountEl = bigPictureEl.querySelector('.comments-count');
  var commentsLoaderEl = bigPictureEl.querySelector('.comments-loader');
  var pictureDescriptionEl = bigPictureEl.querySelector('.social__caption');
  var closeButtonEl = bigPictureEl.querySelector('.big-picture__cancel');
  var commentTemplateEl = bigPictureEl.querySelector('.social__comment');

  var commentsRenderedCount;
  var comments;


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
    commentsLoaderEl.removeEventListener('click', renderComments);
  };

  var clearRenderedComments = function () {
    commentsListEl.querySelectorAll('.social__comment').forEach(function (element) {
      element.remove();
    });
  };

  var renderCommentsCounters = function (commentsRendered, commentsTotal) {
    commentsRenderedEl.textContent = commentsRendered;
    commentsTotalCountEl.textContent = commentsTotal;
  };

  var renderComments = function () {
    var commentsTotalCount = comments.length;

    comments.slice(commentsRenderedCount, commentsRenderedCount + COMMENTS_PER_PAGE).forEach(function (item) {
      commentsListEl.appendChild(getCommentElement(item, commentTemplateEl));
    });

    commentsRenderedCount += COMMENTS_PER_PAGE;

    if (commentsRenderedCount >= commentsTotalCount) {
      commentsRenderedCount = commentsTotalCount;
      commentsLoaderEl.classList.add('hidden');
    } else {
      commentsLoaderEl.classList.remove('hidden');
    }

    renderCommentsCounters(commentsRenderedCount, commentsTotalCount);
  };

  var renderBigPicture = function (photo) {
    bigPictureImgEl.src = photo.url;
    likesCountEl.textContent = photo.likes;
    pictureDescriptionEl.textContent = photo.description;
  };


  var openBigPicture = function (evt) {
    var clickedPicture = evt.target.closest('.picture');
    if (clickedPicture) {
      var renderedPhotos = window.data.getRenderedPhotos();
      var clickedPictureIndex = Array.from(document.querySelectorAll('.picture')).indexOf(clickedPicture);

      commentsRenderedCount = 0;
      comments = renderedPhotos[clickedPictureIndex].comments;

      bigPictureEl.classList.remove('hidden');
      document.body.classList.add('modal-open');

      renderBigPicture(renderedPhotos[clickedPictureIndex]);

      clearRenderedComments();
      renderComments();

      closeButtonEl.addEventListener('click', closeBigPicture);
      document.addEventListener('keydown', onBigPictureEscPress);
      commentsLoaderEl.addEventListener('click', renderComments);
    }
  };

  document.querySelector('.pictures').addEventListener('click', openBigPicture);
})();
