/* =========================================
   CEO JACK LEARNING HUB
   WELCOME PAGE JAVASCRIPT
========================================= */


/* =========================================
   MOBILE MENU
========================================= */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");


menuBtn.addEventListener("click", () => {

    mobileMenu.classList.toggle("active");

});


/* Close mobile menu when a link is clicked */

const mobileLinks =
    mobileMenu.querySelectorAll("a");


mobileLinks.forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("active");

    });

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


typeEffect();


/* =========================================
   GET STARTED
========================================= */

const getStarted =
    document.getElementById("getStarted");


getStarted.addEventListener("click", () => {

    /*
       FUTURE FLOW:

       Welcome Page
            ↓
       Get Started
            ↓
       Account / Onboarding
            ↓
       Personalized Dashboard
            ↓
       Three Hubs

       We will build this later.
    */


    getStarted.innerHTML =
        `
        <span>Starting...</span>
        <span class="arrow">→</span>
        `;


    setTimeout(() => {

        /*
           Temporary behavior.

           Later replace this with:

           window.location.href =
               "pages/onboarding.html";
        */

        alert(
            "Welcome to CEO JACK LEARNING HUB 🚀"
        );


        getStarted.innerHTML =
            `
            <span>Get Started</span>
            <span class="arrow">→</span>
            `;

    }, 700);

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


        visual.style.transform =
            `translate(${x}px, ${y}px)`;

    }
);


/* =========================================
   RESET PARALLAX
========================================= */

document.addEventListener(
    "mouseleave",
    () => {

        visual.style.transform =
            "translate(0, 0)";

    }
);