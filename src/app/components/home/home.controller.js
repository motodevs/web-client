(function () {

  var module = angular.module('MotoTracker');
  module.controller('HomeController', homeControllerFn);

  homeControllerFn.$inject = ['homeService'];

  function homeControllerFn(homeService) {
    var vm = this;

    homeService.getLastValidLocation(function (latLng) {
      console.log(latLng);
    });

  }


}).call(this);