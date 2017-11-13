(function () {

  var module = angular.module('OpenMtsWebCli');
  module.factory('homeService', homeServiceFn);

  homeServiceFn.$inject = ['$http', '$log', '$window', 'appConfig', '$q'];

  function homeServiceFn($http, $log, $window, config, $q) {
    var moment = $window.moment;

    return {
      getDevicesState: getDevicesState
    };

    function getDevicesState(devices) {
      var states = { success: [], fails: [] };
      var defer = $q.defer();

      for (var i = 0; i < devices.length; i++) {
        var device = devices[i];
        $http.get(config.api + '/device/'+ device.serial + '/state').then(stateSuccess(device), stateFail(device));
      }

      return defer.promise;

      function stateSuccess(device) {
        return function (response) {
          response.data.deviceDate = moment(response.data.deviceDate);
          states.success.push({ state: response.data, device: device });
          checkAndResolve();
        }
      }

      function stateFail(device) {
        return function (response) {
          states.fails.push({ state: undefined, device: device });
          checkAndResolve();
        }
      }

      function checkAndResolve() {
        if (devices.length === (states.success.length + states.fails.length)) {
          defer.resolve(states.success);
        }
      }
    }
  }


}).call(this);