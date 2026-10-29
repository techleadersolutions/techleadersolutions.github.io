# Architecture

`media/items/*.json` is the source for incremental media records.

`media/featured.json` controls promotional ordering and series groupings.

`media/featured-media.js` reads the manifest and records and renders only into `#featured-media`.

`media/featured-media.css` scopes presentation to the featured-media classes.

`media/validate-media.js` and the GitHub Actions workflow validate record structure and manifest references.

The legacy archive remains the fallback and is not migrated in one large change.
