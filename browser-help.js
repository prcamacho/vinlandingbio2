export function isInstagramBrowser(userAgent) {
  return /Instagram/i.test(userAgent);
}

export function getChromeLink(target, userAgent) {
  let url;
  try {
    url = new URL(target);
  } catch {
    return null;
  }
  if (!["https:", "http:"].includes(url.protocol)) return null;
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    const scheme = url.protocol === "https:" ? "googlechromes:" : "googlechrome:";
    return scheme + url.href.slice(url.protocol.length);
  }
  if (/Android/i.test(userAgent)) {
    const scheme = url.protocol.slice(0, -1);
    const address = `${url.host}${url.pathname}${url.search}`;
    return `intent://${address}#Intent;scheme=${scheme};package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url.href)};end`;
  }
  return null;
}

let initialized = false;

export function setupInstagramHelp(userAgent = navigator.userAgent) {
  if (initialized || !isInstagramBrowser(userAgent)) return;
  const tip = document.querySelector("#external-browser-tip");
  const dialog = document.querySelector("#external-browser-help");
  const photoLink = document.querySelector(".destination");
  const chromeLink = document.querySelector("#browser-help-chrome");
  const copyButton = document.querySelector("#browser-help-copy");
  const status = document.querySelector("#browser-help-status");
  const destination = document.querySelector("#browser-help-destination");
  if (!tip || !dialog || !photoLink || !chromeLink || !copyButton || !status || !destination) return;
  initialized = true;
  let pendingUrl = "https://bio2.vinsalta.com/";
  tip.hidden = false;

  function showHelp(target) {
    const url = new URL(target);
    pendingUrl = url.href;
    const chromeUrl = getChromeLink(pendingUrl, userAgent);
    chromeLink.hidden = !chromeUrl;
    chromeLink.href = chromeUrl || pendingUrl;
    destination.textContent = url.hostname;
    status.textContent = "";
    copyButton.textContent = "Copiar enlace";
    if (!dialog.open) dialog.showModal();
  }

  tip.addEventListener("click", () => showHelp("https://bio2.vinsalta.com/"));
  photoLink.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showHelp(photoLink.href);
  });
  dialog.querySelector(".browser-help__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  chromeLink.addEventListener("click", () => {
    status.textContent = "Si no se abre, usá el menú ⋯ de Instagram.";
  });
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pendingUrl);
      copyButton.textContent = "Enlace copiado";
      status.textContent = "Pegalo en tu navegador para continuar.";
    } catch {
      status.textContent = "No se pudo copiar. Usá el menú ⋯ de Instagram para abrirlo.";
    }
  });
}

if (typeof document !== "undefined") setupInstagramHelp();
