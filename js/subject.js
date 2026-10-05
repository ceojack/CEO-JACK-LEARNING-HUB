/* =========================================
   CEO JACK LEARNING HUB
   SUBJECT PAGE
========================================= */


/* =========================================
   URL PARAMETERS
========================================= */

const params = new URLSearchParams(window.location.search);

let selectedClass =
  params.get("class") ||
  localStorage.getItem("ceoJackSelectedClass") ||
  "S1";

let selectedSubject =
  params.get("subject") ||
  "Mathematics";


/* =========================================
   SUBJECT DATA
========================================= */

const subjects = {

  Mathematics: {
    icon: "∑",
    description:
      "Build strong mathematical thinking through concepts, examples, practice and problem solving."
  },

  English: {
    icon: "Aa",
    description:
      "Develop communication, reading, writing, grammar and vocabulary skills."
  },

  "English Language": {
    icon: "Aa",
    description:
      "Develop communication, reading, writing, grammar and vocabulary skills."
  },

  Science: {
    icon: "⚗",
    description:
      "Explore scientific ideas, observations, experiments and the world around you."
  },

  Biology: {
    icon: "🧬",
    description:
      "Explore living organisms, life processes, ecosystems and biological systems."
  },

  Chemistry: {
    icon: "⚗",
    description:
      "Understand matter, chemical reactions, elements, compounds and laboratory concepts."
  },

  Physics: {
    icon: "⚡",
    description:
      "Explore forces, energy, motion, matter and the physical world."
  },

  Geography: {
    icon: "🌍",
    description:
      "Understand places, people, environments, physical processes and the world around us."
  },

  History: {
    icon: "🏛",
    description:
      "Explore historical events, societies, people and how the past shaped the present."
  },

  ICT: {
    icon: "💻",
    description:
      "Develop digital literacy, computer knowledge, programming and technology skills."
  },

  Entrepreneurship: {
    icon: "🚀",
    description:
      "Learn how ideas become businesses through innovation, finance and problem solving."
  },

  "Social Studies": {
    icon: "🌍",
    description:
      "Understand communities, society, environment, citizenship and everyday life."
  },

  Literacy: {
    icon: "📖",
    description:
      "Build foundational reading, writing, communication and comprehension skills."
  },

  "Creative Arts": {
    icon: "🎨",
    description:
      "Develop creativity through art, design, music, performance and creative expression."
  },

  "Physical Education": {
    icon: "🏃",
    description:
      "Develop physical fitness, movement skills, teamwork and healthy habits."
  },

  "Religious Education": {
    icon: "📚",
    description:
      "Explore values, beliefs, ethics and principles that guide human life."
  },

  Kiswahili: {
    icon: "A",
    description:
      "Develop Kiswahili language skills through reading, writing, grammar and communication."
  }

};


/* =========================================
   TOPIC LIBRARY
   STARTER CONTENT
========================================= */

