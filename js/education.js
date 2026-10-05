
const classGrid = document.getElementById("classGrid");
const subjectGrid = document.getElementById("subjectGrid");
const subjectSearch = document.getElementById("subjectSearch");
const subjectSubtitle = document.getElementById("subjectSubtitle");
const emptyState = document.getElementById("emptyState");

const levelTabs = document.querySelectorAll(".level-tab");
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");

const toast = document.getElementById("toast");

let currentLevel = "primary";
let selectedClass =
  localStorage.getItem("ceoJackSelectedClass") || "P1";

let toastTimer;

/* ACADEMIC LEVELS */

const classes = {
  primary: ["P1", "P2", "P3", "P4", "P5", "P6", "P7"],
  secondary: ["S1", "S2", "S3", "S4", "S5", "S6"]
};

/* SUBJECT DATA */

const primarySubjects = [
  {
    name: "Mathematics",
    icon: "∑",
    description: "Numbers, calculations, shapes, and problem-solving.",
    color: "#eeedff",
    iconColor: "#6858d8"
  },
  {
    name: "English",
    icon: "Aa",
    description: "Grammar, reading, writing, and communication.",
    color: "#eaf3ff",
    iconColor: "#367ed5"
  },
  {
    name: "Science",
    icon: "⚗",
    description: "Explore nature, living things, and the world.",
    color: "#e8f8f1",
    iconColor: "#219c72"
  },
  {
    name: "Social Studies",
    icon: "◎",
    description: "Understand people, communities, and geography.",
    color: "#fff2e5",
    iconColor: "#d58a35"
  },
  {
    name: "Religious Education",
    icon: "✧",
    description: "Values, beliefs, responsibility, and character.",
    color: "#f6eefe",
    iconColor: "#9a64cf"
  },
  {
    name: "Literacy",
    icon: "▤",
    description: "Develop reading comprehension and writing skills.",
    color: "#e9f7fa",
    iconColor: "#2695a8"
  },
  {
    name: "Creative Arts",
    icon: "✎",
    description: "Explore drawing, music, creativity, and expression.",
    color: "#fff0f4",
    iconColor: "#d45d8b"
  },
  {
    name: "Physical Education",
    icon: "⚽",
    description: "Movement, fitness, teamwork, and healthy living.",
    color: "#edf5e9",
    iconColor: "#659b42"
  }
];

const secondarySubjects = [
  {
    name: "Mathematics",
    icon: "∑",
    description: "Algebra, geometry, statistics, and problem-solving.",
    color: "#eeedff",
    iconColor: "#6858d8"
  },
  {
    name: "English Language",
    icon: "Aa",
    description: "Language skills, comprehension, and composition.",
    color: "#eaf3ff",
    iconColor: "#367ed5"
  },
  {
    name: "Biology",
    icon: "♧",
    description: "Living organisms, ecology, and life processes.",
    color: "#e8f8f1",
    iconColor: "#219c72"
  },
  {
    name: "Chemistry",
    icon: "⚗",
    description: "Matter, chemical reactions, and laboratory concepts.",
    color: "#fff2e5",
    iconColor: "#d58a35"
  },
  {
    name: "Physics",
    icon: "◉",
    description: "Energy, forces, motion, and the physical world.",
    color: "#f6eefe",
    iconColor: "#9a64cf"
  },
  {
    name: "Geography",
    icon: "◎",
    description: "Earth systems, maps, climate, and environments.",
    color: "#e9f7fa",
    iconColor: "#2695a8"
  },
  {
    name: "History",
    icon: "◷",
    description: "Historical events, societies, and developments.",
    color: "#fff0f4",
    iconColor: "#d45d8b"
  },
  {
    name: "ICT",
    icon: "</>",
    description: "Computer fundamentals and digital technology.",
    color: "#edf5e9",
    iconColor: "#659b42"
  },
  {
    name: "Entrepreneurship",
    icon: "◈",
    description: "Business concepts, enterprise, and financial literacy.",
    color: "#fff2e5",
    iconColor: "#d58a35"
  },
  {
    name: "Kiswahili",
    icon: "文",
    description: "Language, vocabulary, reading, and communication.",
    color: "#eaf3ff",
    iconColor: "#367ed5"
  }
];

/* NOTIFICATIONS */

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

/* CLASS RENDERING */

