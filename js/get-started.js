
/* =========================================
   CEO JACK LEARNING HUB
   GET STARTED PAGE JAVASCRIPT
========================================= */

(() => {

    /* =====================================
       BUTTONS
    ====================================== */

    const createAccountButton =
        document.getElementById("createAccountBtn");

    const signInButton =
        document.getElementById("signInBtn");

    const guestButton =
        document.getElementById("guestBtn");

    const startMessage =
        document.getElementById("startMessage");


    /* =====================================
       MESSAGE HELPER
    ====================================== */

    function showMessage(message, type = "info") {

        if (!startMessage) {
            return;
        }

        startMessage.textContent = message;

        startMessage.className =
            `start-message ${type}`;

    }


    /* =====================================
       CREATE ACCOUNT
    ====================================== */

    if (createAccountButton) {

        createAccountButton.addEventListener(
            "click",
            () => {

                showMessage(
                    "Opening account creation...",
                    "info"
                );


                createAccountButton.disabled =
                    true;


                setTimeout(() => {

                    /*
                       FUTURE:

                       window.location.href =
                           "signup.html";
                    */

                    showMessage(
                        "Account creation will be connected next.",
                        "success"
                    );


                    createAccountButton.disabled =
                        false;

                }, 700);

            }
        );

    }


    /* =====================================
       SIGN IN
    ====================================== */

    if (signInButton) {

        signInButton.addEventListener(
            "click",
            () => {

                showMessage(
                    "Opening sign in...",
                    "info"
                );


                signInButton.disabled =
                    true;


                setTimeout(() => {

                    /*
                       FUTURE:

                       window.location.href =
                           "login.html";
                    */

                    showMessage(
                        "Sign in will be connected next.",
                        "success"
                    );


                    signInButton.disabled =
                        false;

                }, 700);

            }
        );

    }


    /* =====================================
       EXPLORE FIRST
    ====================================== */

    if (guestButton) {

        guestButton.addEventListener(
            "click",
            () => {

                showMessage(
                    "Returning you to the welcome experience.",
                    "info"
                );


                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 600);

            }
        );

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

                            entry.target.classList.add(
                                "show"
                            );

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
       CARD PARALLAX
    ====================================== */

    const startCard =
        document.querySelector(".start-card");


    if (startCard) {

        document.addEventListener(
            "mousemove",
            (event) => {

                if (window.innerWidth < 950) {

                    startCard.style.transform =
                        "translate(0, 0)";

                    return;

                }


                const x =
                    (
                        window.innerWidth / 2 -
                        event.clientX
                    ) / 100;


                const y =
                    (
                        window.innerHeight / 2 -
                        event.clientY
                    ) / 100;


                startCard.style.transform =
                    `translate(${x}px, ${y}px)`;

            }
        );


        document.addEventListener(
            "mouseleave",
            () => {

                startCard.style.transform =
                    "translate(0, 0)";

            }
        );

    }


})();
