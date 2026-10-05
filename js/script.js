/* =========================================
   CEO JACK LEARNING HUB
   WELCOME PAGE JAVASCRIPT
========================================= */


/* =========================================
   MOBILE MENU
========================================= */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");


if (menuBtn && mobileMenu) menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("active");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});


/* Close mobile menu when a link is clicked */

const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];


mobileLinks.forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("active");
        menuBtn?.setAttribute("aria-expanded", "false");
        menuBtn?.setAttribute("aria-label", "Open navigation");

    });

});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && mobileMenu?.classList.contains("active")) {
        mobileMenu.classList.remove("active");
        menuBtn?.setAttribute("aria-expanded", "false");
        menuBtn?.setAttribute("aria-label", "Open navigation");
        menuBtn?.focus();
    }
});


/* =========================================
   TYPING ANIMATION
========================================= */

const typingText =
    document.getElementById("typingText");


const words = [
    "LEARNING HUB",
    "DIGITAL FUTURE",
    "CREATIVE SPACE",
    "YOUR NEXT STEP"
];


let wordIndex = 0;
let characterIndex = 0;
let deleting = false;


function typeEffect() {

    const currentWord =
        words[wordIndex];


    if (!deleting) {

        typingText.textContent =
            currentWord.substring(
                0,
                characterIndex + 1
            );

        characterIndex++;


        if (
            characterIndex ===
            currentWord.length
        ) {

            deleting = true;

            setTimeout(
                typeEffect,
                1800
            );

            return;
        }


    } else {

        typingText.textContent =
            currentWord.substring(
                0,
                characterIndex - 1
            );

        characterIndex--;


        if (characterIndex === 0) {

            deleting = false;

            wordIndex =
                (wordIndex + 1) %
                words.length;

        }

    }


    const speed =
        deleting ? 45 : 90;


    setTimeout(
        typeEffect,
        speed
    );

}


if (typingText) typeEffect();


/* =========================================
   GET STARTED
========================================= */

const getStarted =
    document.getElementById("getStarted");


if (getStarted) getStarted.addEventListener("click", () => {
    /* The anchor supplies the route; this only gives immediate feedback. */
    getStarted.setAttribute("aria-busy", "true");
    getStarted.innerHTML = `
        <span>Starting...</span>
        <span class="arrow">→</span>
    `;
});


/* =========================================
   MOUSE PARALLAX EFFECT
========================================= */

const visual =
    document.querySelector(".hero-visual");


document.addEventListener(
    "mousemove",
    (event) => {

        if (
            window.innerWidth < 900
        ) {
            return;
        }


        const x =
            (window.innerWidth / 2 -
             event.clientX) / 40;


        const y =
            (window.innerHeight / 2 -
             event.clientY) / 40;


        if (visual) visual.style.transform =
            `translate(${x}px, ${y}px)`;

    }
);


/* =========================================
   RESET PARALLAX
========================================= */

document.addEventListener(
    "mouseleave",
    () => {

        if (visual) visual.style.transform =
            "translate(0, 0)";

    }
);

/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    "IntersectionObserver" in window ? new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

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
    ) : null;


revealElements.forEach(element => {

    if (revealObserver) revealObserver.observe(element);
    else element.classList.add("show");

});
