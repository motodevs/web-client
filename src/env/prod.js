(function () {
    var appConfig = {
      api: 'http://api.openmts.com',
      publicLocationUrl: 'https://openmts.com/f/#hash#',
      mapsApiKey: 'AIzaSyCzJj2IW8r5jbzxRUT3k0pE_h1AaQsSm50'
    };

    angular.module('OpenMtsWebCli').constant('appConfig', appConfig);
}).call(this);