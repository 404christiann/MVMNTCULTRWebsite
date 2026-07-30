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
