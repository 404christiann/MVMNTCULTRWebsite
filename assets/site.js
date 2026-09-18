// MVMNT CULTR — site scripts. Shared by index.html, about/ and contact/.

/* ============ NAV ============ */
(() => {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const burger = nav.querySelector(".nav-burger");
  const menu = nav.querySelector(".mobile-menu");
  const links = nav.querySelector(".nav-links");
  const glider = nav.querySelector(".nav-glider");
  const mobile = window.matchMedia("(max-width: 860px)");
  const darkSections = [...document.querySelectorAll("[data-dark]")];

  // The nav goes light once it sits over a light section; over the dark hero,
  // banners and dark rows it stays glass with white text.
  const updateTone = () => {
    const probe = mobile.matches ? 32 : 50;
    const overDark = darkSections.some((section) => {
      const box = section.getBoundingClientRect();
      return box.top <= probe && box.bottom >= probe;
    });
    nav.classList.toggle("is-light", !overDark);
  };

  const placeGlider = (target) => {
    if (!glider || !links) return;
    const link = target instanceof Element ? target : links.querySelector('a[aria-current="page"]');
    if (!link || !link.offsetWidth) {
      glider.style.width = "0";
      return;
    }
    glider.style.width = `${link.offsetWidth}px`;
    glider.style.transform = `translateX(${link.offsetLeft}px)`;
  };

  if (links) {
    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("mouseenter", () => placeGlider(link));
      link.addEventListener("focus", () => placeGlider(link));
    });
    links.addEventListener("mouseleave", () => placeGlider());
    links.addEventListener("focusout", () => placeGlider());
  }

  let previousOverflow = null;
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open && previousOverflow === null) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else if (!open && previousOverflow !== null) {
      document.body.style.overflow = previousOverflow;
      previousOverflow = null;
    }
  };

  if (burger && menu) {
    burger.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));

    nav.addEventListener("keydown", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        burger.focus({ preventScroll: true });
      } else if (event.key === "Tab") {
        // Keep focus inside the open menu: burger -> links -> Book Now -> burger
        const lastLink = menu.querySelector("a:last-child");
        if (event.shiftKey && document.activeElement === burger) {
          event.preventDefault();
          lastLink.focus();
        } else if (!event.shiftKey && document.activeElement === lastLink) {
          event.preventDefault();
          burger.focus();
        }
      }
    });
  }

  mobile.addEventListener("change", () => {
    if (!mobile.matches) setOpen(false);
    updateTone();
    placeGlider();
  });

  updateTone();
  window.addEventListener("scroll", updateTone, { passive: true });
  window.addEventListener("resize", () => placeGlider());
  if (document.fonts) document.fonts.ready.then(() => placeGlider());
  placeGlider();
})();

