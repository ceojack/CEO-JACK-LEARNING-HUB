/* =========================================
   CEO JACK LEARNING HUB
   SERVICES PAGE JAVASCRIPT
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

            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

        });


        const mobileLinks =
            mobileNavigation.querySelectorAll("a");


        mobileLinks.forEach((link) => {

            link.addEventListener("click", () => {

                mobileNavigation.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation");

            });

        });

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape" && mobileNavigation.classList.contains("active")) {

                mobileNavigation.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation");
                menuButton.focus();

            }

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

        /* Fallback for older browsers */

        revealElements.forEach((element) => {

            element.classList.add("show");

        });

    }


    /* =====================================
       FAQ ACCORDION
    ====================================== */

    const faqItems =
        document.querySelectorAll(".faq-item");


    faqItems.forEach((item, index) => {

        const question =
            item.querySelector(".faq-question");

        const answer =
            item.querySelector(".faq-answer");


        if (!question || !answer) {
            return;
        }

        const answerId = `faq-answer-${index + 1}`;

        question.type = "button";
        question.setAttribute("aria-expanded", "false");
        question.setAttribute("aria-controls", answerId);
        answer.id = answerId;


        question.addEventListener("click", () => {

            const isOpen =
                item.classList.contains("open");


            /* Close every FAQ */

            faqItems.forEach((otherItem) => {

                const otherAnswer =
                    otherItem.querySelector(".faq-answer");


                otherItem.classList.remove("open");
                const otherQuestion =
                    otherItem.querySelector(".faq-question");

                if (otherQuestion) {

                    otherQuestion.setAttribute("aria-expanded", "false");

                }


                if (otherAnswer) {

                    otherAnswer.style.maxHeight = null;

                }

            });


            /* Open clicked FAQ */

            if (!isOpen) {

                item.classList.add("open");
                question.setAttribute("aria-expanded", "true");

                answer.style.maxHeight =
                    `${answer.scrollHeight}px`;

            }

        });

    });


    /* =====================================
       HERO PARALLAX
    ====================================== */

    const serviceVisual =
        document.querySelector(".service-visual");


    if (serviceVisual) {

        document.addEventListener("mousemove", (event) => {

            /* Disable parallax on smaller screens */

            if (window.innerWidth < 950) {
                serviceVisual.style.transform = "translate(0, 0)";
                return;
            }


            const x =
                (window.innerWidth / 2 - event.clientX) / 70;


            const y =
                (window.innerHeight / 2 - event.clientY) / 70;


            serviceVisual.style.transform =
                `translate(${x}px, ${y}px)`;

        });


        document.addEventListener("mouseleave", () => {

            serviceVisual.style.transform =
                "translate(0, 0)";

        });

    }


})();
