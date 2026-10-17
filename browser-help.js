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
  const dialog = document.querySelector("#external-browser-help");
  const photoLink = document.querySelector(".destination");
  const chromeLink = document.querySelector("#browser-help-chrome");
  const otherButton = document.querySelector("#browser-help-other");
  const arrow = document.querySelector("#browser-help-arrow");
  if (!dialog || !photoLink || !chromeLink || !otherButton || !arrow) return;
  initialized = true;

  function resetArrow() {
    arrow.hidden = true;
    otherButton.setAttribute("aria-expanded", "false");
  }

  photoLink.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const chromeUrl = getChromeLink(photoLink.href, userAgent);
    chromeLink.hidden = !chromeUrl;
    chromeLink.href = chromeUrl || photoLink.href;
    resetArrow();
    if (!dialog.open) dialog.showModal();
  });
  otherButton.addEventListener("click", () => {
    arrow.hidden = false;
    otherButton.setAttribute("aria-expanded", "true");
  });
  dialog.querySelector(".browser-help__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", resetArrow);
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
}

if (typeof document !== "undefined") setupInstagramHelp();
