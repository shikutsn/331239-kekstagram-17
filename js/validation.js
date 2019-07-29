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
    }
  };

  var ValidityChecksMap = {
    firstSymbol: {
      ACTION: function (hashTagsArr) {
        return hashTagsArr.every(function (hashTag) {
          return hashTag.charAt(0) === HashTagsValidationData.FIRST_SYMBOL;
        });
      },
      INVALID_TEXT: 'Хэш-тег должен начинаться с символа #.'
    },
    length: {
      ACTION: function (hashTagsArr) {
        return !hashTagsArr.some(function (hashTag) {
          return hashTag.length < HashTagsValidationData.LENGTH.MIN || hashTag.length > HashTagsValidationData.LENGTH.MAX;
        });
      },
      INVALID_TEXT: 'Длина хэш-тега не меньше 2 и не больше 20 символов.'
    },
    similarity: {
      ACTION: function (hashTagsArr) {
        return hashTagsArr.length === hashTagsArr.filter(function (it, i, arr) {
          return arr.indexOf(it) === i;
        }).length;
      },
      INVALID_TEXT: 'Не должно быть одинаковых хэш-тегов.'
    },
    quantity: {
      ACTION: function (hashTagsArr) {
        return hashTagsArr.length === hashTagsArr.filter(function (it, i, arr) {
          return arr.indexOf(it) === i;
        }).length;
      },
      INVALID_TEXT: 'Не больше 5 хэш-тегов.'
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
    return hashTagsString.split(HashTagsValidationData.SEPARATOR).filter(function (hashTag) {
      return !!hashTag;
    }).map(function (hashTag) {
      return hashTag.toUpperCase();
    });
  };

  var checkHashTagsFieldValidity = function (hashTagsField) {
    var hashTagsArr = getHashTagsArray(hashTagsField.value);
    var validityArr = [];

    for (var key in ValidityChecksMap) {
      if (ValidityChecksMap.hasOwnProperty(key)) {
        var currentCheck = ValidityChecksMap[key].ACTION;
        if (!currentCheck(hashTagsArr)) {
          validityArr.push(ValidityChecksMap[key].INVALID_TEXT);
        }
      }
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

  commentEl.addEventListener('input', function () {
    validateCommentField();
  });
  hashTagsEl.addEventListener('input', function () {
    validateHashTagsField();
  });

  window.validation = {
    validateForm: validateForm
  };
})();
