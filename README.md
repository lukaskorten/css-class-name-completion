# CSS Class Name Completion

CSS Classname Completion is a VS Code extension that provides autocomplete suggestions for CSS class names in HTML files. The class names are extracted from a stylesheet downloaded from a specified URL.

## Features

- Autocomplete for CSS class names in HTML files.
- Supports external stylesheets defined via a configurable URL.

## Usage

1. Set the `cssClassNames.remote` property in your VS Code settings to specify an array of stylesheet URLs.  
2. Open an HTML file in VS Code.  
3. Begin typing in a class="" attribute or press Ctrl+Space (Windows/Linux) or Cmd+Space (Mac) to activate autocomplete.

Example:

```json
{
  "cssClassNames.remote": [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
  ]
}
```
