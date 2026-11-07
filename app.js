/*
 * Logoset — all the files a brand needs, made from one SVG logo.
 * Runs entirely in the browser. MIT License.
 */
(function () {
'use strict';

const MAX_FILE = 5 * 1024 * 1024;
const MAX_NODES = 30000;
const SVG_NS = 'http://www.w3.org/2000/svg';
const ROOT = document.documentElement.getAttribute('data-root') || './';
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
};

/* =====================================================================
   texts (the landing page itself is static HTML in index.html / ru/index.html)
   ===================================================================== */
const T = {
  ru: {
    langSwitch: 'EN', langHref: ROOT, themeLight: 'Светлая тема', themeDark: 'Тёмная тема',
    newLogo: 'Другой логотип',
    sLogo: 'Логотип', fName: 'Название', fNamePh: 'Как называется бренд',
    fTag: 'Подпись', fTagPh: 'Например: кофейня. Можно не заполнять',
    hasText: 'Название уже есть в логотипе', hasTextHint: 'Отметьте, если текст нарисован в самом файле. Тогда второй раз мы его не добавим.',
    sColors: 'Цвета', byColor: 'По цветам', byPart: 'По деталям',
    byColorHint: 'Всё, что одного цвета, меняется вместе.',
    byPartHint: 'Каждая деталь меняется отдельно. Можно нажать на неё прямо на логотипе.',
    oneShape: 'Логотип нарисован одной фигурой, поэтому его можно перекрасить только целиком. Чтобы менять детали по отдельности, нужен SVG, где они сохранены отдельными фигурами.',
    colorN: n => 'Цвет ' + n, partN: n => 'Деталь ' + n,
    split: 'Разделить на детали', unsplit: 'Собрать как было',
    multi: 'В этой детали несколько цветов. Новый цвет закрасит её целиком. Чтобы менять их по отдельности, разделите её.',
    resetColors: 'Исходные цвета', palettes: 'Готовые сочетания', shuffle: 'Случайные',
    original: 'Было', ideas: 'Похожие и контрастные', recent: 'Недавние', eyedropper: 'Взять цвет с экрана',
    change: 'Сменить', w100: 'Тонкий', w200: 'Сверхсветлый', w300: 'Светлый', w500: 'Средний', w700: 'Жирный', w900: 'Чёрный',
    proportions: 'Пропорции', nameSize: 'Размер названия', tagSize: 'Размер подписи', gapSize: 'Отступ от знака', resetProps: 'Вернуть рекомендуемые',
    customFontNote: 'Свой шрифт работает до перезагрузки страницы и никуда не отправляется.',
    catAll: 'Все', catSans: 'Гротески', catDisplay: 'Акцидентные', catSerif: 'С засечками', catScript: 'Рукописные',
    fontSearch: 'Найти шрифт', uploadFont: 'Загрузить свой', yourFont: 'ваш шрифт',
    fontLicense: 'Все шрифты бесплатные, по лицензии SIL Open Font License: их можно использовать в логотипах, в том числе коммерческих.',
    fontErr: 'Не получилось прочитать шрифт. Подойдут файлы TTF, OTF или WOFF.', woff2Err: 'Формат WOFF2 не поддерживается. Загрузите TTF, OTF или WOFF.',
    close: 'Закрыть', zoom: 'Посмотреть крупно', logoSize: 'Размер логотипа', reset: 'Сбросить',
    emailSig: 'Подпись для писем', emailSigHint: 'Вставьте картинку в подпись Gmail, Outlook или Яндекс Почты.', mailBye: 'С уважением,',
    sText: 'Текст', font: 'Шрифт', weight: 'Начертание', w400: 'Обычное', w600: 'Полужирное', w800: 'Жирное',
    caps: 'Заглавными буквами', spacing: 'Расстояние между буквами', textColor: 'Цвет текста', auto: 'Авто', custom: 'Свой',
    tabLogo: 'Логотип', tabAvatar: 'Аватарки', tabWeb: 'Сайт и почта', tabSocial: 'Соцсети', tabPalette: 'Цвета бренда',
    logoColor: 'Цвет логотипа', bgLabel: 'Фон',
    vColor: 'Цветной', vDark: 'Для тёмного фона', vBlack: 'Чёрный', vWhite: 'Белый',
    bgNone: 'Прозрачный', bgWhite: 'Белый', bgDark: 'Тёмный', bgBrand: 'Цвет бренда', bgCustom: 'Свой',
    downloadAll: 'Скачать всё архивом', building: (a, b) => 'Собираем архив: ' + a + ' из ' + b,
    lHorizontal: 'Горизонтальный', lHorizontalHint: 'Знак слева, название справа',
    lVertical: 'Вертикальный', lVerticalHint: 'Знак сверху, название снизу',
    lIcon: 'Знак', lIconHint: 'Без текста', lWord: 'Название', lWordHint: 'Только текст', lFull: 'Логотип',
    svgNote: 'В SVG название записано обычным текстом, поэтому на чужом компьютере шрифт может подмениться. Для соцсетей и печати надёжнее PNG.',
    noName: 'Впишите название слева, и здесь появятся варианты с текстом.',
    aSquare: 'Квадратная аватарка', aSquareHint: 'Telegram, Instagram, WhatsApp, VK. Приложение само обрежет её в круг, логотип останется целым.',
    aCircle: 'Круглая аватарка', aCircleHint: 'PNG с прозрачными углами для сайта и подписи в письмах.',
    webIcon: 'Иконка сайта', webIconHint: 'Видна на вкладке браузера и на экране телефона, если сайт добавить в закладки.',
    webCode: 'Код для сайта', webCodeHint: 'Вставьте в <head>, а файлы положите в корень сайта.', copyCode: 'Скопировать код', downloadSet: 'Скачать иконки',
    soOg: 'Превью ссылки', soOgHint: 'Появляется, когда ссылку на сайт отправляют в мессенджере.',
    soYt: 'Шапка YouTube', soYtHint: 'Логотип стоит там, где его видно и на телефоне, и на телевизоре.',
    soVk: 'Обложка VK', soX: 'Шапка X (Twitter)', soLi: 'Обложка LinkedIn', soStory: 'Сторис', soStoryHint: 'Instagram, Telegram, VK.',
    palTitle: 'Цвета бренда', palHint: 'Коды для типографии, сайта и подрядчиков. Нажмите на код, чтобы скопировать.',
    palCopy: 'Скопировать все коды', palPng: 'Скачать картинкой',
    copied: 'Скопировано', copyFail: 'Не получилось скопировать', saved: n => 'Сохранено: ' + n, renderFail: 'Не получилось собрать картинку',
    errNotSvg: 'Это не похоже на SVG-файл. Нужен логотип в формате .svg', errBig: 'Файл больше 5 МБ. Для логотипа это слишком много.',
    errComplex: 'В этом SVG слишком много элементов.', removed: 'Из файла убрали скрипты и внешние ссылки. Сам логотип не пострадал.',
    loaded: 'Логотип загружен', confirmNew: 'Загрузить другой логотип? Текущие настройки пропадут.',
    dropHere: 'Отпустите файл', footer: 'Logoset — открытый проект. Всё работает в браузере, файлы никуда не отправляются.',
    presetNames: ['Чёрный', 'Океан', 'Лес', 'Закат', 'Графит', 'Ягода', 'Небо', 'Золото'],
    demoName: 'Вершина', demoTag: 'кофейня'
  },
  en: {
    langSwitch: 'RU', langHref: ROOT + 'ru/', themeLight: 'Light theme', themeDark: 'Dark theme',
    newLogo: 'Another logo',
    sLogo: 'Logo', fName: 'Name', fNamePh: 'Your brand name',
    fTag: 'Tagline', fTagPh: 'For example: coffee shop. Optional',
    hasText: 'The name is already in the logo', hasTextHint: 'Tick this if the text is part of the file, so we don\'t add it twice.',
    sColors: 'Colors', byColor: 'By color', byPart: 'By part',
    byColorHint: 'Everything of the same color changes together.',
    byPartHint: 'Each part changes on its own. You can also click a part on the logo.',
    oneShape: 'This logo is drawn as a single shape, so it can only be recolored as a whole. To change parts separately you need an SVG where they are saved as separate shapes.',
    colorN: n => 'Color ' + n, partN: n => 'Part ' + n,
    split: 'Split into parts', unsplit: 'Undo split',
    multi: 'This part has several colors. A new color will fill it completely. Split it to change them one by one.',
    resetColors: 'Original colors', palettes: 'Ready combinations', shuffle: 'Random',
    original: 'Was', ideas: 'Similar and contrasting', recent: 'Recent', eyedropper: 'Pick a color from the screen',
    change: 'Change', w100: 'Thin', w200: 'Extra light', w300: 'Light', w500: 'Medium', w700: 'Bold', w900: 'Black',
    proportions: 'Proportions', nameSize: 'Name size', tagSize: 'Tagline size', gapSize: 'Space from icon', resetProps: 'Back to recommended',
    customFontNote: 'Your font works until you reload the page and is never sent anywhere.',
    catAll: 'All', catSans: 'Sans', catDisplay: 'Display', catSerif: 'Serif', catScript: 'Script',
    fontSearch: 'Search fonts', uploadFont: 'Upload your own', yourFont: 'your font',
    fontLicense: 'All fonts are free under the SIL Open Font License, so you can use them in logos, including commercial ones.',
    fontErr: 'Could not read this font. TTF, OTF and WOFF files work.', woff2Err: 'WOFF2 is not supported. Please upload TTF, OTF or WOFF.',
    close: 'Close', zoom: 'View larger', logoSize: 'Logo size', reset: 'Reset',
    emailSig: 'Email signature', emailSigHint: 'Add the image to your signature in Gmail, Outlook or Apple Mail.', mailBye: 'Best regards,',
    sText: 'Text', font: 'Font', weight: 'Weight', w400: 'Regular', w600: 'Semibold', w800: 'Bold',
    caps: 'All caps', spacing: 'Letter spacing', textColor: 'Text color', auto: 'Auto', custom: 'Custom',
    tabLogo: 'Logo', tabAvatar: 'Avatars', tabWeb: 'Website & email', tabSocial: 'Social media', tabPalette: 'Brand colors',
    logoColor: 'Logo color', bgLabel: 'Background',
    vColor: 'Color', vDark: 'For dark backgrounds', vBlack: 'Black', vWhite: 'White',
    bgNone: 'Transparent', bgWhite: 'White', bgDark: 'Dark', bgBrand: 'Brand color', bgCustom: 'Custom',
    downloadAll: 'Download everything', building: (a, b) => 'Building the archive: ' + a + ' of ' + b,
    lHorizontal: 'Horizontal', lHorizontalHint: 'Icon on the left, name on the right',
    lVertical: 'Stacked', lVerticalHint: 'Icon on top, name below',
    lIcon: 'Icon', lIconHint: 'No text', lWord: 'Wordmark', lWordHint: 'Name only', lFull: 'Logo',
    svgNote: 'In SVG files the name is plain text, so another computer may show a different font. PNG is the safer choice for social media and print.',
    noName: 'Type the name on the left to see versions with text.',
    aSquare: 'Square avatar', aSquareHint: 'Telegram, Instagram, WhatsApp. The app crops it to a circle and the logo stays whole.',
    aCircle: 'Round avatar', aCircleHint: 'PNG with transparent corners for websites and email signatures.',
    webIcon: 'Website icon', webIconHint: 'Shown in the browser tab and on a phone home screen.',
    webCode: 'Code for your site', webCodeHint: 'Paste it into <head> and put the files in the site root.', copyCode: 'Copy code', downloadSet: 'Download icons',
    soOg: 'Link preview', soOgHint: 'Shown when someone shares a link to your site in a messenger.',
    soYt: 'YouTube banner', soYtHint: 'The logo sits in the area visible on phones and TVs.',
    soVk: 'VK cover', soX: 'X (Twitter) header', soLi: 'LinkedIn cover', soStory: 'Story', soStoryHint: 'Instagram, Facebook, Telegram.',
    palTitle: 'Brand colors', palHint: 'Codes for print shops, websites and contractors. Click a code to copy it.',
    palCopy: 'Copy all codes', palPng: 'Download as image',
    copied: 'Copied', copyFail: 'Could not copy', saved: n => 'Saved: ' + n, renderFail: 'Could not render the image',
    errNotSvg: 'This doesn\'t look like an SVG file. The logo needs to be an .svg', errBig: 'The file is over 5 MB, which is too much for a logo.',
    errComplex: 'This SVG has too many elements.', removed: 'Scripts and external links were removed from the file. The logo itself is fine.',
    loaded: 'Logo loaded', confirmNew: 'Load another logo? Your current settings will be lost.',
    dropHere: 'Drop the file', footer: 'Logoset is an open source project. Everything runs in your browser; files are never sent anywhere.',
    presetNames: ['Black', 'Ocean', 'Forest', 'Sunset', 'Graphite', 'Berry', 'Sky', 'Gold'],
    demoName: 'Summit', demoTag: 'coffee shop'
  }
};
const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
function t(k, ...a) {
  const v = T[lang][k] !== undefined ? T[lang][k] : T.en[k];
  return typeof v === 'function' ? v(...a) : (v === undefined ? k : v);
}

/* =====================================================================
   theme
   ===================================================================== */
function currentTheme() {
  const s = store.get('lk-theme');
  if (s === 'dark' || s === 'light') return s;
  return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function applyTheme(th) { document.documentElement.setAttribute('data-theme', th); }
applyTheme(currentTheme());

/* =====================================================================
   DOM helpers, icons
   ===================================================================== */
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) for (const k of Object.keys(props)) {
    const v = props[k];
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'html') el.innerHTML = v;            // only with our own constants
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'value' || k === 'checked') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid === null || kid === undefined || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}
const $ = s => document.querySelector(s);
const ICON = {
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
  download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.3-5.6L4 8.7"/><path d="M4 4v4.7h4.7"/>',
  drop: '<path d="M15 4l5 5-9 9H6v-5z"/><path d="M13 6l5 5"/><path d="M6 18l-2 2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  logo: '<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="12" r="2.5"/><path d="M14 10.5h4M14 13.5h3"/>',
  avatar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.5a6.5 6.5 0 0 1 11 0"/>',
  web: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>',
  social: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M10 9.5v5l4.5-2.5z"/>',
  palette: '<path d="M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A4.6 4.6 0 0 0 22 9.8C22 6 17.5 3 12 3z"/><circle cx="7.5" cy="11.5" r="1.2"/><circle cx="10" cy="7.5" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
  zip: '<path d="M12 4v11M7 10l5 5 5-5"/><path d="M5 20h14"/>',
  github: '<path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  split: '<path d="M4 4h6v6H4zM14 14h6v6h-6z"/><path d="M14 4h6v6h-6z" stroke-dasharray="2 2"/>',
  merge: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/>'
};
function icon(name) {
  return h('span', { class: 'ic', 'aria-hidden': 'true',
    html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICON[name] + '</svg>' });
}
function btn(label, o) {
  o = o || {};
  return h('button', { type: 'button', class: 'btn ' + (o.kind || ''), title: o.title, 'aria-label': o.aria || null, disabled: o.disabled, onClick: o.onClick },
    o.icon ? icon(o.icon) : null, label ? h('span', null, label) : null);
}
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
const fmt = n => String(Math.round(n * 100) / 100);

