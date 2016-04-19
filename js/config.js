// This configuration file is used by the Camomile service
// to know the URL of the Camomile REST API, see app.js

angular.module('camomileApp.production', [])
    .constant('camomileConfig', {
        backend: 'http://localhost:3000'
    });
