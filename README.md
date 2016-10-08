ui-sortable-multiselection
==========================
[![npm](https://img.shields.io/npm/dm/angular-ui-sortable-multiselection.svg)](https://www.npmjs.com/package/angular-ui-sortable-multiselection)
[![debugInfoEnabled(false) Ready Badge](https://rawgit.com/thgreasi/ng-debugInfoDisabled-badges/master/badge1.svg)](https://docs.angularjs.org/guide/production#disabling-debug-data)

Provide multiple element sorting in [UI-Sortable](https://github.com/angular-ui/ui-sortable)

[Simple Demo pen with selection count](http://codepen.io/vanatallin/pen/zqXzmJ)

[Simple Demo pen](http://codepen.io/thgreasi/pen/mJAcL)

[Connected Lists Demo pen](http://codepen.io/thgreasi/pen/FJrxo)

[Handle Demo pen](http://codepen.io/feus4177/pen/zvWvpY)

[MultiSelect on Click Demo pen](http://codepen.io/thgreasi/pen/KgoPmY)

## ui.item.sortableMultiSelect API documentation

### Allow multi-selection on click
For better touch device support, use the option 'multiSelectOnClick'. This will allow click/tap to select and deselect individual items instead of requiring a modifier key to be held down.

Example usage:

```javascript
// set the sortable options
$scope.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
  'multiSelectOnClick': true,
  start: function() {
    // ...
  },
  stop: function() {
    // ...
  }
});
```

```html
<ul class="sortable-list" ui-sortable="sortableOptions" ng-model="items">
  <li ng-repeat="item in items" class="sortable-item" ui-sortable-selectable>
    <div class="sortable-item__inner">{item.name}</div>
  </li>
</ul>
```

The `ui` argument of the available callbacks gets enriched with some extra properties as specified below:


### selectedIndexes
Type: [Array](http://api.jquery.com/Types/#Array)<[Integer](http://api.jquery.com/Types/#Integer)>  
Holds the original indexes of the items dragged.

### selectedModels
Type: [Array](http://api.jquery.com/Types/#Array)<[Object](http://api.jquery.com/Types/#Object)> /`undefined`  
Holds the JavaScript objects that is used as the model of the dragged items, as specified by the ng-repeat of the [`source`](#source) ui-sortable element and the [`ui.item.sortableMultiSelect.selectedIndexes`](#selectedindexes) property.



### indexes
Type: [Array](http://api.jquery.com/Types/#Array)<[Integer](http://api.jquery.com/Types/#Integer)>  
Holds the original indexes of the sibling items dragged.

### models
Type: [Array](http://api.jquery.com/Types/#Array)<[Object](http://api.jquery.com/Types/#Object)>  
Holds the JavaScript objects that is used as the model of the siblings of the dragged item, as specified by the ng-repeat of the [`source`](#source) ui-sortable element and the [`ui.item.sortableMultiSelect.indexes`](#indexes) property.

### moved
Type: [Object](http://api.jquery.com/Types/#Object) /`undefined`  
Holds the models of the dragged sibling items only when a sorting happens between two connected ui-sortable elements.

### sourceElement
Type: [jQuery](http://api.jquery.com/Types/#jQuery)  
Holds the ui-sortable element that the dragged item originated from.
