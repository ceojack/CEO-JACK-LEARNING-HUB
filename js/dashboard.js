/* =========================================
   CEO JACK LEARNING HUB
   DASHBOARD JAVASCRIPT
========================================= */

(() => {

    /* =====================================
       ELEMENTS
    ====================================== */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const mobileMenuButton =
        document.getElementById("mobileMenuBtn");

    const sidebarClose =
        document.getElementById("sidebarClose");

    const notificationButton =
        document.getElementById("notificationBtn");

    const notificationPanel =
        document.getElementById("notificationPanel");

    const closeNotifications =
        document.getElementById("closeNotifications");

    const profileTrigger =
        document.getElementById("profileTrigger");

    const profileMenu =
        document.getElementById("profileMenu");

    const profileLogout =
        document.getElementById("profileLogout");

    const logoutButton =
        document.getElementById("logoutBtn");

    const settingsButton =
        document.getElementById("settingsBtn");

    const toast =
        document.getElementById("toast");

    const globalSearch =
        document.getElementById("globalSearch");

    const breadcrumbCurrent =
        document.getElementById("breadcrumbCurrent");


    /* =====================================
       USER DATA
    ====================================== */

    const storedOnboarding =
        localStorage.getItem(
            "ceoJackOnboarding"
        );


    let onboardingData = null;


    if (storedOnboarding) {

        try {

            onboardingData =
                JSON.parse(
                    storedOnboarding
                );

        } catch (error) {

            onboardingData = null;

        }

    }


    /*
       At this stage there is no real
       authenticated user yet.

       We therefore use a safe fallback.
    */

    const userName =
        localStorage.getItem(
            "ceoJackUserName"
        ) ||
        "Learner";


    /* =====================================
       PERSONALIZE NAME
    ====================================== */

    const nameElements = [

        document.getElementById("welcomeName"),

        document.getElementById("profileName"),

        document.getElementById("sidebarUserName")

    ];


    nameElements.forEach((element) => {

        if (element) {

            element.textContent =
                userName;

        }

    });


    /* =====================================
       CREATE INITIAL
    ====================================== */

    const initial =
        userName
            .trim()
            .charAt(0)
            .toUpperCase() || "U";


    const avatarElements = [

        document.getElementById("profileAvatar"),

        document.getElementById("sidebarAvatar")

    ];


    avatarElements.forEach((element) => {

        if (element) {

            element.textContent =
                initial;

        }

    });


    /* =====================================
       TIME GREETING
    ====================================== */

    function updateGreeting() {

        const greetingElement =
            document.getElementById(
                "timeGreeting"
            );


        if (!greetingElement) {
            return;
        }


        const hour =
            new Date().getHours();


        let greeting = "day";


        if (hour < 12) {

            greeting = "morning";

        } else if (hour < 18) {

            greeting = "afternoon";

        } else {

            greeting = "evening";

        }


        greetingElement.textContent =
            greeting;

    }


    updateGreeting();


    /* =====================================
       MOBILE SIDEBAR
    ====================================== */

    function openSidebar() {

        sidebar.classList.add("open");

        sidebarOverlay.classList.add("show");

    }


    function closeSidebarMenu() {

        sidebar.classList.remove("open");

        sidebarOverlay.classList.remove("show");

    }


    if (mobileMenuButton) {

        mobileMenuButton.addEventListener(
            "click",
            openSidebar
        );

    }


    if (sidebarClose) {

        sidebarClose.addEventListener(
            "click",
            closeSidebarMenu
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebarMenu
        );

    }


    /* =====================================
       SIDEBAR NAVIGATION
    ====================================== */

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach((item) => {

        item.addEventListener(
            "click",
            () => {

                navItems.forEach(
                    (nav) => {

                        nav.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add(
                    "active"
                );


                const view =
                    item.dataset.view;


                if (breadcrumbCurrent) {

                    breadcrumbCurrent.textContent =
                        formatViewName(view);

                }


                /*
                   These are currently dashboard
                   interaction points.

                   Later each item can route to
                   its dedicated application module.
                */

                showToast(
                    `${formatViewName(view)} will open here.`
                );


                if (window.innerWidth <= 850) {

                    closeSidebarMenu();

                }

            }
        );

    });


    function formatViewName(view) {

        const names = {

            overview: "Overview",

            education: "Education Hub",

            digital: "Digital Skills Hub",

            business: "Entrepreneurship Hub",

            projects: "Projects",

            community: "Community",

            ai: "AI Assistant",

            safe: "Digital Safe",

            portfolio: "Portfolio"

        };


        return names[view] || "Overview";

    }


    /* =====================================
       NOTIFICATIONS
    ====================================== */

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                notificationPanel.classList.toggle(
                    "open"
                );

                profileMenu.classList.remove(
                    "open"
                );

            }
        );

    }


    if (closeNotifications) {

        closeNotifications.addEventListener(
            "click",
            () => {

                notificationPanel.classList.remove(
                    "open"
                );

            }
        );

    }


    /* =====================================
       PROFILE MENU
    ====================================== */

    if (profileTrigger) {

        profileTrigger.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                profileMenu.classList.toggle(
                    "open"
                );

                notificationPanel.classList.remove(
                    "open"
                );

            }
        );

    }


    document.addEventListener(
        "click",
        () => {

            profileMenu.classList.remove(
                "open"
            );

            notificationPanel.classList.remove(
                "open"
            );

        }
    );


    if (profileMenu) {

        profileMenu.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

            }
        );

    }


    /* =====================================
       TOAST
    ====================================== */

    let toastTimer;


    function showToast(message) {

        if (!toast) {
            return;
        }


        clearTimeout(
            toastTimer
        );


        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        toastTimer =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                2200
            );

    }


    /* =====================================
       CONTINUE LEARNING
    ====================================== */

    const continueButton =
        document.getElementById(
            "continueBtn"
        );


    const resumeButton =
        document.getElementById(
            "resumeCourseBtn"
        );


    if (continueButton) {

        continueButton.addEventListener(
            "click",
            () => {

                showToast(
                    "Opening your current learning path..."
                );

            }
        );

    }


    if (resumeButton) {

        resumeButton.addEventListener(
            "click",
            () => {

                showToast(
                    "Resuming HTML Foundations..."
                );

            }
        );

    }


    /* =====================================
       HUB ACTIONS
    ====================================== */

    const hubButtons =
        document.querySelectorAll(
            ".hub-card"
        );


    hubButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const hub =
                    button.dataset.hub ||
                    "Learning Hub";


                showToast(
                    `${hub} is ready for the next build.`
                );

            }
        );

    });


    /* =====================================
       QUICK ACTIONS
    ====================================== */

    const quickActions =
        document.querySelectorAll(
            "[data-action]"
        );


    quickActions.forEach((action) => {

        action.addEventListener(
            "click",
            () => {

                const actionType =
                    action.dataset.action;


                const messages = {

                    coding:
                        "Project workspace will open here.",

                    ai:
                        "AI Assistant will open here.",

                    community:
                        "Community workspace will open here.",

                    safe:
                        "Digital Safe will open here."

                };


                showToast(
                    messages[actionType] ||
                    "Action selected."
                );

            }
        );

    });


    /* =====================================
       SEARCH
    ====================================== */

    if (globalSearch) {

        globalSearch.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key !== "Enter"
                ) {
                    return;
                }


                const query =
                    globalSearch.value.trim();


                if (!query) {

                    showToast(
                        "Type something to search."
                    );

                    return;

                }


                showToast(
                    `Searching for "${query}"...`
                );

            }
        );

    }


    /* =====================================
       "/" SEARCH SHORTCUT
    ====================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "/" &&
                document.activeElement !==
                globalSearch
            ) {

                event.preventDefault();

                if (globalSearch) {

                    globalSearch.focus();

                }

            }

        }
    );


    /* =====================================
       SETTINGS
    ====================================== */

    if (settingsButton) {

        settingsButton.addEventListener(
            "click",
            () => {

                showToast(
                    "Settings center will open here."
                );

            }
        );

    }


    /* =====================================
       LOGOUT
    ====================================== */

    function logout() {

        /*
           This is temporary.

           Once real authentication exists,
           logout will call the authentication
           service and clear the real session.
        */

        localStorage.removeItem(
            "ceoJackUserName"
        );


        showToast(
            "Signing out..."
        );


        setTimeout(
            () => {

                window.location.href =
                    "index.html";

            },
            800
        );

    }


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }


    if (profileLogout) {

        profileLogout.addEventListener(
            "click",
            logout
        );

    }


    /* =====================================
       PERSONALIZED RECOMMENDATIONS
    ====================================== */

    function updateRecommendations() {

        if (
            !onboardingData ||
            !onboardingData.interests
        ) {

            return;

        }


        const interests =
            onboardingData.interests
                .map(
                    (interest) =>
                        interest.toLowerCase()
                );


        const cards =
            document.querySelectorAll(
                ".recommendation-card"
            );


        cards.forEach((card) => {

            const content =
                card.textContent.toLowerCase();


            const matches =
                interests.some(
                    (interest) =>
                        content.includes(
                            interest
                        )
                );


            if (matches) {

                card.style.borderColor =
                    "rgba(85,221,255,0.18)";

            }

        });

    }


    updateRecommendations();


    /* =====================================
       PROFILE COMPLETION
    ====================================== */

    function calculateProfileCompletion() {

        if (!onboardingData) {
            return 25;
        }


        let completed = 0;

        const fields = [

            onboardingData.learningLevel,

            onboardingData.ageGroup,

            onboardingData.interests?.length,

            onboardingData.goals?.length,

            onboardingData.experience

        ];


        fields.forEach((field) => {

            if (field) {

                completed++;

            }

        });


        return Math.round(
            (completed / fields.length) * 100
        );

    }


    const completion =
        calculateProfileCompletion();


    const profileProgress =
        document.getElementById(
            "profileProgress"
        );


    if (profileProgress) {

        profileProgress.textContent =
            `${completion}%`;

    }


    /* =====================================
       PROFILE DATA FOR DEBUG / FUTURE
    ====================================== */

    window.ceoJackDashboard = {

        user: userName,

        onboarding: onboardingData,

        profileCompletion:
            completion

    };


    /* =====================================
       INITIAL TOAST
    ====================================== */

    setTimeout(
        () => {

            showToast(
                `Welcome back, ${userName}.`
            );

        },
        700
    );

})();