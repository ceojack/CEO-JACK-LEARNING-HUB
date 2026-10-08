
/* CEO JACK LEARNING HUB — Get Started */
(() => {
  "use strict";

  const createAccountButton = document.getElementById("createAccountBtn");
  const signInButton = document.getElementById("signInBtn");
  const startMessage = document.getElementById("startMessage");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("primary-navigation");

  function showMessage(message) {
    if (startMessage) {
      startMessage.textContent = message;
    }
  }

  function navigateToAuth(mode, button) {
    if (button) {
      button.disabled = true;
    }

    showMessage(
      mode === "signup"
        ? "Taking you to account creation…"
        : "Taking you to sign in…"
    );

    // auth.html must exist and implement real authentication.
    window.location.href = `auth.html?mode=${encodeURIComponent(mode)}`;
  }

  createAccountButton?.addEventListener("click", () => {
    navigateToAuth("signup", createAccountButton);
  });

  signInButton?.addEventListener("click", () => {
    navigateToAuth("signin", signInButton);
  });

  // Visitors can explore public hubs without an account.
  document.getElementById("guestBtn")?.addEventListener("click", () => {
    showMessage("You can explore the hubs without creating an account.");
  });

  // Responsive mobile navigation.
  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation menu" : "Close navigation menu"
      );

      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        navigation.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        navigation.classList.remove("is-open");
        menuToggle.focus();
      }
    });
  }

  // Scroll reveal, with a fallback for reduced-motion preferences.
  const revealElements = document.querySelectorAll(".reveal");

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }
})();
