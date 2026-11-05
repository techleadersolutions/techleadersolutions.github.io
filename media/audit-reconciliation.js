/* Non-destructive audit: node media/audit-reconciliation.js
 * CSV remains historical input; structured JSON is the future source of truth.
 * Exit 1 while migration gaps exist, without modifying any repository file.
 */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
function parseCSV(s) {
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"') {
      if (quoted && s[i+1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (c === ',' && !quoted) { row.push(field); field = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && s[i+1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  if (quoted) throw new Error('Unclosed CSV quote');
  const header = rows.shift();
  return rows.map((r,i) => Object.fromEntries(header.map((h,j) => [h, r[j] || '']))).map((r,i)=>({...r,_row:i+2}));
}
const legacy = parseCSV(fs.readFileSync(path.join(root,'media_library.csv'),'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(__dirname,'catalog.json'),'utf8'));
const items = catalog.items.map(ref => JSON.parse(fs.readFileSync(path.join(__dirname,ref),'utf8')));
const normalize = u => { try { const x = new URL(u); return x.hostname.replace(/^www\./,'').toLowerCase()+x.pathname.replace(/\/$/,'')+x.search; } catch { return u.trim().toLowerCase(); } };
const byURL = new Map(items.map(x=>[normalize(x.source_url),x]));
const matches = [], missing = [], partialDates = [], invalidURLs = [], repeatedURLs = [];
const seen = new Map();
for (const row of legacy) {
  const url = normalize(row.source_url);
  if (seen.has(url)) repeatedURLs.push([seen.get(url),row._row,row.source_url]);
  else seen.set(url,row._row);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.publication_date)) partialDates.push({row:row._row,title:row.title,date:row.publication_date});
  try { if (new URL(row.source_url).protocol !== 'https:') throw Error(); }
  catch { invalidURLs.push({row:row._row,title:row.title,url:row.source_url}); }
  const item = byURL.get(url);
  if (item) matches.push({row:row._row,id:item.id,title:row.title,metadataMismatch:row.title !== item.title || row.publication_date !== item.publication_date || row.format.replace(/s$/,'').toLowerCase() !== item.format.toLowerCase()});
  else missing.push({row:row._row,title:row.title,date:row.publication_date,url:row.source_url});
}
const unmatchedStructured = items.filter(x=>!seen.has(normalize(x.source_url))).map(x=>({id:x.id,title:x.title,date:x.publication_date}));
const formats = legacy.reduce((a,r)=>(a[r.format]=(a[r.format]||0)+1,a),{});
const report = {legacyRows:legacy.length,structuredRecords:items.length,matchedByCanonicalURL:matches.length,unconvertedLegacy:missing.length,structuredNotInLegacy:unmatchedStructured,formats,partialDates,invalidURLs,repeatedURLs,metadataMismatches:matches.filter(x=>x.metadataMismatch),unconvertedSample:missing.slice(0,12)};
console.log(JSON.stringify(report,null,2));
if (missing.length || partialDates.length || invalidURLs.length || repeatedURLs.length || report.metadataMismatches.length) process.exitCode=1;
