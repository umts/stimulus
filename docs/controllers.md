# Controllers

Library controllers will need the respective dependencies installed (not bundled with this library).

## clipboard

Copies content to the system clipboard. Accepts an optional indicator target that controls a status icon
(requires fontawesome).

```haml
.input-group{ 'data-controller': 'clipboard' }
  .form-control{ 'data-clipboard-target': content }
  = button_tag type: :button,
               class: 'btn btn-neutral',
               'data-action': 'click->clipboard#copy blur->clipboard#reset mouseleave->clipboard#reset' do
    %i{ 'data-clipboard-target': 'indicator' }
    Copy
```

## popover

Initializes bootstrap popovers automatically. Pass options via bootstrap data attribute normally.

```haml
= button_tag 'Popover', type: :button, data: { controller: 'popover', 'bs-title': 'Title', 'bs-content': 'content' }
```

## remove

Removes content from the DOM. Will bubble a custom event (`remove:removed`) on the parent element if present when
triggered.

```haml
%div{ 'data-controller': 'remove' }
  This will be removed when you click
  = button_tag 'Remove', type: :button, 'data-action': 'remove#remove'
```

## template

Creates and appends content from a template. Will do a global substitution of the substring `INDEX` with `Date.now()`
before appending (useful for rails nested attribute indices).

```haml
%div{ 'data-controller': 'template' }
  %template{ 'data-template-target': 'source' }
    %li Item INDEX
  = button_tag 'Add item', type: :button, 'data-action': 'template#append'
  %ul{ 'data-template-target': 'append' }
```

## tom-select

Initializes tom-selects automatically. Multi-selects will have a master clear button added automatically.

```haml
= f.select :my_select, ..., data: { controller: 'tom-select' }

= f.select :my_select, ..., multiple: true, data: { controller: 'tom-select' }
```

### Searching

To add a search bar, set `data-tom-select-search`.

```haml
= f.select :my_select, ..., data: { controller: 'tom-select', 'tom-select-search': true }
```

For long lists of options that cause performance issues on render, set `data-tom-select-truncate` as well.

```haml
= f.select :my_select, ..., data: { controller: 'tom-select', 'tom-select-search': true, 'tom-select-truncate': true }
```

### Remote

To load options remotely, set `data-tom-select-remote` with a remote path (will be preloaded).

```haml
= f.select :my_select, ..., data: { controller: 'tom-select', 'tom-select-remote': my_options_path }
```

Your controller action will be responsible for searching (via a `params[:q]` query parameter), limiting the returned
options and should include a blank option if necessary.

Your remote path should respond with a JSON array in the following format.

```json
[
  { "text": "Option 1", "value": "1" },
  { "text": "Option 2", "value": "2" }
]
```

The select will render the returned options exactly. Therefore your controller will be responsible for...

- searching (via a `params[:q]` query parameter)
- limiting rendered options
- including a blank option if necessary

```ruby
class MyController < ApplicationController
  def options
    records = MyModel.search(params[:q]).limit(50)
    blank_option = { text: '', value: '' }
    render json: ([] + records.map { |record| { text: record.name, value: record.id } }).to_json
  end
end
```