/* ============ MOTION ============ */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Split text into words (blur 4px / 12px, like the reference H1) or chars (blur 10px / 20px, like its subtitle).
  document.querySelectorAll("[data-split]").forEach((el) => {
    const mode = el.dataset.split;
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.textContent = "";
    let i = 0;
    words.forEach((word, w) => {
      const wrap = document.createElement("span");
      wrap.className = "bx-word";
      wrap.setAttribute("aria-hidden", "true");
      const units = mode === "chars" ? [...word] : [word];
      units.forEach((u) => {
        const s = document.createElement("span");
        s.className = "bx-split-unit";
        s.textContent = u;
        const step = mode === "chars" ? 12 : 70;
        const base = el.hasAttribute("data-hero") ? (mode === "chars" ? 550 : 250) : 0;
        s.style.setProperty("--d", `${base + i * step}ms`);
        if (mode === "chars") { s.style.setProperty("--b", "10px"); s.style.setProperty("--y", "20px"); }
        wrap.appendChild(s);
        i++;
      });
      el.appendChild(wrap);
      if (w < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  });

  const targets = document.querySelectorAll("[data-reveal], [data-split]");
  if (reduce) { targets.forEach((t) => t.classList.add("is-in")); return; }

  // Hero plays on load; everything else when it scrolls into view.
  requestAnimationFrame(() => requestAnimationFrame(() =>
    document.querySelectorAll("[data-hero]").forEach((t) => t.classList.add("is-in"))));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -12% 0px" });
  targets.forEach((t) => { if (!t.hasAttribute("data-hero")) io.observe(t); });
})();

/* Services: tabbed steps that auto-advance, image crossfades */
(() => {
  const list = document.querySelector(".bx-steps");
  if (!list) return;
  const steps = [...list.querySelectorAll(".bx-step")];
  const imgs = [...document.querySelectorAll(".bx-steps-media img")];
  const STEP_MS = 6000;
  list.style.setProperty("--step-ms", STEP_MS + "ms");
  let idx = 0, timer;
  const go = (n) => {
    idx = (n + steps.length) % steps.length;
    steps.forEach((s, i) => {
      s.classList.toggle("is-active", i === idx);
      s.setAttribute("aria-selected", i === idx);
      // restart the gold progress bar
      s.style.animation = "none"; s.offsetHeight; s.style.animation = "";
    });
    imgs.forEach((im, i) => im.classList.toggle("is-active", i === idx));
  };
  const start = () => { clearInterval(timer); list.classList.remove("is-paused"); timer = setInterval(() => go(idx + 1), STEP_MS); };
  steps.forEach((s, i) => s.addEventListener("click", () => { go(i); list.classList.add("is-paused"); clearInterval(timer); }));
  new IntersectionObserver(([e]) => { if (e.isIntersecting && !list.classList.contains("is-paused")) start(); else if (!e.isIntersecting) clearInterval(timer); }).observe(list);
})();

/* Team support carousel */
(() => {
  const slides = [
    ["Team consulting", "Collaborative guidance for your organization’s athlete care and performance needs.", "team-consulting.webp", "center 55%"],
    ["Event coverage", "Care and support tailored to your sporting event.", "team-event-coverage.webp", "55% 12%"],
    ["Seasonal medical coverage", "Medical support built around your team’s season.", "team-seasonal-coverage.webp", "60% 75%"],
    ["Support for your staff", "Work alongside your existing medical and performance team.", "team-staff-support.webp", "center 20%"],
  ];
  const card = document.querySelector(".bx-slide-card");
  if (!card) return;
  const swaps = card.querySelectorAll(".bx-swap");
  const title = card.querySelector("[data-slide-title]");
  const body = card.querySelector("[data-slide-body]");
  const count = card.querySelector("[data-slide-count]");
  const img = card.querySelector(".bx-slide-img img");
  // Photos live next to the first one; preload them so a slide change never flashes.
  const photo = (file) => img.src.replace(/[^/]+$/, file);
  slides.forEach(([, , file]) => { new Image().src = photo(file); });
  let i = 0;
  document.querySelectorAll(".bx-arrow").forEach((b) => b.addEventListener("click", () => {
    i = (i + Number(b.dataset.dir) + slides.length) % slides.length;
    swaps.forEach((s) => s.classList.add("is-out"));
    setTimeout(() => {
      const [t, d, file, pos] = slides[i];
      title.textContent = t; body.textContent = d; count.textContent = `${i + 1}/${slides.length}`;
      img.src = photo(file);
      img.style.objectPosition = pos;
      swaps.forEach((s, k) => setTimeout(() => s.classList.remove("is-out"), k * 70));
    }, 320);
  }));
})();

/* Today's hours */
(() => {
  const today = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", weekday: "short" });
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  document.querySelector(`[data-hours] [data-day="${map[today]}"]`)?.classList.add("is-today");
})();

/* ============ CONTACT FORM ============ */
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const SUCCESS_MESSAGE =
    "Thank you. Your inquiry has been sent to the clinic. We will get back to you at the email you provided.";
  const ERROR_MESSAGE =
    "Sorry, your inquiry could not be sent. Please call 323.248.1211 or email info@mvmntcultr.com and we will take care of you.";

  const status = contactForm.querySelector("#form-status");
  const submitButton = contactForm.querySelector("button[type='submit']");
  const submitLabel = submitButton ? submitButton.textContent : "";

  const showStatus = (message, state) => {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-success", state === "success");
    status.classList.toggle("is-error", state === "error");
    status.hidden = false;
  };

  // Covers the no-JavaScript path, where the form posts normally and the
  // function redirects back here with a flag.
  const submissionFlag = new URLSearchParams(window.location.search);
  if (submissionFlag.has("sent")) {
    showStatus(SUCCESS_MESSAGE, "success");
  } else if (submissionFlag.has("error")) {
    showStatus(ERROR_MESSAGE, "error");
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }
    showStatus("Sending your inquiry...", "pending");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(formData))
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        contactForm.reset();
        showStatus(SUCCESS_MESSAGE, "success");
      } else {
        throw new Error(result.message || `Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Contact form submission failed:", error);
      showStatus(ERROR_MESSAGE, "error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitLabel;
      }
    }
  });
}