/* =====================================================================
   colors
   ===================================================================== */
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const HEX_RE = /^#[0-9A-F]{6}$/;
function normHex(s) {
  s = String(s || '').trim().toUpperCase();
  if (!s.startsWith('#')) s = '#' + s;
  if (/^#[0-9A-F]{3}$/.test(s)) s = '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
  return HEX_RE.test(s) ? s : null;
}
function hexToRgb(x) { return [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16)); }
function rgbToHex(r, g, b) { return ('#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('')).toUpperCase(); }
function hexToHsv(x) {
  const [r, g, b] = hexToRgb(x).map(v => v / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let hh = 0;
  if (d) { if (mx === r) hh = ((g - b) / d + (g < b ? 6 : 0)); else if (mx === g) hh = (b - r) / d + 2; else hh = (r - g) / d + 4; hh *= 60; }
  return [hh, mx ? d / mx : 0, mx];
}
function hsvToHex(hh, s, v) {
  hh = ((hh % 360) + 360) % 360; s = clamp(s, 0, 1); v = clamp(v, 0, 1);
  const c = v * s, x = c * (1 - Math.abs((hh / 60) % 2 - 1)), m = v - c;
  const [r, g, b] = hh < 60 ? [c, x, 0] : hh < 120 ? [x, c, 0] : hh < 180 ? [0, c, x] : hh < 240 ? [0, x, c] : hh < 300 ? [x, 0, c] : [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}
function hexToHsl(x) {
  const [r, g, b] = hexToRgb(x).map(v => v / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  let hh = 0, s = 0;
  if (d) { s = d / (1 - Math.abs(2 * l - 1)); if (mx === r) hh = ((g - b) / d) % 6; else if (mx === g) hh = (b - r) / d + 2; else hh = (r - g) / d + 4; hh *= 60; if (hh < 0) hh += 360; }
  return [hh, s, l];
}
function hslToHex(hh, s, l) {
  hh = ((hh % 360) + 360) % 360; s = clamp(s, 0, 1); l = clamp(l, 0, 1);
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((hh / 60) % 2 - 1)), m = l - c / 2;
  const [r, g, b] = hh < 60 ? [c, x, 0] : hh < 120 ? [x, c, 0] : hh < 180 ? [0, c, x] : hh < 240 ? [0, x, c] : hh < 300 ? [x, 0, c] : [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}
function luminance(x) {
  const [r, g, b] = hexToRgb(x).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
function cmyk(x) {
  const [r, g, b] = hexToRgb(x).map(v => v / 255);
  const k = 1 - Math.max(r, g, b);
  if (k >= 1) return [0, 0, 0, 100];
  return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k].map(v => Math.round(v * 100));
}
function parseCss(c) {
  const m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i.exec(String(c || '').trim());
  if (!m) return null;
  const a = m[4] === undefined ? 1 : (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
  if (!(a > 0)) return null;
  return { hex: rgbToHex(+m[1], +m[2], +m[3]), a };
}
function suggestions(x) {
  const [hh, s, l] = hexToHsl(x);
  if (s < 0.08) return ['#111111', '#FFFFFF', '#1A4FD6', '#E11D48', '#0E9F6E', '#F59E0B', '#7C3AED', hslToHex(0, 0, l > .5 ? l - .25 : l + .25)];
  return [hslToHex(hh, s, l + .18), hslToHex(hh, s, l - .18), hslToHex(hh + 30, s, l), hslToHex(hh - 30, s, l),
    hslToHex(hh + 180, s, l), hslToHex(hh + 120, s, l), hslToHex(hh, s * .35, l), '#111111', '#FFFFFF'].filter((c, i, a) => a.indexOf(c) === i);
}
let recent = [];
try { recent = JSON.parse(store.get('lp-recent') || '[]').filter(c => HEX_RE.test(c)).slice(0, 10); } catch (e) { recent = []; }
function remember(c) { recent = [c].concat(recent.filter(x => x !== c)).slice(0, 10); store.set('lp-recent', JSON.stringify(recent)); }

/* =====================================================================
   SVG sanitizer — every SVG file is untrusted
   ===================================================================== */
const ALLOWED = new Set(('svg g a switch path rect circle ellipse line polyline polygon text tspan textPath defs ' +
  'linearGradient radialGradient stop clipPath mask pattern symbol use title desc style image marker filter ' +
  'feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap ' +
  'feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feMerge feMergeNode ' +
  'feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence').split(/\s+/));
const SAFE_IMG = /^data:image\/(png|jpe?g|gif|webp);base64,[a-z0-9+/=\s]+$/i;
function cleanCss(css) {
  return String(css).replace(/@import[^;]*;?/gi, '').replace(/url\(\s*(['"]?)(?!#)[^)]*\1\s*\)/gi, 'none')
    .replace(/expression\s*\(/gi, '(').replace(/javascript:/gi, '');
}
function sanitize(text) {
  if (text.length > MAX_FILE) throw new Error(t('errBig'));
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const svg = doc.documentElement;
  if (doc.getElementsByTagName('parsererror').length || !svg || svg.localName !== 'svg' || svg.namespaceURI !== SVG_NS) throw new Error(t('errNotSvg'));
  if (svg.getElementsByTagName('*').length > MAX_NODES) throw new Error(t('errComplex'));
  let removed = 0;
  (function walk(el) {
    for (const child of Array.from(el.childNodes)) {
      if (child.nodeType === 1) {
        if (child.namespaceURI !== SVG_NS || !ALLOWED.has(child.localName)) { child.remove(); removed++; continue; }
        walk(child);
      } else if (child.nodeType !== 3 && child.nodeType !== 4) child.remove();
    }
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase(), local = attr.localName.toLowerCase(), val = attr.value;
      let bad = false;
      if (name.startsWith('on')) bad = true;
      else if (local === 'href') { const v = val.trim(); if (!(v.startsWith('#') || (el.localName === 'image' && SAFE_IMG.test(v)))) bad = true; }
      else if (/javascript:|data:text|vbscript:/i.test(val)) bad = true;
      else if (/url\(\s*['"]?(?!#)/i.test(val)) bad = true;
      else if (name === 'xml:base') bad = true;
      if (bad) { el.removeAttributeNode(attr); removed++; }
      else if (name === 'style') el.setAttribute('style', cleanCss(val));
    }
    if (el.localName === 'style') el.textContent = cleanCss(el.textContent);
  })(svg);
  return { svg, removed };
}

/* =====================================================================
   Logo: sanitized SVG, its color items, its parts and its real (ink) bounds
   ===================================================================== */
const SHADOW_CSS =
  ':host{display:block;width:100%;height:100%}' +
  'svg.lp-root{width:100%;height:100%;display:block;overflow:visible}' +
  '.lp-dim .lp-shape:not(.lp-hit){opacity:.14;transition:opacity .15s}' +
  '.lp-shape{cursor:pointer}';
const SHAPES = 'path,rect,circle,ellipse,line,polyline,polygon,text,tspan,textPath,use';
const NON_VISUAL = new Set(['defs', 'style', 'title', 'desc', 'metadata', 'clipPath', 'mask', 'symbol', 'linearGradient', 'radialGradient', 'pattern', 'filter', 'marker']);
const isGroup = el => el.localName === 'g' || el.localName === 'a' || el.localName === 'switch';
const visualKids = el => Array.from(el.children).filter(c => !NON_VISUAL.has(c.localName));

class Logo {
  constructor(text) {
    const { svg, removed } = sanitize(text);
    this.removed = removed;
    this.host = h('div', { class: 'logo-host offscreen' });
    document.body.append(this.host);
    this.root = this.host.attachShadow({ mode: 'open' });
    this.svg = document.importNode(svg, true);
    this.root.append(h('style', { text: SHADOW_CSS }), this.svg);
    this.fixViewBox();
    this.collect();
    this.measureInk();
    this.hasTextEl = !!this.svg.querySelector('text');
    this.text = new XMLSerializer().serializeToString(this.cleanClone()).replace(/>\s+</g, '><');
  }
  destroy() { this.host.remove(); }
  fixViewBox() {
    const s = this.svg;
    const vb = (s.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);
    if (vb.length === 4 && vb.every(isFinite) && vb[2] > 0 && vb[3] > 0) this.vb = { x: vb[0], y: vb[1], w: vb[2], h: vb[3] };
    else {
      const w = parseFloat(s.getAttribute('width')), hh = parseFloat(s.getAttribute('height'));
      if (w > 0 && hh > 0) this.vb = { x: 0, y: 0, w, h: hh };
      else { const b = s.getBBox(); this.vb = { x: b.x, y: b.y, w: Math.max(1, b.width), h: Math.max(1, b.height) }; }
      s.setAttribute('viewBox', `${this.vb.x} ${this.vb.y} ${this.vb.w} ${this.vb.h}`);
    }
    s.removeAttribute('width'); s.removeAttribute('height');
    if (!s.getAttribute('preserveAspectRatio')) s.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    s.classList.add('lp-root');
  }
  /* every painted color: fills, strokes, gradient stops */
  collect() {
    const items = [], groups = [], index = new Map();
    const add = (el, prop, c) => {
      const it = { el, prop, a: c.a, orig: c.hex, part: null };
      items.push(it);
      let gi = index.get(c.hex);
      if (gi === undefined) { gi = groups.length; index.set(c.hex, gi); groups.push({ orig: c.hex, items: [] }); }
      groups[gi].items.push(it);
    };
    let maxStroke = 0;
    for (const el of this.svg.querySelectorAll(SHAPES)) {
      if (el.closest('clipPath,mask')) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none') continue;
      el.classList.add('lp-shape');
      if (el.localName !== 'line') { const f = parseCss(cs.fill); if (f) add(el, 'fill', f); }
      const s = parseCss(cs.stroke), sw = parseFloat(cs.strokeWidth) || 0;
      if (s && sw !== 0) { add(el, 'stroke', s); maxStroke = Math.max(maxStroke, sw); }
    }
    for (const stop of this.svg.querySelectorAll('stop')) {
      if (stop.closest('clipPath,mask')) continue;
      const c = parseCss(getComputedStyle(stop).stopColor);
      if (c) add(stop, 'stop-color', c);
    }
    groups.sort((a, b) => b.items.length - a.items.length);
    this.items = items; this.groups = groups; this.maxStroke = maxStroke;
  }
  /* the real drawing area, without the empty margins many SVG exports have */
  measureInk() {
    try {
      const b = this.svg.getBBox(), pad = this.maxStroke / 2;
      if (b.width > 0 && b.height > 0) { this.bb = { x: b.x - pad, y: b.y - pad, w: b.width + 2 * pad, h: b.height + 2 * pad }; return; }
    } catch (e) { /* fall through */ }
    this.bb = Object.assign({}, this.vb);
  }
  /* parts for "by part" mode: top-level shapes/groups, with chosen groups split open */
  parts(splits) {
    let base = this.svg;
    for (;;) { const k = visualKids(base); if (k.length === 1 && isGroup(k[0])) base = k[0]; else break; }
    const out = [];
    const walk = (parent, prefix) => {
      visualKids(parent).forEach((el, i) => {
        const key = prefix + i;
        if (isGroup(el) && splits.includes(key) && visualKids(el).length > 1) { walk(el, key + '.'); return; }
        out.push({ key, el });
      });
    };
    walk(base, '');
    this.items.forEach(it => { it.part = null; });
    const parts = [];
    for (const p of out) {
      const its = this.items.filter(it => it.prop !== 'stop-color' && (p.el === it.el || p.el.contains(it.el)));
      if (!its.length) continue;
      its.forEach(it => { it.part = p.key; });
      const colors = [...new Set(its.map(it => it.orig))];
      parts.push({ key: p.key, el: p.el, items: its, colors,
        canSplit: isGroup(p.el) && visualKids(p.el).filter(k => this.items.some(it => k === it.el || k.contains(it.el))).length > 1 });
    }
    this.partList = parts;
    return parts;
  }
  paint(colorOf) {
    for (const it of this.items) {
      const c = colorOf(it), [r, g, b] = hexToRgb(c);
      it.el.style.setProperty(it.prop, it.a < 1 ? `rgba(${r},${g},${b},${it.a})` : c);
    }
  }
  cleanClone() {
    const c = this.svg.cloneNode(true);
    c.querySelectorAll('*').forEach(el => { el.classList.remove('lp-shape', 'lp-hit'); if (el.getAttribute('class') === '') el.removeAttribute('class'); });
    c.classList.remove('lp-root', 'lp-dim');
    if (c.getAttribute('class') === '') c.removeAttribute('class');
    c.setAttribute('xmlns', SVG_NS);
    return c;
  }
  /* <svg> of the logo cropped to its ink, painted with colorOf, placed at x,y,w,h */
  markup(colorOf, x, y, w, hh) {
    this.paint(colorOf);
    const c = this.cleanClone();
    this.paint(liveColor);
    const b = this.bb;
    c.setAttribute('viewBox', `${fmt(b.x)} ${fmt(b.y)} ${fmt(b.w)} ${fmt(b.h)}`);
    c.setAttribute('x', fmt(x)); c.setAttribute('y', fmt(y)); c.setAttribute('width', fmt(w)); c.setAttribute('height', fmt(hh));
    c.setAttribute('overflow', 'visible');
    return new XMLSerializer().serializeToString(c);
  }
  highlight(els) {
    this.svg.querySelectorAll('.lp-hit').forEach(el => el.classList.remove('lp-hit'));
    if (!els || !els.length) { this.svg.classList.remove('lp-dim'); return; }
    els.forEach(el => el.classList.add('lp-hit'));
    this.svg.classList.add('lp-dim');
  }
  groupEls(gi) {
    const g = this.groups[gi]; if (!g) return [];
    const out = [];
    g.items.forEach(it => {
      if (it.prop === 'stop-color') {
        const id = it.el.parentNode && it.el.parentNode.id;
        if (id) this.svg.querySelectorAll('.lp-shape').forEach(s => { const cs = getComputedStyle(s); if ((cs.fill + cs.stroke).includes('#' + id)) out.push(s); });
      } else out.push(it.el);
    });
    return out;
  }
}

/* =====================================================================
   state
   ===================================================================== */
/* ---------- fonts: an open-licensed library (fonts/fonts.json) plus the user's own font ----------
   Text is converted to outlines with opentype.js, so PNG and SVG files look the same everywhere. */
const DEFAULT_FONT = 'manrope';
let FONT_LIST = [];
const fontFiles = new Map();     // 'id|weight' -> Promise<opentype.Font[]>
let customFont = null;           // { name, font } — kept only for this visit, never uploaded
async function loadFontList() {
  try { const r = await fetch(ROOT + 'fonts/fonts.json'); if (r.ok) FONT_LIST = await r.json(); } catch (e) { FONT_LIST = []; }
}
const fontInfo = id => FONT_LIST.find(f => f.id === id) || FONT_LIST.find(f => f.id === DEFAULT_FONT) || FONT_LIST[0];
const nearestWeight = (info, w) => info.weights.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a), info.weights[0]);
function fetchFont(url) {
  return fetch(url).then(r => { if (!r.ok) throw new Error('font'); return r.arrayBuffer(); }).then(buf => window.opentype.parse(buf));
}
function getFonts(id, w) {
  const info = fontInfo(id);
  if (!info || !window.opentype) return Promise.resolve([]);
  const wt = nearestWeight(info, w), key = info.id + '|' + wt;
  if (!fontFiles.has(key)) {
    fontFiles.set(key, Promise.all(info.subsets.map(s => fetchFont(`${ROOT}fonts/${info.id}/${info.id}-${s}-${wt}.woff`).catch(() => null)))
      .then(a => a.filter(Boolean)));
  }
  return fontFiles.get(key);
}
/* fonts ready for drawing: name line and tagline, each with Inter as a fallback for missing letters */
const ready = { name: [], tag: [] };
async function ensureFonts() {
  if (!S || S.hasText) return;
  const fallback = await getFonts('inter', 400);
  if (S.font === 'custom' && customFont) { ready.name = [customFont.font, ...fallback]; ready.tag = ready.name; return; }
  if (S.font === 'custom' || !FONT_LIST.some(f => f.id === S.font)) S.font = DEFAULT_FONT;
  const info = fontInfo(S.font);
  if (!info) return;
  S.weight = nearestWeight(info, S.weight);
  ready.name = [...await getFonts(S.font, S.weight), ...fallback];
  ready.tag = [...await getFonts(S.font, info.weights[0]), ...fallback];
}
/* CSS copies of the fonts, only for showing font names in the picker */
const cssFonts = new Set();
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212,U+FEFF,U+FFFD';
const CYR = 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116';
function cssFamily(id) {
  if (id === 'custom') return customFont ? "'lkf-custom', sans-serif" : 'inherit';
  const info = fontInfo(id);
  if (!info) return 'inherit';
  if (!cssFonts.has(info.id) && document.fonts && window.FontFace) {
    cssFonts.add(info.id);
    const w = nearestWeight(info, 600);
    info.subsets.forEach(s => {
      try { document.fonts.add(new FontFace('lkf-' + info.id, `url(${ROOT}fonts/${info.id}/${info.id}-${s}-${w}.woff)`, { unicodeRange: s === 'latin' ? LATIN : CYR })); } catch (e) { /* ignore */ }
    });
  }
  return `'lkf-${info.id}', sans-serif`;
}
const PRESETS = [
  ['#111111'],
  ['#0E7490', '#083344', '#22D3EE', '#67E8F9'],
  ['#166534', '#0B2E22', '#4ADE80', '#A3E635'],
  ['#EA580C', '#7C2D12', '#FBBF24', '#E11D48'],
  ['#2E2E2E', '#6B7280', '#111111', '#9CA3AF'],
  ['#BE185D', '#4C0519', '#F472B6', '#FDA4AF'],
  ['#2563EB', '#0F172A', '#60A5FA', '#93C5FD'],
  ['#B8860B', '#3B2A06', '#D4AF37', '#F2E9CE']
];
const DEMO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200">
  <g id="mark">
    <circle cx="132" cy="70" r="40" fill="#F2A541"/>
    <g id="mountains">
      <path d="M20 180 L108 62 L196 180 Z" fill="#2F5D62"/>
      <path d="M96 180 L160 100 L224 180 Z" fill="#5E8B7E"/>
    </g>
    <path d="M108 62 L128 88 L116 84 L108 94 L100 84 L88 88 Z" fill="#F4F1EA"/>
  </g>
</svg>`;

let S = null;
let saveTimer = 0, renderTimer = 0;

function defaults(logo, fileName) {
  const s = {
    logo, fileName: fileName || 'logo', name: '', tagline: '',
    hasText: logo.hasTextEl || (logo.bb.w / logo.bb.h > 2.6),
    mode: 'color', map: {}, over: {}, splits: [], sel: 0,
    font: DEFAULT_FONT, weight: 600, caps: false, spacing: 0, textColor: null,
    nameScale: 1, tagScale: 1, gapScale: 1, avatarZoom: 1, socialZoom: 1,
    version: 'color', pbg: 'none', pbgCustom: '#F4F1EA',
    bg: 'white', bgCustom: '#1F2937', tab: 'logo'
  };
  logo.groups.forEach(g => { s.map[g.orig] = g.orig; });
  logo.parts(s.splits);
  if (logo.groups.length < 2 && logo.partList.length > 1) s.mode = 'part';
  return s;
}
function saveState() {
  if (!S) return;
  const o = Object.assign({}, S); delete o.logo; o.s = S.logo.text;
  store.set('lk-project', JSON.stringify(o));
}
function loadState() {
  const raw = store.get('lk-project');
  if (!raw) return null;
  try {
    const o = JSON.parse(raw);
    const logo = new Logo(o.s);
    const st = defaults(logo, o.fileName);
    Object.keys(st.map).forEach(k => { const c = normHex(o.map && o.map[k]); if (c) st.map[k] = c; });
    st.splits = Array.isArray(o.splits) ? o.splits.filter(x => typeof x === 'string' && /^[\d.]+$/.test(x)).slice(0, 200) : [];
    logo.parts(st.splits);
    if (o.over) Object.keys(o.over).forEach(k => { const c = normHex(o.over[k]); if (c && /^[\d.]+$/.test(k)) st.over[k] = c; });
    st.mode = o.mode === 'part' ? 'part' : 'color';
    st.name = String(o.name || '').slice(0, 60); st.tagline = String(o.tagline || '').slice(0, 80);
    st.hasText = !!o.hasText;
    if (typeof o.font === 'string' && /^[a-z0-9-]{1,40}$/.test(o.font) && o.font !== 'custom') st.font = o.font;
    if (Number.isInteger(o.weight) && o.weight >= 100 && o.weight <= 900) st.weight = o.weight;
    ['nameScale', 'tagScale', 'gapScale', 'avatarZoom', 'socialZoom'].forEach(k => { const v = +o[k]; if (v > 0) st[k] = clamp(v, 0.3, 2); });
    st.caps = !!o.caps; st.spacing = clamp(+o.spacing || 0, 0, 0.4);
    st.textColor = normHex(o.textColor) || null;
    if (['color', 'dark', 'black', 'white'].includes(o.version)) st.version = o.version;
    if (['none', 'light', 'dark', 'custom'].includes(o.pbg)) st.pbg = o.pbg;
    st.pbgCustom = normHex(o.pbgCustom) || st.pbgCustom;
    if (['white', 'dark', 'brand', 'custom'].includes(o.bg)) st.bg = o.bg;
    st.bgCustom = normHex(o.bgCustom) || st.bgCustom;
    if (['logo', 'avatar', 'web', 'social', 'palette'].includes(o.tab)) st.tab = o.tab;
    st.sel = Math.max(0, parseInt(o.sel, 10) || 0);
    return st;
  } catch (e) { store.del('lk-project'); return null; }
}
function changed() {
  clearTimeout(saveTimer); saveTimer = setTimeout(saveState, 300);
  clearTimeout(renderTimer); renderTimer = setTimeout(() => { ensureFonts().then(renderMain); }, 90);
}

/* ---------- colors of the logo ---------- */
function baseColor(it) { return (it.part !== null && S.over[it.part]) || S.map[it.orig] || it.orig; }
const liveColor = it => (S ? baseColor(it) : it.orig);
function versionize(c, v) {
  if (v === 'black') return '#000000';
  if (v === 'white') return '#FFFFFF';
  if (v === 'dark') return luminance(c) < 0.09 ? '#FFFFFF' : c;
  return c;
}
const colorFn = v => it => versionize(baseColor(it), v);
function usedColors() {
  const seen = new Map();
  S.logo.items.forEach(it => { const c = baseColor(it); seen.set(c, (seen.get(c) || 0) + 1); });
  return [...seen.entries()].sort((a, b) => b[1] - a[1]).map(e => e[0]);
}
function autoTextColor() {
  let best = '#111111', bl = 2;
  usedColors().forEach(c => { const l = luminance(c); if (l < bl) { bl = l; best = c; } });
  // text reads best in the darkest brand color; if the brand has no dark color, use near-black
  return bl < 0.12 ? best : '#1C1F24';
}
function textColorFor(v) {
  if (v === 'black') return '#000000';
  if (v === 'white') return '#FFFFFF';
  const c = S.textColor || autoTextColor();
  return v === 'dark' ? (luminance(c) < 0.09 ? '#FFFFFF' : c) : c;
}
function brandColor() {
  let best = usedColors()[0] || '#4F46E5', bs = -1;
  usedColors().forEach((c, i) => { const s = hexToHsl(c)[1] * (1 + 1 / (i + 1)); if (s > bs) { bs = s; best = c; } });
  return best;
}
function bgColor() { return S.bg === 'white' ? '#FFFFFF' : S.bg === 'dark' ? '#111318' : S.bg === 'brand' ? brandColor() : S.bgCustom; }
/* which version of the logo reads best on a background */
function versionFor(bg) {
  const mono = contrast('#FFFFFF', bg) >= contrast('#000000', bg) ? 'white' : 'black';
  if (S.bg === 'brand') return mono;
  const v = luminance(bg) > 0.3 ? 'color' : 'dark';
  // small light details (highlights, inner shapes) may blend with the background;
  // switch to a one-color version only when most of the logo would get lost
  const its = S.logo.items.filter(it => it.prop !== 'stop-color');
  if (!its.length) return v;
  const lost = its.filter(it => contrast(versionize(baseColor(it), v), bg) < 1.35).length / its.length;
  return lost <= 0.34 ? v : mono;
}
function logoBg() {
  if (S.pbg === 'light') return '#FFFFFF';
  if (S.pbg === 'dark') return '#111318';
  if (S.pbg === 'custom') return S.pbgCustom;
  return null;
}

/* =====================================================================
   typography & layout
   The rules follow common lockup practice:
   - everything is measured from the logo's real ink bounds, not the file's canvas;
   - text size is set by cap height (the height of a capital H), relative to the icon;
   - the gap between icon and text is proportional to the text size;
   - text is aligned by its ink, not by its box, so centering looks right.
   ===================================================================== */
function capRatio(fonts) {
  const f = fonts[0];
  if (!f) return 0.7;
  const os2 = f.tables && f.tables.os2;
  if (os2 && os2.sCapHeight > 0) return os2.sCapHeight / f.unitsPerEm;
  const b = f.charToGlyph('H').getBoundingBox();
  return b.y2 > 0 ? b.y2 / f.unitsPerEm : 0.7;
}
/* lays a string out glyph by glyph (with kerning), taking missing letters from the fallback font */
function shape(str, fonts, size, track) {
  const ls = track * size, glyphs = [];
  let x = 0, prev = null, prevF = null;
  for (const ch of str) {
    const f = fonts.find(ft => ft.charToGlyphIndex(ch) > 0) || fonts[0];
    const g = f.charToGlyph(ch), sc = size / f.unitsPerEm;
    if (prev && prevF === f) { try { x += f.getKerningValue(prev, g) * sc; } catch (e) { /* no kerning table */ } }
    glyphs.push({ g, x });
    x += g.advanceWidth * sc + ls;
    prev = g; prevF = f;
  }
  let d = '', x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const gl of glyphs) {
    const p = gl.g.getPath(gl.x, 0, size);
    if (!p.commands.length) continue;
    d += p.toPathData(2);
    const b = p.getBoundingBox();
    x1 = Math.min(x1, b.x1); y1 = Math.min(y1, b.y1); x2 = Math.max(x2, b.x2); y2 = Math.max(y2, b.y2);
  }
  if (!isFinite(x1)) { x1 = 0; x2 = 0; y1 = -size * 0.7; y2 = 0; }
  return { d, x1, y1, x2, y2 };
}
const caseOf = s => (S.caps ? s.toUpperCase() : s);
/* one line of text as outlines: size from cap height, placed by its ink */
function textLine(str, cap, fonts, track, color, opacity) {
  const size = cap / capRatio(fonts);
  const s = fonts.length ? shape(str, fonts, size, track) : null;
  const w = s ? s.x2 - s.x1 : 0, asc = s ? -s.y1 : cap, desc = s ? Math.max(0, s.y2) : 0;
  return {
    size, w, asc, desc,
    at(inkLeft, baseline) {
      return {
        svg: s && s.d ? `<path transform="translate(${fmt(inkLeft - s.x1)} ${fmt(baseline)})" d="${s.d}" fill="${color}"${opacity ? ` fill-opacity="${opacity}"` : ''}/>` : '',
        box: [inkLeft, baseline - asc, inkLeft + w, baseline + desc]
      };
    }
  };
}
const hasName = () => !S.hasText && S.name.trim().length > 0;
function layouts() {
  if (S.hasText) return ['full'];
  if (!S.name.trim()) return ['icon'];
  return ['horizontal', 'vertical', 'icon', 'word'];
}
/* returns {inner, x, y, w, h}: markup and its exact bounds */
function compose(layout, v) {
  const lg = S.logo, cf = colorFn(v), tc = textColorFor(v);
  const ratio = lg.bb.w / lg.bb.h;
  const name = caseOf(S.name.trim()), tag = S.tagline.trim();
  const NF = ready.name, TF = ready.tag, ns = S.nameScale, ts = S.tagScale, gs = S.gapScale;
  const tagTrack = S.spacing + 0.06;
  const boxes = [], parts = [];
  const place = p => { parts.push(p.svg); boxes.push(p.box); };
  const icon = (x, y, hh) => { const w = hh * ratio; parts.push(lg.markup(cf, x, y, w, hh)); boxes.push([x, y, x + w, y + hh]); return w; };

  if (layout === 'icon' || layout === 'full' || !name) {
    icon(0, 0, 100);
  } else if (layout === 'horizontal') {
    // icon height 100; for wide icons the text gets a little smaller so the lockup stays balanced
    const iconH = 100, iconW = icon(0, 0, iconH);
    const k = ratio > 1.6 ? 0.88 : 1;
    const capN = (tag ? 0.33 : 0.40) * iconH * k * ns;
    const n = textLine(name, capN, NF, S.spacing, tc);
    const gap = 0.6 * (tag ? 0.33 : 0.40) * iconH * k * gs;
    const tx = iconW + gap;
    if (tag) {
      const capT = 0.4 * capN * ts, gl = 0.66 * capN;
      const tl = textLine(tag, capT, TF, tagTrack, tc, 0.72);
      const block = capN + gl + capT, top = (iconH - block) / 2;
      place(n.at(tx, top + capN)); place(tl.at(tx, top + capN + gl + capT));
    } else {
      place(n.at(tx, (iconH + capN) / 2));
    }
  } else if (layout === 'vertical') {
    const iconH = 100, iconW = iconH * ratio;
    let capN = (tag ? 0.24 : 0.26) * iconH * ns;
    let n = textLine(name, capN, NF, S.spacing, tc);
    const maxW = Math.max(iconW, iconH) * 3 * ns;
    if (n.w > maxW) { capN *= maxW / n.w; n = textLine(name, capN, NF, S.spacing, tc); }
    const capT = 0.42 * capN * ts, tl = tag ? textLine(tag, capT, TF, tagTrack, tc, 0.72) : null;
    const W = Math.max(iconW, n.w, tl ? tl.w : 0);
    icon((W - iconW) / 2, 0, iconH);
    const nb = iconH + 0.95 * (tag ? 0.24 : 0.26) * iconH * gs + capN;
    place(n.at((W - n.w) / 2, nb));
    if (tl) place(tl.at((W - tl.w) / 2, nb + 0.72 * capN + capT));
  } else { // wordmark
    const capN = 40, n = textLine(name, capN, NF, S.spacing, tc);
    const capT = 0.42 * capN * ts, tl = tag ? textLine(tag, capT, TF, tagTrack, tc, 0.72) : null;
    const W = Math.max(n.w, tl ? tl.w : 0);
    place(n.at((W - n.w) / 2, capN));
    if (tl) place(tl.at((W - tl.w) / 2, capN + 0.72 * capN + capT));
  }
  const x0 = Math.min(...boxes.map(b => b[0])), y0 = Math.min(...boxes.map(b => b[1]));
  const x1 = Math.max(...boxes.map(b => b[2])), y1 = Math.max(...boxes.map(b => b[3]));
  return { inner: parts.join(''), x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
/* final picture: W×H canvas, optional background, content fitted into box (centered) */
function scene(W, H, bg, c, box, opts) {
  opts = opts || {};
  const k = Math.min(box.w / c.w, box.h / c.h);
  const cw = c.w * k, ch = c.h * k, x = (W - cw) / 2, y = (H - ch) / 2;
  const clip = 'lk' + Math.random().toString(36).slice(2, 8);
  return `<svg xmlns="${SVG_NS}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    (opts.circle ? `<defs><clipPath id="${clip}"><circle cx="${W / 2}" cy="${H / 2}" r="${Math.min(W, H) / 2}"/></clipPath></defs><g clip-path="url(#${clip})">` : '') +
    (bg ? `<rect width="${W}" height="${H}" fill="${bg}"/>` : '') +
    `<svg x="${fmt(x)}" y="${fmt(y)}" width="${fmt(cw)}" height="${fmt(ch)}" viewBox="${fmt(c.x)} ${fmt(c.y)} ${fmt(c.w)} ${fmt(c.h)}" overflow="visible">${c.inner}</svg>` +
    (opts.circle ? '</g>' : '') + '</svg>';
}
/* logo file: content plus clear space around it, longest side = size */
function logoFile(layout, v, size, bg) {
  const c = compose(layout, v), m = 0.12 * Math.min(c.w, c.h);
  const k = size / (Math.max(c.w, c.h) + 2 * m);
  const W = Math.round((c.w + 2 * m) * k), H = Math.round((c.h + 2 * m) * k);
  return { svg: scene(W, H, bg || null, c, { w: c.w * k, h: c.h * k }), W, H };
}
const iconLayout = () => (S.hasText ? 'full' : 'icon');
function avatarScene(size, circle) {
  const bg = bgColor(), c = compose(iconLayout(), versionFor(bg));
  // fills ~66% of the avatar and stays inside the circle crop
  const k = Math.min(0.66 * size / Math.max(c.w, c.h), 0.9 * size / Math.hypot(c.w, c.h)) * S.avatarZoom;
  return scene(size, size, bg, c, { w: c.w * k, h: c.h * k }, { circle });
}
function faviconScene(size, withBg) {
  const bg = withBg ? bgColor() : null;
  const c = compose(iconLayout(), withBg ? versionFor(bg) : 'color');
  const fill = withBg ? 0.68 : 1;
  return scene(size, size, bg, c, { w: size * fill, h: size * fill });
}
function wideScene(W, H, box) {
  const bg = bgColor(), v = versionFor(bg), z = S.socialZoom;
  return scene(W, H, bg, compose(hasName() ? 'horizontal' : iconLayout(), v), { w: box.w * z, h: box.h * z });
}
function storyScene() {
  const bg = bgColor(), v = versionFor(bg);
  return scene(1080, 1920, bg, compose(hasName() ? 'vertical' : iconLayout(), v), { w: 640 * S.socialZoom, h: 560 * S.socialZoom });
}
/* email signature: white background works in every mail app, including dark mode */
function emailScene() {
  return scene(600, 200, '#FFFFFF', compose(hasName() ? 'horizontal' : iconLayout(), 'color'), { w: 540, h: 140 });
}
const SOCIAL = [
  { id: 'og', label: 'soOg', hint: 'soOgHint', W: 1200, H: 630, box: { w: 720, h: 250 } },
  { id: 'youtube', label: 'soYt', hint: 'soYtHint', W: 2560, H: 1440, box: { w: 1150, h: 300 } },
  { id: 'vk', label: 'soVk', W: 1590, H: 400, box: { w: 860, h: 190 } },
  { id: 'x', label: 'soX', W: 1500, H: 500, box: { w: 780, h: 210 } },
  { id: 'linkedin', label: 'soLi', W: 1584, H: 396, box: { w: 820, h: 180 } }
];
const dataUrl = svg => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
function loadImage(src) { return new Promise((res, rej) => { const img = new Image(); img.onload = () => res(img); img.onerror = () => rej(new Error('img')); img.src = src; }); }
async function toBlob(svg, W, H, type, jpgBg) {
  const img = await loadImage(dataUrl(svg));
  const cv = h('canvas', { width: W, height: H }), ctx = cv.getContext('2d');
  if (type === 'jpg') { ctx.fillStyle = jpgBg || '#FFFFFF'; ctx.fillRect(0, 0, W, H); }
  ctx.drawImage(img, 0, 0, W, H);
  return new Promise((res, rej) => cv.toBlob(b => b ? res(b) : rej(new Error('blob')), type === 'jpg' ? 'image/jpeg' : 'image/png', 0.93));
}
const svgBlob = svg => new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + svg], { type: 'image/svg+xml' });

/* =====================================================================
   files
   ===================================================================== */
const LAYOUT_LABEL = { horizontal: ['lHorizontal', 'lHorizontalHint'], vertical: ['lVertical', 'lVerticalHint'], icon: ['lIcon', 'lIconHint'], word: ['lWord', 'lWordHint'], full: ['lFull', null] };
const VERSIONS = [['color', 'vColor'], ['dark', 'vDark'], ['black', 'vBlack'], ['white', 'vWhite']];
const FILE_V = { color: 'color', dark: 'for-dark-bg', black: 'black', white: 'white' };
const FILE_L = { horizontal: 'horizontal', vertical: 'stacked', icon: 'icon', word: 'wordmark', full: 'logo' };
const baseName = () => safeName(S.name || S.fileName);

function faviconFiles() {
  return [
    { path: 'favicon.ico', make: async () => makeIco(await Promise.all([16, 32, 48].map(async s => new Uint8Array(await (await toBlob(faviconScene(s, false), s, s, 'png')).arrayBuffer()))), [16, 32, 48]) },
    { path: 'favicon.svg', make: async () => svgBlob(faviconScene(64, false)) },
    { path: 'favicon-32x32.png', make: () => toBlob(faviconScene(32, false), 32, 32, 'png') },
    { path: 'apple-touch-icon.png', make: () => toBlob(faviconScene(180, true), 180, 180, 'png') },
    { path: 'icon-512.png', make: () => toBlob(faviconScene(512, true), 512, 512, 'png') }
  ];
}
function allFiles() {
  const b = baseName(), dir = b + '-logoset/', files = [];
  for (const [v] of VERSIONS) for (const l of layouts()) {
    const nm = `${dir}logo/${FILE_V[v]}/${b}-${FILE_L[l]}-${FILE_V[v]}`;
    files.push({ path: nm + '.svg', make: async () => svgBlob(logoFile(l, v, 1000).svg) });
    files.push({ path: nm + '.png', make: async () => { const f = logoFile(l, v, 2000); return toBlob(f.svg, f.W, f.H, 'png'); } });
  }
  files.push({ path: `${dir}avatars/${b}-avatar-square-1080.png`, make: () => toBlob(avatarScene(1080, false), 1080, 1080, 'png') });
  files.push({ path: `${dir}avatars/${b}-avatar-round-1080.png`, make: () => toBlob(avatarScene(1080, true), 1080, 1080, 'png') });
  for (const f of faviconFiles()) files.push({ path: `${dir}website/` + f.path, make: f.make });
  files.push({ path: `${dir}website/how-to-use.html.txt`, make: async () => new Blob([FAVICON_HTML], { type: 'text/plain' }) });
  files.push({ path: `${dir}email/${b}-email-signature-600x200.png`, make: () => toBlob(emailScene(), 600, 200, 'png') });
  for (const s of SOCIAL) files.push({ path: `${dir}social/${b}-${s.id}-${s.W}x${s.H}.png`, make: () => toBlob(wideScene(s.W, s.H, s.box), s.W, s.H, 'png') });
  files.push({ path: `${dir}social/${b}-story-1080x1920.png`, make: () => toBlob(storyScene(), 1080, 1920, 'png') });
  files.push({ path: `${dir}${b}-colors.txt`, make: async () => new Blob([paletteText()], { type: 'text/plain' }) });
  files.push({ path: `${dir}${b}-colors.png`, make: () => paletteImage() });
  return files;
}
const FAVICON_HTML =
`<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">`;

function paletteColors() {
  const cols = usedColors();
  if (hasName()) { const tc = textColorFor('color'); if (!cols.includes(tc)) cols.push(tc); }
  return cols;
}
function paletteText() {
  return (S.name ? S.name + '\n\n' : '') + paletteColors().map((c, i) => {
    const [r, g, b] = hexToRgb(c), [cc, m, y, k] = cmyk(c);
    return `${i + 1}. HEX ${c}   RGB ${r} ${g} ${b}   CMYK ${cc} ${m} ${y} ${k}`;
  }).join('\n') + '\n\nCMYK values are approximate. Ask your print shop for an exact match.\n';
}
async function paletteImage() {
  const cols = paletteColors(), W = 1600, cellH = 520, H = cellH + 140;
  const cv = h('canvas', { width: W, height: H }), ctx = cv.getContext('2d');
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);
  const cw = W / cols.length;
  cols.forEach((c, i) => {
    ctx.fillStyle = c; ctx.fillRect(i * cw, 0, cw + 1, cellH);
    const [r, g, b] = hexToRgb(c);
    ctx.fillStyle = '#14171C'; ctx.font = '700 34px system-ui, sans-serif'; ctx.fillText(c, i * cw + 28, cellH + 56);
    ctx.fillStyle = '#5B6472'; ctx.font = '400 24px system-ui, sans-serif'; ctx.fillText(`RGB ${r} ${g} ${b}`, i * cw + 28, cellH + 98);
  });
  return new Promise((res, rej) => cv.toBlob(b => b ? res(b) : rej(new Error('blob')), 'image/png'));
}
function makeIco(pngs, sizes) {
  const n = pngs.length, head = 6 + 16 * n, total = head + pngs.reduce((a, p) => a + p.length, 0);
  const out = new Uint8Array(total), dv = new DataView(out.buffer);
  dv.setUint16(0, 0, true); dv.setUint16(2, 1, true); dv.setUint16(4, n, true);
  let off = head;
  pngs.forEach((p, i) => {
    const e = 6 + 16 * i, s = sizes[i] >= 256 ? 0 : sizes[i];
    out[e] = s; out[e + 1] = s;
    dv.setUint16(e + 4, 1, true); dv.setUint16(e + 6, 32, true); dv.setUint32(e + 8, p.length, true); dv.setUint32(e + 12, off, true);
    out.set(p, off); off += p.length;
  });
  return new Blob([out], { type: 'image/x-icon' });
}
const CRC_TABLE = (() => { const tb = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; tb[n] = c >>> 0; } return tb; })();
function crc32(buf) { let c = 0xFFFFFFFF; for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function makeZip(entries) {
  const enc = new TextEncoder(), parts = [], central = [], now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  let offset = 0;
  for (const e of entries) {
    const name = enc.encode(e.path), data = e.data, crc = crc32(data);
    const lh = new Uint8Array(30 + name.length), lv = new DataView(lh.buffer);
    lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x0800, true);
    lv.setUint16(10, dosTime, true); lv.setUint16(12, dosDate, true); lv.setUint32(14, crc, true);
    lv.setUint32(18, data.length, true); lv.setUint32(22, data.length, true); lv.setUint16(26, name.length, true);
    lh.set(name, 30);
    const ch = new Uint8Array(46 + name.length), cv = new DataView(ch.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x0800, true);
    cv.setUint16(12, dosTime, true); cv.setUint16(14, dosDate, true); cv.setUint32(16, crc, true);
    cv.setUint32(20, data.length, true); cv.setUint32(24, data.length, true); cv.setUint16(28, name.length, true);
    cv.setUint32(42, offset, true); ch.set(name, 46);
    parts.push(lh, data); central.push(ch); offset += lh.length + data.length;
  }
  const cdSize = central.reduce((a, c) => a + c.length, 0), end = new Uint8Array(22), ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, entries.length, true); ev.setUint16(10, entries.length, true);
  ev.setUint32(12, cdSize, true); ev.setUint32(16, offset, true);
  return new Blob([...parts, ...central, end], { type: 'application/zip' });
}

/* =====================================================================
   small UI pieces
   ===================================================================== */
function toast(m, sticky) {
  const el = $('#toast'); el.textContent = m; el.classList.add('on');
  clearTimeout(toast.tm); if (!sticky) toast.tm = setTimeout(() => el.classList.remove('on'), 2800);
}
function copyText(txt) {
  const ok = () => toast(t('copied'));
  const fallback = () => {
    const ta = h('textarea', { style: { position: 'fixed', opacity: '0' } }); ta.value = txt; document.body.append(ta); ta.select();
    try { document.execCommand('copy') ? ok() : toast(t('copyFail')); } catch (e) { toast(t('copyFail')); }
    ta.remove();
  };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, fallback); else fallback();
}
function downloadBlob(blob, name) {
  const a = h('a', { href: URL.createObjectURL(blob), download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  toast(t('saved', name));
}
function safeName(s) { return String(s || 'logo').replace(/\.svg$/i, '').trim().replace(/[^\wа-яё-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 40) || 'logo'; }

function colorPicker(hex, original, onChange) {
  let [hh, s, v] = hexToHsv(hex), cur = hex;
  const svKnob = h('div', { class: 'knob' }), hueKnob = h('div', { class: 'knob' });
  const sv = h('div', { class: 'sv', role: 'slider', 'aria-label': 'Saturation and brightness', tabindex: '0' }, h('div', { class: 'sv-w' }), h('div', { class: 'sv-b' }), svKnob);
  const hue = h('div', { class: 'hue', role: 'slider', 'aria-label': 'Hue', tabindex: '0' }, hueKnob);
  const big = h('div', { class: 'big-swatch' });
  const hexIn = h('input', { type: 'text', class: 'hex-input', maxlength: '7', spellcheck: 'false', 'aria-label': 'HEX', value: hex });
  const row = h('div', { class: 'pick-row' }, big, hexIn);
  if (window.EyeDropper) row.append(h('button', { type: 'button', class: 'icon-btn', title: t('eyedropper'), 'aria-label': t('eyedropper'), onClick: async () => {
    try { const r = await new window.EyeDropper().open(); const c = normHex(r.sRGBHex); if (c) setHex(c, true); } catch (e) { /* cancelled */ }
  } }, icon('drop')));
  const draw = () => {
    sv.style.backgroundColor = hsvToHex(hh, 1, 1);
    svKnob.style.left = (s * 100) + '%'; svKnob.style.top = ((1 - v) * 100) + '%'; svKnob.style.background = cur;
    hueKnob.style.left = (hh / 360 * 100) + '%'; hueKnob.style.background = hsvToHex(hh, 1, 1);
    big.style.background = cur;
    if (document.activeElement !== hexIn) hexIn.value = cur;
    hexIn.classList.remove('bad');
  };
  const emit = final => { cur = hsvToHex(hh, s, v); draw(); onChange(cur, final); };
  function setHex(c, final) { cur = c; const x = hexToHsv(c); if (x[1] > 0 && x[2] > 0) hh = x[0]; s = x[1]; v = x[2]; draw(); onChange(c, final); }
  const drag = (el, move) => el.addEventListener('pointerdown', e => {
    e.preventDefault(); el.setPointerCapture(e.pointerId); move(e); emit(false);
    const mv = ev => { move(ev); emit(false); };
    const up = () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); emit(true); };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  });
  drag(sv, e => { const r = sv.getBoundingClientRect(); s = clamp((e.clientX - r.left) / r.width, 0, 1); v = 1 - clamp((e.clientY - r.top) / r.height, 0, 1); });
  drag(hue, e => { const r = hue.getBoundingClientRect(); hh = clamp((e.clientX - r.left) / r.width, 0, 1) * 359.9; });
  sv.addEventListener('keydown', e => {
    const d = e.shiftKey ? .1 : .02;
    if (e.key === 'ArrowLeft') s -= d; else if (e.key === 'ArrowRight') s += d; else if (e.key === 'ArrowUp') v += d; else if (e.key === 'ArrowDown') v -= d; else return;
    e.preventDefault(); s = clamp(s, 0, 1); v = clamp(v, 0, 1); emit(true);
  });
  hue.addEventListener('keydown', e => {
    const d = e.shiftKey ? 20 : 4;
    if (e.key === 'ArrowLeft') hh -= d; else if (e.key === 'ArrowRight') hh += d; else return;
    e.preventDefault(); hh = (hh + 360) % 360; emit(true);
  });
  hexIn.addEventListener('input', () => { const c = normHex(hexIn.value); if (c) setHex(c, false); else hexIn.classList.add('bad'); });
  hexIn.addEventListener('change', () => { const c = normHex(hexIn.value); if (c) setHex(c, true); else { hexIn.value = cur; hexIn.classList.remove('bad'); } });
  hexIn.addEventListener('keydown', e => { if (e.key === 'Enter') hexIn.blur(); });
  const chips = (label, list) => list.length ? h('div', { class: 'chip-block' }, h('div', { class: 'lbl-sm', text: label }),
    h('div', { class: 'chips' }, list.map(c => h('button', { type: 'button', class: 'chip', title: c, 'aria-label': c, style: { background: c },
      onClick: () => { setHex(c, true); remember(c); } })))) : null;
  const el = h('div', { class: 'picker' }, sv, hue, row,
    original && original !== hex ? chips(t('original'), [original]) : null, chips(t('ideas'), suggestions(hex)), chips(t('recent'), recent));
  draw();
  return el;
}
/* segmented control */
function seg(options, current, onPick, extra) {
  const wrap = h('div', { class: 'seg', role: 'group' });
  options.forEach(([val, label, dot]) => wrap.append(h('button', { type: 'button', class: 'seg-btn' + (current === val ? ' on' : ''), 'aria-pressed': String(current === val),
    onClick: () => onPick(val) }, dot ? h('span', { class: 'dot' + (dot === 'checker' ? ' checker' : ''), style: dot !== 'checker' ? { background: dot } : null }) : null, label)));
  if (extra) wrap.append(extra);
  return wrap;
}
function customColorBtn(label, active, value, onInput, onDone) {
  const inp = h('input', { type: 'color', 'aria-label': label, value: value.toLowerCase() });
  inp.addEventListener('input', () => onInput(inp.value.toUpperCase()));
  inp.addEventListener('change', () => onDone(inp.value.toUpperCase()));
  return h('label', { class: 'seg-btn' + (active ? ' on' : '') }, h('span', { class: 'dot', style: { background: active ? value : 'conic-gradient(#f43f5e,#f59e0b,#22c55e,#06b6d4,#6366f1,#f43f5e)' } }), label, inp);
}

/* =====================================================================
   app view
   ===================================================================== */
let UI = null;
function topbar() {
  const th = document.documentElement.getAttribute('data-theme');
  return h('header', { class: 'topbar' },
    h('a', { class: 'brand', href: ROOT === './' ? './' : ROOT + (lang === 'ru' ? 'ru/' : '') }, h('span', { class: 'brand-mark', 'aria-hidden': 'true' }), h('span', { text: 'Logoset' })),
    h('div', { class: 'top-actions' },
      btn(t('newLogo'), { icon: 'upload', kind: 'ghost', onClick: () => $('#file').click() }),
      h('a', { class: 'icon-btn plain hide-sm', href: 'https://github.com/harakez/logoset', target: '_blank', rel: 'noopener noreferrer', title: 'GitHub', 'aria-label': 'GitHub' }, icon('github')),
      h('button', { type: 'button', class: 'icon-btn plain', title: th === 'dark' ? t('themeLight') : t('themeDark'), 'aria-label': th === 'dark' ? t('themeLight') : t('themeDark'), onClick: toggleTheme }, icon(th === 'dark' ? 'sun' : 'moon')),
      h('a', { class: 'btn ghost lang', href: t('langHref'), hreflang: lang === 'ru' ? 'en' : 'ru' }, t('langSwitch'))));
}
function toggleTheme() {
  const n = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  store.set('lk-theme', n); applyTheme(n);
  if (S) renderApp(); else syncLandingTheme();
}

function renderApp() {
  const lg = S.logo;
  lg.parts(S.splits);
  lg.paint(liveColor);

  /* 1. logo & name */
  const secLogo = h('section', { class: 'panel' },
    h('h2', null, h('span', { class: 'step', text: '1' }), t('sLogo')),
    S.hasText ? null : h('label', { class: 'field' }, h('span', { text: t('fName') }),
      h('input', { type: 'text', maxlength: '60', placeholder: t('fNamePh'), value: S.name, onInput: e => { S.name = e.target.value; changed(); } })),
    S.hasText ? null : h('label', { class: 'field' }, h('span', { text: t('fTag') }),
      h('input', { type: 'text', maxlength: '80', placeholder: t('fTagPh'), value: S.tagline, onInput: e => { S.tagline = e.target.value; changed(); } })),
    h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: S.hasText, onChange: e => { S.hasText = e.target.checked; renderApp(); saveState(); } }),
      h('span', null, h('b', { text: t('hasText') }), h('small', { text: t('hasTextHint') }))));

  /* 2. colors */
  const live = h('div', { class: 'live' });
  lg.host.className = 'logo-host';
  live.append(lg.host);
  const chipsRow = h('div', { class: 'parts', role: 'tablist' });
  const pickerBox = h('div', { class: 'picker-box' });
  const extraRow = h('div', { class: 'btn-row' });
  const isPart = () => S.mode === 'part';
  const list = () => (isPart() ? lg.partList : lg.groups);
  const elsOf = i => (isPart() ? (lg.partList[i] ? lg.partList[i].items.map(it => it.el) : []) : lg.groupEls(i));
  const colorOfEntry = i => {
    if (isPart()) {
      const p = lg.partList[i]; if (!p) return '#000000';
      return S.over[p.key] || S.map[p.colors[0]] || p.colors[0];
    }
    const g = lg.groups[i]; return g ? S.map[g.orig] : '#000000';
  };
  const swatchStyle = i => {
    if (isPart()) {
      const p = lg.partList[i];
      if (p && !S.over[p.key] && p.colors.length > 1) {
        const cs = p.colors.map(c => S.map[c]); const st = 100 / cs.length;
        return { background: `conic-gradient(${cs.map((c, j) => `${c} ${j * st}% ${(j + 1) * st}%`).join(',')})` };
      }
    }
    return { background: colorOfEntry(i) };
  };
  let flashTimer = 0;
  const flash = i => { lg.highlight(elsOf(i)); clearTimeout(flashTimer); flashTimer = setTimeout(() => lg.highlight(null), 700); };
  const renderChips = () => {
    S.sel = clamp(S.sel, 0, Math.max(0, list().length - 1));
    chipsRow.replaceChildren(...list().map((_, i) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(i === S.sel),
      class: 'part' + (i === S.sel ? ' on' : ''), title: (isPart() ? t('partN', i + 1) : t('colorN', i + 1)),
      onClick: () => { S.sel = i; renderChips(); renderPicker(); flash(i); saveState(); },
      onMouseenter: () => lg.highlight(elsOf(i)), onMouseleave: () => lg.highlight(null) },
      h('span', { class: 'part-sw', style: swatchStyle(i) }), h('span', { class: 'part-n', text: String(i + 1) }))));
  };
  const renderPicker = () => {
    extraRow.replaceChildren();
    if (!list().length || (isPart() && lg.partList.length < 2 && lg.groups.length < 2)) {
      pickerBox.replaceChildren(h('p', { class: 'muted', text: t('oneShape') }));
      if (!list().length) return;
    }
    const i = S.sel, cur = colorOfEntry(i);
    const p = isPart() ? lg.partList[i] : null;
    const orig = isPart() ? (p.colors.length === 1 ? p.colors[0] : null) : lg.groups[i].orig;
    const title = h('div', { class: 'picker-title' }, h('b', { text: isPart() ? t('partN', i + 1) : t('colorN', i + 1) }), h('span', { class: 'mono', text: cur }));
    const pk = colorPicker(cur, orig, (c, final) => {
      if (isPart()) S.over[p.key] = c; else S.map[lg.groups[i].orig] = c;
      lg.paint(liveColor);
      const sw = chipsRow.querySelectorAll('.part-sw')[i]; if (sw) Object.assign(sw.style, swatchStyle(i));
      title.querySelector('.mono').textContent = c;
      changed();
      if (final) remember(c);
    });
    const nodes = [title];
    if (isPart() && p.colors.length > 1 && !S.over[p.key]) nodes.push(h('p', { class: 'hint-box', text: t('multi') }));
    nodes.push(pk);
    if (!(isPart() && lg.partList.length < 2 && lg.groups.length < 2)) pickerBox.replaceChildren(...nodes);
    else pickerBox.append(...nodes);
    if (isPart() && p.canSplit) extraRow.append(btn(t('split'), { icon: 'split', kind: 'small', onClick: () => {
      const c = S.over[p.key]; delete S.over[p.key];
      S.splits.push(p.key); lg.parts(S.splits);
      if (c) lg.partList.filter(x => x.key.startsWith(p.key + '.')).forEach(x => { S.over[x.key] = c; });
      renderChips(); renderPicker(); changed();
    } }));
    if (isPart() && S.splits.length) extraRow.append(btn(t('unsplit'), { icon: 'merge', kind: 'small ghost', onClick: () => {
      S.splits = []; Object.keys(S.over).forEach(k => { if (k.includes('.')) delete S.over[k]; });
      lg.parts(S.splits); S.sel = 0; renderChips(); renderPicker(); lg.paint(liveColor); changed();
    } }));
  };
  live.addEventListener('click', e => {
    const el = e.composedPath().find(n => n && n.classList && n.classList.contains('lp-shape'));
    if (!el) return;
    let i = -1;
    if (isPart()) i = lg.partList.findIndex(p => p.el === el || p.el.contains(el));
    else { const it = lg.items.find(x => x.el === el && x.prop !== 'stroke') || lg.items.find(x => x.el === el); if (it) i = lg.groups.findIndex(g => g.orig === it.orig); }
    if (i >= 0) { S.sel = i; renderChips(); renderPicker(); flash(i); saveState(); }
  });
  const applyPalette = colors => {
    S.over = {};
    lg.groups.forEach((g, i) => { S.map[g.orig] = colors[i % colors.length]; });
    lg.paint(liveColor); renderChips(); renderPicker(); changed();
  };
  const modeSeg = seg([['color', t('byColor')], ['part', t('byPart')]], S.mode, m => { S.mode = m; S.sel = 0; renderApp(); saveState(); });
  const secColors = h('section', { class: 'panel' },
    h('h2', null, h('span', { class: 'step', text: '2' }), t('sColors')),
    modeSeg, h('p', { class: 'muted', text: isPart() ? t('byPartHint') : t('byColorHint') }),
    live, chipsRow, pickerBox, extraRow,
    h('div', { class: 'lbl' }, t('palettes')),
    h('div', { class: 'presets' }, PRESETS.map((p, i) => h('button', { type: 'button', class: 'preset', title: t('presetNames')[i], 'aria-label': t('presetNames')[i], onClick: () => applyPalette(p) },
      p.slice(0, 4).map(c => h('i', { style: { background: c } }))))),
    h('div', { class: 'btn-row' },
      btn(t('shuffle'), { icon: 'shuffle', kind: 'small', onClick: () => {
        const hh = Math.random() * 360, s = 0.5 + Math.random() * 0.35;
        const sch = [[0, 30, -30, 15], [0, 180, 0, 180], [0, 120, 240, 60]][Math.floor(Math.random() * 3)];
        applyPalette(sch.map((d, i) => hslToHex(hh + d, i === 1 ? s * 0.6 : s, [0.42, 0.2, 0.55, 0.32][i])));
      } }),
      btn(t('resetColors'), { icon: 'reset', kind: 'small ghost', onClick: () => {
        lg.groups.forEach(g => { S.map[g.orig] = g.orig; }); S.over = {}; S.textColor = null;
        lg.paint(liveColor); renderChips(); renderPicker(); changed();
      } })));

  /* 3. text */
  let secText = null;
  if (!S.hasText) {
    const fontName = S.font === 'custom' && customFont ? customFont.name : (fontInfo(S.font) || { name: '' }).name;
    const fontBtn = h('button', { type: 'button', class: 'font-select', onClick: openFontPicker, 'aria-label': t('font') + ': ' + fontName },
      h('span', { class: 'fs-name', style: { fontFamily: cssFamily(S.font) }, text: fontName }), h('span', { class: 'fs-more', text: t('change') }));
    const info = S.font === 'custom' ? null : fontInfo(S.font);
    const WN = { 100: 'w100', 200: 'w200', 300: 'w300', 400: 'w400', 500: 'w500', 600: 'w600', 700: 'w700', 800: 'w800', 900: 'w900' };
    const weightSeg = () => seg(info.weights.map(w => [w, t(WN[w])]), nearestWeight(info, S.weight), w => { S.weight = w; wHolder.replaceChildren(weightSeg()); changed(); });
    const wHolder = info && info.weights.length > 1 ? h('div', null, weightSeg()) : null;
    const slider = (label, key, min, max) => {
      const out = h('span', { class: 'val', text: Math.round(S[key] * 100) + '%' });
      return h('label', { class: 'field slider' }, h('span', { class: 'slider-head' }, h('span', { text: label }), out),
        h('input', { type: 'range', min: String(min), max: String(max), step: '0.01', value: String(S[key]), 'data-k': key,
          onInput: e => { S[key] = +e.target.value; out.textContent = Math.round(S[key] * 100) + '%'; changed(); } }));
    };
    const propBox = h('div', { class: 'props' },
      slider(t('nameSize'), 'nameScale', 0.5, 1.8),
      S.tagline.trim() ? slider(t('tagSize'), 'tagScale', 0.5, 1.8) : null,
      slider(t('gapSize'), 'gapScale', 0.2, 2.5),
      h('button', { type: 'button', class: 'linkish small-link', onClick: () => { S.nameScale = 1; S.tagScale = 1; S.gapScale = 1; renderApp(); changed(); } }, t('resetProps')));
    const tcRow = h('div', { class: 'chips' });
    const renderTc = () => {
      const opts = [null].concat(usedColors().slice(0, 6), ['#1A1A1A', '#FFFFFF']).filter((c, i, a) => a.indexOf(c) === i);
      const isCustom = S.textColor && !opts.includes(S.textColor);
      const inp = h('input', { type: 'color', 'aria-label': t('custom'), value: (S.textColor || '#1A1A1A').toLowerCase() });
      inp.addEventListener('input', () => { S.textColor = inp.value.toUpperCase(); changed(); });
      inp.addEventListener('change', () => { S.textColor = inp.value.toUpperCase(); renderTc(); changed(); });
      tcRow.replaceChildren(...opts.map(c => h('button', { type: 'button', class: 'chip' + (c === null ? ' auto' : '') + (S.textColor === c ? ' on' : ''),
        title: c || t('auto'), 'aria-label': c || t('auto'), style: c ? { background: c } : null, text: c ? null : 'A',
        onClick: () => { S.textColor = c; renderTc(); changed(); } })),
        h('label', { class: 'chip custom' + (isCustom ? ' on' : ''), title: t('custom'), style: isCustom ? { background: S.textColor } : null }, inp));
    };
    renderTc();
    secText = h('section', { class: 'panel' },
      h('h2', null, h('span', { class: 'step', text: '3' }), t('sText')),
      h('div', { class: 'lbl' }, t('font')), fontBtn,
      S.font === 'custom' ? h('p', { class: 'muted small', text: t('customFontNote') }) : null,
      wHolder ? h('div', { class: 'lbl' }, t('weight')) : null, wHolder,
      h('label', { class: 'row-field' }, h('input', { type: 'checkbox', checked: S.caps, onChange: e => { S.caps = e.target.checked; changed(); } }), h('span', { text: t('caps') })),
      h('label', { class: 'field slider' }, h('span', { class: 'slider-head' }, h('span', { text: t('spacing') })),
        h('input', { type: 'range', min: '0', max: '0.3', step: '0.01', value: String(S.spacing), onInput: e => { S.spacing = +e.target.value; changed(); } })),
      h('div', { class: 'lbl' }, t('textColor')), tcRow,
      h('div', { class: 'lbl' }, t('proportions')), propBox);
  }

  /* main area */
  const tabs = [['logo', 'tabLogo', 'logo'], ['avatar', 'tabAvatar', 'avatar'], ['web', 'tabWeb', 'web'], ['social', 'tabSocial', 'social'], ['palette', 'tabPalette', 'palette']];
  const tabBar = h('nav', { class: 'tabs', role: 'tablist' }, tabs.map(([id, k, ic]) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(S.tab === id), 'data-t': id,
    class: 'tab' + (S.tab === id ? ' on' : ''), onClick: () => {
      S.tab = id; tabBar.querySelectorAll('.tab').forEach(b => { const on = b.dataset.t === id; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); });
      renderMain(); saveState();
    } }, icon(ic), h('span', { text: t(k) }))));
  const content = h('div', { class: 'content' });

  $('#app').replaceChildren(
    topbar(),
    h('div', { class: 'layout' },
      h('aside', { class: 'sidebar' }, secLogo, secColors, secText),
      h('main', { class: 'main' },
        h('div', { class: 'main-head' }, tabBar, btn(t('downloadAll'), { icon: 'zip', kind: 'primary', onClick: downloadAll })),
        content)),
    h('footer', { class: 'foot' }, h('span', { text: t('footer') }), h('a', { href: 'https://github.com/harakez/logoset', target: '_blank', rel: 'noopener noreferrer', text: 'GitHub' })));
  UI = { content };
  renderChips(); renderPicker();
  ensureFonts().then(renderMain);
}

