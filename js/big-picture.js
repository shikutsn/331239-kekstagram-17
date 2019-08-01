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
  var picturesEl = document.querySelector('.pictures');

  var commentsRenderedCount;
  var currentPictureIndex;

  var getCommentElement = function (comment) {
    var result = commentTemplateEl.cloneNode(true);
    var commentAvatar = result.querySelector('.social__picture');

    commentAvatar.src = comment.avatar;
    commentAvatar.alt = comment.name;
    result.querySelector('.social__text').textContent = comment.message;
    return result;
  };

  var onBigPictureEscPress = function (evt) {
    if (window.util.isEscPressed(evt)) {
      closeBigPicture();
    }
  };

  var closeBigPicture = function () {
    bigPictureEl.classList.add('hidden');
    document.body.classList.remove('modal-open');
    closeButtonEl.removeEventListener('click', onCloseButtonClick);
    document.removeEventListener('keydown', onBigPictureEscPress);
    commentsLoaderEl.removeEventListener('click', onCommentsLoaderClick);
  };

  var onCloseButtonClick = function () {
    closeBigPicture();
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

  var getCurrentPhoto = function (currentPhotoIndex) {
    var renderedPhotosCollection = window.filters.Map[window.filters.getCurrent()]();
    return renderedPhotosCollection[currentPhotoIndex];
  };

  var renderComments = function () {
    var comments = getCurrentPhoto(currentPictureIndex).comments;
    var commentsTotalCount = comments.length;

    comments.slice(commentsRenderedCount, commentsRenderedCount + COMMENTS_PER_PAGE).forEach(function (it) {
      commentsListEl.appendChild(getCommentElement(it));
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

  var onCommentsLoaderClick = function () {
    renderComments();
  };

  var renderBigPicture = function (photo) {
    bigPictureImgEl.src = photo.url;
    likesCountEl.textContent = photo.likes;
    pictureDescriptionEl.textContent = photo.description;
  };

  var onPicturesClick = function (evt) {
    var clickedPicture = evt.target.closest('.picture');
    if (clickedPicture) {
      currentPictureIndex = Array.from(document.querySelectorAll('.picture')).indexOf(clickedPicture);
      var clickedPhoto = getCurrentPhoto(currentPictureIndex);

      commentsRenderedCount = 0;

      bigPictureEl.classList.remove('hidden');
      document.body.classList.add('modal-open');

      renderBigPicture(clickedPhoto);

      clearRenderedComments();
      renderComments();


      closeButtonEl.addEventListener('click', onCloseButtonClick);
      document.addEventListener('keydown', onBigPictureEscPress);
      commentsLoaderEl.addEventListener('click', onCommentsLoaderClick);
    }
  };

  window.bigPicture = {
    init: function () {
      picturesEl.addEventListener('click', onPicturesClick);
    }
  };
})();
