/* Sets the color theme before the page is drawn, so there is no flash. */
(function () {
  var t = null;
  try { t = localStorage.getItem('lk-theme'); } catch (e) { /* storage blocked */ }
  if (t !== 'dark' && t !== 'light') t = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
})();