function renderClasses() {
  classGrid.innerHTML = "";

  classes[currentLevel].forEach(className => {
    const button = document.createElement("button");

    button.className =
      "class-card" +
      (selectedClass === className ? " active" : "");

    button.type = "button";
    button.setAttribute(
      "aria-pressed",
      selectedClass === className ? "true" : "false"
    );

    const title = document.createElement("strong");
    title.textContent = className;

    const caption = document.createElement("span");
    caption.textContent =
      currentLevel === "primary"
        ? "Primary"
        : "Secondary";

    button.append(title, caption);

    button.addEventListener("click", () => {
      selectedClass = className;

      localStorage.setItem(
        "ceoJackSelectedClass",
        selectedClass
      );

      renderClasses();
      updateLearningCard();
      renderSubjects();

      showToast(`${selectedClass} selected successfully.`);
    });

    classGrid.appendChild(button);
  });
}

/* SUBJECT RENDERING */

function renderSubjects() {
  const source =
    currentLevel === "primary"
      ? primarySubjects
      : secondarySubjects;

  const query = subjectSearch.value
    .trim()
    .toLowerCase();

  const filtered = source.filter(subject =>
    subject.name.toLowerCase().includes(query) ||
    subject.description.toLowerCase().includes(query)
  );

  subjectGrid.innerHTML = "";

  subjectSubtitle.textContent =
    `Explore subjects for ${selectedClass}.`;

  emptyState.hidden = filtered.length !== 0;

  filtered.forEach(subject => {
    const card = document.createElement("article");
    card.className = "subject-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      `Explore ${subject.name} for ${selectedClass}`
    );

    const icon = document.createElement("div");
    icon.className = "subject-icon";
    icon.style.backgroundColor = subject.color;
    icon.style.color = subject.iconColor;
    icon.textContent = subject.icon;

    const title = document.createElement("h3");
    title.textContent = subject.name;

    const description = document.createElement("p");
    description.textContent = subject.description;

    const bottom = document.createElement("div");
    bottom.className = "subject-bottom";

    const action = document.createElement("span");
    action.textContent = "Explore subject →";

    const level = document.createElement("small");
    level.textContent = selectedClass;

    bottom.append(action, level);
    card.append(icon, title, description, bottom);

    function openSubject() {
      const query = new URLSearchParams({
        class: selectedClass,
        subject: subject.name
      });

      window.location.href = `subject.html?${query.toString()}`;
    }

    card.addEventListener("click", openSubject);

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSubject();
      }
    });

    subjectGrid.appendChild(card);
  });
}

/* LEVEL SWITCHING */

levelTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    currentLevel = tab.dataset.level;

    levelTabs.forEach(item => {
      item.classList.toggle(
        "active",
        item === tab
      );
    });

    const defaultClass =
      currentLevel === "primary" ? "P1" : "S1";

    const validClasses = classes[currentLevel];

    if (!validClasses.includes(selectedClass)) {
      selectedClass = defaultClass;
    }

    localStorage.setItem(
      "ceoJackSelectedClass",
      selectedClass
    );

    subjectSearch.value = "";

    renderClasses();
    renderSubjects();
    updateLearningCard();
  });
});

/* CONTINUE LEARNING */

function updateLearningCard() {
  const title = document.getElementById("continueTitle");
  const description = document.getElementById("continueDescription");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  title.textContent = `Mathematics Foundations — ${selectedClass}`;

  description.textContent =
    `Start building your Mathematics knowledge for ${selectedClass} through guided explanations and practice.`;

  const savedProgress = Number(
    localStorage.getItem(`ceoJackProgress_${selectedClass}`) || 0
  );

  const progress = Math.min(
    100,
    Math.max(0, savedProgress)
  );

  progressFill.style.width = `${progress}%`;
  progressText.textContent = `${progress}% completed`;
}

document.getElementById("continueButton")
  .addEventListener("click", () => {
    const query = new URLSearchParams({
      class: selectedClass,
      subject: "Mathematics"
    });

    window.location.href = `subject.html?${query.toString()}`;
  });

/* SEARCH */

subjectSearch.addEventListener("input", renderSubjects);

/* MOBILE NAVIGATION */

menuBtn.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
});

document.querySelectorAll(".sidebar .nav-link").forEach(link => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });
});

/* PROFILE */

const savedName = localStorage.getItem("ceoJackUserName");

if (savedName) {
  document.getElementById("profileInitial").textContent =
    savedName.trim().charAt(0).toUpperCase() || "J";
}

/* INITIALIZE */

if (!classes.primary.includes(selectedClass) &&
    !classes.secondary.includes(selectedClass)) {
  selectedClass = "P1";
}

currentLevel = selectedClass.startsWith("S")
  ? "secondary"
  : "primary";

levelTabs.forEach(tab => {
  tab.classList.toggle(
    "active",
    tab.dataset.level === currentLevel
  );
});

renderClasses();
renderSubjects();
updateLearningCard();
