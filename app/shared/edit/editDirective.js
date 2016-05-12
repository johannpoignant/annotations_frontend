angular.module('camomileApp.directives.edit', [])
    .directive('camomileAnnotations', function ($interval, Camomile, camomileToolsConfig) {
        return {
            restrict: 'AE',
            templateUrl: camomileToolsConfig.moduleFolder + 'edit/editView.html',
            require: '^camomileBox',
            scope: {
                data: '@'
            },
            controller: function ($scope) {
                $scope.api = {};

                $scope.api.sendAnnotations = function () {
                    var i = $scope.dataCtrl.infos();
                    if (!i.layer || !i.medium) {
                        console.warn('Pas de layer ou medium sélectionné');
                        return;
                    }
                    var callback = function (err, data) {
                        if (err) {
                            console.warn('Save annotation fail');
                        } else {
                            console.info('Save annotation succeeded');
                            $scope.api.getAnnotations();
                        }
                    };

                    var sa = [];
                    for (a of $scope.dataCtrl.facto.annotations) {
                        if (a.id == 0) {
                            delete a['$$hashKey'];

                            sa.push({
                                id_medium: i.medium,
                                fragment: a.fragment,
                                data: a.fragment.name
                            });
                        }
                    }

                    if (sa.length) {
                        Camomile.createAnnotations(i.layer, sa, callback);
                    }
                };

                $scope.api.getAnnotations = function () {
                    if ($scope.dataCtrl.infos) {
                        var i = $scope.dataCtrl.infos();

                        if (i.layer && i.medium) {
                            var ans = [];
                            Camomile.getAnnotations(function (err, data) {
                                if (err) {
                                    console.warn('Error in retrieving of annotations data');
                                } else {
                                    for (obj of data) { // We push every fragment to recreate the array
                                        ans.push({fragment: obj.fragment, id: obj._id});
                                    }
                                }

                                $scope.dataCtrl.setAnnotations(ans);
                            }, {
                                'filter': {
                                    id_layer: i.layer,
                                    id_medium: i.medium
                                }
                            });
                        } else {
                            console.warn('Infos non complètes');
                        }
                    } else {
                        console.warn('Infos non dispos');
                    }
                };

                $scope.api.deleteAnnotation = function (annotation) {
                    if (annotation.id) {
                        Camomile.deleteAnnotation(annotation.id, function (err, data) {
                            if (err) {
                                console.warn('Delete failed.');
                            } else {
                                $scope.api.getAnnotations();
                            }
                        });
                    } else {
                        let t = $scope.dataCtrl.facto.annotations;
                        let p = t.indexOf(annotation);
                        if (p !== -1) {
                            t.splice(p, 1);
                        }
                    }
                };

                $scope.initWatchers = function () {
                    $scope.$watch("dataCtrl.facto.config.drawStyle", function () {
                        console.log('Draw style changed to ' + $scope.dataCtrl.facto.config.drawStyle);
                        $scope.dataCtrl.facto.annotation.fragment.drawStyle = $scope.dataCtrl.facto.config.drawStyle;
                    });
                    $scope.$watch("dataCtrl.facto.config.strokeColor", function () {
                        console.log('Stroke color changed to ' + $scope.dataCtrl.facto.config.strokeColor);
                    });
                    $scope.$watch("dataCtrl.facto.config.strokeWidth", function () {
                        console.log('Stroke width changed to ' + $scope.dataCtrl.facto.config.strokeWidth);
                    });
                }
            },
            link: function (scope, elem, attrs, controllerInstance) {
                scope.dataCtrl = controllerInstance;
                controllerInstance.apis.edit = scope.api;

                scope.initWatchers();
            }
        }
    });
