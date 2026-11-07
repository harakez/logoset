# Logoset

**Every format of your logo — in a minute.**

Upload an SVG logo, type the brand name and get everything a small business needs: logo files in every color, avatars, a website favicon, social media covers, stories and a brand color palette. Download each file separately or everything as one ZIP archive.

Free, no sign-up, no server. Your logo never leaves your browser.

**Live demo:** https://logoset.vercel.app *(update after deploying)*

<!-- Add a short GIF here: docs/demo.gif -->

## Why

A logo is delivered once, but the small tasks keep coming: "I need a round avatar for Telegram", "make it white for a dark background", "what size is a YouTube banner?", "we need a favicon for the website". Logoset does all of that automatically and correctly, so the owner of a logo doesn't have to go back to a designer for every small thing.

Designers can also give it to clients as a bonus after handing over the logo.

## What you get

| Group | Files |
|---|---|
| **Logo** | Horizontal (icon + name), stacked (icon above name), icon only, name only. Each in 4 colors: color, for dark backgrounds, black, white. PNG (2000 px), JPG and SVG |
| **Avatars** | Square 1080×1080 (Telegram, Instagram, WhatsApp, VK) and round PNG with transparent corners |
| **Website** | `favicon.ico` (16/32/48), `favicon.svg`, 32 px PNG, 180 px Apple touch icon, 512 px icon, ready HTML code |
| **Social media** | Link preview (Open Graph) 1200×630, YouTube banner 2560×1440 with the logo inside the safe area, VK cover 1590×400, X header 1500×500, LinkedIn cover 1584×396, story 1080×1920 |
| **Palette** | Brand colors with HEX, RGB and CMYK codes, as text and as an image |

"Download all" creates a ZIP with about 45 files sorted into folders.

## Features

- Any SVG logo: file picker, drag & drop or paste.
- Colors are detected automatically: fills, strokes, gradients and `<style>` classes from Illustrator, Figma or Inkscape exports.
- Two ways to recolor: **by color** (everything of one color changes together) or **by part** (each shape or group changes on its own, and groups can be split into smaller parts). Click the logo itself to pick a part.
- Layouts are built from the logo's real drawing bounds, not the empty canvas around it. Text size is set by cap height relative to the icon, and text is aligned by its ink, so lockups stay balanced with any font.
- Ready palettes, random harmonious colors, screen eyedropper (Chrome / Edge).
- Name and tagline set in one of 32 free fonts with Cyrillic support (Inter, Manrope, Montserrat, Golos, Unbounded, Playfair Display, Lora, Caveat and more), or upload your own TTF, OTF or WOFF font.
- Text is converted to outlines, so PNG and SVG files look exactly the same on every computer.
- Sliders for name size, tagline size and the space between icon and text, plus logo size for avatars and covers.
- Click any preview to see it full screen.
- Email signature image (600×200).
- "The logo already contains the name" mode for logos that already include the text.
- Background for avatars and covers: white, dark, brand color or any custom color, chosen right above the previews. The logo switches to a version that stays readable on it.
- Logo files can be previewed and exported on a transparent, white, dark or custom background.
- Light and dark theme, English and Russian interface. Your work is saved in the browser.

## Project files

| File | What it is |
|---|---|
| `index.html`, `ru/index.html` | Landing pages in English and Russian. The text is plain HTML so search engines can read it |
| `app.js` | The whole app: SVG cleaning, color detection, layouts, export, ZIP |
| `theme.js` | Picks light or dark theme before the page is drawn |
| `style.css` | Styles for both themes |
| `fonts/` | 32 fonts from [Fontsource](https://fontsource.org), SIL Open Font License; each folder has its license |
| `lib/opentype.min.js` | [opentype.js](https://github.com/opentypejs/opentype.js) 1.3.4 (MIT), turns text into outlines |
| `sitemap.xml`, `robots.txt` | For search engines. Replace `logoset.vercel.app` with your domain |
| `vercel.json` | Security headers for Vercel |

## Run locally

It is a static site: no build step, no dependencies.

```bash
python -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` directly also works.

## Deploy

- **Vercel:** import the repository. No settings are needed. `vercel.json` adds security headers.
- **GitHub Pages:** Settings → Pages → deploy from the `main` branch, root folder.
- **Netlify** or any other static hosting.

## Privacy and security

- Everything runs in the browser. There is no backend, no analytics, no cookies and no third-party requests.
- Uploaded SVG files are treated as untrusted and cleaned before use. Scripts, event handlers (`onload`, `onclick`…), `<foreignObject>`, animations, external links and external resources (`url(https://…)`, `@import`) are all removed. The logo is rendered inside a shadow root, so its styles cannot affect the page.
- Names and taglines are escaped before they are written into SVG files.
- A strict Content Security Policy is set both in `index.html` and in `vercel.json`.

Found a security problem? Please report it privately through GitHub Security Advisories instead of a public issue.

## Limitations

- WOFF2 font files can't be uploaded yet; use TTF, OTF or WOFF. An uploaded font is kept only until the page is reloaded.
- Raster images embedded in an SVG cannot be recolored. Colors inside masks and clip paths are left unchanged on purpose.
- Files over 5 MB or 30,000 elements are rejected to keep the page responsive.

## Contributing

Issues and pull requests are welcome: logos that are not handled well, new formats, translations, design improvements. Please keep it dependency-free (plain HTML, CSS and JavaScript).

## License

[MIT](LICENSE) © 2026 harakez

---

## По-русски

**Logoset** — все форматы логотипа за минуту. Загрузите SVG-логотип, впишите название и получите:

- логотип горизонтальный, вертикальный, только знак и только название — в цвете, для тёмного фона, чёрный и белый (PNG, JPG, SVG);
- аватарки для Telegram, Instagram, WhatsApp, VK — квадратную и круглую;
- иконку для сайта (favicon) и готовый HTML-код;
- обложки YouTube, VK, X, LinkedIn, сторис и превью ссылок;
- палитру бренда с кодами HEX, RGB и CMYK.

Всё можно скачать одним ZIP-архивом. Бесплатно, без регистрации, файлы никуда не загружаются.
