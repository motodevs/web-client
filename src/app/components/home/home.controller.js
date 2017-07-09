(function () {

  var module = angular.module('OpenMtsWebCli');
  module.controller('HomeController', homeControllerFn);

  homeControllerFn.$inject = ['homeService', '$scope', '$cookies'];

  function homeControllerFn(homeService, $scope, $cookies) {
    var vm = this;
    vm.user = $cookies.getObject('user');
    var deviceId = vm.user.deviceId;

    vm.lastLocation = {};

    homeService.getLastLocation(deviceId, 'VALID', function (latLng) {
      $scope.$broadcast('lat-lng-change', { lat: latLng.latitude, lng: latLng.longitude, zoom: 17, date: latLng.date, clearMarkers: true });
    });

    vm.reloadData = function () {
      getLastLocation();
    };

    function getLastLocation() {
      homeService.getLastLocation(deviceId, 'VALID', function (latLng) {
        $scope.$broadcast('lat-lng-change', { lat: latLng.latitude, lng: latLng.longitude, zoom: 17, date: latLng.date, clearMarkers: true });
      });
    }

    getLastLocation();
  }


}).call(this);