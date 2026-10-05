"use strict";

/*
|--------------------------------------------------------------------------
| CEO JACK LEARNING HUB — DASHBOARD CONTROLLER
|--------------------------------------------------------------------------
*/

const routes = {
  overview: "dashboard.html",
  education: "education.html",
  digital: "digital-skills.html",
  business: "entrepreneurship.html",
  projects: "projects.html",
  community: "community.html",
  ai: "ai.html",
  safe: "digital-safe.html",
  portfolio: "portfolio.html"
};


/* =====================================================
   DOM HELPERS
===================================================== */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) =>
  [...document.querySelectorAll(selector)];


/* =====================================================
   USER DATA
===================================================== */

function getUserName() {
  return (
    localStorage.getItem("ceoJackUserName") ||
    "CEO JACK"
  );
}


function getUserInitial(name) {
  const cleanName = String(name || "").trim();

  return cleanName
    ? cleanName.charAt(0).toUpperCase()
    : "C";
}


/* =====================================================
   GREETING
===================================================== */

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}


function updateWelcome() {
  const name = getUserName();
  const greeting = getGreeting();

  const welcomeTitle = $("#welcomeTitle");
  const profileName = $("#profileName");
  const profileAvatar = $("#profileAvatar");

  if (welcomeTitle) {
    welcomeTitle.textContent =
      `${greeting}, ${name} 👋`;
  }

  if (profileName) {
    profileName.textContent = name;
  }

  if (profileAvatar) {
    profileAvatar.textContent =
      getUserInitial(name);
  }
}


/* =====================================================
   NAVIGATION
===================================================== */

function navigate(route, options = {}) {
  const destination = routes[route];

  if (!destination) {
    showToast("This section is not available yet.");
    return;
  }

  if (options.newTab) {
    window.open(destination, "_blank");
    return;
  }

  window.location.href = destination;
}


function setupNavigation() {

  $$("[data-route]").forEach((element) => {

    element.addEventListener("click", (event) => {

      const route =
        element.dataset.route;

      if (!route) {
        return;
      }

      /*
       * Allow normal links to work naturally
       * if JavaScript navigation is not required.
       */

      if (
        element.tagName === "A" &&
        element.getAttribute("href")
      ) {
        return;
      }

      event.preventDefault();

      navigate(route);
    });

  });

}


/* =====================================================
   ACTIVE SIDEBAR ITEM
===================================================== */

function setActiveSidebarItem() {

  const currentPage =
    window.location.pathname
      .split("/")
      .pop() || "dashboard.html";

  $$(".nav-item").forEach((item) => {

    const href =
      item.getAttribute("href");

    item.classList.toggle(
      "active",
      href === currentPage
    );

  });

}


/* =====================================================
   MOBILE SIDEBAR
===================================================== */

function setupMobileSidebar() {

  const sidebar = $("#sidebar");
  const overlay = $("#sidebarOverlay");
  const menuButton = $("#mobileMenuBtn");

  if (!sidebar || !overlay || !menuButton) {
    return;
  }


  function openSidebar() {

    sidebar.classList.add("open");
    overlay.classList.add("show");

    document.body.style.overflow = "hidden";
  }


  function closeSidebar() {

    sidebar.classList.remove("open");
    overlay.classList.remove("show");

    document.body.style.overflow = "";
  }


  menuButton.addEventListener(
    "click",
    openSidebar
  );


  overlay.addEventListener(
    "click",
    closeSidebar
  );


  $$(".nav-item").forEach((item) => {

    item.addEventListener(
      "click",
      closeSidebar
    );

  });


  window.addEventListener(
    "resize",
    () => {

      if (window.innerWidth > 850) {
        closeSidebar();
      }

    }
  );

}


/* =====================================================
   NOTIFICATIONS
===================================================== */

function setupNotifications() {

  const button = $("#notificationBtn");
  const panel = $("#notificationPanel");
  const markRead = $("#markReadBtn");

  if (!button || !panel) {
    return;
  }


  button.addEventListener("click", (event) => {

    event.stopPropagation();

    panel.classList.toggle("show");

    const profileMenu = $("#profileMenu");

    if (profileMenu) {
      profileMenu.classList.remove("show");
    }

  });


  if (markRead) {

    markRead.addEventListener(
      "click",
      () => {

        const dot =
          document.querySelector(
            ".notification-dot"
          );

        if (dot) {
          dot.style.display = "none";
        }

        showToast("Notifications marked as read.");

      }
    );

  }

}


/* =====================================================
   PROFILE MENU
===================================================== */

function setupProfileMenu() {

  const button = $("#profileBtn");
  const menu = $("#profileMenu");

  if (!button || !menu) {
    return;
  }


  button.addEventListener("click", (event) => {

    event.stopPropagation();

    menu.classList.toggle("show");

    const notifications =
      $("#notificationPanel");

    if (notifications) {
      notifications.classList.remove("show");
    }

  });

}


