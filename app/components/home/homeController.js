angular.module('camomileApp.controllers.browse', [
    "ngSanitize"
])
    .controller('BrowseCtrl', ['$scope', '$sce', 'Camomile', '$timeout', 'cappdata',
        function ($scope, $sce, Camomile, $timeout, cappdata) {
            $scope.api = {};
            $scope.infos = {
                corpus: undefined,
                medium: undefined,
                layer: undefined
            };

            var refresh = function () {
                cappdata.clean(); // On clean la facto, pour éviter les restes d'autres composants
                cappdata.get('corpora'); // On update les corpus dispos
                cappdata.registerObserver(updateData); // On register le composant
            };

            $scope.$parent.onLogin(refresh);

            var updateData = function () { // Callback de refresh
                $timeout(function () {
                    $scope.cappdata = cappdata;
                    $scope.api.loader.finished();
                    //$scope.api.popup.showMessage("Chargement terminé.", 3000, "#07f");
                }, 0);
            };

            refresh();

            $scope.updateMedia = function () { // Lorsque l'utilisateur sélectionne un corpus, on update les layers & mt
                if ($scope.corpus) {
                    $scope.api.loader.loading();
                    $scope.infos.corpus = $scope.corpus;
                    cappdata.get('layers', $scope.corpus);
                    cappdata.get('media', $scope.corpus);
                }
            };

            $scope.updateMedium = function () { // Lorsqu'il choisi un object ou un layer, on doit refresh les media
                cappdata.resetMedium();

                if ($scope.medium) {
                    $scope.infos.medium = $scope.medium;
                    cappdata.get('medium', $scope.medium);
                }

                if ($scope.layer) {
                    $scope.infos.layer = $scope.layer;
                }
            };
        }])
    .filter('filterByExt', function() {
        return function(input, ext, filtering) {
            if (!ext || !filtering) { // If extension is null or undefined, we return the input
                return input;
            }

            ext = ext.toLowerCase(); // Else, we transform MP4 in mp4 (example)
            var patt = new RegExp('.+\.' + ext); // We build the regexp
            var out = []; // Array that will contain the output
            for (var i = 0; i < input.length; i++) { // For each element in the input
                if (patt.test(input[i].name.toLowerCase())) { // We test it against the pattern
                    out.push(input[i]); // If it matches, we add it to the output array
                }
            }
            return out; // And we return this array
        };
    });
