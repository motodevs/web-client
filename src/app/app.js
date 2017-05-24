(function () {

  var module = angular.module('MotoTracker', ['ui.router']);


  module.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {

      $stateProvider.state('dashboard', {
        url: '/dashboard',
        controller: 'HomeController as vm',
        templateUrl: 'components/home/home.html'
      });

      $urlRouterProvider.otherwise('/dashboard');
      //$locationProvider.html5Mode({ enabled: true, requireBase: false });

    }]);


}).call(this);