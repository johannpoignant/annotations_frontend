angular.module('camomileApp.directives.media', [])
    .directive('camomileMedia', function () {
        return {
            restrict: 'AE',
            template: '<div><camomile-image ng-if="type === \'image\'" src={{src}}></camomile-image>' +
            '<camomile-video ng-if="type === \'video\'" src="src"></camomile-video></div>',
            replace: true,
            scope: {
                type: '=',
                src: '='
            }
        }
    });
