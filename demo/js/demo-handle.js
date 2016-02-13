var myapp = angular.module('sortableApp', ['ui.sortable', 'ui.sortable.multiselection'], function ($compileProvider) {
  if (typeof $compileProvider.debugInfoEnabled === 'function') {
    $compileProvider.debugInfoEnabled(false);
  }
});


myapp.controller('sortableController', function ($scope, uiSortableMultiSelectionMethods) {
  var tmpList = [];
  
  for (var i = 1; i <= 6; i++){
    tmpList.push({
      text: 'Row ' + i,
      value: i
    });
  }
  
  $scope.list = tmpList;
  
  $scope.sortingLog = [];
  
  $scope.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
    handle: '.cursor-grab',
    stop: function(e, ui) {
      // this callback has the changed model
      var logEntry = tmpList.map(function(i){
        return i.value;
      }).join(', ');
      $scope.sortingLog.push('Stop: ' + logEntry);
    }
  });
});