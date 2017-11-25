(function () {

  angular.module('OpenMtsWebCli')
    .directive('googleMap', directiveFn);

  directiveFn.$inject = ['appConfig', '$window'];
  var $ = window.jQuery;

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
        mapId: '@?',
        responsive: '=?'
      },
      link: linkFn
    };

    function linkFn(scope, element, attrs, controller) {
      appendGoogleMapsJS(initMap);

      function initMap() {
        var opts = controller.options || {};
        var responsive = controller.responsive || {};
        opts.zoom = opts.zoom || 5;
        opts.center = controller.center;

        var mapW = document.getElementById(controller.mapId);
        scope.vm.map = new google.maps.Map(mapW, opts);
        if (responsive.autoWidthHeight) {
          autoWidthHeight(element, responsive, scope.vm.map);
        }
      }
    }


    function autoWidthHeight(element, config, map) {
      var elem = $(element);

      function resize() {
        var w = elem.parent().width();
        var h = $window.innerHeight;

        elem.find('div:first').css({
          height: (h - (config.heightMargin || 0)) + 'px',
          width: (w - (config.widthMargin || 0)) + 'px'
        });

        google.maps.event.trigger(map, 'resize');
      }

      $($window).on('resize', resize);
      resize();
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