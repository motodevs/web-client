(function () {

  var module = angular.module('OpenMtsWebCli');
  module.controller('HomeController', homeControllerFn);

  homeControllerFn.$inject = ['homeService', '$scope', '$cookies', '$interval'];

  function homeControllerFn(homeService, $scope, $cookies, $interval) {
    var vm = this;
    vm.user = $cookies.getObject('user');
    var deviceId = vm.user.deviceId;

    vm.lastLocation = {};

    vm.reloadData = function () {
      getLastLocation();
    };

    function deviceStateHandler(state) {
      vm.deviceState = state;
      $scope.$broadcast('lat-lng-change', { lat: state.latitude, lng: state.longitude, zoom: 17, date: state.deviceDate, direction: state.direction });
    }

    function getLastLocation() {
      homeService.getDeviceState(deviceId, deviceStateHandler);
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

    $interval(getLastLocation, 3000);
    getLastLocation();
  }


}).call(this);