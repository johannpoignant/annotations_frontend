angular.module('camomileApp.directives.media', [])
    .directive('camomileMedia', function () {
        return {
            restrict: 'AE',
            template: '<div><api-image ng-if="type === \'image\'" src={{src}}></api-image>' +
            '<api-video ng-if="type === \'video\'" src="src"></api-video></div>',
            replace: true,
            scope: {
                type: '=',
                src: '='
            }
        }
    });
