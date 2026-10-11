# Portfolio

A simple static site linking to my Netlify-hosted projects and their GitHub repos.

## Structure

- `index.html` — page markup
- `styles.css` — styling
- `main.js` — renders project cards from `projects.json`
- `projects.json` — the project list (edit this to add/remove projects)
- `netlify.toml` — Netlify config (no build step)

## Adding a project

Add an entry to `projects.json`:

```json
{
  "title": "Project Name",
  "description": "Short description.",
  "liveUrl": "https://example.netlify.app",
  "repoUrl": "https://github.com/benfortenberry/example",
  "repoPrivate": false,
  "tech": "TypeScript"
}
```

## Local preview

Serve the folder with any static server, e.g.:

```bash
npx serve .
```

Opening `index.html` directly via `file://` will not work because `main.js`
fetches `projects.json` (blocked by the browser for local files).

## Deploy

```bash
netlify deploy --prod
```
