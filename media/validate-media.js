/* Run before merging a media update: node media/validate-media.js */
const fs = require('fs');
const path = require('path');
const root = __dirname;
const repo = path.resolve(root, '..');
const itemsDir = path.join(root, 'items');
const required = ['id','title','publication_date','format','source_url','featured','summary'];
const failures = [];
const ids = new Map();
const recordsByFile = new Map();
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
    if (!['Article','Video','Podcast'].includes(item.format)) failures.push(`${file}: unsupported format ${item.format}`);
    if (typeof item.summary !== 'string' || !item.summary.trim()) failures.push(`${file}: summary must be nonempty text`);
    recordsByFile.set(file,item);
  } catch (error) { failures.push(`${file}: invalid JSON (${error.message})`); }
}

function validateRefs(label, refs) {
  const seen = new Set();
  for (const ref of refs || []) {
    if (seen.has(ref)) failures.push(`${label}: duplicate reference ${ref}`);
    seen.add(ref);
    if (!fs.existsSync(path.join(root, ref))) failures.push(`${label}: missing reference ${ref}`);
  }
}

try {
  const catalog = JSON.parse(fs.readFileSync(path.join(root,'catalog.json'),'utf8'));
  validateRefs('catalog.json', catalog.items);
  const catalogFiles = new Set((catalog.items || []).map(ref => path.basename(ref)));
  let previousDate = null;
  for (const ref of catalog.items || []) {
    const item = recordsByFile.get(path.basename(ref));
    if (!item || !validDate(item.publication_date)) continue;
    if (previousDate && item.publication_date > previousDate) failures.push(`catalog.json: not newest-first at ${ref}`);
    previousDate = item.publication_date;
  }
  for (const file of files) if (!catalogFiles.has(file)) failures.push(`catalog.json: structured item not indexed ${file}`);
  for (const ref of catalog.items || []) if (!files.includes(path.basename(ref))) failures.push(`catalog.json: non-item reference ${ref}`);
} catch (error) { failures.push(`catalog.json: ${error.message}`); }

try {
  const manifest = JSON.parse(fs.readFileSync(path.join(root,'featured.json'),'utf8'));
  validateRefs('featured.json featured_items', manifest.featured_items || []);
  const catalogSet = new Set(JSON.parse(fs.readFileSync(path.join(root,'catalog.json'),'utf8')).items || []);
  for (const ref of manifest.featured_items || []) if (!catalogSet.has(ref)) failures.push(`featured.json: item not in catalog ${ref}`);
  for (const series of manifest.series || []) for (const ref of series.items || []) if (!catalogSet.has(ref)) failures.push(`featured.json series ${series.id}: item not in catalog ${ref}`);
  for (const s of manifest.series || []) validateRefs(`featured.json series:${s.id || s.title || 'unnamed'}`, s.items || []);
} catch (error) { failures.push(`featured.json: ${error.message}`); }

for (const siteFile of ['index.html','media.html','adaptive-enterprise.html','john-marcante.html']) {
  const p = path.join(repo,siteFile);
  if (!fs.existsSync(p) || fs.statSync(p).size === 0) failures.push(`site integrity: missing/empty ${siteFile}`);
}

if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Media validation passed: ${files.length} structured item(s), unique IDs, valid dates/URLs, complete catalog indexing, manifest references and core site files.`);
