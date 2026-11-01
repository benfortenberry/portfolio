# Portfolio

A terminal-themed static site linking to my Netlify-hosted projects and their GitHub repos.
No framework, no build step.

Live: https://ben-portfolio-terminal.netlify.app

## Structure

- `index.html` — terminal window markup, prompt lines, and link-preview (Open Graph) tags
- `styles.css` — terminal theme (colors live in the `:root` variables at the top)
- `main.js` — boot/typewriter sequence, then renders a panel per project from `projects.json`
- `projects.json` — the project list (edit this to add/remove projects)
- `favicon.svg` — `>_` tab icon
- `og-image.png` — 1200×630 preview image shown when the link is shared
- `netlify.toml` — Netlify config (publishes the repo root, no build)

## Adding a project

Add an entry to `projects.json`. The list renders in file order, newest first.

```json
{
  "title": "Project Name",
  "year": "2026",
  "type": "side",
  "description": "Short description.",
  "liveUrl": "https://example.netlify.app",
  "repoUrl": "https://github.com/benfortenberry/example",
  "repoPrivate": false,
  "tech": "TypeScript"
}
```

- `type` shows as a `[label]` in the panel's title bar. Current labels: `saas`, `client`,
  `demo`, `game`, `challenge`, `side`, `writing`.
- `repoPrivate: true` hides the `> view code` link (the repo would 404 for visitors).

## Local preview

Serve the folder with any static server, e.g.:

```bash
npx serve .
```

Opening `index.html` directly via `file://` will not work because `main.js`
fetches `projects.json` (blocked by the browser for local files).

The boot animation is skipped automatically for anyone with
"reduce motion" turned on in their OS settings.

## Deploy

```bash
netlify deploy --prod --dir .
```

If the site URL changes (rename or custom domain), update the `og:url` and
`og:image` URLs in `index.html` so link previews keep working.
