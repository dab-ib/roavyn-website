const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');
const pages = ['support', 'app-datenschutz', 'konto-loeschen'];

test('public app pages contain their content and work without login or scripts', () => {
  const headings = ['Roavyn-Support', 'Datenschutzerklärung der Roavyn-App', 'Roavyn-Konto und Daten löschen'];
  for (const [i, page] of pages.entries()) {
    const html = read(`${page}/index.html`);
    assert.ok(html.includes(`<h1>${headings[i]}</h1>`));
    assert.ok(html.includes('mailto:info@roavyn.de'));
    assert.doesNotMatch(html, /<script|<iframe|<form/i);
    for (const [, href] of html.matchAll(/href="(\/[^"#]*)"/g)) {
      const file = href.endsWith('/') ? `${href}index.html` : href;
      assert.ok(existsSync(path.join(root, file)), `Missing link: ${href}`);
    }
    for (const target of pages) assert.ok(html.includes(`href="/${target}/"`));
    assert.ok(read('sitemap.xml').includes(`https://roavyn.de/${page}/`));
  }
});

test('website visitors can find all app pages without replacing the website policy', () => {
  for (const file of ['index.html', 'impressum.html', 'datenschutz.html']) {
    const footer = read(file).split('<footer')[1];
    for (const page of pages) assert.ok(footer.includes(`href="/${page}/"`));
  }
  assert.ok(read('datenschutz.html').includes('CleverReach'));
  assert.ok(read('app-datenschutz/index.html').includes('Supabase'));
});

test('external account deletion explains the request, deleted data and retained copies', () => {
  const html = read('konto-loeschen/index.html');
  for (const text of ['Roavyn-Konto%20l%C3%B6schen', 'Berechtigung', '180 Tage', 'Backups', 'nicht fernlöschen']) {
    assert.ok(html.includes(text), `Missing deletion information: ${text}`);
  }
});