/* ---------- font picker ---------- */
const CATS = [['all', 'catAll'], ['sans', 'catSans'], ['display', 'catDisplay'], ['serif', 'catSerif'], ['script', 'catScript']];
let fontCat = 'all';
function openFontPicker() {
  const sample = S.name.trim() || 'Brand';
  const search = h('input', { type: 'search', class: 'font-search', placeholder: t('fontSearch'), 'aria-label': t('fontSearch') });
  const list = h('div', { class: 'font-list', role: 'listbox' });
  const cats = h('div', { class: 'chip-tabs' });
  const pick = id => { S.font = id; close(); renderApp(); changed(); };
  const renderList = () => {
    const q = search.value.trim().toLowerCase();
    cats.replaceChildren(...CATS.map(([c, k]) => h('button', { type: 'button', class: 'chip-tab' + (fontCat === c ? ' on' : ''), onClick: () => { fontCat = c; renderList(); } }, t(k))));
    const items = FONT_LIST.filter(f => (fontCat === 'all' || f.cat === fontCat) && (!q || f.name.toLowerCase().includes(q)));
    list.replaceChildren(
      ...(customFont ? [h('button', { type: 'button', role: 'option', class: 'font-item' + (S.font === 'custom' ? ' on' : ''), onClick: () => pick('custom') },
        h('span', { class: 'fi-sample', style: { fontFamily: cssFamily('custom') }, text: caseOf(sample) }), h('span', { class: 'fi-name', text: customFont.name + ' · ' + t('yourFont') }))] : []),
      ...items.map(f => h('button', { type: 'button', role: 'option', 'aria-selected': String(S.font === f.id), class: 'font-item' + (S.font === f.id ? ' on' : ''), onClick: () => pick(f.id) },
        h('span', { class: 'fi-sample', style: { fontFamily: cssFamily(f.id) }, text: caseOf(sample) }),
        h('span', { class: 'fi-name', text: f.name + (f.subsets.includes('cyrillic') ? '' : ' · Latin') }))));
  };
  search.addEventListener('input', renderList);
  const upload = h('input', { type: 'file', accept: '.ttf,.otf,.woff', hidden: true, onChange: e => { const f = e.target.files[0]; e.target.value = ''; if (f) loadCustomFont(f, () => pick('custom')); } });
  const { close } = modal(t('font'), [
    h('div', { class: 'font-tools' }, search, btn(t('uploadFont'), { icon: 'upload', kind: 'small', onClick: () => upload.click() }), upload),
    cats, list, h('p', { class: 'muted small', text: t('fontLicense') })
  ], 'font-modal');
  renderList();
  setTimeout(() => search.focus(), 30);
}
function loadCustomFont(file, done) {
  if (file.size > 15 * 1024 * 1024) { toast(t('fontErr')); return; }
  if (/\.woff2$/i.test(file.name)) { toast(t('woff2Err')); return; }
  const r = new FileReader();
  r.onload = () => {
    try {
      const font = window.opentype.parse(r.result);
      if (!font || !font.unitsPerEm || !font.glyphs || font.glyphs.length < 2) throw new Error('bad');
      const nm = (font.names && (font.names.fullName || font.names.fontFamily) && ((font.names.fullName || font.names.fontFamily).en || Object.values(font.names.fullName || font.names.fontFamily)[0])) || file.name.replace(/\.\w+$/, '');
      customFont = { name: String(nm).slice(0, 40), font };
      try { if (window.FontFace) { const ff = new FontFace('lkf-custom', r.result.slice(0)); ff.load().then(f => document.fonts.add(f)).catch(() => {}); } } catch (e) { /* preview only */ }
      done();
    } catch (e) { toast(t('fontErr')); }
  };
  r.onerror = () => toast(t('fontErr'));
  r.readAsArrayBuffer(file);
}

