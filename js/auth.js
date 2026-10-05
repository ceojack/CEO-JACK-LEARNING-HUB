
/* =========================================
   CEO JACK LEARNING HUB
   AUTHENTICATION JAVASCRIPT
========================================= */

(() => {

    /* =====================================
       ELEMENTS
    ====================================== */

    const authForm =
        document.getElementById("authForm");

    const authLabel =
        document.getElementById("authLabel");

    const authTitle =
        document.getElementById("authTitle");

    const authSubtitle =
        document.getElementById("authSubtitle");

    const submitButton =
        document.getElementById("submitBtn");

    const submitText =
        document.getElementById("submitText");

    const switchPrompt =
        document.getElementById("switchPrompt");

    const switchMode =
        document.getElementById("switchMode");

    const togglePassword =
        document.getElementById("togglePassword");

    const passwordInput =
        document.getElementById("password");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const fullName =
        document.getElementById("fullName");

    const emailInput =
        document.getElementById("email");

    const termsInput =
        document.getElementById("terms");

    const formStatus =
        document.getElementById("formStatus");

    const googleButton =
        document.getElementById("googleBtn");

    const appleButton =
        document.getElementById("appleBtn");

    const forgotPassword =
        document.getElementById("forgotPassword");

    const strengthText =
        document.getElementById("strengthText");

    const strengthBars =
        document.querySelectorAll(
            ".strength-bar span"
        );


    let currentMode = "signup";


    /* =====================================
       URL MODE
    ====================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const requestedMode =
        params.get("mode");


    if (
        requestedMode === "signin" ||
        requestedMode === "signup"
    ) {

        currentMode =
            requestedMode;

    }


    /* =====================================
       MODE CONFIGURATION
    ====================================== */

    function updateMode(mode) {

        currentMode = mode;


        const signupElements =
            document.querySelectorAll(
                ".signup-only"
            );


        const signinElements =
            document.querySelectorAll(
                ".signin-only"
            );


        if (mode === "signup") {

            authLabel.textContent =
                "CREATE ACCOUNT";

            authTitle.textContent =
                "Create your account";

            authSubtitle.textContent =
                "Start your CEO JACK journey.";

            submitText.textContent =
                "Create Account";

            switchPrompt.textContent =
                "Already have an account?";

            switchMode.textContent =
                "Sign In";


            signupElements.forEach((element) => {

                element.classList.remove(
                    "hidden"
                );

            });


            signinElements.forEach((element) => {

                element.classList.add(
                    "hidden"
                );

            });


            passwordInput.autocomplete =
                "new-password";


            confirmPassword.autocomplete =
                "new-password";


        } else {

            authLabel.textContent =
                "WELCOME BACK";

            authTitle.textContent =
                "Sign in to continue";

            authSubtitle.textContent =
                "Continue your CEO JACK journey.";

            submitText.textContent =
                "Sign In";

            switchPrompt.textContent =
                "Don't have an account?";

            switchMode.textContent =
                "Create Account";


            signupElements.forEach((element) => {

                element.classList.add(
                    "hidden"
                );

            });


            signinElements.forEach((element) => {

                element.classList.remove(
                    "hidden"
                );

            });


            passwordInput.autocomplete =
                "current-password";

        }


        clearAllErrors();

        clearStatus();

    }


    /* =====================================
       SWITCH AUTH MODE
    ====================================== */

    switchMode.addEventListener(
        "click",
        () => {

            const newMode =
                currentMode === "signup"
                    ? "signin"
                    : "signup";


            const nextUrl =
                `${window.location.pathname}?mode=${newMode}`;


            window.history.replaceState(
                {},
                "",
                nextUrl
            );


            updateMode(newMode);

        }
    );


    /* =====================================
       SHOW / HIDE PASSWORD
    ====================================== */

    togglePassword.addEventListener(
        "click",
        () => {

            const isPassword =
                passwordInput.type === "password";


            passwordInput.type =
                isPassword
                    ? "text"
                    : "password";


            togglePassword.textContent =
                isPassword
                    ? "Hide"
                    : "Show";

        }
    );


    /* =====================================
       PASSWORD STRENGTH
    ====================================== */

    function updatePasswordStrength() {

        const password =
            passwordInput.value;


        let score = 0;


        if (password.length >= 8) {
            score++;
        }

        if (/[A-Z]/.test(password)) {
            score++;
        }

        if (/[0-9]/.test(password)) {
            score++;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score++;
        }


        strengthBars.forEach(
            (bar, index) => {

                bar.style.background =
                    index < score
                        ? "#55ddff"
                        : "rgba(255,255,255,0.08)";

            }
        );


        if (!password) {

            strengthText.textContent =
                "Use 8 or more characters";

            return;

        }


        if (score === 1) {

            strengthText.textContent =
                "Weak password";

        } else if (score === 2) {

            strengthText.textContent =
                "Fair password";

        } else if (score === 3) {

            strengthText.textContent =
                "Good password";

        } else {

            strengthText.textContent =
                "Strong password";

        }

    }


    passwordInput.addEventListener(
        "input",
        updatePasswordStrength
    );


    /* =====================================
       ERROR HELPERS
    ====================================== */

    function showError(
        input,
        errorId,
        message
    ) {

        const errorElement =
            document.getElementById(
                errorId
            );


        const group =
            input.closest(
                ".form-group"
            );


        if (errorElement) {

            errorElement.textContent =
                message;

        }


        if (group) {

            group.classList.add(
                "invalid"
            );

        }

    }


    function clearError(
        input,
        errorId
    ) {

        const errorElement =
            document.getElementById(
                errorId
            );


        const group =
            input.closest(
                ".form-group"
            );


        if (errorElement) {

            errorElement.textContent = "";

        }


        if (group) {

            group.classList.remove(
                "invalid"
            );

        }

    }


    function clearAllErrors() {

        clearError(
            fullName,
            "nameError"
        );

        clearError(
            emailInput,
            "emailError"
        );

        clearError(
            passwordInput,
            "passwordError"
        );

        clearError(
            confirmPassword,
            "confirmError"
        );

    }


    /* =====================================
       STATUS HELPERS
    ====================================== */

    function showStatus(
        message,
        type
    ) {

        formStatus.textContent =
            message;

        formStatus.className =
            `form-status ${type}`;

    }


    function clearStatus() {

        formStatus.textContent =
            "";

        formStatus.className =
            "form-status";

    }


    /* =====================================
       EMAIL VALIDATION
    ====================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }


    /* =====================================
       SIGNUP VALIDATION
    ====================================== */

    function validateSignup() {

        let valid = true;


        const name =
            fullName.value.trim();


        const email =
            emailInput.value.trim();


        const password =
            passwordInput.value;


        const confirm =
            confirmPassword.value;


        if (name.length < 2) {

            showError(
                fullName,
                "nameError",
                "Please enter your full name."
            );

            valid = false;

        } else {

            clearError(
                fullName,
                "nameError"
            );

        }


        if (!isValidEmail(email)) {

            showError(
                emailInput,
                "emailError",
                "Enter a valid email address."
            );

            valid = false;

        } else {

            clearError(
                emailInput,
                "emailError"
            );

        }


        if (password.length < 8) {

            showError(
                passwordInput,
                "passwordError",
                "Password must contain at least 8 characters."
            );

            valid = false;

        } else {

            clearError(
                passwordInput,
                "passwordError"
            );

        }


        if (confirm !== password) {

            showError(
                confirmPassword,
                "confirmError",
                "Passwords do not match."
            );

            valid = false;

        } else {

            clearError(
                confirmPassword,
                "confirmError"
            );

        }


        if (!termsInput.checked) {

            showStatus(
                "Please accept the Terms and Privacy Policy.",
                "error"
            );

            valid = false;

        }


        return valid;

    }


    /* =====================================
       SIGNIN VALIDATION
    ====================================== */

    function validateSignin() {

        let valid = true;


        const email =
            emailInput.value.trim();


        const password =
            passwordInput.value;


        if (!isValidEmail(email)) {

            showError(
                emailInput,
                "emailError",
                "Enter a valid email address."
            );

            valid = false;

        } else {

            clearError(
                emailInput,
                "emailError"
            );

        }


        if (!password) {

            showError(
                passwordInput,
                "passwordError",
                "Please enter your password."
            );

            valid = false;

        } else {

            clearError(
                passwordInput,
                "passwordError"
            );

        }


        return valid;

    }


    /* =====================================
       FORM SUBMISSION
    ====================================== */

    authForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            clearStatus();


            const isValid =
                currentMode === "signup"
                    ? validateSignup()
                    : validateSignin();


            if (!isValid) {

                if (
                    currentMode === "signup" &&
                    !termsInput.checked
                ) {

                    return;

                }


                showStatus(
                    "Please correct the highlighted fields.",
                    "error"
                );

                return;

            }


            submitButton.disabled =
                true;


            submitText.textContent =
                currentMode === "signup"
                    ? "Preparing account..."
                    : "Checking account...";


            const name = currentMode === "signup"
                ? fullName.value.trim()
                : emailInput.value.trim().split("@")[0];

            localStorage.setItem("ceoJackUserName", name || "Student");
            localStorage.setItem("ceoJackUserEmail", emailInput.value.trim());
            localStorage.setItem("ceoJackSignedIn", "true");

            submitText.textContent = "Opening your learning space...";

            window.setTimeout(() => {
                window.location.href = currentMode === "signup"
                    ? "onboarding.html"
                    : "dashboard.html";
            }, 350);

        }
    );


    /* =====================================
       GOOGLE
    ====================================== */

    googleButton.addEventListener(
        "click",
        () => {

            showStatus(
                "Google authentication will be connected here.",
                "info"
            );

        }
    );


    /* =====================================
       APPLE
    ====================================== */

    appleButton.addEventListener(
        "click",
        () => {

            showStatus(
                "Apple authentication will be connected here.",
                "info"
            );

        }
    );


    /* =====================================
       FORGOT PASSWORD
    ====================================== */

    forgotPassword.addEventListener(
        "click",
        () => {

            showStatus(
                "Password recovery will be connected to the authentication backend.",
                "info"
            );

        }
    );


    /* =====================================
       SCROLL / INITIAL REVEAL
    ====================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    if (
        "IntersectionObserver"
        in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "show"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.15
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


    /* =====================================
       INITIALIZE
    ====================================== */

    updateMode(currentMode);

})();
