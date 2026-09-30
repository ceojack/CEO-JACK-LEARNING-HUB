
/* =========================================
   CEO JACK LEARNING HUB
   CONTACT PAGE JAVASCRIPT
========================================= */

(() => {

    /* =====================================
       MOBILE MENU
    ====================================== */

    const menuButton =
        document.getElementById("menuBtn");

    const mobileNavigation =
        document.getElementById("mobileMenu");


    if (menuButton && mobileNavigation) {

        menuButton.addEventListener("click", () => {

            const isOpen =
                mobileNavigation.classList.toggle("active");


            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });


        const mobileLinks =
            mobileNavigation.querySelectorAll("a");


        mobileLinks.forEach((link) => {

            link.addEventListener("click", () => {

                mobileNavigation.classList.remove("active");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    /* =====================================
       SCROLL REVEAL
    ====================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("show");

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.15
                }
            );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach((element) => {

            element.classList.add("show");

        });

    }


    /* =====================================
       FORM ELEMENTS
    ====================================== */

    const contactForm =
        document.getElementById("contactForm");

    const nameInput =
        document.getElementById("name");

    const emailInput =
        document.getElementById("email");

    const subjectInput =
        document.getElementById("subject");

    const messageInput =
        document.getElementById("message");

    const characterCount =
        document.getElementById("characterCount");

    const formStatus =
        document.getElementById("formStatus");

    const submitButton =
        document.getElementById("submitBtn");


    /* =====================================
       CHARACTER COUNTER
    ====================================== */

    if (messageInput && characterCount) {

        const updateCharacterCount = () => {

            const length =
                messageInput.value.length;


            characterCount.textContent =
                `${length} / 1000`;

        };


        messageInput.addEventListener(
            "input",
            updateCharacterCount
        );


        updateCharacterCount();

    }


    /* =====================================
       ERROR HANDLING
    ====================================== */

    function showError(input, errorId, message) {

        const errorElement =
            document.getElementById(errorId);


        const formGroup =
            input.closest(".form-group");


        if (errorElement) {

            errorElement.textContent =
                message;

        }


        if (formGroup) {

            formGroup.classList.add(
                "invalid"
            );

        }

    }


    function clearError(input, errorId) {

        const errorElement =
            document.getElementById(errorId);


        const formGroup =
            input.closest(".form-group");


        if (errorElement) {

            errorElement.textContent = "";

        }


        if (formGroup) {

            formGroup.classList.remove(
                "invalid"
            );

        }

    }


    /* =====================================
       EMAIL VALIDATION
    ====================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }


    /* =====================================
       FORM VALIDATION
    ====================================== */

    function validateForm() {

        let isValid = true;


        const name =
            nameInput.value.trim();


        const email =
            emailInput.value.trim();


        const subject =
            subjectInput.value;


        const message =
            messageInput.value.trim();


        /* Name */

        if (name.length < 2) {

            showError(
                nameInput,
                "nameError",
                "Please enter your name."
            );

            isValid = false;

        } else {

            clearError(
                nameInput,
                "nameError"
            );

        }


        /* Email */

        if (!isValidEmail(email)) {

            showError(
                emailInput,
                "emailError",
                "Please enter a valid email address."
            );

            isValid = false;

        } else {

            clearError(
                emailInput,
                "emailError"
            );

        }


        /* Subject */

        if (!subject) {

            showError(
                subjectInput,
                "subjectError",
                "Please select a subject."
            );

            isValid = false;

        } else {

            clearError(
                subjectInput,
                "subjectError"
            );

        }


        /* Message */

        if (message.length < 10) {

            showError(
                messageInput,
                "messageError",
                "Message must contain at least 10 characters."
            );

            isValid = false;

        } else {

            clearError(
                messageInput,
                "messageError"
            );

        }


        return isValid;

    }


    /* =====================================
       FORM SUBMISSION
    ====================================== */

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                formStatus.textContent = "";

                formStatus.className =
                    "form-status";


                if (!validateForm()) {

                    formStatus.textContent =
                        "Please correct the highlighted fields.";

                    formStatus.classList.add(
                        "error"
                    );

                    return;

                }


                /* Disable button */

                submitButton.disabled = true;


                submitButton.innerHTML =
                    `
                    <span>
                        Preparing message...
                    </span>

                    <span class="submit-arrow">
                        ...
                    </span>
                    `;


                /*
                   FRONT-END DEMO

                   No backend has been connected yet.

                   Later this section can become:

                   fetch("/api/contact", {
                       method: "POST",
                       body: new FormData(contactForm)
                   });
                */


                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            900
                        )
                );


                formStatus.textContent =
                    "Your message has been prepared successfully. The message-sending backend will be connected next.";

                formStatus.classList.add(
                    "success"
                );


                contactForm.reset();


                if (characterCount) {

                    characterCount.textContent =
                        "0 / 1000";

                }


                submitButton.disabled = false;


                submitButton.innerHTML =
                    `
                    <span>
                        Send Message
                    </span>

                    <span class="submit-arrow">
                        →
                    </span>
                    `;

            }
        );

    }


    /* =====================================
       HERO PARALLAX
    ====================================== */

    const contactVisual =
        document.querySelector(
            ".contact-visual"
        );


    if (contactVisual) {

        document.addEventListener(
            "mousemove",
            (event) => {

                if (
                    window.innerWidth < 950
                ) {

                    contactVisual.style.transform =
                        "translate(0, 0)";

                    return;

                }


                const x =
                    (
                        window.innerWidth / 2 -
                        event.clientX
                    ) / 70;


                const y =
                    (
                        window.innerHeight / 2 -
                        event.clientY
                    ) / 70;


                contactVisual.style.transform =
                    `translate(${x}px, ${y}px)`;

            }
        );


        document.addEventListener(
            "mouseleave",
            () => {

                contactVisual.style.transform =
                    "translate(0, 0)";

            }
        );

    }


})();
