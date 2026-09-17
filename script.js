const header = document.querySelector(".site-header");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileNavigation = window.matchMedia("(max-width: 860px)");
let desktopNavCompact = false;

function updateHeaderState() {
  if (!header) return;
  // Hysteresis keeps the desktop transition steady near the scroll threshold.
  desktopNavCompact = window.scrollY > (desktopNavCompact ? 70 : 80);
  header.classList.toggle("is-scrolled", mobileNavigation.matches
    ? window.scrollY > 12
    : desktopNavCompact);
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });
mobileNavigation.addEventListener("change", () => {
  if (!mobileNavigation.matches && mobileMenu) mobileMenu.open = false;
  updateHeaderState();
});

if (header && mobileMenu) {
  const toggle = mobileMenu.querySelector("summary");
  let previousOverflow = null;

  const syncMobileMenu = () => {
    const open = mobileMenu.open;
    header.classList.toggle("menu-is-open", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open && previousOverflow === null) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else if (!open && previousOverflow !== null) {
      document.body.style.overflow = previousOverflow;
      previousOverflow = null;
    }
  };

  mobileMenu.addEventListener("toggle", syncMobileMenu);
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.open = false;
      syncMobileMenu();
    });
  });

  mobileMenu.addEventListener("keydown", (event) => {
    if (!mobileMenu.open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      mobileMenu.open = false;
      syncMobileMenu();
      toggle.focus({ preventScroll: true });
    } else if (event.key === "Tab") {
      const lastLink = mobileMenu.querySelector("a:last-child");
      if (event.shiftKey && document.activeElement === toggle) {
        event.preventDefault();
        lastLink.focus();
      } else if (!event.shiftKey && document.activeElement === lastLink) {
        event.preventDefault();
        toggle.focus();
      }
    }
  });
}

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

const methodTitle = document.querySelector(".method-heading h2");

if (methodTitle && "IntersectionObserver" in window) {
  const methodMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finishMethodSweep = () => methodTitle.classList.remove("is-sweeping");
  const methodObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    methodObserver.disconnect();
    if (!methodMotion.matches) methodTitle.classList.add("is-sweeping");
  }, { threshold: 0.5, rootMargin: "0px 0px -12% 0px" });

  methodTitle.addEventListener("animationend", finishMethodSweep);
  methodTitle.addEventListener("animationcancel", finishMethodSweep);
  methodMotion.addEventListener("change", (event) => {
    if (event.matches) finishMethodSweep();
  });
  // Wait for the display font so the sweep crosses the final letter shapes.
  document.fonts.ready.then(() => methodObserver.observe(methodTitle));
}

const careAccordion = document.querySelector(".care-accordion");

if (careAccordion) {
  const rows = Array.from(careAccordion.querySelectorAll(".care-row"));

  const setOpenRow = (target) => {
    rows.forEach((row) => {
      const open = row === target;
      row.classList.toggle("is-open", open);
      row.querySelector(".care-row-trigger").setAttribute("aria-expanded", String(open));
      row.querySelector(".care-row-panel").inert = !open;
    });
  };

  rows.forEach((row) => {
    row.querySelector(".care-row-trigger").addEventListener("click", () => {
      setOpenRow(row.classList.contains("is-open") ? null : row);
    });
  });
}

const servicesSection = document.querySelector(".services-section");

if (servicesSection) {
  const cards = Array.from(servicesSection.querySelectorAll(".service-card"));
  const mobileServices = window.matchMedia("(max-width: 760px)");
  let openCard = cards[0];

  // One shared set of content becomes an accordion on phones and a full grid on desktop.
  const updateServices = () => {
    cards.forEach((card) => {
      const open = card === openCard;
      card.classList.toggle("is-open", open);
      card.querySelector(".service-trigger").setAttribute("aria-expanded", String(open));
      card.querySelector(".service-body").hidden = mobileServices.matches && !open;
    });
    window.ScrollTrigger?.refresh();
  };

  cards.forEach((card) => {
    card.querySelector(".service-trigger").addEventListener("click", () => {
      if (!mobileServices.matches) return;
      openCard = card === openCard ? null : card;
      updateServices();
    });
  });

  servicesSection.classList.add("services-accordion-ready");
  mobileServices.addEventListener("change", updateServices);
  updateServices();
}

const clinicHourRows = document.querySelectorAll("[data-clinic-day]");

if (clinicHourRows.length) {
  // Clinic hours follow Arcadia's date, even when the visitor is in another time zone.
  const clinicDayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "America/Los_Angeles"
  });
  const updateClinicDay = () => {
    const today = clinicDayFormatter.format(new Date());
    clinicHourRows.forEach((row) => {
      const isToday = row.dataset.clinicDay === today;
      row.classList.toggle("is-today", isToday);
      if (isToday) row.setAttribute("aria-current", "date");
      else row.removeAttribute("aria-current");
    });
  };
  updateClinicDay();
  window.setInterval(updateClinicDay, 60000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateClinicDay();
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gsapReady = window.gsap && !prefersReducedMotion;

if (gsapReady) {
  const { gsap } = window;
  const ScrollTrigger = window.ScrollTrigger;

  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  gsap.set(".site-header", { autoAlpha: 0 });
  gsap.to(".site-header", {
    autoAlpha: 1,
    clearProps: "opacity,visibility",
    duration: 0.7,
    ease: "power3.out"
  });

  const heroItems = document.querySelectorAll(
    ".hero .eyebrow, .hero h1, .hero-copy, .hero-actions"
  );

  if (heroItems.length) {
    gsap.from(heroItems, {
      y: 28,
      autoAlpha: 0,
      duration: 0.85,
      stagger: 0.08,
      delay: 0.18,
      ease: "power3.out"
    });
  }

  const pageIntroItems = document.querySelectorAll(
    ".about-profile-copy > *, .contact-intro > *, .contact-form"
  );

  if (!heroItems.length && pageIntroItems.length) {
    gsap.from(pageIntroItems, {
      y: 24,
      autoAlpha: 0,
      duration: 0.75,
      stagger: 0.07,
      delay: 0.12,
      ease: "power3.out"
    });
  }

  if (ScrollTrigger) {
    // Keep compact social rows visible: near the footer, they may never reach
    // the reveal threshold on taller screens.
    const revealGroups = [
      ".section-heading:not(.method-heading)",
      ".sports-support-section > *",
      ".logo-carousel-head",
      ".services-heading",
      ".home-hours-section > *",
      ".consulting-section > *",
      ".location-copy > *",
      ".location-media",
      ".contact-support-section > *"
    ];

    revealGroups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        gsap.from(element, {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 84%",
            once: true
          }
        });
      });
    });

    [
      ".care-row",
      ".services-list article"
    ].forEach((selector) => {
      const items = document.querySelectorAll(selector);
      if (!items.length) return;

      gsap.from(items, {
        y: 22,
        autoAlpha: 0,
        duration: 0.62,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: items[0].parentElement,
          start: "top 82%",
          once: true
        }
      });
    });
  }
}
