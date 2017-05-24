(function () {
    var appConfig = {
      api: 'http://localhost:44773/api',
      mapsApiKey: 'AIzaSyCzJj2IW8r5jbzxRUT3k0pE_h1AaQsSm50'
    };

    angular.module('MotoTracker').constant('appConfig', appConfig);
}).call(this);