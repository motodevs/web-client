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

      if (angular.isObject(mapData.locations) && Object.keys(mapData.locations).length === 0) {
        return;
      }


      if (mapData.clearMarkers) {
        Object.keys(markers).map(function (m) {
          markers[m].setMap(null);
          delete markers[m];
        });
      }

      var id, locations = {};
      for (id in mapData.locations) {
        var state = mapData.locations[id];
        locations[id] = {};
        locations[id].latLng = new google.maps.LatLng(state.lat, state.lng);
        locations[id].markerProperties = {
          position: locations[id].latLng,
          map: vm.map,
          label: state.label,
          icon: {
            labelOrigin: new google.maps.Point(60, 0)
          }
        };

        if (state.direction) {
          locations[id].markerProperties.icon = {
            path : google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 4,
            rotation: state.direction,
            labelOrigin: new google.maps.Point(5, 5)
          };
        } else if (state.icon) {
          var icon = state.icon;
          icon.scaledSize = new google.maps.Size(35, 35);
          icon.labelOrigin =  new google.maps.Point(60, 0);
          angular.extend(locations[id].markerProperties.icon, icon);
        }
      }

      if (mapData.zoom) {
        vm.map.setZoom(mapData.zoom);
      }

      if (mapData.pan) {
        var k = Object.keys(locations)[0];
        vm.map.panTo(locations[k].latLng);
      }

      for (id in mapData.locations) {
        var currentLatLng = locations[id].latLng;
        var currentMarkerProperties = locations[id].markerProperties;
        var currentMarker = markers[id];

        if (!currentMarker) {
          markers[id] = new google.maps.Marker(currentMarkerProperties);
          markers[id].addListener('click', getMarkerOnClickHandler(mapData, mapData.locations[id]));
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