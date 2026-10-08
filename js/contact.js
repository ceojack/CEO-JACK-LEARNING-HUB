/* =========================================
   CEO JACK LEARNING HUB
   CONTACT PAGE JAVASCRIPT
========================================= */

"use strict";

(() => {

  /* MOBILE MENU */

  const menuButton = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  function closeMenu() {
    if (!menuButton || !mobileMenu) return;

    mobileMenu.classList.remove("active");

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    menuButton.setAttribute(
      "aria-label",
      "Open navigation"
    );
  }

  if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {

      const open =
        mobileMenu.classList.toggle("active");

      menuButton.setAttribute(
        "aria-expanded",
        String(open)
      );

      menuButton.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation"
      );

    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {

      if (event.key === "Escape") {
        closeMenu();
        menuButton.focus();
      }

    });

    window.addEventListener("resize", () => {

      if (window.innerWidth > 900) {
        closeMenu();
      }

    });

  }


  /* SCROLL REVEAL */

  const revealItems =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      (entries, obs) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("show");

            obs.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealItems.forEach(item => {
      observer.observe(item);
    });

  } else {

    revealItems.forEach(item => {
      item.classList.add("show");
    });

  }


  /* CURRENT YEAR */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* FORM ELEMENTS */

  const form = document.getElementById("contactForm");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  const count = document.getElementById("characterCount");
  const status = document.getElementById("formStatus");

  if (!form) return;


  /* ERROR MESSAGE ELEMENTS */

  const errorIds = {
    name: "nameError",
    email: "emailError",
    subject: "subjectError",
    message: "messageError"
  };


  function setError(input, message) {

    const group =
      input.closest(".form-group");

    const error =
      document.getElementById(errorIds[input.name]);

    if (group) {
      group.classList.toggle(
        "invalid",
        Boolean(message)
      );
    }

    if (error) {
      error.textContent = message || "";
    }

    input.setAttribute(
      "aria-invalid",
      String(Boolean(message))
    );

  }


  /* VALIDATE THE FORM */

  function validate() {

    let valid = true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    const emailOK =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const checks = [

      [
        nameInput,
        name.length >= 2,
        "Please enter your name (at least 2 characters)."
      ],

      [
        emailInput,
        emailOK,
        "Please enter a valid email address."
      ],

      [
        subjectInput,
        Boolean(subjectInput.value),
        "Please choose a subject."
      ],

      [
        messageInput,
        message.length >= 10,
        "Please write at least 10 characters."
      ]

    ];

    checks.forEach(([input, passed, messageText]) => {

      setError(
        input,
        passed ? "" : messageText
      );

      if (!passed) {
        valid = false;
      }

    });

    return valid;

  }


  /* CHARACTER COUNTER */

  function updateCount() {

    if (count) {

      count.textContent =
        `${messageInput.value.length} / 1000`;

    }

  }

  messageInput.addEventListener(
    "input",
    updateCount
  );

  updateCount();


  /* CLEAR ERRORS AS THE USER CORRECTS INPUT */

  [
    nameInput,
    emailInput,
    subjectInput,
    messageInput
  ].forEach(input => {

    input.addEventListener("input", () => {

      if (input.getAttribute("aria-invalid") === "true") {
        validate();
      }

      if (status) {
        status.textContent = "";
      }

    });

    input.addEventListener("change", () => {

      if (input.getAttribute("aria-invalid") === "true") {
        validate();
      }

    });

  });


  /* FORM SUBMISSION */

  form.addEventListener("submit", event => {

    event.preventDefault();

    if (status) {
      status.textContent = "";
      status.className = "form-status";
    }

    if (!validate()) {

      if (status) {
        status.textContent =
          "Please correct the highlighted fields.";

        status.classList.add("error");
      }

      const firstInvalid =
        form.querySelector('[aria-invalid="true"]');

      if (firstInvalid) {
        firstInvalid.focus();
      }

      return;

    }


    /*
      FRONTEND-ONLY EMAIL FALLBACK

      This opens the visitor's email application.
      It does not send the message directly from
      the website. A backend can be connected later.
    */

    const recipient =
      "hello@ceojacklearninghub.com";

    const subject =
      `[CEO JACK Contact] ${subjectInput.value}`;

    const body = [

      `Name: ${nameInput.value.trim()}`,

      `Reply email: ${emailInput.value.trim()}`,

      `Subject: ${subjectInput.value}`,

      "",

      messageInput.value.trim()

    ].join("\n");


    const mailto =
      `mailto:${recipient}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;


    if (status) {

      status.textContent =
        "Opening your email application with the message prepared. Send it there to complete delivery.";

      status.classList.add("success");

    }

    window.location.href = mailto;

  });


  /* OPTIONAL PUBLIC METHODS */

  window.CeoJackContact = {
    closeMenu,
    validate
  };

})();