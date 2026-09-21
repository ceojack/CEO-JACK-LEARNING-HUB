document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const exploreBtn = document.getElementById("explore-btn");

    // 1. Dark/Light Theme Switcher Logic
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        
        if (currentTheme === "light") {
            document.documentElement.removeAttribute("data-theme");
            themeToggle.textContent = "🌙 Dark Mode";
        } else {
            document.documentElement.setAttribute("data-theme", "light");
            themeToggle.textContent = "☀️ Light Mode";
        }
    });

    // 2. Interactive Button Action
    exploreBtn.addEventListener("click", () => {
        alert("Welcome to CEO JACK Learning Hub! Preparing your personalized executive syllabus...");
    });
});
