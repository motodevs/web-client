(function () {

  var module = angular.module('MotoTracker');
  module.controller('HomeController', homeControllerFn);

  homeControllerFn.$inject = ['homeService', '$scope'];

  function homeControllerFn(homeService, $scope) {
    var vm = this;
    var deviceId = 'test-device-id';

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