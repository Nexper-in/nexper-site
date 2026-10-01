# nexper-site

The public website for **Nexper** at https://nexper.in. Static HTML and CSS:
the pages are generated locally by `tools/build.py` and committed, and Vercel
serves the files as they are.

Read **CLAUDE.md** before changing anything: the site is in six languages
and every change has to go into all of them.

| Path | What it is |
| --- | --- |
| `tools/build.py` | Generates every page below from the text in `i18n/`, and checks the translations |
| `i18n/en.json` | All visible English text (the source) |
| `i18n/hi.json`, `te.json`, `kn.json`, `ta.json`, `ml.json` | Hindi, Telugu, Kannada, Tamil, Malayalam |
| `i18n/languages.json` | The languages in the picker |
| `index.html`, `faq/`, `contact/`, `privacy/`, `terms/`, `404.html` | Generated pages; do not edit by hand |
| `assets/site.css` | All styles. Base tokens at the top, the dark-glow theme and language rules at the bottom |
| `assets/i18n.js` | Switches the language in the browser |
| `assets/icons.svg` | Icon sprite (Lucide icons) |
| `assets/site.js` | Mobile menu, header shadow, footer year |
| `sw.js` | Removes the old prototype's service worker from visitors' browsers |
| `og.jpg` | Image shown when the link is shared on WhatsApp and social apps |

The previous prototype app that lived here is kept on the `legacy-prototype`
branch.

## Links to the app

Every "Start free" and "Sign in" button points to `https://app.nexper.in`
(`/login`, `/login?mode=signup`, `/login?mode=staff`). If the app ends up on a
different address, change `APP` in `tools/build.py` and rebuild.

## Change text or add a page

```sh
python3 tools/build.py            # regenerate the pages
python3 tools/build.py --stamp    # after updating all six languages
python3 tools/build.py --check    # must print OK (GitHub runs this too)
```

## Preview locally

```sh
python3 -m http.server 4173
```

Then open http://localhost:4173, or http://localhost:4173/?lang=te for Telugu.
