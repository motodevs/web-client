(function () {

  var module = angular.module('OpenMtsWebCli');
  module.controller('LoginController', loginControllerFn);

  loginControllerFn.$inject = ['loginService', '$state'];

  function loginControllerFn(loginService, $state) {
    var vm = this;

    vm.doLogin = function () {
      loginService.login(vm.username, vm.password, loginSuccess, loginFailed);
    };
    
    function loginSuccess(user) {
      vm.loginError = false;
      $state.go('app.dashboard')
    }
    
    function loginFailed(err) {
      vm.loginError = true;
    }

  }


}).call(this);