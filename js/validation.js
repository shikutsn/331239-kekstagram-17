'use strict';

(function () {
  var CommentFiledValidationData = {
    MAX_LENGTH: 140,
    VALIDITY_STYLE: 'outline',
    INVALID_STYLE: '3px solid red',
    VALID_STYLE: 'none',
    INVALID_TEXT: 'Не больше 140 символов.'
  };

  var imgUploadForm = document.querySelector('.img-upload__form');
  var commentEl = imgUploadForm.querySelector('.text__description');

  var isCommentFieldValid = function (commentField) {
    return commentField.value.length <= CommentFiledValidationData.MAX_LENGTH;
  };

  var setCommentFieldState = function (commentField, isValid) {
    if (isValid) {
      commentEl.setCustomValidity('');
      commentEl.style[CommentFiledValidationData.VALIDITY_STYLE] = CommentFiledValidationData.VALID_STYLE;
    } else {
      commentEl.setCustomValidity(CommentFiledValidationData.INVALID_TEXT);
      commentEl.style[CommentFiledValidationData.VALIDITY_STYLE] = CommentFiledValidationData.INVALID_STYLE;
    }
  };

  var validateCommentField = function () {
    setCommentFieldState(commentEl, isCommentFieldValid(commentEl));
  };

  imgUploadForm.addEventListener('submit', validateCommentField);
  commentEl.addEventListener('input', validateCommentField);

})();