/* =====================================================
   CLOSE MENUS
===================================================== */

function setupGlobalMenuClose() {

  document.addEventListener(
    "click",
    (event) => {

      const profileMenu =
        $("#profileMenu");

      const notificationPanel =
        $("#notificationPanel");

      const profileWrapper =
        $(".profile-wrapper");

      const notificationButton =
        $("#notificationBtn");

      if (
        profileMenu &&
        profileWrapper &&
        !profileWrapper.contains(event.target)
      ) {
        profileMenu.classList.remove("show");
      }


      if (
        notificationPanel &&
        notificationButton &&
        !notificationPanel.contains(event.target) &&
        !notificationButton.contains(event.target)
      ) {
        notificationPanel.classList.remove("show");
      }

    }
  );

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

  localStorage.removeItem(
    "ceoJackUserName"
  );

  localStorage.removeItem(
    "ceoJackOnboarding"
  );

  window.location.href = "index.html";
}


function setupLogout() {

  const logoutButton =
    $("#logoutBtn");

  const menuLogoutButton =
    $("#menuLogoutBtn");


  if (logoutButton) {

    logoutButton.addEventListener(
      "click",
      logout
    );

  }


  if (menuLogoutButton) {

    menuLogoutButton.addEventListener(
      "click",
      logout
    );

  }

}


/* =====================================================
   CONTINUE LEARNING
===================================================== */

function setupContinueLearning() {

  const button =
    document.querySelector(
      '[data-course="html"]'
    );

  if (!button) {
    return;
  }


  button.addEventListener(
    "click",
    () => {

      window.location.href =
        "digital-skills.html?mode=digital-skills&course=HTML+Foundations";

    }
  );

}


/* =====================================================
   START LEARNING
===================================================== */

function setupStartLearning() {

  const button =
    $("#startLearningBtn");

  if (!button) {
    return;
  }


  button.addEventListener(
    "click",
    () => {

      navigate("education");

    }
  );

}


/* =====================================================
   HUB CARDS
===================================================== */

function setupHubCards() {

  $$(".hub-card").forEach((card) => {

    card.addEventListener(
      "click",
      () => {

        const route =
          card.dataset.route;

        navigate(route);

      }
    );

  });

}


/* =====================================================
   RECOMMENDATIONS
===================================================== */

function setupRecommendations() {

  $$(".recommendation-card").forEach(
    (card) => {

      card.addEventListener(
        "click",
        () => {

          const destination =
            card.dataset.destination;

          navigate(destination);

        }
      );

    }
  );

}


/* =====================================================
   QUICK ACTIONS
===================================================== */

function setupQuickActions() {

  $$(".quick-action").forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const route =
            button.dataset.route;

          navigate(route);

        }
      );

    }
  );

}


/* =====================================================
   SEARCH
===================================================== */

function setupSearch() {

  const searchInput =
    $("#dashboardSearch");

  if (!searchInput) {
    return;
  }


  function performSearch() {

    const query =
      searchInput.value
        .trim()
        .toLowerCase();


    if (!query) {
      return;
    }


    /*
     * Education
     */

    if (
      query.includes("math") ||
      query.includes("english") ||
      query.includes("science") ||
      query.includes("biology") ||
      query.includes("physics") ||
      query.includes("chemistry") ||
      query.includes("geography") ||
      query.includes("history") ||
      query.includes("subject") ||
      query.includes("lesson")
    ) {

      window.location.href =
        `education.html?search=${encodeURIComponent(query)}`;

      return;
    }


    /*
     * Digital Skills
     */

    if (
      query.includes("html") ||
      query.includes("css") ||
      query.includes("javascript") ||
      query.includes("python") ||
      query.includes("coding") ||
      query.includes("programming") ||
      query.includes("web")
    ) {

      window.location.href =
        `digital-skills.html?search=${encodeURIComponent(query)}`;

      return;
    }


    /*
     * Entrepreneurship
     */

    if (
      query.includes("business") ||
      query.includes("money") ||
      query.includes("entrepreneur") ||
      query.includes("finance") ||
      query.includes("startup") ||
      query.includes("idea")
    ) {

      window.location.href =
        `entrepreneurship.html?search=${encodeURIComponent(query)}`;

      return;
    }


    /*
     * AI
     */

    if (
      query.includes("ai") ||
      query.includes("assistant") ||
      query.includes("explain")
    ) {

      window.location.href =
        `ai.html?query=${encodeURIComponent(query)}`;

      return;
    }


    showToast(
      `Searching CEO JACK for "${query}"...`
    );

  }


  searchInput.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {
        performSearch();
      }

    }
  );

}


