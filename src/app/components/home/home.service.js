(function () {

  var module = angular.module('MotoTracker');
  module.factory('homeService', homeServiceFn);

  homeServiceFn.$inject = ['$http', '$log', '$window', 'appConfig'];

  function homeServiceFn($http, $log, $window, config) {
    var moment = $window.moment;
    return {
      getLastValidLocation: getLastValidLocation
    };

    function getLastValidLocation(success) {
      $http.get(config.api + '/messages/86307101896953212?size=1&messageStatus=0').then(function (response) {
        var d = response.data[0];
        success({
          latitude: d.latitude,
          longitude: d.longitude,
          date: moment(d.datetime.$date)
        });
      }, function (error) {
        $log.warn(error);
      })
    }
  }


}).call(this);