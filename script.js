const header = document.querySelector(".site-header");
const mobileMenu = document.querySelector(".mobile-menu");

function updateHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if (header && mobileMenu) {
  mobileMenu.addEventListener("toggle", () => {
    header.classList.toggle("menu-is-open", mobileMenu.open);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.open = false;
      header.classList.remove("menu-is-open");
    });
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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gsapReady = window.gsap && !prefersReducedMotion;

if (gsapReady) {
  const { gsap } = window;
  const ScrollTrigger = window.ScrollTrigger;

  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  gsap.set(".site-header", { y: -18, autoAlpha: 0 });
  gsap.to(".site-header", {
    y: 0,
    autoAlpha: 1,
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
    const revealGroups = [
      ".section-heading",
      ".sports-support-section > *",
      ".logo-carousel-head",
      ".services-heading",
      ".home-hours-section > *",
      ".consulting-section > *",
      ".about-social-row > *",
      ".location-copy > *",
      ".location-map",
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
      ".care-grid article",
      ".services-list article",
      ".about-social-links a",
      ".home-hours-list div"
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
