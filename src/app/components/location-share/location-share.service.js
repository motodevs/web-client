(function () {

  var module = angular.module('OpenMtsWebCli');
  module.factory('LocationShareService', locationShareServiceFn);

  locationShareServiceFn.$inject = ['$http', '$log', 'appConfig'];

  function locationShareServiceFn($http, $log, config) {
    return {
      shareLocation: shareLocation
    };

    function shareLocation(recipientNumber, device, successFn, failFn) {
      ///device/:deviceId/public-hash
      var data = {
        "shareWithSms": true,
        "recipientNumber": recipientNumber + ""
      };

      $http.post(config.api + '/device/'+ device.serial + '/public-hash', data).then(function (response) {
        successFn(response.data);
      }, function (errResponse) {
        (failFn || function () {}).call(null, errResponse);
      })
    }
  }


}).call(this);