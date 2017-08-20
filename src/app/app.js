(function () {

  var module = angular.module('OpenMtsWebCli', ['ui.router', 'ngCookies']);


  module.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

      $stateProvider.state('app', {
        abstract: true,
        controller: 'AppController',
        controllerAs: 'vm',
        templateUrl: 'components/app/app.html'
      });

      $stateProvider.state('app.dashboard', {
        url: '/dashboard',
        controller: 'HomeController as vm',
        templateUrl: 'components/home/home.html',
        resolve: {
          loggedIn: ['loginService', function (loginService) {
            return loginService.isLoggedIn();
          }]
        }
      });

      $stateProvider.state('login', {
        url: '/login',
        controller: 'LoginController as vm',
        templateUrl: 'components/login/login.html'
      });

      $urlRouterProvider.otherwise('/dashboard');
      //$locationProvider.html5Mode({ enabled: true, requireBase: false });

      $httpProvider.interceptors.push('defaultHttpInterceptor');


    }]);

  
  module.run(['$rootScope', '$state', '$http', '$transitions', 'loginService',
    function ($rootScope, $state, $http, $transitions, loginService) {

      $transitions.onError({}, function (trans) {
        if (trans.error().detail && trans.error().detail.invalidToken) {
          loginService.logout();
          trans.router.stateService.go('login');
        }
      });

  }]);

  module.controller('AppController', appControllerFn);
  appControllerFn.$inject = ['$cookies', 'loginService', '$state'];

  function appControllerFn($cookies, loginService, $state) {
    var vm = this;
    vm.user = $cookies.getObject('user');
    var stateNameParts = $state.current.name.split('.');

    vm.logout = function () {
      loginService.logout();
      $state.go('login');
    };

    vm.contentClass = stateNameParts.pop();
    vm.$state = $state;
  }


}).call(this);