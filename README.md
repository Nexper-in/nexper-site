# nexper-site

The public website for **Nexper** at https://nexper.in. Plain static HTML and
CSS with no build step, so Vercel serves the files as they are.

| Path | What it is |
| --- | --- |
| `index.html` | Landing page |
| `privacy/`, `terms/`, `contact/` | Legal and contact pages |
| `404.html` | Not-found page |
| `assets/site.css` | All styles. Base tokens at the top; the dark-glow theme at the bottom overrides them |
| `assets/icons.svg` | Icon sprite (Lucide icons) |
| `assets/site.js` | Mobile menu, header shadow, footer year |
| `sw.js` | Removes the old prototype's service worker from visitors' browsers |
| `og.jpg` | Image shown when the link is shared on WhatsApp and social apps |

The previous prototype app that lived here is kept on the `legacy-prototype`
branch.

## Links to the app

Every "Start free" and "Sign in" button points to `https://app.nexper.in`
(`/login`, `/login?mode=signup`, `/login?mode=staff`). If the app ends up on a
different address, search and replace `https://app.nexper.in` across the
HTML files.

## Preview locally

```sh
python3 -m http.server 4173
```

Then open http://localhost:4173.
