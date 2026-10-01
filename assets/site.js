// Small progressive enhancements. The site works without this file.
(function () {
  var header = document.querySelector(".header");
  var btn = document.querySelector(".menu-btn");
  var menu = document.getElementById("mobile-menu");

  // Swap the menu/close icon, keeping the sprite URL (and its version) as is.
  function setIcon(name) {
    var use = btn.querySelector("use");
    use.setAttribute("href", use.getAttribute("href").split("#")[0] + "#" + name);
  }

  if (btn && menu) {
    btn.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      setIcon(open ? "x" : "menu");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        setIcon("menu");
      }
    });
  }

  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // The previous version of nexper.in installed a service worker. /sw.js now
  // removes itself; this also clears it for visitors whose browser has not
  // re-checked yet.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (regs) {
      regs.forEach(function (r) {
        r.unregister();
      });
    });
  }
})();