const topicLibrary = {

  Mathematics: [
    {
      title: "Number Systems",
      description: "Understand numbers and their properties."
    },
    {
      title: "Integers",
      description: "Work with positive and negative whole numbers."
    },
    {
      title: "Fractions",
      description: "Learn how fractions represent parts of a whole."
    },
    {
      title: "Decimals",
      description: "Understand decimal numbers and operations."
    },
    {
      title: "Percentages",
      description: "Learn how percentages represent parts of quantities."
    },
    {
      title: "Algebra",
      description: "Introduction to variables and algebraic expressions."
    },
    {
      title: "Geometry",
      description: "Explore shapes, angles and geometric relationships."
    },
    {
      title: "Measurement",
      description: "Learn how to measure length, mass, time and other quantities."
    }
  ],

  English: [
    {
      title: "Parts of Speech",
      description: "Understand nouns, verbs, adjectives and other word classes."
    },
    {
      title: "Sentence Construction",
      description: "Learn how to construct clear and meaningful sentences."
    },
    {
      title: "Vocabulary",
      description: "Develop your vocabulary and word usage."
    },
    {
      title: "Reading Comprehension",
      description: "Develop understanding when reading different texts."
    },
    {
      title: "Writing Skills",
      description: "Learn how to communicate ideas effectively in writing."
    },
    {
      title: "Grammar",
      description: "Build a strong foundation in English grammar."
    }
  ],

  "English Language": [
    {
      title: "Parts of Speech",
      description: "Understand nouns, verbs, adjectives and other word classes."
    },
    {
      title: "Sentence Construction",
      description: "Learn how to construct clear and meaningful sentences."
    },
    {
      title: "Vocabulary",
      description: "Develop your vocabulary and word usage."
    },
    {
      title: "Reading Comprehension",
      description: "Develop understanding when reading different texts."
    },
    {
      title: "Writing Skills",
      description: "Learn how to communicate ideas effectively in writing."
    },
    {
      title: "Grammar",
      description: "Build a strong foundation in English grammar."
    }
  ],

  Science: [
    {
      title: "Living Things",
      description: "Explore characteristics of living organisms."
    },
    {
      title: "Matter",
      description: "Understand materials and their properties."
    },
    {
      title: "Energy",
      description: "Explore different forms and uses of energy."
    },
    {
      title: "Forces",
      description: "Understand how forces affect objects."
    },
    {
      title: "Environment",
      description: "Explore ecosystems and environmental interactions."
    },
    {
      title: "Health",
      description: "Learn principles related to health and wellbeing."
    }
  ],

  Biology: [
    {
      title: "Introduction to Biology",
      description: "Understand biology and the study of living things."
    },
    {
      title: "Cells",
      description: "Explore the basic unit of life."
    },
    {
      title: "Nutrition",
      description: "Understand nutrients and their roles in organisms."
    },
    {
      title: "Transport",
      description: "Explore transport systems in living organisms."
    },
    {
      title: "Reproduction",
      description: "Understand reproduction in living organisms."
    }
  ],

  Chemistry: [
    {
      title: "Introduction to Chemistry",
      description: "Understand what chemistry is and why it matters."
    },
    {
      title: "Matter",
      description: "Explore solids, liquids and gases."
    },
    {
      title: "Elements",
      description: "Understand elements and their properties."
    },
    {
      title: "Compounds",
      description: "Explore how elements combine to form compounds."
    },
    {
      title: "Chemical Reactions",
      description: "Understand how substances change during reactions."
    }
  ],

  Physics: [
    {
      title: "Introduction to Physics",
      description: "Understand physics and its applications."
    },
    {
      title: "Measurement",
      description: "Learn about physical quantities and measurement."
    },
    {
      title: "Motion",
      description: "Explore movement and how it can be described."
    },
    {
      title: "Forces",
      description: "Understand forces and their effects."
    },
    {
      title: "Energy",
      description: "Explore energy and its different forms."
    }
  ],

  Geography: [
    {
      title: "Introduction to Geography",
      description: "Understand geography and its areas of study."
    },
    {
      title: "The Earth",
      description: "Explore the structure and characteristics of Earth."
    },
    {
      title: "Weather",
      description: "Understand weather elements and observations."
    },
    {
      title: "Climate",
      description: "Explore climate patterns and factors."
    },
    {
      title: "Map Reading",
      description: "Learn basic map skills and interpretation."
    }
  ],

  History: [
    {
      title: "Introduction to History",
      description: "Understand history and why we study the past."
    },
    {
      title: "Historical Sources",
      description: "Explore different sources used to study history."
    },
    {
      title: "Early Societies",
      description: "Learn about early human communities."
    },
    {
      title: "Leadership",
      description: "Explore leadership and governance in societies."
    }
  ],

  ICT: [
    {
      title: "Introduction to Computers",
      description: "Understand computers and their basic functions."
    },
    {
      title: "Computer Hardware",
      description: "Explore the physical components of computers."
    },
    {
      title: "Computer Software",
      description: "Understand software and operating systems."
    },
    {
      title: "Internet",
      description: "Learn how the internet works and how it is used."
    },
    {
      title: "Digital Safety",
      description: "Learn how to stay safe and responsible online."
    },
    {
      title: "Programming",
      description: "Introduction to computational thinking and programming."
    }
  ],

  Entrepreneurship: [
    {
      title: "Business Ideas",
      description: "Learn how problems can become business opportunities."
    },
    {
      title: "Entrepreneurs",
      description: "Understand entrepreneurship and entrepreneurial thinking."
    },
    {
      title: "Customers",
      description: "Learn how businesses identify and serve customers."
    },
    {
      title: "Business Models",
      description: "Understand how businesses create and deliver value."
    },
    {
      title: "Money Management",
      description: "Learn basic financial management principles."
    }
  ]

};


