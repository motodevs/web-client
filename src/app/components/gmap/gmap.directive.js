(function () {

  angular.module('MotoTracker')
    .directive('googleMap', directiveFn);

  directiveFn.$inject = ['appConfig', '$window'];

  function directiveFn(appConfig, $window) {
    var id = "google-map-" + parseInt(Math.random() * 100000);
    return {
      restrict: 'EA',
      scope: {},
      controller: 'GMapController',
      controllerAs: 'vm',
      template: '<div class="google-map" id="'+ id +'"></div>',
      bindToController: {
        center: '=',
        options: '=?'
      },
      link: linkFn
    };

    function linkFn(scope, element, attrs, controller) {
      appendGoogleMapsJS(initMap);

      function initMap() {
        var opts = controller.options || {};

        opts.zoom = opts.zoom || 15;
        opts.center = controller.center;

        var mapW = document.getElementById(id);

        controller.map = new google.maps.Map(mapW, opts);
      }
    }

    function appendGoogleMapsJS(callback) {
      var mapsJS = document.getElementById('googleMapsJs');
      if (mapsJS) {
        callback();
        return;
      }

      $window._onGoogleMapsJsLoad = callback;

      var script = document.createElement("script");
      script.src = 'https://maps.googleapis.com/maps/api/js?key='+ appConfig.mapsApiKey +'&callback=_onGoogleMapsJsLoad';
      script.id = 'googleMapsJs';
      script.async = true;
      script.defer = true;

      document.body.appendChild(script) ;
    }

  }

}).call(this);