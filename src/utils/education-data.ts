export const classes = {
  primary: [
    { value: "baby-class", label: "Baby Class", group: "Nursery" },
    { value: "middle-class", label: "Middle Class", group: "Nursery" },
    { value: "top-class", label: "Top Class", group: "Nursery" },
    { value: "P1", label: "Primary One", group: "Primary" },
    { value: "P2", label: "Primary Two", group: "Primary" },
    { value: "P3", label: "Primary Three", group: "Primary" },
    { value: "P4", label: "Primary Four", group: "Primary" },
    { value: "P5", label: "Primary Five", group: "Primary" },
    { value: "P6", label: "Primary Six", group: "Primary" },
    { value: "P7", label: "Primary Seven", group: "Primary" },
  ],
  secondary: [
    { value: "S1", label: "Senior One", group: "Secondary" },
    { value: "S2", label: "Senior Two", group: "Secondary" },
    { value: "S3", label: "Senior Three", group: "Secondary" },
    { value: "S4", label: "Senior Four", group: "Secondary" },
    { value: "S5", label: "Senior Five", group: "Secondary" },
    { value: "S6", label: "Senior Six", group: "Secondary" },
  ],
} as const;

export type AcademicLevel = keyof typeof classes;

export function getClassLabel(classValue: string) {
  return Object.values(classes).flat().find((item) => item.value === classValue)?.label ?? classValue;
}

export type ClassLearningTask = {
  subject: string;
  title: string;
  prompt: string;
};

export function getClassLearningTasks(classValue: string): ClassLearningTask[] {
  const classLabel = getClassLabel(classValue);
  const isNursery = ["baby-class", "middle-class", "top-class"].includes(classValue);
  const isSecondary = classValue.startsWith("S");
  const classNumber = Number(classValue.slice(1)) || 1;

  const tasks = isNursery
    ? [
        { subject: "Early Numeracy", title: "Count and compare", prompt: "Create a playful counting activity using familiar objects. Help me count, compare groups, and explain which group has more or fewer." },
        { subject: "Early Literacy", title: "Explore letter sounds", prompt: "Teach me a short letter-sound activity with simple words, repetition, and one question to practise." },
        { subject: "Creative Learning", title: "Notice shapes and colors", prompt: "Guide me through a simple activity to identify shapes and colors around me, one step at a time." },
      ]
    : isSecondary
      ? [
          { subject: "Mathematics", title: classNumber <= 2 ? "Work with algebraic expressions" : classNumber <= 4 ? "Solve linear equations" : "Explore functions and graphs", prompt: `Teach me ${classNumber <= 2 ? "algebraic expressions" : classNumber <= 4 ? "linear equations" : "functions and graphs"} at ${classLabel} level, then give me one guided example and three practice questions.` },
          { subject: "Science", title: classNumber <= 2 ? "Understand cells and living things" : classNumber <= 4 ? "Explore forces and energy" : "Connect biology to real life", prompt: `Teach me an age-appropriate ${classNumber <= 2 ? "biology topic about cells and living things" : classNumber <= 4 ? "physics topic about forces and energy" : "biology topic"} for ${classLabel}, with a clear explanation and a short practice activity.` },
          { subject: "English Language", title: "Build a clear paragraph", prompt: `Help me write a clear paragraph for ${classLabel}. Show me how to plan a main idea, supporting details, and a strong final sentence, then let me try.` },
        ]
      : [
          { subject: "Mathematics", title: classNumber <= 2 ? "Build number confidence" : classNumber <= 4 ? "Practise fractions and operations" : "Solve a multi-step problem", prompt: `Teach me a ${classNumber <= 2 ? "number and place-value" : classNumber <= 4 ? "fractions and operations" : "multi-step mathematics"} activity for ${classLabel}. Explain one example, then give me three practice questions one at a time.` },
          { subject: "English", title: classNumber <= 2 ? "Read and understand a short story" : classNumber <= 4 ? "Grow vocabulary from a passage" : "Write a strong composition", prompt: `Give me a ${classNumber <= 2 ? "short reading passage with simple comprehension questions" : classNumber <= 4 ? "reading passage to practise vocabulary and comprehension" : "composition writing activity with a planning outline"} suitable for ${classLabel}, and guide me through it step by step.` },
          { subject: "Science", title: classNumber <= 3 ? "Explore plants and animals" : classNumber <= 5 ? "Investigate matter and energy" : "Explain an ecosystem", prompt: `Teach me a science activity about ${classNumber <= 3 ? "plants and animals" : classNumber <= 5 ? "matter and energy" : "ecosystems"} at ${classLabel} level, using familiar examples and a short check for understanding.` },
        ];

  return tasks.map((task) => ({
    ...task,
    prompt: `I am in ${classLabel}. ${task.prompt}`,
  }));
}

