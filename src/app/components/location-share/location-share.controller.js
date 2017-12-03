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

    function createPublicHashSuccess(response) {
      alertify.success('Hash created ('+ response.hash +') and sent. Validity date: ' + new Date(response.expireDate).toString());
      locationShareService.shareWithSms(vm.recipientNumber, response.hash, vm.unit, function (data) {
        alertify.log('Sms send result ' + data.response);
        resetForm();
      }, function () {
        alertify.error('Sms can\'t send');
      });
    }

    function createPublicHashFail(errorResponse) {
      alertify.error('server error see logs');
      $log.error(errorResponse);
    }

    vm.shareLocation = function () {
      if (!$scope.locationShareForm.$valid) {
        alertify.alert('Invalid form data');
        return;
      }

      alertify.confirm('Are your sure want to share ' + vm.unit.label + '('+ vm.unit.serial +')\'s location with ' + vm.recipientNumber, function () {
        locationShareService.createPublicHash(vm.unit, createPublicHashSuccess, createPublicHashFail);
      });

    };

  }


}).call(this);