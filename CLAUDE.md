# nexper-site: rules for anyone (human or AI) changing this site

nexper.in is published in **six languages**: English (default), Hindi, Telugu,
Kannada, Tamil and Malayalam. Every change to what visitors read must ship in
all six at once. A page or feature that is only in English is not finished.

## How the site is built

- `i18n/en.json` holds every piece of visible English text, as `"key": "text"`.
- `i18n/hi.json`, `te.json`, `kn.json`, `ta.json`, `ml.json` hold the same keys,
  translated. `i18n/languages.json` lists the languages, in picker order.
- `tools/build.py` generates every `.html` page from those files. Each piece of
  text is written in English and marked `data-i18n="key"`; attributes use
  `data-i18n-attr="name:key"` (for example `aria-label:nav.menu`).
- `assets/i18n.js` swaps the text into the visitor's language in the browser:
  `?lang=xx` in the URL, then the saved choice, then the phone's language, then
  English. The language picker sits in the header on every page.
- **Never edit the generated `.html` files by hand.** Change `tools/build.py`
  or the JSON, then run `python3 tools/build.py`. Each generated page says so in
  a comment at the top.

## Checklist for every change

1. **New or changed text:** add or edit the key in `i18n/en.json`, then write
   the translation in **all five** other files in the same change. Use the text
   in the page through `tag()` or `t()` in `tools/build.py`; never type
   visible English straight into the HTML template.
2. **New page:** add a function in `tools/build.py`, register it in `PAGES`,
   and use `head()`, `header()` and `footer()` so the page gets the picker,
   the fonts and the scripts. Add the page to `sitemap.xml`.
3. **Run** `python3 tools/build.py`, then `python3 tools/build.py --stamp` (this
   records that every language matches the current English), then
   `python3 tools/build.py --check`. It must print `OK`.
4. **Look at it** in at least English and one Indian language, on a phone-width
   screen: `python3 -m http.server 4173`, then open
   `http://localhost:4173/?lang=te`. Indian scripts run longer than English;
   check that nothing overflows or wraps badly.
5. **Commit** the JSON, `tools/build.py` and the regenerated HTML together.

GitHub runs `python3 tools/build.py --check` on every push and pull request
(`.github/workflows/site-checks.yml`). It fails when:

- a key is missing from any language, or a language has a key English doesn't;
- English text changed (or a key was added) but the translations were not
  updated and stamped;
- a translation drops or adds HTML tags or links compared with English;
- a key in `en.json` is not used on any page;
- a generated page is out of date or was edited by hand.

Only run `--stamp` after the translations really are updated. Stamping to
silence the check ships English-meaning drift to five languages.

## Translation style

- **Audience:** kirana and small-shop owners. Write the way they talk at the
  counter: short, warm and plain, not formal or bookish. Prefer everyday words
  (Hindi "दुकान", not "प्रतिष्ठान").
- **Keep in Latin script:** Nexper, WhatsApp, UPI, GST, GSTR-1, QR, PIN, JSON,
  Free and Pro (plan names), product and shop names in examples
  (Aashirvaad Atta, Sharma General Store), amounts like ₹1,250.
- **Udhaar (customer credit):** Hindi उधार, Telugu అప్పు, Kannada ಸಾಲ,
  Tamil கடன், Malayalam കടം.
- **Keep the same HTML** as English: the same tags (`<em>`, `<s>`, `<a>`) and
  the same link targets. Only the words inside change.
- **Headline lines:** English uses romanised Hindi ("Dukaan ka hisaab, ab
  phone pe."). Each language has its own version of these lines, written in
  its own script, not a word-for-word translation.
- **Legal pages** (`/privacy/`, `/terms/`) stay in English until a lawyer has
  reviewed translations. Their header and footer are translated, and they show
  an "English only" note (`legal.englishOnly`) in other languages.
- Translations were first written with AI help. Ask a native speaker to review
  any important new text before launch.

## Adding a language

Add it to `i18n/languages.json` (`code`, native `name`, `htmlLang`, and a
Google Fonts `font` that covers the script). Then create `i18n/<code>.json`
with every key, add a `--font-indic` rule for it in `assets/site.css` (see the
Languages section), and run the checklist above. `assets/i18n.js` reads the
list from the picker, so it needs no change.

## Other things to know

- Asset URLs carry `?v=<hash>` so browsers fetch new CSS, JS and translations
  after each deploy. `tools/build.py` computes it; don't hard-code versions.
- Buttons for signing up and signing in point to `https://app.nexper.in`
  (`APP` in `tools/build.py`). The app itself lives in the `nexper-app` repo
  and is English-only for now.
- Support contact details: `SUPPORT_EMAIL` and `SUPPORT_WHATSAPP` at the top of
  `tools/build.py`. The contact cards appear once they are set.
