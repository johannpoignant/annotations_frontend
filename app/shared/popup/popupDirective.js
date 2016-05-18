angular.module('camomileApp.directives.popup', [
    "ngAnimate"
])
    .directive('camomilePopup', function ($timeout, camomileToolsConfig) {
        return {
            restrict: 'AE',
            scope: {
                api: '=?'
            },
            templateUrl: camomileToolsConfig.moduleFolder + 'popup/popupView.html',
            controller: function ($scope) {
                /**
                 * Utility for the little popup
                 * @type {Object}
                 */
                $scope.message = {
                    show: false, // Is it displayed?
                    background: false, // Is the background on?
                    backgroundcolor: "#fff", // Color of the background
                    text: '' // The message stored
                };

                /**
                 * Shows a message
                 * @param  {string} message  the message to show
                 * @param  {int} duration the duration to show it
                 * @return {undefined}
                 */
                $scope.showMessage = this.showMessage = function(message, duration, background) {
                    duration = duration === undefined ? 5000 : duration;
                    background = background === undefined ? false : background;
                    $scope.message.background = background;
                    $scope.message.text = message;

                    if (background && background.length == 4) {
                        $scope.message.backgroundcolor = background;
                    } else {
                        $scope.message.backgroundcolor = "#666";
                    }

                    $scope.message.show = true;
                    $timeout(function() {
                        $scope.message.show = false;
                        $scope.message.background = false;
                    }, duration);
                };

                $scope.api.popup = $scope;
            },
            link: function (scope, elem, attrs) {
                // Nothing
            }
        }
    });