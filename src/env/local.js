(function () {
    var appConfig = {
      api: 'http://localhost:8080/api',
      mapsApiKey: 'AIzaSyCzJj2IW8r5jbzxRUT3k0pE_h1AaQsSm50'
    };

    angular.module('OpenMtsWebCli').constant('appConfig', appConfig);
}).call(this);