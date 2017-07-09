(function () {

  var module = angular.module('OpenMtsWebCli');
  module.factory('defaultHttpInterceptor', defaultHttpInterceptorFn);

  defaultHttpInterceptorFn.$inject = ['appConfig', '$cookies'];

  function defaultHttpInterceptorFn(appConfig, $cookies) {
    return {
      request: function (config) {
        var user = $cookies.getObject('user') || {};
        if (config.url.indexOf(appConfig.api) === 0 && angular.isDefined(user.accessToken)) {
          config.headers['x-access-token'] = user.accessToken;
        }
        return config;
      },
      response: function (response) {
        return response;
      }
    };

  }
}).call(this);