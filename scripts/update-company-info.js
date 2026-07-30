// ==============================
// Update company info across all files
// ==============================
const fs = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname, '..');

// --- Step 1: Update data/company.json ---
const companyData = {
  companyName: 'DCR Sicily Cars s.r.l.s',
  taxId: '06286240871',
  vatNumber: '06286240871',
  foundedYear: 2026,
  soldArchiveDays: 2,
  address: 'Via San Giuseppe La Rena, 94, 95121 Catania CT',
  phone: '+39 095 123 4567',
  email: 'info@dcrsicilycars.it'
};

fs.writeFileSync(
  path.join(BASE, 'data', 'company.json'),
  JSON.stringify(companyData, null, 2) + '\n'
);
console.log('✓ data/company.json updated');

// --- Step 2: Update locale JSON files ---
function updateLocale(filePath, updates) {
  let content = fs.readFileSync(filePath, 'utf8');
  let obj = JSON.parse(content);
  for (const [key, value] of Object.entries(updates)) {
    const parts = key.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  }
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n');
  console.log('  ✓ ' + path.relative(BASE, filePath));
}

updateLocale(path.join(BASE, 'locales', 'it.json'), {
  'site.title': 'DCR Sicily Cars s.r.l.s — Concessionaria Auto Premium',
  'site.description': 'DCR Sicily Cars s.r.l.s — concessionaria auto premium a Catania. BMW, Mercedes, Audi, Tesla e molte altre marche. Vendita, permuta e spedizione in tutta Europa.',
  'footer.rights': '© 2026 DCR Sicily Cars s.r.l.s — P.IVA e C.F. 06286240871 — Tutti i diritti riservati.'
});
updateLocale(path.join(BASE, 'locales', 'en.json'), {
  'site.title': 'DCR Sicily Cars s.r.l.s — Premium Car Dealership',
  'site.description': 'DCR Sicily Cars s.r.l.s — premium car dealership in Catania. BMW, Mercedes, Audi, Tesla and more. Sales, trade-in and shipping across Europe.',
  'footer.rights': '© 2026 DCR Sicily Cars s.r.l.s — VAT and Tax ID 06286240871 — All rights reserved.'
});

// --- Step 3: Define replacement pairs ---
const replacements = [
  { old: '"title":"DCR Sicily Cars — Concessionaria Auto Premium"', new: '"title":"DCR Sicily Cars s.r.l.s — Concessionaria Auto Premium"' },
  { old: '"description":"Concessionaria auto premium a Catania.', new: '"description":"DCR Sicily Cars s.r.l.s — concessionaria auto premium a Catania.' },
  { old: '"rights":"© 2026 DCR Sicily Cars. Tutti i diritti riservati."', new: '"rights":"© 2026 DCR Sicily Cars s.r.l.s — P.IVA e C.F. 06286240871 — Tutti i diritti riservati."' },
  { old: 'Benvenuti da DCR Sicily Cars', new: 'Benvenuti da DCR Sicily Cars s.r.l.s' },
  { old: '"intro_p1":"DCR Sicily Cars nasce', new: '"intro_p1":"DCR Sicily Cars s.r.l.s nasce' },
  { old: '"title":"DCR Sicily Cars — Premium Car Dealership"', new: '"title":"DCR Sicily Cars s.r.l.s — Premium Car Dealership"' },
  { old: '"description":"Premium car dealership in Catania.', new: '"description":"DCR Sicily Cars s.r.l.s — premium car dealership in Catania.' },
  { old: '"rights":"© 2026 DCR Sicily Cars. All rights reserved."', new: '"rights":"© 2026 DCR Sicily Cars s.r.l.s — VAT and Tax ID 06286240871 — All rights reserved."' },
  { old: '"intro_p1":"DCR Sicily Cars was born', new: '"intro_p1":"DCR Sicily Cars s.r.l.s was born' },
  { old: 'Welcome to DCR Sicily Cars', new: 'Welcome to DCR Sicily Cars s.r.l.s' },
];

