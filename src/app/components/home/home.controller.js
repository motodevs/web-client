(function () {

  var module = angular.module('OpenMtsWebCli');
  module.controller('HomeController', homeControllerFn);

  homeControllerFn.$inject = ['homeService', '$scope', '$cookies', '$interval'];

  function homeControllerFn(homeService, $scope, $cookies, $interval) {
    var vm = this;
    vm.user = $cookies.getObject('user');
    var deviceId = vm.user.device.serial, intervalId;

    vm.lastLocation = {};

    function getMapData() {
      if (vm.deviceState) {
        return {
          lat: vm.deviceState.latitude,
          lng: vm.deviceState.longitude,
          date: vm.deviceState.deviceDate,
          direction: vm.deviceState.direction
        };
      }
    }

    vm.reCenter = function () {
      var mapData = getMapData() || {};
      mapData.pan = true;
      mapData.zoom = 17 ;
      $scope.$broadcast('lat-lng-change', mapData);
    };

    function deviceStateHandler(state) {
      vm.deviceState = state;
      $scope.$broadcast('lat-lng-change', getMapData());
    }

    function getLastLocation() {
      homeService.getDeviceState(deviceId, deviceStateHandler);
    }

    function startInterval() {
      intervalId = $interval(getLastLocation, 3000);
    }


    function init() {
      homeService.getDeviceState(deviceId, function (state) {
        vm.deviceState = state;
        var mapData = getMapData();
        mapData.pan = true;
        mapData.zoom = 17;
        $scope.$broadcast('lat-lng-change', mapData);
        startInterval();
      }, function () {
        startInterval();
      });
    }


    init();

  }


}).call(this);