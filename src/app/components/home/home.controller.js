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


    // homeService.getMessages(deviceId, 1200, function (data) {
    //   var i = 0;
    //   var intervalid = $interval(function () {
    //     vm.deviceState = data[i];
    //     $scope.$broadcast('lat-lng-change', { lat: data[i].latitude, lng: data[i].longitude, zoom: 17, date: data[i].deviceDate, direction: data[i].direction });
    //     i++;
    //     if (i === 1200) {
    //       $interval.cancel(intervalid);
    //     }
    //   }, 150);
    // });

    function init() {
      homeService.getDeviceState(deviceId, function (state) {
        vm.deviceState = state;
        var mapData = getMapData();
        mapData.pan = true;
        mapData.zoom = 17;
        $scope.$broadcast('lat-lng-change', mapData);
        startInterval();
      });
    }


    init();

  }


}).call(this);