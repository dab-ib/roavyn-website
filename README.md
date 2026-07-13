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
