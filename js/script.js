/* =========================================
   CEO JACK LEARNING HUB
   HOMEPAGE JAVASCRIPT
========================================= */

"use strict";


/* =========================================
   MOBILE MENU
========================================= */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");


function closeMobileMenu() {

  if (!mobileMenu || !menuBtn) {
    return;
  }

  mobileMenu.classList.remove("active");

  menuBtn.setAttribute(
    "aria-expanded",
    "false"
  );

  menuBtn.setAttribute(
    "aria-label",
    "Open navigation"
  );
}


if (menuBtn && mobileMenu) {

  menuBtn.addEventListener("click", () => {

    const isOpen =
      mobileMenu.classList.toggle("active");

    menuBtn.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuBtn.setAttribute(
      "aria-label",
      isOpen
        ? "Close navigation"
        : "Open navigation"
    );

  });


  mobileMenu
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        closeMobileMenu
      );

    });

}


/* ESCAPE KEY */

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {
      closeMobileMenu();
    }

  }
);


/* CLOSE MOBILE MENU AFTER RESIZE */

window.addEventListener(
  "resize",
  () => {

    if (window.innerWidth > 780) {
      closeMobileMenu();
    }

  }
);


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
  document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("show");

          observer.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.12,

        rootMargin:
          "0px 0px -40px 0px"
      }
    );


  revealElements.forEach(
    (element) => {

      revealObserver.observe(
        element
      );

    }
  );

} else {

  revealElements.forEach(
    (element) => {

      element.classList.add(
        "show"
      );

    }
  );

}


/* =========================================
   SMOOTH INTERNAL NAVIGATION
========================================= */

document
  .querySelectorAll('a[href^="#"]')
  .forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(
            targetId
          );

        if (!target) {
          return;
        }

        event.preventDefault();

        const headerHeight =
          document.querySelector(
            ".site-header"
          )?.offsetHeight || 0;

        const targetTop =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          12;

        window.scrollTo({
          top: targetTop,
          behavior: "smooth"
        });

        history.replaceState(
          null,
          "",
          targetId
        );

      }
    );

  });


/* =========================================
   CURRENT YEAR
========================================= */

const year =
  document.getElementById("year");


if (year) {

  year.textContent =
    new Date().getFullYear();

}


/* =========================================
   GLOBAL HOMEPAGE API
========================================= */

window.CeoJackHomepage = {
  closeMobileMenu
};