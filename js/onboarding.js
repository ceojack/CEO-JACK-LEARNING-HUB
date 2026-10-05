
/* =========================================
   CEO JACK LEARNING HUB
   ONBOARDING JAVASCRIPT
========================================= */

(() => {

    /* =====================================
       BASIC ELEMENTS
    ====================================== */

    const steps =
        document.querySelectorAll(".form-step");

    const progressSteps =
        document.querySelectorAll(".progress-step");

    const progressFill =
        document.getElementById("progressFill");

    const stepCounter =
        document.getElementById("stepCounter");

    const backButton =
        document.getElementById("backBtn");

    const nextButton =
        document.getElementById("nextBtn");

    const nextText =
        document.getElementById("nextText");

    const statusMessage =
        document.getElementById("onboardingStatus");


    const totalSteps = 4;

    let currentStep = 1;


    /* =====================================
       STEP DISPLAY
    ====================================== */

    function showStep(stepNumber) {

        currentStep = stepNumber;


        steps.forEach((step) => {

            const stepValue =
                Number(
                    step.dataset.step
                );


            step.classList.toggle(
                "active",
                stepValue === currentStep
            );

        });


        updateProgress();

        clearErrors();

        clearStatus();


        /* Update review before showing step 4 */

        if (currentStep === 4) {

            updateReview();

        }

    }


    /* =====================================
       PROGRESS
    ====================================== */

    function updateProgress() {

        const percentage =
            ((currentStep - 1) /
            (totalSteps - 1)) * 100;


        progressFill.style.width =
            `${percentage}%`;


        stepCounter.textContent =
            `${currentStep} / ${totalSteps}`;


        progressSteps.forEach(
            (step) => {

                const value =
                    Number(
                        step.dataset.progress
                    );


                step.classList.toggle(
                    "active",
                    value === currentStep
                );


                step.classList.toggle(
                    "completed",
                    value < currentStep
                );

            }
        );


        backButton.disabled =
            currentStep === 1;


        if (currentStep === totalSteps) {

            nextText.textContent =
                "Complete Setup";

        } else {

            nextText.textContent =
                "Continue";

        }

    }


    /* =====================================
       GET RADIO VALUE
    ====================================== */

    function getSelectedValue(name) {

        const selected =
            document.querySelector(
                `input[name="${name}"]:checked`
            );


        return selected
            ? selected.value
            : "";

    }


    /* =====================================
       GET CHECKBOX VALUES
    ====================================== */

    function getCheckedValues(name) {

        return Array.from(
            document.querySelectorAll(
                `input[name="${name}"]:checked`
            )
        ).map(
            (input) => input.value
        );

    }


    /* =====================================
       VALIDATION
    ====================================== */

    function validateCurrentStep() {

        let valid = true;


        /* STEP 1 */

        if (currentStep === 1) {

            const level =
                getSelectedValue(
                    "learningLevel"
                );


            const ageGroup =
                document.getElementById(
                    "ageGroup"
                ).value;


            if (!level) {

                document.getElementById(
                    "levelError"
                ).textContent =
                    "Please select your learning level.";

                valid = false;

            }


            if (!ageGroup) {

                document.getElementById(
                    "ageError"
                ).textContent =
                    "Please select your age group.";

                valid = false;

            }

        }


        /* STEP 2 */

        if (currentStep === 2) {

            const interests =
                getCheckedValues(
                    "interest"
                );


            if (interests.length === 0) {

                document.getElementById(
                    "interestError"
                ).textContent =
                    "Choose at least one interest.";

                valid = false;

            }

        }


        /* STEP 3 */

        if (currentStep === 3) {

            const goals =
                getCheckedValues(
                    "goal"
                );


            const experience =
                document.getElementById(
                    "experience"
                ).value;


            if (goals.length === 0) {

                document.getElementById(
                    "goalError"
                ).textContent =
                    "Choose at least one goal.";

                valid = false;

            }


            if (!experience) {

                document.getElementById(
                    "experienceError"
                ).textContent =
                    "Please select your experience level.";

                valid = false;

            }

        }


        return valid;

    }


    /* =====================================
       CLEAR ERRORS
    ====================================== */

    function clearErrors() {

        document
            .querySelectorAll(
                ".validation-message"
            )
            .forEach(
                (element) => {

                    element.textContent =
                        "";

                }
            );

    }


    /* =====================================
       STATUS
    ====================================== */

    function showStatus(
        message,
        type
    ) {

        statusMessage.textContent =
            message;

        statusMessage.className =
            `onboarding-status ${type}`;

    }


    function clearStatus() {

        statusMessage.textContent =
            "";

        statusMessage.className =
            "onboarding-status";

    }


    /* =====================================
       REVIEW DATA
    ====================================== */

    function createReviewTags(
        container,
        values
    ) {

        container.innerHTML = "";


        if (!values.length) {

            const empty =
                document.createElement(
                    "span"
                );


            empty.className =
                "review-tag";


            empty.textContent =
                "None selected";


            container.appendChild(
                empty
            );

            return;

        }


        values.forEach((value) => {

            const tag =
                document.createElement(
                    "span"
                );


            tag.className =
                "review-tag";


            tag.textContent =
                value;


            container.appendChild(
                tag
            );

        });

    }


    function updateReview() {

        const level =
            getSelectedValue(
                "learningLevel"
            );


        const ageGroup =
            document.getElementById(
                "ageGroup"
            ).value;


        const interests =
            getCheckedValues(
                "interest"
            );


        const goals =
            getCheckedValues(
                "goal"
            );


        const experience =
            document.getElementById(
                "experience"
            ).value;


        document.getElementById(
            "reviewLevel"
        ).textContent =
            level || "—";


        document.getElementById(
            "reviewAge"
        ).textContent =
            ageGroup || "—";


        document.getElementById(
            "reviewExperience"
        ).textContent =
            experience || "—";


        createReviewTags(
            document.getElementById(
                "reviewInterests"
            ),
            interests
        );


        createReviewTags(
            document.getElementById(
                "reviewGoals"
            ),
            goals
        );

    }


    /* =====================================
       SAVE ONBOARDING DATA
    ====================================== */

    function saveOnboardingData() {

        const onboardingData = {

            learningLevel:
                getSelectedValue(
                    "learningLevel"
                ),

            ageGroup:
                document.getElementById(
                    "ageGroup"
                ).value,

            interests:
                getCheckedValues(
                    "interest"
                ),

            goals:
                getCheckedValues(
                    "goal"
                ),

            experience:
                document.getElementById(
                    "experience"
                ).value,

            completedAt:
                new Date().toISOString()

        };


        localStorage.setItem(
            "ceoJackOnboarding",
            JSON.stringify(
                onboardingData
            )
        );

    }


    /* =====================================
       NEXT BUTTON
    ====================================== */

    nextButton.addEventListener(
        "click",
        () => {

            /* Last step */

            if (
                currentStep === totalSteps
            ) {

                saveOnboardingData();


                showStatus(
                    "Your personalized setup has been saved successfully.",
                    "success"
                );


                nextButton.disabled =
                    true;


                nextText.textContent =
                    "Setup Complete";


                window.setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 500);

                return;

            }


            if (!validateCurrentStep()) {

                showStatus(
                    "Please complete the required information.",
                    "error"
                );

                return;

            }


            showStep(
                currentStep + 1
            );

        }
    );


    /* =====================================
       BACK BUTTON
    ====================================== */

    backButton.addEventListener(
        "click",
        () => {

            if (currentStep > 1) {

                showStep(
                    currentStep - 1
                );

            }

        }
    );


    /* =====================================
       CLEAR ERROR WHILE ANSWERING
    ====================================== */

    document.addEventListener(
        "change",
        (event) => {

            if (
                event.target.matches(
                    "input, select"
                )
            ) {

                clearErrors();

                clearStatus();

            }

        }
    );


    /* =====================================
       SCROLL REVEAL
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

    showStep(1);

})();