/* =====================================================
   KEYBOARD SHORTCUTS
===================================================== */

function setupKeyboardShortcuts() {

  document.addEventListener(
    "keydown",
    (event) => {

      /*
       * "/" focuses search
       */

      if (
        event.key === "/" &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA"
      ) {

        event.preventDefault();

        const search =
          $("#dashboardSearch");

        if (search) {
          search.focus();
        }

      }


      /*
       * Escape closes menus
       */

      if (event.key === "Escape") {

        const profileMenu =
          $("#profileMenu");

        const notificationPanel =
          $("#notificationPanel");

        const sidebar =
          $("#sidebar");

        const overlay =
          $("#sidebarOverlay");


        profileMenu?.classList.remove(
          "show"
        );

        notificationPanel?.classList.remove(
          "show"
        );

        sidebar?.classList.remove(
          "open"
        );

        overlay?.classList.remove(
          "show"
        );

        document.body.style.overflow = "";

      }

    }
  );

}


/* =====================================================
   PROFILE COMPLETION
===================================================== */

function calculateProfileCompletion() {

  const onboardingRaw =
    localStorage.getItem(
      "ceoJackOnboarding"
    );

  if (!onboardingRaw) {
    return 60;
  }


  try {

    const onboarding =
      JSON.parse(onboardingRaw);


    const fields = [
      "name",
      "age",
      "classLevel",
      "interests",
      "goals"
    ];


    const completed =
      fields.filter(
        (field) => {

          const value =
            onboarding[field];

          if (Array.isArray(value)) {
            return value.length > 0;
          }

          return Boolean(value);

        }
      ).length;


    return Math.round(
      (completed / fields.length) * 100
    );

  } catch (error) {

    console.warn(
      "Could not read onboarding data:",
      error
    );

    return 60;
  }

}


function updateProfileCompletion() {

  const percent =
    calculateProfileCompletion();

  const percentElement =
    $("#completionPercent");

  const fill =
    $("#completionFill");


  if (percentElement) {
    percentElement.textContent =
      `${percent}%`;
  }


  if (fill) {
    fill.style.width =
      `${percent}%`;
  }

}


/* =====================================================
   COURSE / LESSON STATS
===================================================== */

function updateStats() {

  const lessonCount =
    $("#lessonCount");

  const courseCount =
    $("#courseCount");


  /*
   * These are starter dashboard values.
   * They can later be replaced with database values.
   */

  const completedLessons =
    Number(
      localStorage.getItem(
        "ceoJackCompletedLessons"
      ) || 0
    );


  const enrolledCourses =
    Number(
      localStorage.getItem(
        "ceoJackCourseCount"
      ) || 0
    );


  if (lessonCount) {

    lessonCount.textContent =
      completedLessons;

  }


  if (courseCount) {

    courseCount.textContent =
      enrolledCourses;

  }

}


/* =====================================================
   UPGRADE
===================================================== */

function setupUpgradeButton() {

  const button =
    $("#upgradeBtn");

  if (!button) {
    return;
  }


  button.addEventListener(
    "click",
    () => {

      showToast(
        "Premium learning features are coming soon."
      );

    }
  );

}


/* =====================================================
   ADD GOAL
===================================================== */

function setupAddGoal() {

  const button =
    $("#addGoalBtn");

  if (!button) {
    return;
  }


  button.addEventListener(
    "click",
    () => {

      showToast(
        "Goal creation will be available soon."
      );

    }
  );

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer = null;


function showToast(message) {

  const toast =
    $("#toast");

  const toastMessage =
    $("#toastMessage");


  if (!toast || !toastMessage) {
    return;
  }


  toastMessage.textContent =
    message;


  toast.classList.add("show");


  clearTimeout(toastTimer);


  toastTimer = setTimeout(
    () => {

      toast.classList.remove(
        "show"
      );

    },
    2800
  );

}


/* =====================================================
   DASHBOARD INITIALIZATION
===================================================== */

function initDashboard() {

  updateWelcome();

  updateProfileCompletion();

  updateStats();

  setActiveSidebarItem();

  setupNavigation();

  setupMobileSidebar();

  setupNotifications();

  setupProfileMenu();

  setupGlobalMenuClose();

  setupLogout();

  setupContinueLearning();

  setupStartLearning();

  setupHubCards();

  setupRecommendations();

  setupQuickActions();

  setupSearch();

  setupKeyboardShortcuts();

  setupUpgradeButton();

  setupAddGoal();

}


/* =====================================================
   START
===================================================== */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initDashboard
  );

} else {

  initDashboard();

}


/* =====================================================
   PUBLIC API
===================================================== */

window.ceoJackDashboard = {
  navigate,
  showToast,
  getUserName,
  logout
};