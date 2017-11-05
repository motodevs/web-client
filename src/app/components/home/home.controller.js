(function () {

  var module = angular.module('OpenMtsWebCli');
  module.controller('HomeController', homeControllerFn);

  homeControllerFn.$inject = ['homeService', '$scope', '$cookies', '$interval', '$window', '$timeout'];

  function homeControllerFn(homeService, $scope, $cookies, $interval, $window, $timeout) {
    var vm = this;
    var deviceId, intervalId;
    vm.user = $cookies.getObject('user');
    vm.mapConfig = {
      autoWidthHeight: true
    };
    vm.loaded = false;
    vm.lastLocation = {};

    deviceId = vm.user.device.serial;

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

    function startInterval() {
      intervalId = $interval(function () {
        homeService.getDeviceState(deviceId, deviceStateHandler);
      }, 3000);
    }

    function init() {
      homeService.getDeviceState(deviceId, function (state) {
        vm.deviceState = state;
        configureMapSize();
        vm.loaded = true;
        var mapdata = angular.extend(getMapData(), { pan: true, zoom: 17 });
        $timeout(function () { $scope.$broadcast('lat-lng-change', mapdata); }, 500);
        startInterval();
      }, function () {
        configureMapSize();
        startInterval();
        vm.loaded = true;
      });
    }

    function configureMapSize() {
      var $ = $window.jQuery;
      var h1 = $('.current-state').height();
      var h2 = parseInt($('body').css('padding-top'));
      vm.mapConfig.heightMargin = h1 + h2;
    }

    init();

  }


}).call(this);