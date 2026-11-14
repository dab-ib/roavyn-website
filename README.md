# Roavyn Website

Static GitHub Pages website for Roavyn.

## Local preview

Open `index.html` in a browser, or run a small static server:

```powershell
python -m http.server 8080
```

## Signup form

The form in `index.html` uses the CleverReach endpoint generated for the Roavyn beta signup.

For a newsletter in the EU, use double opt-in and update `datenschutz.html` with the actual provider details before publishing.

## Legal pages

`impressum.html` and `datenschutz.html` are drafted for the current static GitHub Pages setup with CleverReach signup.
Review them again before the domain goes live, especially after GitHub Pages, DNS, double opt-in, and the CleverReach data processing agreement are finalized.

## Öffentliche App-Seiten und Store-URLs

Ohne Anmeldung und ohne JavaScript erreichbar:

| Store-Feld | URL |
| --- | --- |
| Apple Support URL / Google Support-Website | https://roavyn.de/support/ |
| Apple Privacy Policy URL / Google Datenschutzerklärung | https://roavyn.de/app-datenschutz/ |
| Google URL zur Kontolöschung | https://roavyn.de/konto-loeschen/ |
| Marketing-Website | https://roavyn.de/ |
| Support-E-Mail | info@roavyn.de |

`datenschutz.html` gilt für Website und Newsletter; für die Stores die separate
App-Datenschutzerklärung verwenden. Die Löschseite ermöglicht eine Anfrage per E-Mail
auch ohne App und Login; die Berechtigung wird vor der Löschung geprüft.

Die drei `index.html` stammen aus `Roavyn/docs/store-web/`. App-Datenschutz und
Löschtext bei Änderungen dort ebenfalls aktualisieren. Die Datenangaben für Apple App
Privacy und Google Data Safety stehen in `Roavyn/docs/STORE_RELEASE.md` und müssen
für den tatsächlichen Release in den Store-Konsolen bestätigt werden.

Prüfung: `node --test tests/public-pages.test.cjs`. Veröffentlichung erfolgt weiterhin
über das bestehende GitHub-Pages-Setup. Danach alle drei URLs ohne Login aufrufen,
Seiteninhalt, Navigation und Mail-Link prüfen. Eine eigene Testanfrage samt Antwort
bestätigt das Postfach; ein öffentlicher Mail-Link allein tut das nicht.
