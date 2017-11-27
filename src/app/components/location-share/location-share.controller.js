(function () {

  var module = angular.module('OpenMtsWebCli');
  module.controller('LocationShareController', locationShareControllerFn);

  locationShareControllerFn.$inject = ['$cookies', '$scope', 'alertify', 'LocationShareService', '$log'];

  function locationShareControllerFn($cookies, $scope, alertify, locationShareService, $log) {
    var vm = this;
    var user = $cookies.getObject('user');
    vm.devices = user.devices;
    alertify = alertify.delay(10000).closeLogOnClick(true);

    function resetForm() {
      $scope.locationShareForm.$setPristine();
      $scope.locationShareForm.$setUntouched();
      vm.unit = undefined;
      vm.recipientNumber = undefined;
    }

    function shareLocationSuccess(response) {
      if (!response.smsFailed) {
        alertify.success('Hash created ('+ response.hash +') and sent. Validity date: ' + new Date(response.expireDate).toString());
        resetForm();
      } else {
        alertify.error('sms can\'t send. check server logs');
      }
    }

    function shareLocationFail(errorResponse) {
      alertify.error('server error see logs');
      $log.error(errorResponse);
    }

    vm.shareLocation = function () {
      if (!$scope.locationShareForm.$valid) {
        alertify.alert('Invalid form data');
        return;
      }

      alertify.confirm('Are your sure want to share ' + vm.unit.label + '('+ vm.unit.serial +')\'s location with ' + vm.recipientNumber, function () {
        locationShareService.shareLocation(vm.recipientNumber, vm.unit, shareLocationSuccess, shareLocationFail);
      });

    };

  }


}).call(this);