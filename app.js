(() => {
  const root = document.documentElement;

  const cancelDefault = (event) => {
    if (event.cancelable) event.preventDefault();
  };
  document.addEventListener("contextmenu", cancelDefault);
  document.addEventListener("selectstart", cancelDefault);
  document.addEventListener("dragstart", cancelDefault);
  document.addEventListener("keydown", (event) => {
    const zoomKey = ["+", "=", "-", "_", "0"].includes(event.key);
    if ((event.ctrlKey || event.metaKey) && zoomKey) cancelDefault(event);
  });
  document.addEventListener("wheel", (event) => {
    if (event.ctrlKey) cancelDefault(event);
  }, { passive: false });
  document.addEventListener("touchstart", (event) => {
    if (event.touches.length > 1) cancelDefault(event);
  }, { passive: false });
  for (const gesture of ["gesturestart", "gesturechange", "gestureend"]) {
    document.addEventListener(gesture, cancelDefault, { passive: false });
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const photoLink = document.querySelector(".destination");
  const hoverAvailable = window.matchMedia("(hover: hover) and (pointer: fine)");
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  photoLink.addEventListener("pointermove", (event) => {
    if (!hoverAvailable.matches || event.pointerType !== "mouse") return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      const bounds = photoLink.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (pointerX - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (pointerY - bounds.top) / bounds.height));
      photoLink.style.setProperty("--move-x", `${(0.5 - x) * 12}px`);
      photoLink.style.setProperty("--move-y", `${(0.5 - y) * 12}px`);
      photoLink.style.setProperty("--spot-x", `${x * 100}%`);
      photoLink.style.setProperty("--spot-y", `${y * 100}%`);
      pointerFrame = 0;
    });
  });
  photoLink.addEventListener("pointerleave", () => {
    window.cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    for (const property of ["--move-x", "--move-y", "--spot-x", "--spot-y"]) {
      photoLink.style.removeProperty(property);
    }
  });

  root.classList.add("is-loading");
  const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  let revealed = false;
  function reveal() {
    if (revealed) return;
    revealed = true;
    root.classList.add("is-revealing");
    window.setTimeout(() => root.classList.remove("is-loading", "is-revealing"), 700);
  }
  // Keep the intro brief on slow connections. The link works without JavaScript.
  const safetyTimeout = window.setTimeout(reveal, 1800);
  const imagesReady = Promise.allSettled(Array.from(document.images, (image) => image.decode()));
  Promise.all([delay(1050), imagesReady, document.fonts.ready])
    .then(() => { window.clearTimeout(safetyTimeout); reveal(); })
    .catch(reveal);
})();
