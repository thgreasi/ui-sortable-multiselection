var myapp = angular.module('sortableApp', ['ui.sortable', 'ui.sortable.multiselection']);


myapp.controller('sortableController', function ($scope, uiSortableMultiSelectionMethods) {
  var tmpList = [];
  
  for (var i = 1; i <= 6; i++){
    tmpList.push({
      text: 'Item ' + i,
      value: i
    });
  }
  
  $scope.list = tmpList;
  
  $scope.sortingLog = [];
  
  $scope.sortableOptions = {
    helper: uiSortableMultiSelectionMethods.helper,
    stop: function(e, ui) {
      uiSortableMultiSelectionMethods.stop(e, ui);

      // this callback has the changed model
      var logEntry = tmpList.map(function(i){
        return i.value;
      }).join(', ');
      $scope.sortingLog.push('Stop: ' + logEntry);
    }
  };
});