/* ---------- simple modal and full-size preview ---------- */
function modal(title, body, cls) {
  const prev = document.activeElement;
  const close = () => { ov.remove(); document.removeEventListener('keydown', onKey); document.body.classList.remove('no-scroll'); if (prev && prev.focus) prev.focus(); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  const box = h('div', { class: 'modal ' + (cls || ''), role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
    h('div', { class: 'modal-head' }, h('b', { text: title }), h('button', { type: 'button', class: 'icon-btn plain', 'aria-label': t('close'), onClick: () => close(), html: '<span class="x">×</span>' })),
    h('div', { class: 'modal-body' }, body));
  const ov = h('div', { class: 'overlay', onMousedown: e => { if (e.target === ov) close(); } }, box);
  document.body.append(ov); document.body.classList.add('no-scroll');
  document.addEventListener('keydown', onKey);
  return { close };
}
function openLightbox(src, bg) {
  const prev = document.activeElement;
  const close = () => { ov.remove(); document.removeEventListener('keydown', onKey); document.body.classList.remove('no-scroll'); if (prev && prev.focus) prev.focus(); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  const frame = h('div', { class: 'lb-frame' + (bg ? '' : ' checker'), style: bg ? { background: bg } : null }, h('img', { src, alt: '' }));
  const ov = h('div', { class: 'lightbox', role: 'dialog', 'aria-modal': 'true', onClick: () => close() },
    frame, h('button', { type: 'button', class: 'lb-close', 'aria-label': t('close'), html: '<span class="x">×</span>' }));
  document.body.append(ov); document.body.classList.add('no-scroll');
  document.addEventListener('keydown', onKey);
}

/* ---------- previews ---------- */
function card(title, sub, previewNode, actions, cls) {
  return h('article', { class: 'fcard ' + (cls || '') },
    h('div', { class: 'fprev' }, previewNode),
    h('div', { class: 'fmeta' }, h('div', { class: 'ftext' }, h('b', { text: title }), sub ? h('small', { text: sub }) : null), h('div', { class: 'factions' }, actions)));
}
function pv(svg, bg, cls, ratio) {
  const src = dataUrl(svg), realBg = bg && bg !== '#0000' ? bg : null;
  return h('button', { type: 'button', class: 'pv ' + (cls || '') + (bg ? '' : ' checker'), title: t('zoom'), 'aria-label': t('zoom'),
    style: Object.assign(bg ? { background: bg } : {}, ratio ? { aspectRatio: ratio } : {}), onClick: () => openLightbox(src, realBg) },
    h('img', { src, alt: '', decoding: 'async' }), h('span', { class: 'pv-zoom', 'aria-hidden': 'true', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>' }));
}
function dl(label, fn) {
  return h('button', { type: 'button', class: 'dl', onClick: async e => {
    const b = e.currentTarget; b.disabled = true;
    try { await fn(); } catch (err) { toast(t('renderFail')); } finally { b.disabled = false; }
  } }, icon('download'), h('span', { text: label }));
}
function bgBar(zoomKey) {
  const custom = customColorBtn(t('bgCustom'), S.bg === 'custom', S.bgCustom, c => { S.bg = 'custom'; S.bgCustom = c; changed(); }, c => { S.bg = 'custom'; S.bgCustom = c; renderMain(); saveState(); });
  const bars = [h('div', { class: 'content-bar' }, h('span', { class: 'bar-lbl', text: t('bgLabel') }),
    seg([['white', t('bgWhite'), '#FFFFFF'], ['dark', t('bgDark'), '#111318'], ['brand', t('bgBrand'), brandColor()]], S.bg, b => { S.bg = b; renderMain(); saveState(); }, custom))];
  if (zoomKey) {
    const out = h('span', { class: 'val', text: Math.round(S[zoomKey] * 100) + '%' });
    bars.push(h('div', { class: 'content-bar' }, h('span', { class: 'bar-lbl', text: t('logoSize') }),
      h('div', { class: 'zoom' },
        h('input', { type: 'range', min: '0.5', max: '1.5', step: '0.01', value: String(S[zoomKey]), 'aria-label': t('logoSize'),
          onInput: e => { S[zoomKey] = +e.target.value; out.textContent = Math.round(S[zoomKey] * 100) + '%'; changed(); } }),
        out,
        h('button', { type: 'button', class: 'linkish small-link', onClick: () => { S[zoomKey] = 1; renderMain(); saveState(); } }, t('reset')))));
  }
  return bars;
}
function renderMain() {
  if (!UI || !S) return;
  const box = UI.content, b = baseName(), out = [];
  if (S.tab === 'logo') {
    const vSeg = seg(VERSIONS.map(([v, k]) => [v, t(k), v === 'color' ? brandColor() : v === 'dark' ? '#3B4250' : v === 'black' ? '#000000' : '#FFFFFF']), S.version, v => {
      S.version = v;
      if ((v === 'white' || v === 'dark') && S.pbg !== 'dark' && S.pbg !== 'custom') S.pbg = 'dark';
      if ((v === 'black' || v === 'color') && S.pbg === 'dark') S.pbg = 'none';
      renderMain(); saveState();
    });
    const pCustom = customColorBtn(t('bgCustom'), S.pbg === 'custom', S.pbgCustom, c => { S.pbg = 'custom'; S.pbgCustom = c; changed(); }, c => { S.pbg = 'custom'; S.pbgCustom = c; renderMain(); saveState(); });
    const pSeg = seg([['none', t('bgNone'), 'checker'], ['light', t('bgWhite'), '#FFFFFF'], ['dark', t('bgDark'), '#111318']], S.pbg, p => { S.pbg = p; renderMain(); saveState(); }, pCustom);
    out.push(h('div', { class: 'content-bar' }, h('span', { class: 'bar-lbl', text: t('logoColor') }), vSeg));
    out.push(h('div', { class: 'content-bar' }, h('span', { class: 'bar-lbl', text: t('bgLabel') }), pSeg));
    if (!S.hasText && !S.name.trim()) out.push(h('p', { class: 'note', text: t('noName') }));
    const v = S.version, bg = logoBg();
    const jpgBg = bg || (v === 'white' || v === 'dark' ? '#111318' : '#FFFFFF');
    out.push(h('div', { class: 'grid logos' }, layouts().map(l => {
      const f = logoFile(l, v, 900, bg);
      const [lk, hk] = LAYOUT_LABEL[l], nm = `${b}-${FILE_L[l]}-${FILE_V[v]}`;
      const wide = l === 'horizontal' || l === 'word';
      return card(t(lk), hk ? t(hk) : null, pv(f.svg, bg, 'logo-pv' + (wide ? ' wide' : '')), [
        dl('PNG', async () => { const x = logoFile(l, v, 2000, bg); downloadBlob(await toBlob(x.svg, x.W, x.H, 'png'), nm + '.png'); }),
        dl('JPG', async () => { const x = logoFile(l, v, 2000, jpgBg); downloadBlob(await toBlob(x.svg, x.W, x.H, 'jpg', jpgBg), nm + '.jpg'); }),
        dl('SVG', async () => downloadBlob(svgBlob(logoFile(l, v, 1000, bg).svg), nm + '.svg'))
      ], wide ? 'span2' : '');
    })));
  } else if (S.tab === 'avatar') {
    out.push(...bgBar('avatarZoom'));
    out.push(h('div', { class: 'grid two' },
      card(t('aSquare'), t('aSquareHint') + ' 1080×1080', h('div', { class: 'avatar-pair' }, pv(avatarScene(1080, false), '#0000', 'sq'), pv(avatarScene(1080, true), '#0000', 'sq round')),
        [dl('PNG', async () => downloadBlob(await toBlob(avatarScene(1080, false), 1080, 1080, 'png'), b + '-avatar-square-1080.png')),
         dl('JPG', async () => downloadBlob(await toBlob(avatarScene(1080, false), 1080, 1080, 'jpg', bgColor()), b + '-avatar-square-1080.jpg'))]),
      card(t('aCircle'), t('aCircleHint') + ' 1080×1080', h('div', { class: 'single-pv' }, pv(avatarScene(1080, true), null, 'sq')),
        [dl('PNG', async () => downloadBlob(await toBlob(avatarScene(1080, true), 1080, 1080, 'png'), b + '-avatar-round-1080.png'))])));
  } else if (S.tab === 'web') {
    out.push(...bgBar());
    const mock = h('div', { class: 'browser' },
      h('div', { class: 'browser-tab' }, h('img', { src: dataUrl(faviconScene(64, false)), alt: '' }), h('span', { text: S.name || 'Logoset' })),
      h('div', { class: 'browser-body' },
        h('figure', null, h('img', { src: dataUrl(faviconScene(180, true)), alt: '', class: 'app-icon' }), h('figcaption', { text: '180 px' })),
        [64, 32, 16].map(s => h('figure', null, h('img', { src: dataUrl(faviconScene(64, false)), alt: '', style: { width: s + 'px', height: s + 'px' } }), h('figcaption', { text: s + ' px' })))));
    out.push(h('div', { class: 'grid one' },
      card(t('webIcon'), t('webIconHint'), mock, [dl(t('downloadSet'), async () => {
        const entries = [];
        for (const f of faviconFiles()) entries.push({ path: f.path, data: new Uint8Array(await (await f.make()).arrayBuffer()) });
        downloadBlob(makeZip(entries), b + '-favicon.zip');
      })]),
      card(t('webCode'), t('webCodeHint'), h('pre', { class: 'code' }, FAVICON_HTML), [h('button', { type: 'button', class: 'dl', onClick: () => copyText(FAVICON_HTML) }, icon('copy'), h('span', { text: t('copyCode') }))], 'code-card'),
      card(t('emailSig'), t('emailSigHint') + ' 600×200', h('div', { class: 'mail-mock' },
        h('p', { class: 'mail-line', text: t('mailBye') }), h('p', { class: 'mail-name', text: S.name || 'Logoset' }),
        pv(emailScene(), '#FFFFFF', 'mail-pv', '3/1')),
        [dl('PNG', async () => downloadBlob(await toBlob(emailScene(), 600, 200, 'png'), b + '-email-signature-600x200.png'))])));
  } else if (S.tab === 'social') {
    out.push(...bgBar('socialZoom'));
    out.push(h('div', { class: 'grid social' },
      SOCIAL.map(s => card(t(s.label), (s.hint ? t(s.hint) + ' ' : '') + s.W + '×' + s.H, pv(wideScene(s.W, s.H, s.box), '#0000', 'wide-pv', s.W + '/' + s.H),
        [dl('PNG', async () => downloadBlob(await toBlob(wideScene(s.W, s.H, s.box), s.W, s.H, 'png'), `${b}-${s.id}-${s.W}x${s.H}.png`)),
         dl('JPG', async () => downloadBlob(await toBlob(wideScene(s.W, s.H, s.box), s.W, s.H, 'jpg', bgColor()), `${b}-${s.id}-${s.W}x${s.H}.jpg`))],
        s.W / s.H > 2.5 ? 'span2' : '')),
      card(t('soStory'), t('soStoryHint') + ' 1080×1920', pv(storyScene(), '#0000', 'story', '9/16'),
        [dl('PNG', async () => downloadBlob(await toBlob(storyScene(), 1080, 1920, 'png'), b + '-story-1080x1920.png')),
         dl('JPG', async () => downloadBlob(await toBlob(storyScene(), 1080, 1920, 'jpg', bgColor()), b + '-story-1080x1920.jpg'))], 'story-card')));
  } else {
    out.push(h('div', { class: 'palette-card' },
      h('div', { class: 'pal-head' }, h('div', null, h('b', { text: t('palTitle') }), h('p', { class: 'muted', text: t('palHint') })),
        h('div', { class: 'btn-row' }, btn(t('palCopy'), { icon: 'copy', kind: 'small', onClick: () => copyText(paletteText()) }),
          btn(t('palPng'), { icon: 'download', kind: 'small', onClick: async () => { try { downloadBlob(await paletteImage(), b + '-colors.png'); } catch (e) { toast(t('renderFail')); } } }))),
      h('div', { class: 'swatches' }, paletteColors().map(c => {
        const [r, g, bb] = hexToRgb(c), [cc, m, y, k] = cmyk(c);
        const line = (lbl, val, copy) => h('button', { type: 'button', class: 'code-line', onClick: () => copyText(copy) }, h('span', { text: lbl }), h('b', { text: val }));
        return h('div', { class: 'swatch' }, h('div', { class: 'swatch-color', style: { background: c } }),
          h('div', { class: 'swatch-codes' }, line('HEX', c, c), line('RGB', `${r} ${g} ${bb}`, `${r}, ${g}, ${bb}`), line('CMYK', `${cc} ${m} ${y} ${k}`, `${cc} ${m} ${y} ${k}`)));
      }))));
  }
  box.replaceChildren(...out);
}

async function downloadAll() {
  await ensureFonts();
  const files = allFiles(), entries = [];
  try {
    for (let i = 0; i < files.length; i++) {
      toast(t('building', i + 1, files.length), true);
      const blob = await files[i].make();
      entries.push({ path: files[i].path, data: new Uint8Array(await blob.arrayBuffer()) });
    }
    downloadBlob(makeZip(entries), baseName() + '-logoset.zip');
  } catch (e) { toast(t('renderFail')); }
}

/* =====================================================================
   loading
   ===================================================================== */
function openFile(file) {
  if (!file) return;
  if (file.size > MAX_FILE) { toast(t('errBig')); return; }
  if (!/svg/i.test(file.type) && !/\.svg$/i.test(file.name)) { toast(t('errNotSvg')); return; }
  const r = new FileReader();
  r.onload = () => startWith(String(r.result), file.name);
  r.onerror = () => toast(t('errNotSvg'));
  r.readAsText(file);
}
function startWith(text, name, demo) {
  if (S && !demo && (S.name || S.tagline) && !confirm(t('confirmNew'))) return;
  try {
    const logo = new Logo(text);
    if (S) S.logo.destroy();
    S = defaults(logo, safeName(name));
    if (demo) { S.name = t('demoName'); S.tagline = t('demoTag'); S.hasText = false; }
    fontsReady.then(() => { renderApp(); saveState(); window.scrollTo(0, 0); });
    toast(logo.removed ? t('removed') : t('loaded'));
  } catch (e) { toast(e.message || t('errNotSvg')); }
}
/* the landing page is static HTML; here we only wire its buttons */
function syncLandingTheme() {
  const b = $('#lk-theme'); if (!b) return;
  const th = document.documentElement.getAttribute('data-theme');
  b.replaceChildren(icon(th === 'dark' ? 'sun' : 'moon'));
  b.setAttribute('aria-label', th === 'dark' ? t('themeLight') : t('themeDark'));
  b.title = b.getAttribute('aria-label');
}
function wireLanding() {
  const pick = () => $('#file').click();
  const dz = $('#lk-drop');
  if (dz) { dz.addEventListener('click', pick); dz.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } }); }
  const demo = $('#lk-demo'); if (demo) demo.addEventListener('click', () => startWith(DEMO_SVG, 'demo', true));
  const th = $('#lk-theme'); if (th) th.addEventListener('click', toggleTheme);
  syncLandingTheme();
}

document.body.append(h('input', { type: 'file', id: 'file', accept: '.svg,image/svg+xml', hidden: true, onChange: e => { openFile(e.target.files[0]); e.target.value = ''; } }));
document.body.append(h('div', { class: 'drop', id: 'drop' }, h('div', { text: t('dropHere') })));
let dragDepth = 0;
window.addEventListener('dragenter', e => { if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) { dragDepth++; $('#drop').classList.add('on'); } });
window.addEventListener('dragleave', () => { dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) $('#drop').classList.remove('on'); });
window.addEventListener('dragover', e => e.preventDefault());
window.addEventListener('drop', e => { e.preventDefault(); dragDepth = 0; $('#drop').classList.remove('on'); if (e.dataTransfer.files[0]) openFile(e.dataTransfer.files[0]); });
window.addEventListener('paste', e => {
  if (/input|textarea/i.test(document.activeElement.tagName)) return;
  const f = e.clipboardData && e.clipboardData.files[0];
  if (f) { openFile(f); return; }
  const tx = e.clipboardData && e.clipboardData.getData('text');
  if (tx && /<svg[\s>]/i.test(tx)) startWith(tx, 'pasted');
});
if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (!store.get('lk-theme')) { applyTheme(currentTheme()); if (S) renderApp(); else syncLandingTheme(); } });

const fontsReady = loadFontList();
S = loadState();
if (S) fontsReady.then(renderApp); else wireLanding();
})();
