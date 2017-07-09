(function () {

  var module = angular.module('OpenMtsWebCli');
  module.factory('loginService', loginServiceFn);

  loginServiceFn.$inject = ['$q', '$http', '$log', 'appConfig', '$cookies'];

  function loginServiceFn($q, $http, $log, config, $cookies) {
    return {
      login: login,
      isLoggedIn: isLoggedIn,
      logout: logout
    };

    function logout() {
      $cookies.remove('user');
    }

    function login(username, password, loginSuccessFn, loginFailFn) {
      var data = { username: username, password: password };

      $http.post(config.api + '/access-token', data).then(function (response) {
        var user = {
          username: response.data.username,
          name: response.data.name,
          surname: response.data.surname,
          deviceId: response.data.devices[0],
          accessToken: response.data.accessToken
        };
        $cookies.putObject('user', user);
        loginSuccessFn(user);
      }, function (r) {
        loginFailFn(r);
      });
    }

    function getFailFn(failFn) {
      return failFn || function (r) {
          $log.warn(r);
        };
    }

    function isLoggedIn() {
      var defer = $q.defer();
      $http.get(config.api + '/user/checkpoint').then(function () {
        defer.resolve();
      }, function () {
        defer.reject({ invalidToken: true })
      });

      return defer.promise;
    }
  }
}).call(this);