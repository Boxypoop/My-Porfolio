# Amielle Munio — Portfolio (editable source)

## File map — where to change things

**index.html** — all content and structure.
- Hero text, tagline: `<section class="hero">` near the top of `<body>`
- About cards / timeline: `<section id="about">`
- Skills carousel (add/remove/edit skill cards): `<section id="skills">` — each skill
  is a `<div class="skill-card carousel-card">` block. Copy/paste one to add a skill,
  delete one to remove it. The small `<span class="skill-tag">` controls the category label.
- Certificates: `<section id="certificates">` — each `<div class="cert-card">` has
  `data-title`, `data-org`, `data-date`, `data-topics` attributes (shown in the popup on click)
  plus an `<img src="...">` for the certificate image.
- Projects: `<section id="projects">` — GitHub / Live Demo links are `<a href="#">`, currently
  placeholders. Replace `#` with real URLs.
- Contact info: `<section id="contact">`

**css/style.css** — all visual styling.
- Colors: edit the `:root { ... }` block at the very top (`--bg`, `--blue`, `--cyan`, etc.)
  — changing these updates the whole site's color scheme at once.
- Fonts: the `font-family` values reference Google Fonts already linked in index.html's `<head>`.
- Spacing/sizing per section: search for the section's class, e.g. `.cert-card`, `.skill-card`.

**js/script.js** — all interactivity (no content lives here).
- Mobile menu, lightboxes, the skills carousel, 3D tilt effects, and the Three.js
  particle background are each in their own labeled block (search the `/* ---------- */` comments).

## Images
Certificate images (`Unified WLAN.png`, `SAP.png`, `SAP S4.png`, `Java Certificate.png`)
and hero/profile photos referenced in index.html should sit in the **same folder as
index.html** unless you update their `src` paths to point elsewhere (e.g. an `images/` folder).

## To edit
Open any of these files in a text editor (VS Code, Notepad++, Sublime, etc.), make your
change, save, and refresh index.html in a browser to preview.
