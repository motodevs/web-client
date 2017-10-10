(function () {

  var module = angular.module('OpenMtsWebCli');
  module.factory('homeService', homeServiceFn);

  homeServiceFn.$inject = ['$http', '$log', '$window', 'appConfig'];

  function homeServiceFn($http, $log, $window, config) {
    var moment = $window.moment;

    return {
      getMessages: getMessages,
      getDeviceState: getDeviceState
    };

    function getMessages(deviceId, size, successFn, failFn) {
      var status = 'VALID';
      size = size || 1;
      failFn = getFailFn(failFn);

      $http.get(config.api + '/messages/'+ deviceId +'?size='+ size +'&gps=' + status).then(function (response) {
        var d = response.data;
        var result = [];

        if (angular.isArray(d) && d.length > 0) {
          d.map(function (r) {
            result.unshift({
              speed: r.speed,
              distance: r.distance,
              latitude: r.latitude,
              longitude: r.longitude,
              direction: r.direction,
              date: moment(r.datetime)
            });
          });
          successFn(result);
        }
      }, failFn)
    }

    function getDeviceState(deviceId, successFn, failFn) {
      failFn = getFailFn(failFn);
      $http.get(config.api + '/device/'+ deviceId + '/state').then(function (response) {
        response.data.deviceDate = moment(response.data.deviceDate);
        successFn(response.data);
      }, failFn);
    }



    function getFailFn(failFn) {
      return failFn || function (r) {
          $log.warn(r);
        };
    }

  }


}).call(this);