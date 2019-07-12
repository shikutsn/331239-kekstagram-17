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

  var imgUploadForm = document.querySelector('.img-upload__form');
  var commentEl = imgUploadForm.querySelector('.text__description');
  var hashTagsEl = imgUploadForm.querySelector('.text__hashtags');


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

  // для тестов заполним поле хэш-тегов
  // hashTagsEl.value = ' #asdj    #d123 #d123 #aee asd #asdlkjsadlkadjsasdlkjqwe ';

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

  // var hashTags = getHashTagsArray(hashTagsEl.value);
  // console.log('value: ', hashTagsEl.value);
  // console.log('hashtags array: ', hashTags);
  // console.log('Проверка на то, что начинаются с решетки: ' + isHashTagsFirstSymbolCorrect(hashTags));
  // console.log('Проверка на макс кол-во: ' + isHashTagsMaxQuantityCorrect(hashTags));
  // console.log('Проверка на уникальность: ' + isHashTagsUniquenessCorrect(hashTags));
  // console.log('Проверка на правильную длину: ' + isHashTagsLengthCorrect(hashTags));


  var isHashTagsFieldInvalid = function (hashTagsField) {
    // если возвращается не пустая строка, то в поле ошибки
    // чтобы сократить код, переписать на ассоциативный массив?
    // типа такого перебора: for (var key in data)
    var hashTagsArr = getHashTagsArray(hashTagsField.value);
    var result = [];

    if (!isHashTagsFirstSymbolCorrect(hashTagsArr)) {
      result.push(HashTagsValidationData.INVALID_TEXT.FIRST_SYMBOL);
    }
    if (!isHashTagsLengthCorrect(hashTagsArr)) {
      result.push(HashTagsValidationData.INVALID_TEXT.LENGTH);
    }
    if (!isHashTagsUniquenessCorrect(hashTagsArr)) {
      result.push(HashTagsValidationData.INVALID_TEXT.UNIQUENESS);
    }
    if (!isHashTagsMaxQuantityCorrect(hashTagsArr)) {
      result.push(HashTagsValidationData.INVALID_TEXT.QUANTITY);
    }

    return result.join(' ');
  };

  var setHashTagsFieldState = function (hashTagsField, isInvalid) {
    if (!isInvalid) {
      hashTagsField.setCustomValidity('');
      hashTagsField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.VALID;
    } else {
      hashTagsField.setCustomValidity(isInvalid);
      hashTagsField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.INVALID;
    }
  };

  var validateCommentField = function () {
    setCommentFieldState(commentEl, isCommentFieldValid(commentEl));
  };

  var validateHashTagsField = function () {
    setHashTagsFieldState(hashTagsEl, isHashTagsFieldInvalid(hashTagsEl));
  };

  var validateForm = function (evt) {
    // evt.preventDefault();
    validateHashTagsField();
    validateCommentField();
  };


  imgUploadForm.addEventListener('submit', validateForm);
  commentEl.addEventListener('input', validateCommentField);
  hashTagsEl.addEventListener('input', validateHashTagsField);


  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';
  var uploadSuccess = function () {
    alert('uploaded!');
  };
  var uploadError = function () {
    alert('upload error!');
  };
  imgUploadForm.addEventListener('submit', function () {
    var uploadData = new FormData(imgUploadForm);
    uploadData.append('test', 'sth to test');
    console.log('uploadData: ', uploadData);
    window.backend.upload(UPLOAD_URL, uploadData, uploadSuccess, uploadError);
    document.write('test');
  });
})();
