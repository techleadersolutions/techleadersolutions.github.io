/* Run with Node before merging a media update: node media/validate-media.js
   Validates required fields and featured manifest references without changing files. */
const fs = require('fs');
const path = require('path');
const root = __dirname;
const itemsDir = path.join(root, 'items');
const required = ['id', 'title', 'publication_date', 'format', 'source_url', 'featured', 'summary'];
let failures = [];

for (const file of fs.readdirSync(itemsDir).filter(f => f.endsWith('.json'))) {
  try {
    const item = JSON.parse(fs.readFileSync(path.join(itemsDir, file), 'utf8'));
    for (const field of required) if (item[field] === undefined || item[field] === '') failures.push(`${file}: missing ${field}`);
    if (!/^https:\/\//.test(item.source_url || '')) failures.push(`${file}: source_url must use https`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.publication_date || '')) failures.push(`${file}: invalid publication_date`);
  } catch (error) { failures.push(`${file}: invalid JSON (${error.message})`); }
}

try {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'featured.json'), 'utf8'));
  const refs = [...(manifest.featured_items || []), ...(manifest.series || []).flatMap(s => s.items || [])];
  for (const ref of refs) if (!fs.existsSync(path.join(root, ref))) failures.push(`featured.json: missing reference ${ref}`);
} catch (error) { failures.push(`featured.json: ${error.message}`); }

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Media validation passed.');
