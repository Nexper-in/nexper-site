// Language switching for nexper.in.
//
// Pages are generated in English with data-i18n="key" on every piece of
// text (see tools/build.py). This file loads /i18n/<lang>.json and swaps the
// text in place. The language list comes from the dropdown's options
// ([data-lang-option] in the header), so adding a language never needs a
// change here.
//
// Order: ?lang=xx in the URL, then the saved choice, then the browser's
// language, then English.
(function () {
  var STORE_KEY = "nexper.lang";
  var root = document.documentElement;
  var menu = document.querySelector("[data-lang-menu]");
  if (!menu) return;
  var button = menu.querySelector(".lang-btn");
  var list = menu.querySelector(".lang-list");
  var current = menu.querySelector("[data-lang-current]");
  var options = Array.prototype.slice.call(menu.querySelectorAll("[data-lang-option]"));

  var langs = {};
  options.forEach(function (o) {
    langs[o.getAttribute("data-lang-option")] = {
      font: o.getAttribute("data-font"),
      htmlLang: o.getAttribute("data-html-lang"),
      name: o.querySelector(".lang-native").textContent,
    };
  });

  var textEls = document.querySelectorAll("[data-i18n]");
  var attrEls = document.querySelectorAll("[data-i18n-attr]");
  // English as generated, so switching back to English needs no download.
  var originalText = new Map();
  var originalAttrs = new Map();
  textEls.forEach(function (el) {
    originalText.set(el, el.innerHTML);
  });
  attrEls.forEach(function (el) {
    var saved = {};
    parseAttrs(el).forEach(function (a) {
      saved[a.name] = el.getAttribute(a.name);
    });
    originalAttrs.set(el, saved);
  });
  var cache = {};

  function parseAttrs(el) {
    return el
      .getAttribute("data-i18n-attr")
      .split(";")
      .filter(Boolean)
      .map(function (pair) {
        var i = pair.indexOf(":");
        return { name: pair.slice(0, i).trim(), key: pair.slice(i + 1).trim() };
      });
  }

  function save(code) {
    try {
      localStorage.setItem(STORE_KEY, code);
    } catch (e) {}
  }

  function initial() {
    var l = null;
    try {
      l = new URLSearchParams(location.search).get("lang") || localStorage.getItem(STORE_KEY);
    } catch (e) {}
    if (l && langs[l]) return l;
    var nav = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < nav.length; i++) {
      var c = String(nav[i]).slice(0, 2).toLowerCase();
      if (langs[c]) return c;
    }
    return "en";
  }

  function loadFont(code) {
    var family = langs[code] && langs[code].font;
    if (!family || document.getElementById("font-" + code)) return;
    var link = document.createElement("link");
    link.id = "font-" + code;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=" + family.replace(/ /g, "+") + ":wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }

  function fetchDict(code) {
    if (cache[code]) return Promise.resolve(cache[code]);
    var v = (document.querySelector('script[src*="/assets/i18n.js"]') || {}).src || "";
    v = (v.split("?v=")[1] || "").split("&")[0];
    return fetch("/i18n/" + code + ".json?v=" + v)
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then(function (d) {
        cache[code] = d;
        return d;
      });
  }

  function apply(code, dict) {
    textEls.forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      el.innerHTML = dict && dict[key] != null ? dict[key] : originalText.get(el);
    });
    attrEls.forEach(function (el) {
      parseAttrs(el).forEach(function (a) {
        el.setAttribute(a.name, dict && dict[a.key] != null ? dict[a.key] : originalAttrs.get(el)[a.name]);
      });
    });
    root.setAttribute("lang", (langs[code] && langs[code].htmlLang) || "en-IN");
    root.setAttribute("data-lang", code);
    current.textContent = langs[code].name;
    options.forEach(function (o) {
      o.setAttribute("aria-checked", String(o.getAttribute("data-lang-option") === code));
    });
    root.removeAttribute("data-lang-pending");
  }

  function setLanguage(code, remember) {
    if (!langs[code]) code = "en";
    if (remember) save(code);
    if (code === "en") return apply("en", null);
    loadFont(code);
    fetchDict(code)
      .then(function (d) {
        apply(code, d);
      })
      .catch(function () {
        apply("en", null);
      });
  }

  // ---- dropdown behaviour
  function openMenu(focusCurrent) {
    list.hidden = false;
    button.setAttribute("aria-expanded", "true");
    if (focusCurrent) {
      var on = list.querySelector('[aria-checked="true"]') || options[0];
      on.focus();
    }
  }
  function closeMenu(returnFocus) {
    list.hidden = true;
    button.setAttribute("aria-expanded", "false");
    if (returnFocus) button.focus();
  }

  button.addEventListener("click", function () {
    if (list.hidden) openMenu(false);
    else closeMenu(false);
  });
  button.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openMenu(true);
    }
  });
  list.addEventListener("keydown", function (e) {
    var i = options.indexOf(document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      options[(i + 1) % options.length].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      options[(i - 1 + options.length) % options.length].focus();
    } else if (e.key === "Tab") {
      closeMenu(false);
    }
  });
  menu.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !list.hidden) closeMenu(true);
  });
  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target)) closeMenu(false);
  });

  options.forEach(function (o) {
    o.addEventListener("click", function () {
      var code = o.getAttribute("data-lang-option");
      closeMenu(true);
      setLanguage(code, true);
      // Keep ?lang= in sync so a copied link opens in the same language.
      try {
        var u = new URL(location.href);
        if (code === "en") u.searchParams.delete("lang");
        else u.searchParams.set("lang", code);
        history.replaceState(null, "", u);
      } catch (e) {}
    });
  });

  var first = initial();
  var fromUrl = null;
  try {
    fromUrl = new URLSearchParams(location.search).get("lang");
  } catch (e) {}
  setLanguage(first, Boolean(fromUrl && langs[fromUrl]));
})();
