(function () {

  var module = angular.module('OpenMtsWebCli');
  module.directive('locationShare', locationShareDirectiveFn);

  locationShareDirectiveFn.$inject = [];

  function locationShareDirectiveFn() {
    return {
      scope: {},
      restrict: 'EA',
      bindToController: {},
      controllerAs: 'vm',
      controller: 'LocationShareController',
      templateUrl: 'components/location-share/location-share.html'
    }
  }


}).call(this);