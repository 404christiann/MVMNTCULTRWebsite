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
