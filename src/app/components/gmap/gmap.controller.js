(function () {

  var module = angular.module('OpenMtsWebCli');
  module.controller('GMapController', gmapControllerFn);

  gmapControllerFn.$inject = ['$scope', '$interval', '$log'];

  function gmapControllerFn($scope, $interval, $log) {
    var vm = this;
    var eventQ = [];
    var markers = {};
    /**
     * if lat-lng-change event broadcasted before map load, push event to eventQ
     */
    function onLatLngChange(event, mapData) {
      if (!vm.map) {
        eventQ.unshift(mapData);
        return;
      }
      google.maps.event.trigger(vm.map, 'resize');

      if (angular.isObject(mapData.locations) && Object.keys(mapData.locations).length === 0) {
        return;
      }

      var latLng = {}, markerProperties = {}, deviceId;
      for (deviceId in mapData.locations) {
        var state = mapData.locations[deviceId];
        latLng[deviceId] = new google.maps.LatLng(state.lat, state.lng);
        markerProperties[deviceId] = {
          position: latLng[deviceId],
          map: vm.map,
          label: {
            text: state.label + ' ' + state.deviceId,
          }
        };

        if (state.direction) {
          markerProperties[deviceId].icon = {
            path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 4,
            rotation: state.direction
          };
        }
      }

      if (mapData.zoom) {
        vm.map.setZoom(mapData.zoom);
      }

      if (mapData.pan) {
        vm.map.panTo(latLng[Object.keys(latLng)[0]]);
      }

      if (mapData.clearMarkers) {
        markers.map(function (m) {
          m.setMap(null);
        });
      }


      for (deviceId in mapData.locations) {
        var currentLatLng = latLng[deviceId];
        var currentMarkerProperties = markerProperties[deviceId];
        var currentMarker = markers[deviceId];

        if (!currentMarker) {
          markers[deviceId] = new google.maps.Marker(currentMarkerProperties);
          markers[deviceId].addListener('click', getMarkerOnClickHandler(mapData, mapData.locations[deviceId]));
        } else {
          currentMarker.setPosition(currentLatLng);
          if (currentMarkerProperties && currentMarkerProperties.icon) {
            currentMarker.setIcon(currentMarkerProperties.icon);
          }
        }
      }
    }

    function getMarkerOnClickHandler(mapData, currentMarker) {
      return function () {
        if (angular.isFunction(mapData.onMarkerClick)) {
          mapData.onMarkerClick(currentMarker);
        }
      }
    }

    function init() {
      if (angular.isUndefined(vm.center) || angular.isUndefined(vm.center.lat) || angular.isUndefined(vm.center.lng)) {
        vm.center = { lat: 39.0407786,  lng: 35.8698383 }
      }

      if (angular.isUndefined(vm.options) || angular.isUndefined(vm.options.zoom)) {
        vm.options = vm.options || {};
        vm.options.zoom = 6;
      }

      if (!vm.mapId) {
        vm.mapId = "google-map-" + parseInt(Math.random() * 100000);
      }

      $scope.$on('lat-lng-change', onLatLngChange);

      /**
       * when map is ready, send collected events to onLatLngChange
       */
      var intervalId = $interval(function () {
        if (vm.map) {
          eventQ.map(function (ev) {
            onLatLngChange(undefined, ev);
          });
          eventQ = [];
          $interval.cancel(intervalId);
        }
      }, 500);
    }

    init();
  }

}).call(this);