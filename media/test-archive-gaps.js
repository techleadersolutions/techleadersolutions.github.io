/* Historical evidence handling: node media/test-archive-gaps.js */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'tls-archive-gaps-'));
const unknownRef = 'items/undated-go-lean-and-fail-fast.json';
const monthRef = 'items/2020-07-right-the-ship-uncertainty.json';
const httpRef = 'items/undated-making-change-vanguard-adaptation.json';
function run() {
  return spawnSync(process.execPath, [path.join(temp, 'media/validate-media.js')], { encoding: 'utf8' });
}
function rejects(ref, mutate, message) {
  const file = path.join(temp, 'media', ref);
  const original = fs.readFileSync(file, 'utf8');
  try {
    const item = JSON.parse(original); mutate(item);
    fs.writeFileSync(file, JSON.stringify(item));
    assert.notEqual(run().status, 0, message);
  } finally { fs.writeFileSync(file, original); }
}
(async () => {
  try {
    fs.cpSync(path.join(root, 'media'), path.join(temp, 'media'), { recursive: true });
    for (const file of ['media_library.csv','index.html','media.html','adaptive-enterprise.html','john-marcante.html']) {
      fs.copyFileSync(path.join(root, file), path.join(temp, file));
    }
    assert.equal(run().status, 0, 'documented archive must validate');
    rejects(monthRef, x => x.publication_date = '2020-13', 'invalid month');
    rejects(monthRef, x => delete x.provenance.date_evidence, 'undocumented month');
    rejects(unknownRef, x => delete x.publication_date_precision, 'unmarked unknown date');
    rejects(unknownRef, x => x.publication_date = '', 'empty string instead of null');
    rejects(unknownRef, x => x.featured = true, 'unknown date featured');
    rejects(httpRef, x => delete x.source_url_status, 'unmarked HTTP URL');
    rejects(httpRef, x => x.source_url = 'http://example.com/unverified', 'new HTTP URL');
    rejects(monthRef, x => x.publication_date = '2020-02-30', 'invalid calendar day');
    rejects(monthRef, x => x.topic = 'Unmapped topic', 'unknown public topic');
    const catalogPath = path.join(temp, 'media/catalog.json');
    const catalog = JSON.parse(fs.readFileSync(catalogPath));
    catalog.items = [unknownRef, ...catalog.items.filter(x => x !== unknownRef)];
    fs.writeFileSync(catalogPath, JSON.stringify(catalog));
    assert.notEqual(run().status, 0, 'unknown dates cannot precede known dates');
    const context = { window: {}, fetch: async url => ({ ok: true, json: async () => JSON.parse(fs.readFileSync(path.join(root, url))) }) };
    vm.runInNewContext(fs.readFileSync(path.join(root, 'media/media-data.js'), 'utf8'), context);
    const items = await context.window.TLSMedia.loadCatalog();
    const expectedCount = JSON.parse(fs.readFileSync(path.join(root, 'media/catalog.json'))).items.length;
    assert.equal(items.length, expectedCount);
    assert.equal(new Set(items.map(x => x.source_url)).size, expectedCount);
    const unknownCount = items.filter(x => x.publication_date === null).length;
    assert(unknownCount >= 2);
    assert(items.slice(-unknownCount).every(x => x.publication_date === null));
    assert(items.some(x => x.publication_date === '2020-07'));
    assert.equal(context.window.TLSMedia.filter(items, {search: 'Go Lean and Fail Fast'}).length, 1);
    const archive = fs.readFileSync(path.join(root, 'index.html'), 'utf8').split('<div id="archive-grid">')[1];
    const cards = archive.match(/<article class="archive-card"[^>]*>.*?<\/article>/gs);
    for (const topic of ['Board governance','Leadership & culture','Strategy & transformation']) {
      const expected = cards.filter(card => card.match(/data-topic="([^"]+)"/)[1].replaceAll('&amp;', '&') === topic)
        .map(card => card.match(/href="([^"]+)"/)[1]).sort();
      const actual = Array.from(context.window.TLSMedia.filter(items, {topic}), item => item.source_url).sort();
      assert.deepEqual(actual, expected, `topic filter parity: ${topic}`);
    }
    const featured = await context.window.TLSMedia.loadFeatured();
    assert(featured.featured.every(x => /^\d{4}-\d{2}-\d{2}$/.test(x.publication_date)));
    console.log(`Archive evidence tests passed: valid gaps, invalid dates, HTTP restrictions, ordering, ${items.length}-record loading, search and featured records.`);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
})().catch(error => { console.error(error); process.exitCode = 1; });
