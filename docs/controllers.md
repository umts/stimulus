# Controllers

Library controllers will need the respective dependencies installed (not bundled with this library).

## tom-select

Initialize tom-selects automatically.

```haml
= f.select :my_select, ..., data: { controller: 'tom-select' }

-# multi selects are automatically detected and add a clear button
= f.select :my_select, ..., multiple: true, data: { controller: 'tom-select' }

-# add search bars
= f.select :my_select, ..., data: { controller: 'tom-select', search: true }

-# limit rendered options (only when search is enabled)
= f.select :my_select, ..., data: { controller: 'tom-select', search: true, truncate: true }
```
