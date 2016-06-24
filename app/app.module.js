angular.module('camomileApp', [
    // Routes
    'app.routes',

    // Services
    'camomileApp.services.data',

    // Controllers for components
    'camomileApp.controllers.auth',
    'camomileApp.controllers.browse',
    'camomileApp.controllers.backoffice',
    'camomileApp.controllers.objects',
    'camomileApp.controllers.indexation',
    'camomileApp.controllers.segmentation',
    'camomileApp.controllers.debug',

    // Directives
    'camomileApp.directives.box',
    'camomileApp.directives.canvas',
    'camomileApp.directives.details',
    'camomileApp.directives.edit',
    'camomileApp.directives.image',
    'camomileApp.directives.video',
    'camomileApp.directives.media',
    'camomileApp.directives.loader',
    'camomileApp.directives.popup',

    // Vendor
    'jsonFormatter',
    'ui.bootstrap',
    'ngAnimate',
    'json-tree'
])
    .constant('camomileConfig', {
        backend: 'http://localhost:3000'
    })
    .constant('camomileToolsConfig', {
        moduleFolder: 'app/shared/',
        refreshTime: {
            canvas: 250,
            video: 100,
            dimensions: 1000
        }
    })
    .factory('Camomile', ['camomileConfig', function (camomileConfig) {
        Camomile.setURL(camomileConfig.backend);
        return Camomile;
    }]);
