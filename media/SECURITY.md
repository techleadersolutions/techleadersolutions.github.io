# Safety boundaries

- Media text is HTML-escaped before rendering.
- External links use `rel="noopener noreferrer"`.
- The renderer only runs when the explicit `#featured-media` mount exists.
- On loading failure, the featured block hides itself instead of interfering with the legacy archive.
- No credentials, tokens or secrets are stored in media records.
