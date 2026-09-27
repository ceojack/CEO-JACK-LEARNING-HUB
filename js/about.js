/* =========================================
   CEO JACK LEARNING HUB
   ABOUT PAGE JAVASCRIPT
========================================= */


/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuBtn =
    document.getElementById("menuBtn");

const mobileMenu =
    document.getElementById("mobileMenu");


if (menuBtn && mobileMenu) {

    menuBtn.addEventListener(
        "click",
        () => {
            const isOpen = mobileMenu.classList.toggle("active");
            menuBtn.setAttribute("aria-expanded", String(isOpen));
            menuBtn.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");

        }
    );


    const mobileLinks =
        mobileMenu.querySelectorAll("a");


    mobileLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mobileMenu.classList.remove(
                    "active"
                );
                menuBtn.setAttribute("aria-expanded", "false");
                menuBtn.setAttribute("aria-label", "Open navigation");

            }
        );

    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && mobileMenu.classList.contains("active")) {
            mobileMenu.classList.remove("active");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.setAttribute("aria-label", "Open navigation");
            menuBtn.focus();
        }
    });

}


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    "IntersectionObserver" in window ? new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

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

            });

        },
        {
            threshold: 0.15
        }
    ) : null;


revealElements.forEach(element => {

    if (revealObserver) revealObserver.observe(element);
    else element.classList.add("show");

});


/* =========================================
   SUBTLE MOUSE MOVEMENT
========================================= */

const aboutVisual =
    document.querySelector(
        ".about-visual"
    );


document.addEventListener(
    "mousemove",
    event => {

        if (
            !aboutVisual ||
            window.innerWidth < 950
        ) {
            return;
        }


        const x =
            (
                window.innerWidth / 2 -
                event.clientX
            ) / 60;


        const y =
            (
                window.innerHeight / 2 -
                event.clientY
            ) / 60;


        aboutVisual.style.transform =
            `translate(${x}px, ${y}px)`;

    }
);


/* =========================================
   RESET MOUSE EFFECT
========================================= */

document.addEventListener(
    "mouseleave",
    () => {

        if (aboutVisual) {

            aboutVisual.style.transform =
                "translate(0, 0)";

        }

    }
);


/* =========================================
   ACTIVE PAGE
========================================= */

const currentPage =
    window.location.pathname;


if (
    currentPage.includes("about")
) {

    document
        .querySelectorAll(
            ".nav-links a"
        )
        .forEach(link => {

            link.classList.remove(
                "active"
            );

        });


    const aboutLink =
        document.querySelector(
            '.nav-links a[href="about.html"]'
        );


    if (aboutLink) {

        aboutLink.classList.add(
            "active"
        );

    }

}