/* =========================================
   FALLBACK TOPICS
========================================= */

const fallbackTopics = [
  {
    title: "Introduction",
    description: "Understand the foundations of this subject."
  },
  {
    title: "Key Concepts",
    description: "Learn the major ideas you need to understand."
  },
  {
    title: "Examples",
    description: "Explore examples that make the concepts clearer."
  },
  {
    title: "Practice",
    description: "Apply what you have learned through practice."
  },
  {
    title: "Revision",
    description: "Review important concepts before assessment."
  }
];


/* =========================================
   GET DATA
========================================= */

const subjectData =
  subjects[selectedSubject] ||
  {
    icon: "📚",
    description:
      "Explore lessons, topics and practice activities designed to help you learn."
  };

const topics =
  topicLibrary[selectedSubject] ||
  fallbackTopics;


/* =========================================
   DOM ELEMENTS
========================================= */

const subjectIcon =
  document.getElementById("subjectIcon");

const subjectName =
  document.getElementById("subjectName");

const subjectDescription =
  document.getElementById("subjectDescription");

const classBadge =
  document.getElementById("classBadge");

const breadcrumbClass =
  document.getElementById("breadcrumbClass");

const breadcrumbSubject =
  document.getElementById("breadcrumbSubject");

const topicCount =
  document.getElementById("topicCount");

const completedCount =
  document.getElementById("completedCount");

const progressPercent =
  document.getElementById("progressPercent");

const topicsList =
  document.getElementById("topicsList");

const emptyState =
  document.getElementById("emptyState");

const topicSearch =
  document.getElementById("topicSearch");

const profileName =
  document.getElementById("profileName");

const profileAvatar =
  document.getElementById("profileAvatar");

const currentYear =
  document.getElementById("currentYear");


/* =========================================
   PROFILE
========================================= */

const storedUserName =
  localStorage.getItem("ceoJackUserName") ||
  "Student";

profileName.textContent = storedUserName;

profileAvatar.textContent =
  storedUserName.charAt(0).toUpperCase();


/* =========================================
   PAGE CONTENT
========================================= */

subjectIcon.textContent =
  subjectData.icon;

subjectName.textContent =
  selectedSubject;

subjectDescription.textContent =
  subjectData.description;

classBadge.textContent =
  selectedClass;

breadcrumbClass.textContent =
  selectedClass;

breadcrumbSubject.textContent =
  selectedSubject;

topicCount.textContent =
  topics.length;

currentYear.textContent =
  new Date().getFullYear();


/* =========================================
   PROGRESS STORAGE
========================================= */

const progressKey =
  `ceoJackSubjectProgress_${selectedClass}_${selectedSubject}`;

let progress =
  JSON.parse(localStorage.getItem(progressKey)) || {};


/* =========================================
   SAVE PROGRESS
========================================= */

function saveProgress() {

  localStorage.setItem(
    progressKey,
    JSON.stringify(progress)
  );

}


/* =========================================
   CALCULATE PROGRESS
========================================= */

function calculateProgress() {

  let completed = 0;

  topics.forEach((topic, index) => {

    const status =
      progress[index]?.status;

    if (status === "completed") {
      completed++;
    }

  });

  const percentage =
    topics.length === 0
      ? 0
      : Math.round(
          (completed / topics.length) * 100
        );

  completedCount.textContent =
    completed;

  progressPercent.textContent =
    `${percentage}%`;

}


/* =========================================
   TOPIC STATUS
========================================= */

function getTopicStatus(index) {

  return progress[index]?.status ||
    "not-started";

}


/* =========================================
   STATUS LABEL
========================================= */

function getStatusLabel(status) {

  if (status === "completed") {
    return "Completed";
  }

  if (status === "in-progress") {
    return "In Progress";
  }

  return "Not Started";

}


/* =========================================
   RENDER TOPICS
========================================= */

