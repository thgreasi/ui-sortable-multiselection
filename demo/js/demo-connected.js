var myapp = angular.module('sortableApp', ['ui.sortable', 'ui.sortable.multiselection']);


myapp.controller('sortableController', function ($scope, uiSortableMultiSelectionMethods) {
  function makeList (letter) {
    var tmpList = [];

    for (var i = 1; i <= 6; i++){
      tmpList.push({
        text: 'Item ' + i + letter,
        value: i + letter
      });
    }
    return tmpList;
  }
  
  $scope.list1 = makeList('a');
  $scope.list2 = makeList('b');

  $scope.rawScreens = [
    $scope.list1,
    $scope.list2
  ];
  
  
  $scope.sortingLog = [];
  
  $scope.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
    connectWith: '.items-container'
  });
  
  $scope.logModels = function () {
    $scope.sortingLog = [];
    for (var i = 0; i < $scope.rawScreens.length; i++) {
      var logEntry = $scope.rawScreens[i].map(function (x) {
        return x.text;
      }).join(', ');
      logEntry = 'container ' + (i+1) + ': ' + logEntry;
      $scope.sortingLog.push(logEntry);
    }
  };
});

myapp.controller('dummyController', function ($scope) {
  // this is required since ui-sortable v0.12.x is not creating a new scope
});