const metaReplacements = [
  { old: 'content="DCR Sicily Cars — Concessionaria Auto Premium"', new: 'content="DCR Sicily Cars s.r.l.s — Concessionaria Auto Premium"' },
  { old: 'content="DCR Sicily Cars — Premium Car Dealership"', new: 'content="DCR Sicily Cars s.r.l.s — Premium Car Dealership"' },
  { old: 'content="DCR Sicily Cars — Chi Siamo"', new: 'content="DCR Sicily Cars s.r.l.s — Chi Siamo"' },
  { old: 'content="DCR Sicily Cars — Contatti"', new: 'content="DCR Sicily Cars s.r.l.s — Contatti"' },
  { old: 'content="DCR Sicily Cars — Veicoli"', new: 'content="DCR Sicily Cars s.r.l.s — Veicoli"' },
  { old: 'content="DCR Sicily Cars — Dettaglio Veicolo"', new: 'content="DCR Sicily Cars s.r.l.s — Dettaglio Veicolo"' },
  { old: '>DCR Sicily Cars - Cookie Policy<', new: '>DCR Sicily Cars s.r.l.s - Cookie Policy<' },
  { old: '>DCR Sicily Cars - Privacy Policy<', new: '>DCR Sicily Cars s.r.l.s - Privacy Policy<' },
  { old: '>DCR Sicily Cars - Chi Siamo<', new: '>DCR Sicily Cars s.r.l.s - Chi Siamo<' },
  { old: '>DCR Sicily Cars - Contatti<', new: '>DCR Sicily Cars s.r.l.s - Contatti<' },
  { old: '>DCR Sicily Cars - Veicoli<', new: '>DCR Sicily Cars s.r.l.s - Veicoli<' },
  { old: '>DCR Sicily Cars - Dettaglio Veicolo<', new: '>DCR Sicily Cars s.r.l.s - Dettaglio Veicolo<' },
  { old: '>DCR Sicily Cars - Admin<', new: '>DCR Sicily Cars s.r.l.s - Admin<' },
  { old: '>DCR Sicily Cars - Accesso Admin<', new: '>DCR Sicily Cars s.r.l.s - Accesso Admin<' },
  { old: '>404 - DCR Sicily Cars<', new: '>404 - DCR Sicily Cars s.r.l.s<' },
  { old: 'name="description" content="DCR Sicily Cars — Concessionaria auto premium', new: 'name="description" content="DCR Sicily Cars s.r.l.s — Concessionaria auto premium' },
  { old: 'name="description" content="DCR Sicily Cars — Premium car dealership', new: 'name="description" content="DCR Sicily Cars s.r.l.s — Premium car dealership' },
  { old: 'property="og:title" content="DCR Sicily Cars', new: 'property="og:title" content="DCR Sicily Cars s.r.l.s' },
  { old: 'name="twitter:title" content="DCR Sicily Cars', new: 'name="twitter:title" content="DCR Sicily Cars s.r.l.s' },
  { old: '"name":"DCR Sicily Cars"', new: '"name":"DCR Sicily Cars s.r.l.s"' },
  { old: '"description":"Concessionaria auto premium a Catania.', new: '"description":"DCR Sicily Cars s.r.l.s — concessionaria auto premium a Catania.' },
  { old: 'alt="DCR Sicily Cars"', new: 'alt="DCR Sicily Cars s.r.l.s"' },
];

const files = [
  'js/inline.js', 'js/main.js',
  'index.html',
  'pages/about.html', 'pages/vehicles.html', 'pages/contact.html',
  'pages/privacy.html', 'pages/cookies.html', 'pages/vehicle-detail.html',
  'pages/404.html', 'admin/index.html', 'admin/login.html'
];

files.forEach(relPath => {
  const fullPath = path.join(BASE, relPath);
  if (!fs.existsSync(fullPath)) {
    console.log('  ✗ ' + relPath + ' not found, skipping');
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  replacements.forEach(({ old, new: newStr }) => {
    if (content.includes(old)) {
      content = content.replaceAll(old, newStr);
      changed = true;
    }
  });

  if (relPath.endsWith('.html')) {
    metaReplacements.forEach(({ old, new: newStr }) => {
      if (content.includes(old)) {
        content = content.replaceAll(old, newStr);
        changed = true;
      }
    });
  }

  if (changed) {
    fs.writeFileSync(fullPath, content);
    console.log('  ✓ ' + relPath);
  } else {
    console.log('  - ' + relPath + ' (no changes)');
  }
});

// --- Update COMPANY_DATA ---
const companyFields = ',companyName:"DCR Sicily Cars s.r.l.s",taxId:"06286240871",vatNumber:"06286240871"';
const htmlFilesWithCompanyData = ['index.html', 'pages/about.html', 'pages/vehicles.html'];

htmlFilesWithCompanyData.forEach(relPath => {
  const fullPath = path.join(BASE, relPath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  const companyRegex = /(var COMPANY_DATA = \{)([^}]+)(\})/;
  if (companyRegex.test(content)) {
    content = content.replace(companyRegex, function(match, prefix, fields, suffix) {
      if (fields.includes('companyName')) return match;
      return prefix + fields + companyFields + suffix;
    });
    fs.writeFileSync(fullPath, content);
    console.log('  ✓ ' + relPath + ' (COMPANY_DATA updated)');
  }
});

// --- Update JSON-LD in index.html ---
const indexHtml = path.join(BASE, 'index.html');
let idxContent = fs.readFileSync(indexHtml, 'utf8');

if (idxContent.includes('"@type":"Organization"') && !idxContent.includes('"legalName"')) {
  idxContent = idxContent.replace(
    /("@type":"Organization","name":"DCR Sicily Cars s\.r\.l\.s")/,
    '$1,"legalName":"DCR Sicily Cars s.r.l.s","vatID":"06286240871","taxID":"06286240871"'
  );
  fs.writeFileSync(indexHtml, idxContent);
  console.log('✓ index.html JSON-LD updated');
}

// --- Add legal notes to privacy/cookies ---
var legalNoteIT = '<!-- LEGAL INFO --><div class="legal-note" style="max-width:760px;margin:2rem auto;padding:0 20px;font-size:0.85em;color:#666;text-align:center;"><p><strong>DCR Sicily Cars s.r.l.s</strong> — P.IVA e Codice Fiscale: 06286240871</p><p>Via San Giuseppe La Rena, 94, 95121 Catania CT — Email: <a href="mailto:info@dcrsicilycars.it">info@dcrsicilycars.it</a> — Tel: <a href="tel:+390951234567">+39 095 123 4567</a></p></div>';

['pages/privacy.html', 'pages/cookies.html'].forEach(function(relPath) {
  var fullPath = path.join(BASE, relPath);
  var content = fs.readFileSync(fullPath, 'utf8');
  if (!content.includes('LEGAL INFO')) {
    content = content.replace(/(<footer)/, legalNoteIT + '\n$1');
    fs.writeFileSync(fullPath, content);
    console.log('✓ ' + relPath + ' (legal note added)');
  } else {
    console.log('- ' + relPath + ' (already has legal note)');
  }
});

console.log('\n✅ All updates complete!');