function renderTopics(searchTerm = "") {

  topicsList.innerHTML = "";

  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  const filteredTopics =
    topics.filter(topic => {

      return (
        topic.title
          .toLowerCase()
          .includes(normalizedSearch) ||

        topic.description
          .toLowerCase()
          .includes(normalizedSearch)
      );

    });


  if (filteredTopics.length === 0) {

    emptyState.style.display =
      "block";

    return;

  }


  emptyState.style.display =
    "none";


  filteredTopics.forEach((topic) => {

    const originalIndex =
      topics.indexOf(topic);

    const status =
      getTopicStatus(originalIndex);

    const card =
      document.createElement("div");

    card.className =
      "topic-card";

    card.innerHTML = `

      <div class="topic-number">
        ${String(originalIndex + 1).padStart(2, "0")}
      </div>

      <div class="topic-info">

        <h3>
          ${topic.title}
        </h3>

        <p>
          ${topic.description}
        </p>

      </div>

      <span class="topic-status ${status}">
        ${getStatusLabel(status)}
      </span>

      <span class="topic-arrow">
        →
      </span>

    `;


    card.addEventListener(
      "click",
      () => openTopic(originalIndex)
    );


    topicsList.appendChild(card);

  });

}


/* =========================================
   OPEN TOPIC
========================================= */

function openTopic(index) {

  const topic =
    topics[index];

  if (!topic) {
    return;
  }


  progress[index] = {
    status: "in-progress"
  };

  saveProgress();

  calculateProgress();


  const query =
    new URLSearchParams({

      class: selectedClass,

      subject: selectedSubject,

      topic: topic.title

    });


  window.location.href =
    `ai.html?mode=education&${query.toString()}`;

}


/* =========================================
   CONTINUE LEARNING
========================================= */

function continueLearning() {

  let targetIndex = -1;


  for (
    let i = 0;
    i < topics.length;
    i++
  ) {

    if (
      getTopicStatus(i) !==
      "completed"
    ) {

      targetIndex = i;

      break;

    }

  }


  if (targetIndex === -1) {

    targetIndex = 0;

    showToast(
      "You completed all topics. Start revising from the beginning."
    );

  }


  openTopic(targetIndex);

}


/* =========================================
   AI URL
========================================= */

function openAI(topic = "") {

  const query =
    new URLSearchParams({

      mode: "education",

      class: selectedClass,

      subject: selectedSubject,

      topic: topic

    });


  window.location.href =
    `ai.html?${query.toString()}`;

}


/* =========================================
   BUTTONS
========================================= */

document
  .getElementById("continueBtn")
  .addEventListener(
    "click",
    continueLearning
  );


document
  .getElementById("heroAiBtn")
  .addEventListener(
    "click",
    () => openAI()
  );


document
  .getElementById("bannerAiBtn")
  .addEventListener(
    "click",
    () => openAI()
  );


document
  .getElementById("sidebarAiBtn")
  .addEventListener(
    "click",
    () => openAI()
  );


document
  .getElementById("topAiBtn")
  .addEventListener(
    "click",
    () => openAI()
  );


/* =========================================
   SEARCH
========================================= */

topicSearch.addEventListener(
  "input",
  event => {

    renderTopics(
      event.target.value
    );

  }
);


/* =========================================
   BACK BUTTON
========================================= */

document
  .getElementById("backBtn")
  .addEventListener(
    "click",
    () => {

      window.location.href =
        "education.html";

    }
  );


/* =========================================
   MOBILE SIDEBAR
========================================= */

const menuBtn =
  document.getElementById("menuBtn");

const sidebar =
  document.getElementById("sidebar");

const sidebarOverlay =
  document.getElementById("sidebarOverlay");


function openSidebar() {

  sidebar.classList.add("open");

  sidebarOverlay.classList.add("show");

}


function closeSidebar() {

  sidebar.classList.remove("open");

  sidebarOverlay.classList.remove("show");

}


menuBtn.addEventListener(
  "click",
  openSidebar
);


sidebarOverlay.addEventListener(
  "click",
  closeSidebar
);


/* =========================================
   TOAST
========================================= */

const toast =
  document.getElementById("toast");

const toastMessage =
  document.getElementById("toastMessage");

let toastTimer;


function showToast(message) {

  toastMessage.textContent =
    message;

  toast.classList.add("show");


  clearTimeout(toastTimer);


  toastTimer =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 3000);

}


/* =========================================
   INITIALIZE
========================================= */

calculateProgress();

renderTopics();
