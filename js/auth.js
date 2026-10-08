
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("auth-form");
  const title = document.getElementById("auth-title");
  const description = document.getElementById("auth-description");
  const message = document.getElementById("form-message");
  const submitButton = document.getElementById("submit-button");

  const signinTab = document.getElementById("signin-tab");
  const signupTab = document.getElementById("signup-tab");

  const nameField = document.getElementById("name-field");
  const confirmField = document.getElementById("confirm-field");
  const termsOption = document.getElementById("terms-option");
  const rememberOption = document.getElementById("remember-option");
  const forgotPassword = document.getElementById("forgot-password");

  const nameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm-password");
  const termsInput = document.getElementById("terms");

  const strengthContainer = document.getElementById("password-strength");
  const strengthBar = document.getElementById("strength-bar");
  const strengthLabel = document.getElementById("strength-label");

  const switchPrompt = document.getElementById("switch-prompt");
  const switchMode = document.getElementById("switch-mode");

// Social sign-in: UI is ready, but provider authentication
// must be configured before these buttons can sign users in.

document.querySelectorAll("[data-provider]").forEach((button) => {
  button.addEventListener("click", () => {
    const provider = button.dataset.provider;

    showMessage(
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in is not connected yet. Configure this provider in your authentication service first.`
    );
  });
});

  let currentMode =
    new URLSearchParams(window.location.search).get("mode") === "signup"
      ? "signup"
      : "signin";

  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  function clearErrors() {
    document.querySelectorAll(".field-error").forEach((element) => {
      element.textContent = "";
    });

    document.querySelectorAll(".invalid").forEach((element) => {
      element.classList.remove("invalid");
      element.removeAttribute("aria-invalid");
    });
  }

  function showMessage(text, type = "info") {
    message.textContent = text;
    message.className = "form-message";

    if (type === "error") {
      message.classList.add("error");
    }

    if (type === "success") {
      message.classList.add("success");
    }

    message.hidden = false;
  }

  function clearMessage() {
    message.hidden = true;
    message.textContent = "";
    message.className = "form-message";
  }

  function setError(input, errorId, text) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = text;
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
  }

  function setMode(mode, updateUrl = true) {
    currentMode = mode === "signup" ? "signup" : "signin";

    const signingUp = currentMode === "signup";

    signinTab.classList.toggle("active", !signingUp);
    signupTab.classList.toggle("active", signingUp);

    signinTab.setAttribute("aria-pressed", String(!signingUp));
    signupTab.setAttribute("aria-pressed", String(signingUp));

    nameField.hidden = !signingUp;
    confirmField.hidden = !signingUp;
    termsOption.hidden = !signingUp;
    rememberOption.hidden = signingUp;
    strengthContainer.hidden = !signingUp;

    nameInput.required = signingUp;
    confirmInput.required = signingUp;
    termsInput.required = signingUp;

    passwordInput.autocomplete = signingUp
      ? "new-password"
      : "current-password";

    title.textContent = signingUp ? "Create your account" : "Welcome back";

    description.textContent = signingUp
      ? "Start building your future with CEO JACK."
      : "Sign in to continue your learning journey.";

    submitButton.innerHTML = signingUp
      ? 'Create account <span aria-hidden="true">→</span>'
      : 'Sign in <span aria-hidden="true">→</span>';

    switchPrompt.firstChild.textContent = signingUp
      ? "Already have an account? "
      : "New to CEO JACK? ";

    switchMode.textContent = signingUp ? "Sign in" : "Create an account";
    switchMode.href = signingUp ? "?mode=signin" : "?mode=signup";

    forgotPassword.hidden = signingUp;

    clearErrors();
    clearMessage();
    updatePasswordStrength();

    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("mode", currentMode);
      window.history.replaceState({}, "", url);
    }
  }

  function updatePasswordStrength() {
    const password = passwordInput.value;

    if (currentMode !== "signup") {
      strengthContainer.hidden = true;
      return;
    }

    strengthContainer.hidden = false;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const labels = ["Not entered", "Weak", "Fair", "Good", "Strong"];
    const widths = ["0%", "25%", "50%", "75%", "100%"];

    strengthBar.style.width = widths[score];
    strengthLabel.textContent = `Password strength: ${labels[score]}`;
  }

  function validateForm() {
    clearErrors();

    let valid = true;

    if (currentMode === "signup" && nameInput.value.trim().length < 2) {
      setError(nameInput, "name-error", "Enter your full name.");
      valid = false;
    }

    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError(emailInput, "email-error", "Enter a valid email address.");
      valid = false;
    }

    const password = passwordInput.value;

    if (password.length < 8) {
      setError(
        passwordInput,
        "password-error",
        "Your password must contain at least 8 characters."
      );
      valid = false;
    }

    if (
      currentMode === "signup" &&
      confirmInput.value !== password
    ) {
      setError(
        confirmInput,
        "confirm-error",
        "Your passwords do not match."
      );
      valid = false;
    }

    if (currentMode === "signup" && !termsInput.checked) {
      document.getElementById("terms-error").textContent =
        "Please accept the Terms and Privacy Policy.";
      valid = false;
    }

    return valid;
  }

  signinTab.addEventListener("click", () => setMode("signin"));
  signupTab.addEventListener("click", () => setMode("signup"));

  switchMode.addEventListener("click", (event) => {
    event.preventDefault();
    setMode(currentMode === "signup" ? "signin" : "signup");
  });

  passwordInput.addEventListener("input", updatePasswordStrength);

  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(
        button.dataset.togglePassword
      );

      const shouldShow = input.type === "password";

      input.type = shouldShow ? "text" : "password";
      button.textContent = shouldShow ? "Hide" : "Show";
      button.setAttribute(
        "aria-label",
        shouldShow ? "Hide password" : "Show password"
      );
    });
  });

  forgotPassword.addEventListener("click", (event) => {
    event.preventDefault();

    showMessage(
      "Password recovery is not connected yet. Connect your authentication provider to enable secure password resets."
    );
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage();

    if (!validateForm()) {
      showMessage("Please check the highlighted fields and try again.", "error");
      return;
    }

    showMessage(
      currentMode === "signup"
        ? "Your form is valid, but account creation is not connected yet. Connect Supabase Auth or your backend before using real accounts."
        : "Your form is valid, but sign-in is not connected yet. Connect Supabase Auth or your backend before using real accounts."
    );
  });

  setMode(currentMode, false);
});