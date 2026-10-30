/* Run before merging a media update: node media/validate-media.js */
const fs = require('fs');
const path = require('path');
const root = __dirname;
const repo = path.resolve(root, '..');
const itemsDir = path.join(root, 'items');
const required = ['id','title','publication_date','format','source_url','featured','summary'];
const failures = [];
const ids = new Map();
const files = fs.readdirSync(itemsDir).filter(f => f.endsWith('.json'));

function validDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.valueOf()) && d.toISOString().slice(0,10) === s;
}
function validUrl(s) {
  try { const u = new URL(s); return u.protocol === 'https:' && !!u.hostname; }
  catch { return false; }
}

for (const file of files) {
  try {
    const item = JSON.parse(fs.readFileSync(path.join(itemsDir,file),'utf8'));
    for (const field of required) if (item[field] === undefined || item[field] === '') failures.push(`${file}: missing ${field}`);
    if (item.id) {
      if (ids.has(item.id)) failures.push(`${file}: duplicate id ${item.id} (also ${ids.get(item.id)})`);
      else ids.set(item.id,file);
    }
    if (!validDate(item.publication_date)) failures.push(`${file}: invalid publication_date`);
    if (!validUrl(item.source_url)) failures.push(`${file}: source_url must be a valid https URL`);
    if (typeof item.featured !== 'boolean') failures.push(`${file}: featured must be boolean`);
  } catch (error) { failures.push(`${file}: invalid JSON (${error.message})`); }
}

try {
  const manifest = JSON.parse(fs.readFileSync(path.join(root,'featured.json'),'utf8'));
  const refs = [...(manifest.featured_items || []), ...(manifest.series || []).flatMap(s => s.items || [])];
  const seenRefs = new Set();
  for (const ref of refs) {
    if (seenRefs.has(ref)) failures.push(`featured.json: duplicate reference ${ref}`);
    seenRefs.add(ref);
    if (!fs.existsSync(path.join(root,ref))) failures.push(`featured.json: missing reference ${ref}`);
  }
} catch (error) { failures.push(`featured.json: ${error.message}`); }

for (const siteFile of ['index.html','media.html','adaptive-enterprise.html','john-marcante.html']) {
  const p = path.join(repo,siteFile);
  if (!fs.existsSync(p) || fs.statSync(p).size === 0) failures.push(`site integrity: missing/empty ${siteFile}`);
}

if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Media validation passed: ${files.length} structured item(s), unique IDs, valid dates/URLs, manifest references and core site files.`);
