(function () {

  var module = angular.module('OpenMtsWebCli');
  module.factory('homeService', homeServiceFn);

  homeServiceFn.$inject = ['$http', '$log', '$window', 'appConfig'];

  function homeServiceFn($http, $log, $window, config) {
    var moment = $window.moment;

    return {
      getLastLocation: getLastLocation
    };

    function getLastLocation(deviceId, status, successFn, failFn) {
      status = status || 'VALID';
      failFn = getFailFn(failFn);

      $http.get(config.api + '/messages/'+ deviceId +'?size=1&gps=' + status).then(function (response) {
        var d = response.data;
        if (angular.isArray(d) && d.length > 0) {
          var loc = d[0];
          successFn({
            latitude: loc.latitude,
            longitude: loc.longitude,
            date: moment(loc.datetime)
          });
        }
      }, failFn)
    }



    function getFailFn(failFn) {
      return failFn || function (r) {
          $log.warn(r);
        };
    }

  }


}).call(this);