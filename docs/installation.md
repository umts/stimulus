# Installation

This library is distributed as an npm package.

```json
// package.json

{
  "dependencies": {
    "@umts/stimulus": "*"
  }
}
```

Import controllers individually and register them as a part of your stimulus application setup.

```js
// app/javascript/controllers/application.js

import { Application } from "@hotwired/stimulus";
import SomeController from "@umts/stimulus/some-controller";

const application = Application.start();
application.register("some", SomeController);
```
