(function () {

  var module = angular.module('OpenMtsWebCli');
  module.controller('LocationShareController', locationShareControllerFn);

  locationShareControllerFn.$inject = ['$cookies', '$scope', 'alertify', 'LocationShareService', '$log', 'appConfig'];

  function locationShareControllerFn($cookies, $scope, alertify, locationShareService, $log, appConfig) {
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
      alertify.error('cannot create hash');
      $log.error(errorResponse);
    }

    vm.shareLocation = function () {
      if (!$scope.locationShareForm.$valid) {
        alertify.alert('Invalid form data');
        return;
      }

      if (vm.sendSms) {
        alertify.confirm('Are your sure want to share ' + vm.unit.label + '('+ vm.unit.serial +')\'s location with ' + vm.recipientNumber, function () {
          locationShareService.createPublicHash(vm.unit, createPublicHashSuccess, createPublicHashFail);
        });
      } else {
        locationShareService.createPublicHash(vm.unit, function (response) {
          alertify.alert('Public location url created: <a target="_blank" href="' + appConfig.publicLocationUrl.replace('#hash#', response.hash) + '">'+ response.hash +'</a> validity date: ' + new Date(response.expireDate).toString())
        }, createPublicHashFail);
      }
    };

  }


}).call(this);