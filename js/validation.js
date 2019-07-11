'use strict';

(function () {
  // объединить в отдельную константу то, как красятся неправильные поля
  var CommentFieldValidationData = {
    MAX_LENGTH: 140,
    VALIDITY_STYLE: 'outline',
    INVALID_STYLE: '3px solid red',
    VALID_STYLE: 'none',
    INVALID_TEXT: 'Не больше 140 символов.'
  };

  var imgUploadForm = document.querySelector('.img-upload__form');
  var commentEl = imgUploadForm.querySelector('.text__description');
  var hashTagsEl = imgUploadForm.querySelector('.text__hashtags');


  var isCommentFieldValid = function (commentField) {
    return commentField.value.length <= CommentFieldValidationData.MAX_LENGTH;
  };

  var setCommentFieldState = function (commentField, isValid) {
    if (isValid) {
      commentField.setCustomValidity('');
      commentField.style[CommentFieldValidationData.VALIDITY_STYLE] = CommentFieldValidationData.VALID_STYLE;
    } else {
      commentField.setCustomValidity(CommentFieldValidationData.INVALID_TEXT);
      commentField.style[CommentFieldValidationData.VALIDITY_STYLE] = CommentFieldValidationData.INVALID_STYLE;
    }
  };

  var validateCommentField = function () {
    setCommentFieldState(commentEl, isCommentFieldValid(commentEl));
  };


  // для тестов заполним поле хэш-тегов
  hashTagsEl.value = ' #asdj    #d123 #dalksjd #aee #asd #qwe';
  // рамножить строку хэш-тегов
  // for (var i = 0; i < 15; i++) {
  // testHashTags = testHashTags + testHashTags;
  // }

  var HashTagsValidationData = {
    SEPARATOR: ' ',
    FIRST_SYMBOL: '#',
    MAX_QUANTITY: 5,
    LENGTH: {
      MIN: 2,
      MAX: 20
    }
  };

  console.log('test: ', !!'');

  var getHashTagsArray = function (hashTagsString) {
    return hashTagsString.split(HashTagsValidationData.SEPARATOR).filter(function (it) {
      return !!it;
    }).map(function (it) {
      return it.toUpperCase();
    });
  };

  // объединить проверки массива хэш-тегов в объект с несколькими методами?
  // а, может быть, и получение массива из строки тоже в этот объект.
  // вместе с константами. Хотя, тогда получится просто модуль?

  var isHashTagsFirstSymbolCorrect = function (hashTags) {
    // а если начинается с двух решеток?
    // в т.з. не оговорено, но как-то неправильно?
    // TODO:
    // то есть первый символ решетка, а второй - не решетка
    return hashTags.every(function (it) {
      return it.charAt(0) === HashTagsValidationData.FIRST_SYMBOL;
    });
  };

  var isHashTagsMaxQuantityCorrect = function (hashTags) {
    return hashTags.length <= HashTagsValidationData.MAX_QUANTITY;
  };

  var isHashTagsUnique = function (hashTags) {
    return hashTags.length === hashTags.filter(function (it, i, arr) {
        return arr.indexOf(it) === i;
    }).length;
    // первый метод, перебор вложенными циклами
    // for (var i = 0; i < hashTags.length; i++) {
    //   for (var j = i + 1; j < hashTags.length; j++) {
    //     if (hashTags[i] === hashTags[j]) {
    //       return false;
    //     }
    //   }
    // }
    // return true;
  };

  var isHashTagsCorrectLength = function (hashTags) {
    return !hashTags.some(function (it) {
      return it.length < HashTagsValidationData.LENGTH.MIN || it.length > HashTagsValidationData.LENGTH.MAX;
    });
  };

  var hashTags = getHashTagsArray(hashTagsEl.value);

  // console.log('value: ', hashTagsEl.value);
  // console.log('hashtags array: ', hashTags);
  // console.log('Проверка на то, что начинаются с решетки: ' + isHashTagsFirstSymbolCorrect(hashTags));
  // console.log('Проверка на макс кол-во: ' + isHashTagsMaxQuantityCorrect(hashTags));
  // console.log('Проверка на уникальность: ' + isHashTagsUnique(hashTags));
  // console.log('Проверка на правильную длину: ' + isHashTagsCorrectLength(hashTags));


  var isHashTagsFieldValid = function (hashTags) {
    // true / false
    // возвращать еще тексты ошибок
    return (isHashTagsFirstSymbolCorrect())
    // return commentField.value.length <= CommentFieldValidationData.MAX_LENGTH;
  };

  var setHashTagsFieldState = function (hashTagsField, isValid) {
    //  поменять откуда берутся стили для ошибок
    if (isValid) {
      hashTagsField.setCustomValidity('');
      hashTagsField.style[CommentFieldValidationData.VALIDITY_STYLE] = CommentFieldValidationData.VALID_STYLE;
    } else {
      hashTagsField.setCustomValidity(CommentFieldValidationData.INVALID_TEXT + 'ladksjadkljasldkjasd');
      hashTagsField.style[CommentFieldValidationData.VALIDITY_STYLE] = CommentFieldValidationData.INVALID_STYLE;
    }
  };

  var validateHashTagsField = function () {
    setHashTagsFieldState(hashTagsEl, isHashTagsFieldValid(hashTags));
  };

  var validateForm = function () {
    validateCommentField();
    validateHashTagsField();
  };


  imgUploadForm.addEventListener('submit', validateForm);
  commentEl.addEventListener('input', validateForm);
})();
