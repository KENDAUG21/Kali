# Kali Linux Learning Hub

A free, static, multi-page educational website that teaches Kali Linux and ethical hacking across three difficulty tracks — **Beginner**, **Intermediate**, and **Advanced** — plus a hands-on **Projects** section and a **Resources** page with cheat sheets and legal guidelines.

Pure HTML/CSS/JS. No build step, no framework, no dependencies to install — just open it in a browser.

---

## Quick start

**Option 1 — just open it**
Unzip the archive and double-click `index.html`. Everything works from the local filesystem.

**Option 2 — run a local server (recommended)**
Opening via `file://` works fine, but a local server avoids occasional browser quirks with relative paths:

```bash
cd kali-learning-hub
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

**No install, no npm, no bundler.** The only external dependency is a Google Fonts stylesheet link (JetBrains Mono + IBM Plex Sans), loaded over the network in `style.css`. If you need this to work fully offline, see [Going fully offline](#going-fully-offline) below.

---

## Folder structure

```
kali-learning-hub/
├── index.html                 → Homepage: intro + track overview
├── beginner/index.html        → Beginner track (7 modules)
├── intermediate/index.html    → Intermediate track (7 modules)
├── advanced/index.html        → Advanced track (7 modules)
├── projects/index.html        → All 9 projects, filterable by level
├── resources/index.html       → Cheat sheets, doc links, legal guide
└── assets/
    ├── css/style.css          → The entire design system (one file)
    ├── js/main.js             → Nav, typing effect, copy buttons, TOC scroll-spy, project filter
    └── img/
        ├── favicon.svg              → Site mark / favicon
        ├── lab-network-topology.svg → Diagram used in Beginner → Networking
        └── methodology-flow.svg     → Diagram used in Advanced → Methodology
```

Every page is a self-contained HTML file with its own `<head>`, nav, and footer — there's no templating engine, so shared markup (nav/footer) is duplicated across files by design. See [Editing content](#editing-content) for how to update it consistently.

---

## Pages at a glance

| Page | Contents |
|---|---|
| `index.html` | Hero, legal disclaimer banner, "What is Kali Linux," track cards, projects/resources teasers |
| `beginner/` | What Kali is · Installing on VirtualBox · Terminal basics · Updating packages · Kali menu · Networking basics · Safe & legal pentesting |
| `intermediate/` | Nmap deep dive · Metasploit basics · Burp Suite · Hydra · John the Ripper · Wireless overview · Privilege escalation |
| `advanced/` | Advanced Metasploit · Reverse engineering · Buffer overflow basics · Advanced wireless · Post-exploitation · Custom payloads · Full methodology |
| `projects/` | 3 projects per level (9 total), each with objective, tools, time estimate, and numbered steps |
| `resources/` | Linux/Nmap/Metasploit cheat-sheet tables, official documentation links, full legal & safe-practice guidelines (`#legal`) |

---

## Design system

The whole site is built around one idea: **everything looks like a terminal window** — the nav bar, the hero, module cards, and code blocks all share the same window-chrome (colored dots + fake path breadcrumb like `~/beginner`), because that's the one visual every Kali user instantly recognizes.

- **Colors** are semantic by difficulty: cyan = Beginner, amber = Intermediate, crimson = Advanced, violet = Projects/cross-cutting. All defined as CSS variables at the top of `style.css` under `:root`.
- **Fonts**: JetBrains Mono for headings/code (the "terminal" voice), IBM Plex Sans for body text (readability). Loaded via Google Fonts in the first line of `style.css`.
- **Motion**: hero typing animation, blinking cursor, and hover states all respect `prefers-reduced-motion` and degrade to static content automatically.

To change the accent color of a whole track, edit one CSS variable — e.g. in `advanced/index.html`, the `<main>` tag sets `style="--level-accent: var(--accent-crimson);"`, which cascades to the sidebar TOC, module bullets, and icons on that page.

---

## Editing content

**Add or edit a module** (any track page):
Each module is one `<article class="module term-window" id="your-id">` block. Copy an existing one, change the `id`, heading, and body content, then add a matching entry to the sidebar `<aside class="toc">` list — the `id` and the `href="#your-id"` must match exactly.

**Add or edit a project** (`projects/index.html`):
Each project is one `<article class="project-card term-window" id="your-id">` inside a `<div class="project-group" data-level="beginner|intermediate|advanced">`. If a track page links to it (e.g. `../projects/index.html#your-id`), keep the `id` in sync on both ends.

**Add a code block:**
```html
<div class="code-block">
  <div class="cb-head"><span>bash</span><button class="copy-btn" data-label="Copy">…</button></div>
  <pre><code><span class="c-prompt">$</span> your command here</code></pre>
</div>
```
The copy button works automatically — `main.js` wires up every `.code-block` on the page, no extra JS needed per block.

**Update the nav or footer:**
There's no shared include file, so nav/footer changes need to be repeated across all 6 HTML files. If you plan to edit these often, consider introducing a static site generator or a simple templating script — the current structure favors simplicity and zero build tooling over DRY-ness.

---

## Going fully offline

By default the site loads fonts from `fonts.googleapis.com`. To remove that dependency:
1. Download the JetBrains Mono and IBM Plex Sans font files.
2. Add `@font-face` rules pointing to local files in `assets/css/style.css`.
3. Remove the `@import url(...)` line at the top of `style.css`.

Everything else (icons, diagrams, layout) is already fully self-contained SVG/CSS with no external calls.

---

## Content notice

This is independent educational material and is **not affiliated with or endorsed by Offensive Security or Kali Linux**. It's built for learning inside a legal, isolated lab — your own VMs, or systems you have explicit written authorization to test. Nothing on the site is legal advice; see `resources/index.html#legal` for the full guidelines and check the laws that apply where you live before running any tool covered here.

---

## License

No license file is bundled — treat this as source you own and can modify freely for your own learning site. If you plan to publish it publicly, consider adding an explicit license (MIT is a common, permissive choice for a static site like this).
