(function () {
  "use strict";

  /* ---------------- Data ---------------- */

  // Wedding: Saturday 19 Dec 2026, 11:00 West Africa Time (UTC+1)
  var WEDDING = new Date("2026-12-19T11:00:00+01:00");

  var couplePhotos = [
    { src: "couple-01.jpg", caption: "Always you", r: -4 },
    { src: "couple-02.jpg", caption: "Rooted in love", r: 3 },
    { src: "couple-03.jpg", caption: "By the water", r: -2 },
    { src: "couple-04.jpg", caption: "Side by side", r: 4 },
    { src: "couple-05.jpg", caption: "Forever smiling", r: -3 }
  ];

  // Pre-wedding photoshoot, in three chapters. First image of each is the large lead.
  var shootChapters = [
    {
      num: "I", title: "Rooted in Heritage", line: "In traditional attire, woven stripes and gold.",
      photos: [["heritage-1", 1600, 2000], ["heritage-2", 1333, 2000], ["heritage-3", 1333, 2000], ["heritage-4", 1333, 2000], ["heritage-5", 1333, 2000]]
    },
    {
      num: "II", title: "Honour & Grace", line: "His uniform, her burgundy gown.",
      photos: [["honour-1", 1600, 2000], ["honour-2", 1333, 2000], ["honour-3", 1600, 2000], ["honour-4", 1333, 2000], ["honour-5", 1333, 2000]]
    },
    {
      num: "III", title: "Simply Us", line: "Denim, bare feet and easy laughter.",
      photos: [["simply-1", 1600, 2000], ["simply-2", 1600, 2000], ["simply-3", 1600, 2000], ["simply-4", 1600, 2000], ["simply-5", 1440, 2000]]
    }
  ];

  // [file, width, height] of the curated traditional-wedding photos
  var tradPhotos = [
    ["trad-27.jpg", 1023, 1280], ["trad-26.jpg", 1210, 864], ["trad-01.jpg", 1130, 807],
    ["trad-10.jpg", 838, 1173], ["trad-28.jpg", 1023, 1280], ["trad-02.jpg", 1210, 864],
    ["trad-06.jpg", 1210, 864], ["trad-14.jpg", 1210, 864], ["trad-29.jpg", 1023, 1280],
    ["trad-04.jpg", 740, 1035], ["trad-12.jpg", 1210, 864], ["trad-31.jpg", 1051, 841],
    ["trad-03.jpg", 1162, 830], ["trad-30.jpg", 840, 1049], ["trad-24.jpg", 1210, 864],
    ["trad-25.jpg", 1210, 864], ["trad-32.jpg", 1145, 916], ["trad-18.jpg", 864, 1210],
    ["trad-23.jpg", 1210, 864], ["trad-33.jpg", 1280, 853], ["trad-34.jpg", 1165, 932],
    ["trad-35.jpg", 1280, 1023], ["trad-11.jpg", 826, 1157], ["trad-21.jpg", 1191, 851]
  ];
  var INITIAL_VISIBLE = 12;

  /* ---------------- Navigation ---------------- */

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });

  /* ---------------- Countdown ---------------- */

  var countdown = document.getElementById("countdown");
  var units = {};
  countdown.querySelectorAll("[data-unit]").forEach(function (el) {
    units[el.getAttribute("data-unit")] = el;
  });
  var timer;

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function tick() {
    var diff = WEDDING.getTime() - Date.now();
    if (diff <= 0) {
      clearInterval(timer);
      countdown.className = "countdown countdown--done";
      countdown.textContent = diff > -1000 * 60 * 60 * 24 ? "Today is the day!" : "Just married!";
      return;
    }
    var s = Math.floor(diff / 1000);
    units.days.textContent = Math.floor(s / 86400);
    units.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    units.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    units.seconds.textContent = pad(s % 60);
  }
  tick();
  timer = setInterval(tick, 1000);

  /* ---------------- Photoshoot chapters ---------------- */

  var chapters = document.getElementById("chapters");
  shootChapters.forEach(function (ch, ci) {
    var wrap = document.createElement("article");
    wrap.className = "chapter" + (ci % 2 ? " chapter--flip" : "");
    var html =
      '<header class="chapter__head reveal"><span class="chapter__num">' + ch.num + "</span>" +
      '<h3 class="chapter__title">' + ch.title + '</h3><p class="chapter__line">' + ch.line + "</p></header>" +
      '<div class="mosaic">';
    ch.photos.forEach(function (p, i) {
      html +=
        '<button type="button" class="mosaic__item reveal' + (i === 0 ? " mosaic__item--lead" : "") + '"' +
        ' data-lightbox="/assets/images/shoot/' + p[0] + '.jpg" data-group="shoot"' +
        ' data-caption="' + ch.title + '" aria-label="View photo: ' + ch.title + " " + (i + 1) + '">' +
        '<img src="/assets/images/shoot/' + (i === 0 ? "" : "thumbs/") + p[0] + '.jpg" alt="Chat and John, ' +
        ch.title + " photo " + (i + 1) + '" loading="lazy" width="' + p[1] + '" height="' + p[2] + '" /></button>';
    });
    wrap.innerHTML = html + "</div>";
    chapters.appendChild(wrap);
  });

  /* ---------------- Polaroids ---------------- */

  var polaroids = document.getElementById("polaroids");
  couplePhotos.forEach(function (p, i) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "polaroid reveal";
    btn.style.setProperty("--r", p.r + "deg");
    btn.setAttribute("data-lightbox", "/assets/images/couple/" + p.src);
    btn.setAttribute("data-group", "couple");
    btn.setAttribute("data-caption", p.caption);
    btn.setAttribute("aria-label", "View photo: " + p.caption);
    btn.innerHTML =
      '<img src="/assets/images/couple/thumbs/' + p.src + '" alt="Chat and John — ' + p.caption +
      '" loading="lazy" width="405" height="720" /><span>' + p.caption + "</span>";
    polaroids.appendChild(btn);
  });

  /* ---------------- Traditional wedding gallery ---------------- */

  var gallery = document.getElementById("gallery");
  var moreBtn = document.getElementById("galleryMore");

  tradPhotos.forEach(function (p, i) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gallery__item" + (i >= INITIAL_VISIBLE ? " is-hidden" : "");
    btn.setAttribute("data-lightbox", "/assets/images/trad/" + p[0]);
    btn.setAttribute("data-group", "trad");
    btn.setAttribute("data-caption", "Traditional Wedding · 10 October 2026");
    btn.setAttribute("aria-label", "View traditional wedding photo " + (i + 1) + " of " + tradPhotos.length);
    btn.innerHTML =
      '<img src="/assets/images/trad/thumbs/' + p[0] + '" alt="Traditional wedding photo ' + (i + 1) +
      '" loading="lazy" width="' + p[1] + '" height="' + p[2] + '" />';
    gallery.appendChild(btn);
  });

  if (tradPhotos.length <= INITIAL_VISIBLE) {
    moreBtn.parentElement.hidden = true;
  }
  moreBtn.addEventListener("click", function () {
    var expanded = moreBtn.getAttribute("data-expanded") === "true";
    gallery.querySelectorAll(".gallery__item").forEach(function (el, i) {
      if (i >= INITIAL_VISIBLE) el.classList.toggle("is-hidden", expanded);
    });
    moreBtn.setAttribute("data-expanded", String(!expanded));
    moreBtn.textContent = expanded ? "View all photos" : "Show fewer";
    if (expanded) document.getElementById("traditional").scrollIntoView();
  });

  /* ---------------- Lightbox ---------------- */

  var lb = document.getElementById("lightbox");
  var lbImg = lb.querySelector("img");
  var lbCap = lb.querySelector("figcaption");
  var items = [];
  var index = 0;
  var lastFocus = null;

  function visibleGroup(group) {
    return Array.prototype.filter.call(
      document.querySelectorAll('[data-lightbox][data-group="' + group + '"]'),
      function (el) { return !el.classList.contains("is-hidden"); }
    );
  }

  function show(i) {
    index = (i + items.length) % items.length;
    var el = items[index];
    lbImg.src = el.getAttribute("data-lightbox");
    lbImg.alt = el.getAttribute("data-caption") || "";
    var cap = el.getAttribute("data-caption") || "";
    lbCap.textContent = items.length > 1 ? cap + "  ·  " + (index + 1) + " / " + items.length : cap;
  }

  function open(el) {
    var group = el.getAttribute("data-group");
    items = group ? visibleGroup(group) : [el];
    lb.classList.toggle("is-single", items.length < 2);
    lastFocus = el;
    show(items.indexOf(el));
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lb.querySelector(".lightbox__close").focus();
  }

  function close() {
    lb.hidden = true;
    lbImg.removeAttribute("src");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-lightbox]");
    if (trigger) open(trigger);
  });
  lb.querySelector(".lightbox__close").addEventListener("click", close);
  lb.querySelector(".lightbox__prev").addEventListener("click", function () { show(index - 1); });
  lb.querySelector(".lightbox__next").addEventListener("click", function () { show(index + 1); });
  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target.classList.contains("lightbox__figure")) close();
  });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(index - 1);
    else if (e.key === "ArrowRight") show(index + 1);
    else if (e.key === "Tab") {
      // keep focus inside the dialog
      var closeBtn = lb.querySelector(".lightbox__close");
      var f = items.length > 1
        ? [closeBtn, lb.querySelector(".lightbox__prev"), lb.querySelector(".lightbox__next")]
        : [closeBtn];
      var first = f[0], last = f[f.length - 1];
      if (f.length === 1) { e.preventDefault(); closeBtn.focus(); return; }
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Swipe on touch devices
  var startX = null;
  lb.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (startX === null || items.length < 2) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  /* ---------------- RSVP → WhatsApp ---------------- */

  var form = document.getElementById("rsvpForm");
  var attendFields = document.getElementById("attendFields");
  var formError = document.getElementById("formError");

  form.addEventListener("change", function (e) {
    if (e.target.name === "attending") {
      attendFields.classList.toggle("is-hidden", e.target.value === "no");
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var name = (data.get("name") || "").trim();
    if (!name) {
      formError.textContent = "Please enter your name.";
      form.elements.name.focus();
      return;
    }
    formError.textContent = "";

    var attending = data.get("attending") === "yes";
    var lines = ["Hello! RSVP for Chat & John's wedding (#JCLoveisthegreatest)", "", "Name: " + name];

    if (attending) {
      var events = data.getAll("events");
      if (!events.length) {
        formError.textContent = "Please tick at least one event you'll attend.";
        return;
      }
      lines.push("Attending: Yes, joyfully!");
      lines.push("Guests: " + data.get("guests"));
      lines.push("Events: " + events.join(", "));
    } else {
      lines.push("Attending: Regretfully, I won't be able to make it.");
    }

    var note = (data.get("note") || "").trim();
    if (note) lines.push("", "Note: " + note);

    var url = "https://wa.me/" + data.get("to") + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  });

  /* ---------------- Scroll reveal ---------------- */

  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
