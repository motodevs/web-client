(function () {
    var appConfig = {
      api: 'http://localhost:44773/api',
      publicLocationUrl: 'http://localhost/#hash#',
      mapsApiKey: 'AIzaSyCzJj2IW8r5jbzxRUT3k0pE_h1AaQsSm50'
    };

    angular.module('OpenMtsWebCli').constant('appConfig', appConfig);
}).call(this);