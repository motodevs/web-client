(function () {

  var module = angular.module('OpenMtsWebCli');
  module.controller('HomeController', homeControllerFn);

  homeControllerFn.$inject = ['homeService', '$scope', '$cookies', '$interval', '$window', 'loginService', '$state', 'alertify'];

  function homeControllerFn(homeService, $scope, $cookies, $interval, $window, loginService, $state, alertify) {
    var vm = this;
    var devices, intervalId, loginCheckIntervalId;
    vm.user = $cookies.getObject('user');

    vm.mapConfig = {
      autoWidthHeight: true
    };

    vm.loaded = false;
    vm.states = [];

    devices = vm.user.devices;

    function getLocations() {
      var locations = {};
      if (vm.states.length ) {
        vm.states.map(function (s) {
          locations[s.state.deviceId] = {
            lat: s.state.latitude,
            lng: s.state.longitude,
            date: s.state.deviceDate,
            direction: s.state.direction,
            label: {
              text: s.device.label,
              fontSize: '13px',
              fontWeight: 'bold'
            },
            icon: {
              url: 'images/motorcycle.png'
            },
            deviceId: s.state.deviceId
          }
        });
      }
      return locations;
    }

    function getDeviceState(deviceId) {
      var filter = vm.states.filter(function (s) {
        return s.state.deviceId === deviceId;
      });

      var state = filter.shift();

      if (angular.isUndefined(state)) {
        return undefined;
      }

      return angular.extend(angular.copy(state.state), { label: state.device.label });
    }

    function startInterval() {
      intervalId = $interval(function () {
        homeService.getDevicesState(devices).then(function (states) {
          vm.states = states;
          publishCoordinates();
          if (vm.deviceState) {
            vm.deviceState = getDeviceState(vm.deviceState.deviceId)
          }
        });
      }, 2000);
    }

    function publishCoordinates(pan, zoom, timeout) {
      pan = pan || false;
      zoom = zoom || ((pan === true && devices.length === 1) ? 15 : undefined);

      if (timeout) {
        setTimeout(broadcastCoordinates, 500);
      } else {
        broadcastCoordinates();
      }

      function broadcastCoordinates() {
        var mapData = {
          locations: getLocations(),
          zoom: zoom,
          pan: pan,
          onMarkerClick: function (marker) {
            $scope.$apply(function () {
              vm.deviceState = getDeviceState(marker.deviceId);
            });
          }
        };
        $scope.$broadcast('lat-lng-change', mapData);
      }
    }

    function init() {
      homeService.getDevicesState(devices).then(function (states) {
        vm.loaded = true;
        vm.states = states;
        publishCoordinates(true, (devices.length > 1 ? 13 : undefined), 500);
        startInterval();
        configureMapSize();
      });

      loginCheckIntervalId = $interval(checkSessionTimeout, 3000);
    }

    function checkSessionTimeout() {
      loginService.isLoggedIn().then(function () {
        // success
      }, function (error) {
        // may be internet connection lost
        if (error.response.status === -1) {
          return;
        }

        $interval.cancel(loginCheckIntervalId);
        alertify.alert('Your session has been timed out reason ' + JSON.stringify(error.response.data) + '. Click OK to logout', function () {
          $state.go('login');
        });
      });
    }

    function configureMapSize() {
      var $ = $window.jQuery;
      var h1 = $('.current-state').height();
      var h2 = parseInt($('body').css('padding-top'));
      vm.mapConfig.heightMargin = h1 + h2;
    }

    init();

  }


}).call(this);
