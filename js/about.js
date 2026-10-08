/* =========================================
   CEO JACK LEARNING HUB
   ABOUT PAGE JAVASCRIPT
========================================= */

"use strict";


/* =========================
   MOBILE MENU
========================= */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");


function closeMobileMenu() {

  if (!menuBtn || !mobileMenu) {
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
    .forEach(link => {

      link.addEventListener(
        "click",
        closeMobileMenu
      );

    });

}


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {
      closeMobileMenu();
    }

  }
);


/* =========================
   RESIZE
========================= */

window.addEventListener(
  "resize",
  () => {

    if (window.innerWidth > 780) {
      closeMobileMenu();
    }

  }
);


/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
  document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

  const observer =
    new IntersectionObserver(
      (entries, obs) => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("show");

          obs.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.12,

        rootMargin:
          "0px 0px -35px 0px"
      }
    );


  revealElements.forEach(
    element => observer.observe(element)
  );

} else {

  revealElements.forEach(
    element => element.classList.add("show")
  );

}


/* =========================
   CURRENT YEAR
========================= */

const yearElement =
  document.getElementById("year");

if (yearElement) {

  yearElement.textContent =
    new Date().getFullYear();

}


/* =========================
   PUBLIC API
========================= */

window.CeoJackAbout = {
  closeMobileMenu
};