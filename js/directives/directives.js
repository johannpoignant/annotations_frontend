angular.module('camomileApp.directives', [])
.directive('listView', ['$sce', 'Camomile', function(Camomile, $sce) {
  return {
    templateUrl: 'js/directives/listView.html',
    scope: {
      video: '='
    }
  };
}])
.directive('buttonBar', function () {
  return {
    templateUrl: 'js/directives/buttonBar.html',
    scope: {
      buttons: '='
    }
  }
})
/*
[
  {
    description: 'zdqdzq',
    valy: 2
  },
  [
    {
      roll: 'zdqdzq',
      truc: 6
    }
  ]
]
*/
// .directive('jsonListing', function () {
//   return {
//     templateUrl: 'js/directives/jsonListing.html',
//     scope: {
//       data: '='
//     }
//   }
// })
.directive('arrayListing', function () {
  return {
    templateUrl: 'js/directives/arrayListing.html',
    scope: {
      data: '='
    }
  }
})
.controller('ArrayListingCtrl', function ($scope) {
  $scope.isArrayA = function (d) {
    return d instanceof Array;
  };
})
.directive('objectListing', function () {
  return {
    template: '<span ng-repeat="(k,v) in data"><b>{{k}}</b>: {{v}}<br></span>',
    scope: {
      data: '='
    }
  }
});
