/* fit-header.js
   Fits the NAME (+ blue check), LOCATION and ROLE lines to the combined
   buttons width on phones, in portrait and landscape.
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
  var details = q(".container > header .profile-details");
  if (!h1 || !loc || !role || !badges || !details) return;
  var buttons = Array.prototype.slice.call(badges.querySelectorAll(".btn"));
  var rootStyle = document.documentElement.style;

  /* The button row fills the text column and is the shared line-width reference. */
  function targetWidth() {
    var visibleButtons = buttons.filter(function (button) {
      return button.offsetParent !== null;
    });
    if (!visibleButtons.length) return badges.clientWidth;
    return visibleButtons[visibleButtons.length - 1].getBoundingClientRect().right -
      visibleButtons[0].getBoundingClientRect().left;
  }

  /* One-line width of an element, measured on an invisible copy.
     For the role we measure the FULL typed sentence, not the part typed so far. */
  function naturalWidth(el, prepare) {
    var c = el.cloneNode(true);
    c.removeAttribute("id");
    c.style.setProperty("position", "absolute", "important");
    c.style.setProperty("visibility", "hidden", "important");
    c.style.setProperty("left", "-9999px", "important");
    c.style.setProperty("width", "max-content", "important");
    c.style.setProperty("max-width", "none", "important");
    c.style.setProperty("white-space", "nowrap", "important");
    c.style.setProperty("flex", "none", "important");
    if (prepare) prepare(c);
    el.parentNode.appendChild(c);
    var w = c.getBoundingClientRect().width;
    el.parentNode.removeChild(c);
    return w;
  }

  /* Fit a text line to its share of the button-row width.
     `fixed` = part of the line that does not scale with the font (the check icon). */
  function fit(el, target, fixed, prepare, scale) {
    el.style.removeProperty("font-size");
    var desiredWidth = target * (scale || 1);
    for (var i = 0; i < 5; i++) {
      var fs = parseFloat(getComputedStyle(el).fontSize);
      var w = naturalWidth(el, prepare);
      var scalable = w - fixed;
      if (scalable <= 0 || desiredWidth <= fixed || Math.abs(w - desiredWidth) < 0.5) return;
      var next = Math.max(6, fs * (desiredWidth - fixed) / scalable);
      el.style.setProperty("font-size", next.toFixed(3) + "px", "important");
    }
  }

  function fullRole(c) {
    var t = c.querySelector(".typing");
    var full = null;
    try { if (typeof typingText === "string") full = typingText; } catch (e) {}
    if (t && full) t.textContent = full;
  }

  function apply() {
    if (!PHONE.matches) {
      rootStyle.removeProperty("--profile-photo-height");
      [h1, loc, role].forEach(function (el) { el.style.removeProperty("font-size"); });
      return;
    }
    rootStyle.removeProperty("--profile-photo-height");
    var target = targetWidth();
    if (!target) return;

    var img = h1.querySelector("img");
    var gap = parseFloat(getComputedStyle(h1).columnGap) || 0;
    var fixedH1 = (img ? img.getBoundingClientRect().width : 0) + (img ? gap : 0);

    fit(h1, target, fixedH1);
    fit(loc, target, 0, null, 0.9);
    fit(role, target, 0, fullRole, 0.95);

    var textHeight = h1.getBoundingClientRect().height +
      loc.getBoundingClientRect().height +
      role.getBoundingClientRect().height +
      (parseFloat(getComputedStyle(details).gap) || 0) * 2;
    var neededHeight = Math.ceil(textHeight + badges.getBoundingClientRect().height);
    var baseHeight = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--profile-photo-height")
    ) || 0;
    if (neededHeight > baseHeight) {
      rootStyle.setProperty("--profile-photo-height", neededHeight + "px");
    }
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
