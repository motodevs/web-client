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
        var user = { accessToken: response.data.token };
        $cookies.putObject('user', user);
        return $http.get(config.api + '/user');
      }, function (r) {
        loginFailFn(r);
      }).then(function (response) {
        if (!response) {
          loginFailFn();
          return;
        }

        var user = $cookies.getObject('user') || {};
        user.username = response.data.email;
        user.name = response.data.name;
        user.surname = response.data.surname;
        user.devices = response.data.devices;
        $cookies.putObject('user', user);
        loginSuccessFn(user);
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
      }, function (response) {
        defer.reject({ invalidToken: true, response: response })
      });

      return defer.promise;
    }
  }
}).call(this);