'use strict';

(function () {
  var RESPONSE_CODE_OK = 200;
  var TIMEOUT = 10000;
  var Url = {
    DOWNLOAD: 'https://js.dump.academy/kekstagram/data',
    UPLOAD: 'https://js.dump.academy/kekstagram'
  };

  var Request = {
    GET: 'GET',
    POST: 'POST'
  };


  var createXHRequest = function (method, url, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === RESPONSE_CODE_OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(method, url);
    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };


  window.backend = {
    Url: Url,
    download: function (url, onSuccess, onError) {
      createXHRequest(Request.GET, url, onSuccess, onError);
    },
    upload: function (url, data, onSuccess, onError) {
      createXHRequest(Request.POST, url, onSuccess, onError, data);
    }
  };
})();
