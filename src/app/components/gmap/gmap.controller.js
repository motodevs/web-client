(function () {

  var module = angular.module('OpenMtsWebCli');
  module.controller('GMapController', gmapControllerFn);

  gmapControllerFn.$inject = ['$scope', '$interval', '$window'];

  function gmapControllerFn($scope, $interval, $window) {
    var vm = this;
    var eventQ = [];
    var moment = $window.moment;
    var markers = [];

    /**
     * if lat-lng-change event broadcasted before map load, push event to eventQ
     */
    function onLatLngChange(event, obj) {
      if (vm.map) {
        var latLng = new google.maps.LatLng(obj.lat, obj.lng);
        vm.map.setZoom(obj.zoom);
        vm.map.panTo(latLng);


        if (obj.clearMarkers) {
          markers.map(function (m) {
            m.setMap(null);
          });
        }

        var marker = new google.maps.Marker({
          position: latLng,
          map: vm.map,
          animation: google.maps.Animation.DROP,
          title: moment(obj.date).format('DD.MM.YYYY HH:mm:ss')
        });

        var infoWindow = new google.maps.InfoWindow({
          content: 'Lokasyon Tarihi: ' + moment(obj.date).format('DD.MM.YYYY HH:mm:ss')
        });

        google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(vm.map, marker);
        });

        markers.push(marker);

      } else {
        eventQ.unshift(obj);
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