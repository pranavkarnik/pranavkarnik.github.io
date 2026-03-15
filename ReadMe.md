<!-- README for Portfolio Data Rendering -->

# Portfolio Content Architecture

This portfolio now uses page-level JSON data files instead of hardcoded page content.

## Structure
- **data/common.json** - Shared navigation, footer, and repeated profile data
- **data/index.json** - Home page content
- **data/experience.json** - Work experience content
- **data/certifications.json** - Certifications and awards content
- **data/languages.json** - Languages and technical skills content
- **data/opportunities.json** - Opportunity and location preference content
- **js/script.js** - Fetches the JSON file and renders each page dynamically based on the current page key
- **index.html** and **pages/*.html** - Lightweight shell pages with placeholders only

## How it works
- Each page shell keeps a plain `<body>` and includes its own page-specific JavaScript file.
- `js/script.js` contains shared rendering logic.
- The page-specific scripts like `js/index.js` and `js/experience.js` fetch **data/common.json** and the matching page JSON file.
- The script renders:
  - navigation
  - footer
  - page-specific sections for home, experience, certifications, languages, and opportunities

## Updating content
- Edit the matching file in **data/** when you want to change text, cards, skills, experience, awards, or opportunity details.
- Update **data/common.json** when you want to change shared profile data, navigation, or footer content.
- Avoid editing rendered HTML directly in the page shells unless you are changing structure.
- If you add a new page, add its content to the JSON file and update the renderer in **js/script.js**.

## Local development
Because the site now fetches JSON, it should be served over HTTP when testing locally.

### Simple local server options
```bash
python3 -m http.server 8000
```

Then open:
```text
http://localhost:8000
```

## GitHub Pages compatibility
This approach works on GitHub Pages because the JSON file is served as a static asset.
