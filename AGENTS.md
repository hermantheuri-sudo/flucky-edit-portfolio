# AGENTS.md

- Static site: `index.html` loads local `style.css` and deferred `script.js` directly; no build, package, test, lint, or framework config. Open `index.html` in a browser or serve the folder statically.
- No external libraries or assets are used; keep edits dependency-free and mobile-first.
- Video embeds are lazy: `.video-trigger` elements carry `data-embed`/`data-title`, and `script.js` injects an iframe into `#video-dialog` on click. Don't add iframes to `index.html`.
- Work filters rely on `.filter-btn[data-filter]` matching `.work-card[data-category]`.
- Replaceable placeholders live in `data-embed` URLs (`REPLACE_*_ID`) and two Google Docs `href`s (`REPLACE_*_DOC_ID`); WhatsApp/TikTok URLs are already final.
- `.gitattributes` sets `* text=auto` (LF normalization).
