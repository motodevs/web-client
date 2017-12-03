(function () {

  var module = angular.module('OpenMtsWebCli');
  module.factory('LocationShareService', locationShareServiceFn);

  locationShareServiceFn.$inject = ['$http', '$log', 'appConfig'];

  function locationShareServiceFn($http, $log, config) {
    return {
      createPublicHash: createPublicHash,
      shareWithSms: shareWithSms
    };

    function createPublicHash(device, successFn, failFn) {
      $http.post(config.api + '/device/'+ device.serial + '/public-hash').then(function (response) {
        successFn(response.data);
      }, function (errResponse) {
        (failFn || function () {}).call(null, errResponse);
      })
    }

    function shareWithSms(recipientNumber, hash, device, successFn, failFn) {
      var data = {
        hash: hash,
        number: recipientNumber + ""
      };

      $http.post(config.api + '/device/'+ device.serial + '/share', data).then(function (response) {
        successFn(response.data);
      },function (errResponse) {
        (failFn || function () {}).call(null, errResponse);
      });
    }
  }


}).call(this);