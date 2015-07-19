ui-sortable-multiselection
==========================
[![npm](https://img.shields.io/npm/dm/angular-ui-sortable-multiselection.svg)](https://www.npmjs.com/package/angular-ui-sortable-multiselection)  

Provide multiple element sorting in [UI-Sortable](https://github.com/angular-ui/ui-sortable)

[Simple Demo pen](http://codepen.io/thgreasi/pen/mJAcL)

[Connected Lists Demo pen](http://codepen.io/thgreasi/pen/FJrxo)

## ui.item.sortableMultiSelect API documentation

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
