(function () {

  angular.module('OpenMtsWebCli')
    .directive('googleMap', directiveFn);

  directiveFn.$inject = ['appConfig', '$window'];

  function directiveFn(appConfig, $window) {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'GMapController',
      controllerAs: 'vm',
      template: '<div class="google-map" id="{{vm.mapId}}"></div>',
      bindToController: {
        center: '=?',
        options: '=?',
        mapId: '@?'
      },
      link: linkFn
    };

    function linkFn(scope, element, attrs, controller) {
      var $ = $window.jQuery;
      appendGoogleMapsJS(initMap);

      function initMap() {
        var opts = controller.options || {};

        opts.zoom = opts.zoom || 5;
        opts.center = controller.center;

        var mapW = document.getElementById(controller.mapId);

        scope.vm.map = new google.maps.Map(mapW, opts);
      }

      function calcHeight() {
        var h = $('#content').outerHeight() - 103;
        $('.google-map').height(h);
      }

      $($window).on('resize', calcHeight);
      calcHeight();
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