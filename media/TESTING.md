# Testing checklist

Before merging:

- Run `node media/validate-media.js`.
- Confirm every featured manifest reference resolves to an item JSON file.
- Confirm source URLs use HTTPS and open the intended publication.
- Confirm the branch preview renders four Adaptive Enterprise cards.
- Confirm `main` has not changed during branch development.
- Review the pull request diff before any merge.

After a future production integration, verify the existing archive remains visible even if featured media requests fail.
