/* fit-header.js
   Makes the NAME (+ blue check), LOCATION and ROLE lines exactly as long as the
   buttons row (Download Resume -> Call Me) on phones, in portrait and landscape.
   The buttons row is the reference and is never changed.
   Load it AFTER js/script.js:  <script src="js/fit-header.js"></script> */
(function () {
  var PHONE = window.matchMedia(
    "(max-width: 600px), (orientation: landscape) and (max-height: 500px)"
  );

  var q = function (s) { return document.querySelector(s); };
  var h1      = q(".container > header .hero h1");
  var loc     = q(".container > header .sub.location");
  var role    = q(".container > header .sub.role");
  var badges  = q(".container > header .badges");
  if (!h1 || !loc || !role || !badges) return;

  /* Width of the buttons row: left edge of the first visible pill to the
     right edge of the last visible pill. */
  function targetWidth() {
    var btns = Array.prototype.filter.call(
      badges.querySelectorAll(".btn"),
      function (b) { return b.offsetParent !== null; }
    );
    if (!btns.length) return 0;
    return btns[btns.length - 1].getBoundingClientRect().right -
           btns[0].getBoundingClientRect().left;
  }

  /* One-line width of an element, measured on an invisible copy.
     For the role we measure the FULL typed sentence, not the part typed so far. */
  function naturalWidth(el, prepare) {
    var c = el.cloneNode(true);
    c.removeAttribute("id");
    c.style.position = "absolute";
    c.style.visibility = "hidden";
    c.style.left = "-9999px";
    c.style.width = "max-content";
    c.style.maxWidth = "none";
    c.style.whiteSpace = "nowrap";
    if (prepare) prepare(c);
    el.parentNode.appendChild(c);
    var w = c.getBoundingClientRect().width;
    el.parentNode.removeChild(c);
    return w;
  }

  /* Change the font size until the line is exactly `target` px long.
     `fixed` = part of the line that does not scale with the font (the check icon). */
  function fit(el, target, fixed, prepare) {
    el.style.removeProperty("font-size");
    for (var i = 0; i < 5; i++) {
      var fs = parseFloat(getComputedStyle(el).fontSize);
      var w = naturalWidth(el, prepare);
      var scalable = w - fixed;
      if (scalable <= 0 || Math.abs(w - target) < 0.2) return;
      var next = fs * (target - fixed) / scalable;
      el.style.setProperty("font-size", next.toFixed(3) + "px", "important");
    }
  }

  function fullRole(c) {
    var t = c.querySelector(".typing");
    var full = null;
    try { if (typeof text === "string") full = text; } catch (e) {}
    if (t && full) t.textContent = full;
  }

  function apply() {
    if (!PHONE.matches) {
      [h1, loc, role].forEach(function (el) { el.style.removeProperty("font-size"); });
      return;
    }
    var target = targetWidth();
    if (!target) return;

    var img = h1.querySelector("img");
    var gap = parseFloat(getComputedStyle(h1).columnGap) || 0;
    var fixedH1 = (img ? img.getBoundingClientRect().width : 0) + (img ? gap : 0);

    fit(h1, target, fixedH1);
    fit(loc, target, 0);
    fit(role, target, 0, fullRole);
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; apply(); });
  }

  window.addEventListener("load", schedule);
  window.addEventListener("resize", schedule);
  window.addEventListener("orientationchange", function () { setTimeout(schedule, 150); });
  if (PHONE.addEventListener) PHONE.addEventListener("change", schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  schedule();
})();