export type Subject = {
  name: string;
  icon: string;
  description: string;
  color: string;
  iconColor: string;
};

export const primarySubjects: Subject[] = [
  { name: "Mathematics", icon: "∑", description: "Numbers, calculations, shapes, and problem-solving.", color: "#eeedff", iconColor: "#6858d8" },
  { name: "English", icon: "Aa", description: "Grammar, reading, writing, and communication.", color: "#eaf3ff", iconColor: "#367ed5" },
  { name: "Science", icon: "⚗", description: "Explore nature, living things, and the world.", color: "#e8f8f1", iconColor: "#219c72" },
  { name: "Social Studies", icon: "◎", description: "Understand people, communities, and geography.", color: "#fff2e5", iconColor: "#d58a35" },
  { name: "Religious Education", icon: "✧", description: "Values, beliefs, responsibility, and character.", color: "#f6eefe", iconColor: "#9a64cf" },
  { name: "Literacy", icon: "▤", description: "Develop reading comprehension and writing skills.", color: "#e9f7fa", iconColor: "#2695a8" },
  { name: "Creative Arts", icon: "✎", description: "Explore drawing, music, creativity, and expression.", color: "#fff0f4", iconColor: "#d45d8b" },
  { name: "Physical Education", icon: "⚽", description: "Movement, fitness, teamwork, and healthy living.", color: "#edf5e9", iconColor: "#659b42" },
];

export const secondarySubjects: Subject[] = [
  { name: "Mathematics", icon: "∑", description: "Algebra, geometry, statistics, and problem-solving.", color: "#eeedff", iconColor: "#6858d8" },
  { name: "English Language", icon: "Aa", description: "Language skills, comprehension, and composition.", color: "#eaf3ff", iconColor: "#367ed5" },
  { name: "Biology", icon: "♧", description: "Living organisms, ecology, and life processes.", color: "#e8f8f1", iconColor: "#219c72" },
  { name: "Chemistry", icon: "⚗", description: "Matter, chemical reactions, and laboratory concepts.", color: "#fff2e5", iconColor: "#d58a35" },
  { name: "Physics", icon: "◉", description: "Energy, forces, motion, and the physical world.", color: "#f6eefe", iconColor: "#9a64cf" },
  { name: "Geography", icon: "◎", description: "Earth systems, maps, climate, and environments.", color: "#e9f7fa", iconColor: "#2695a8" },
  { name: "History", icon: "◷", description: "Historical events, societies, and developments.", color: "#fff0f4", iconColor: "#d45d8b" },
  { name: "ICT", icon: "</>", description: "Computer fundamentals and digital technology.", color: "#edf5e9", iconColor: "#659b42" },
  { name: "Entrepreneurship", icon: "◈", description: "Business concepts, enterprise, and financial literacy.", color: "#fff2e5", iconColor: "#d58a35" },
  { name: "Kiswahili", icon: "文", description: "Language, vocabulary, reading, and communication.", color: "#eaf3ff", iconColor: "#367ed5" },
];

export const digitalTracks = [
  { name: "Web Development", icon: "</>", description: "HTML, CSS, and JavaScript foundations for building websites." },
  { name: "Programming", icon: "{ }", description: "Logic, problem-solving, and beginner coding projects." },
  { name: "AI Tools", icon: "✦", description: "Use AI as a learning companion while you practise." },
  { name: "Digital Projects", icon: "⌘", description: "Turn skills into small, finished pieces of work." },
];

export const entrepreneurshipTracks = [
  { name: "Business Ideas", icon: "↗", description: "Spot problems and shape simple, useful ideas." },
  { name: "Financial Literacy", icon: "◈", description: "Costs, savings, customers, and money basics." },
  { name: "Entrepreneurial Thinking", icon: "◎", description: "Plan, test, and improve ideas with action." },
  { name: "Opportunity Discovery", icon: "✧", description: "Find local opportunities you can start small." },
];
