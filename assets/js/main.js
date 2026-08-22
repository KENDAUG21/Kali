/* Kali Linux Learning Hub — shared behavior
   - mobile nav toggle
   - hero terminal typing sequence
   - copy-to-clipboard on code blocks
   - scroll-spy for the module sidebar TOC
   All effects respect prefers-reduced-motion. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- mobile nav ---------------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- hero typing sequence ---------------- */
  function initHeroTyping() {
    var el = document.querySelector("[data-typer]");
    if (!el) return;

    var lines = JSON.parse(el.getAttribute("data-typer"));
    var finalHTML = el.innerHTML; /* static fallback already in the markup */

    if (reduceMotion) return; /* keep the static fallback content */

    el.innerHTML = "";
    var lineIndex = 0;
    var charIndex = 0;
    var container = document.createElement("div");
    el.appendChild(container);

    function typeNext() {
      if (lineIndex >= lines.length) {
        var cursor = document.createElement("span");
        cursor.className = "cursor";
        container.appendChild(cursor);
        return;
      }
      var current = lines[lineIndex];
      var lineEl = container.children[lineIndex];
      if (!lineEl) {
        lineEl = document.createElement("div");
        lineEl.className = current.cls || "out";
        container.appendChild(lineEl);
      }
      charIndex++;
      lineEl.textContent = current.text.slice(0, charIndex);

      if (charIndex >= current.text.length) {
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNext, current.pause || 260);
      } else {
        setTimeout(typeNext, current.speed || 22);
      }
    }
    typeNext();
  }

  /* ---------------- copy-to-clipboard for code blocks ---------------- */
  function initCopyButtons() {
    document.querySelectorAll(".code-block").forEach(function (block) {
      var btn = block.querySelector(".copy-btn");
      var code = block.querySelector("code");
      if (!btn || !code) return;

      btn.addEventListener("click", function () {
        var text = code.innerText;
        var done = function () {
          var original = btn.getAttribute("data-label") || "Copy";
          btn.textContent = "Copied";
          btn.classList.add("copied");
          setTimeout(function () {
            btn.textContent = original;
            btn.classList.remove("copied");
          }, 1400);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, done);
        } else {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); } catch (e) {}
          document.body.removeChild(ta);
          done();
        }
      });
    });
  }

  /* ---------------- scroll-spy for module TOC ---------------- */
  function initScrollSpy() {
    var tocLinks = document.querySelectorAll(".toc a");
    var modules = document.querySelectorAll(".module");
    if (!tocLinks.length || !modules.length) return;

    var map = {};
    tocLinks.forEach(function (a) {
      map[a.getAttribute("href").replace("#", "")] = a;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = map[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            tocLinks.forEach(function (l) { l.classList.remove("active"); });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    modules.forEach(function (m) { observer.observe(m); });
  }

  /* ---------------- projects page: filter by difficulty ---------------- */
  function initProjectFilter() {
    var buttons = document.querySelectorAll(".filter-btn");
    var groups = document.querySelectorAll(".project-group");
    if (!buttons.length || !groups.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");

        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        groups.forEach(function (group) {
          var level = group.getAttribute("data-level");
          var show = filter === "all" || filter === level;
          group.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------------- mark current page in nav ---------------- */
  function markActiveNav() {
    var path = window.location.pathname.replace(/\/index\.html$/, "/");
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      var normalized = href.replace(/\/index\.html$/, "/");
      if (path.endsWith(normalized) && normalized !== "/") {
        a.classList.add("active");
      } else if (normalized === "/" && (path === "/" || path.endsWith("/index.html"))) {
        /* root handled via explicit data-page attr fallback below */
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initHeroTyping();
    initCopyButtons();
    initScrollSpy();
    initProjectFilter();
    markActiveNav();
  });
})();
