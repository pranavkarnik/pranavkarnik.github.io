<!-- README for Common Components -->

# Common Components Usage

This folder contains reusable HTML components for the portfolio website.

## Files:
- **common-nav.html** - Navigation bar component
- **common-footer.html** - Footer component

## Note on Static HTML:
Since this is a static HTML site (for GitHub Pages), these components are provided as reference templates. 

## Options for including these components:

### Option 1: Manual Copy-Paste (Current)
- Copy the content from common-nav.html and common-footer.html into each page
- Update the active class on the appropriate nav link

### Option 2: JavaScript Include (Recommended for development)
Add this script to load components:
```javascript
// Load common components
fetch('common-nav.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('nav-placeholder').innerHTML = data;
  });
```

### Option 3: Build Process
- Use a static site generator (Jekyll, Hugo, 11ty)
- Use a build tool to compile components

### Option 4: Server-Side Includes (if hosting allows)
```html
<!--#include file="common-nav.html" -->
```

For GitHub Pages, Option 1 (manual) is simplest and works without any build process.
