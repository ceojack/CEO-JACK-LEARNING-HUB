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

            mobileMenu.classList.toggle(
                "active"
            );

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

            }
        );

    });

}


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(
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
    );


revealElements.forEach(element => {

    revealObserver.observe(
        element
    );

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