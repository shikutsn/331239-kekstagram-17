'use strict';

(function () {
  var CommentValidationData = {
    MAX_LENGTH: 140,
    INVALID_TEXT: 'Не больше 140 символов.'
  };

  var HashTagsValidationData = {
    SEPARATOR: ' ',
    FIRST_SYMBOL: '#',
    MAX_QUANTITY: 5,
    LENGTH: {
      MIN: 2,
      MAX: 20
    },
    INVALID_TEXT: {
      FIRST_SYMBOL: 'Хэш-тег должен начинаться с символа #.',
      LENGTH: 'Длина хэш-тега не меньше 2 и не больше 20 символов.',
      UNIQUENESS: 'Не должно быть одинаковых хэш-тегов.',
      QUANTITY: 'Не больше 5 хэш-тегов.'
    }
  };

  var InvalidFieldStyles = {
    VALIDITY: 'outline',
    INVALID: '3px solid red',
    VALID: 'none'
  };

  var imgUploadFormEl = document.querySelector('.img-upload__form');
  var commentEl = imgUploadFormEl.querySelector('.text__description');
  var hashTagsEl = imgUploadFormEl.querySelector('.text__hashtags');


  var isCommentFieldValid = function (commentField) {
    return commentField.value.length <= CommentValidationData.MAX_LENGTH;
  };

  var setCommentFieldState = function (commentField, isValid) {
    if (isValid) {
      commentField.setCustomValidity('');
      commentField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.VALID;
    } else {
      commentField.setCustomValidity(CommentValidationData.INVALID_TEXT);
      commentField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.INVALID;
    }
  };

  var getHashTagsArray = function (hashTagsString) {
    return hashTagsString.split(HashTagsValidationData.SEPARATOR).filter(function (it) {
      return !!it;
    }).map(function (it) {
      return it.toUpperCase();
    });
  };

  var isHashTagsFirstSymbolCorrect = function (hashTagsArr) {
    return hashTagsArr.every(function (it) {
      return it.charAt(0) === HashTagsValidationData.FIRST_SYMBOL;
    });
  };

  var isHashTagsLengthCorrect = function (hashTagsArr) {
    return !hashTagsArr.some(function (it) {
      return it.length < HashTagsValidationData.LENGTH.MIN || it.length > HashTagsValidationData.LENGTH.MAX;
    });
  };

  var isHashTagsUniquenessCorrect = function (hashTagsArr) {
    return hashTagsArr.length === hashTagsArr.filter(function (it, i, arr) {
      return arr.indexOf(it) === i;
    }).length;
  };

  var isHashTagsMaxQuantityCorrect = function (hashTagsArr) {
    return hashTagsArr.length <= HashTagsValidationData.MAX_QUANTITY;
  };

  var checkHashTagsFieldValidity = function (hashTagsField) {
    var hashTagsArr = getHashTagsArray(hashTagsField.value);
    var validityArr = [];

    if (!isHashTagsFirstSymbolCorrect(hashTagsArr)) {
      validityArr.push(HashTagsValidationData.INVALID_TEXT.FIRST_SYMBOL);
    }
    if (!isHashTagsLengthCorrect(hashTagsArr)) {
      validityArr.push(HashTagsValidationData.INVALID_TEXT.LENGTH);
    }
    if (!isHashTagsUniquenessCorrect(hashTagsArr)) {
      validityArr.push(HashTagsValidationData.INVALID_TEXT.UNIQUENESS);
    }
    if (!isHashTagsMaxQuantityCorrect(hashTagsArr)) {
      validityArr.push(HashTagsValidationData.INVALID_TEXT.QUANTITY);
    }

    return {
      isValid: !validityArr.length,
      invalidMsg: validityArr.join(' ')
    };
  };

  var setHashTagsFieldState = function (hashTagsField, validity) {
    if (validity.isValid) {
      hashTagsField.setCustomValidity('');
      hashTagsField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.VALID;
    } else {
      hashTagsField.setCustomValidity(validity.invalidMsg);
      hashTagsField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.INVALID;
    }
  };

  var validateCommentField = function () {
    var result = isCommentFieldValid(commentEl);
    setCommentFieldState(commentEl, result);
    return result;
  };

  var validateHashTagsField = function () {
    var hashTagsFieldValidity = checkHashTagsFieldValidity(hashTagsEl);
    setHashTagsFieldState(hashTagsEl, hashTagsFieldValidity);
    return hashTagsFieldValidity.isValid;
  };

  var validateForm = function () {
    return (validateHashTagsField() && validateCommentField());
  };


  commentEl.addEventListener('input', validateCommentField);
  hashTagsEl.addEventListener('input', validateHashTagsField);


  window.validation = {
    validateForm: validateForm
  };
})();
