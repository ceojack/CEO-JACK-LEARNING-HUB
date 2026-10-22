export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  takeaway?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  datePublished: string;
  readTime: string;
  image: string;
  imageAlt: string;
  imageCredit: string;
  intro: string;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "study-smarter-weekly-study-plan",
    title: "Study smarter: a simple weekly study plan that works",
    description:
      "Build a practical weekly study routine with clear goals, active recall, short review sessions and time to rest.",
    category: "Learning skills",
    datePublished: "2026-10-21",
    readTime: "6 min read",
    image: "/assets/images/blog/study-group.webp",
    imageAlt: "Learners studying together around a table",
    imageCredit: "Photo via Unsplash",
    intro:
      "A good study plan is not a timetable packed from morning to night. It is a repeatable way to decide what matters, practise it, and notice what you still need to learn. Start small enough that you can keep going.",
    sections: [
      {
        heading: "1. Choose a clear outcome for the week",
        paragraphs: [
          "Write down one to three things you want to understand or be able to do by the end of the week. Make each one specific: instead of “study science,” try “explain the water cycle in my own words” or “solve five questions on fractions.”",
          "Check your class notes, assignment dates and topics you find difficult. Give the most important or challenging topic a place in your plan first.",
        ],
      },
      {
        heading: "2. Turn each outcome into a short session",
        paragraphs: [
          "A focused session can be 25 to 40 minutes, followed by a short break. If you have less time, a 15-minute session is still useful when you know exactly what you will work on. Put your phone away or silence notifications while you focus.",
          "Try this simple session: spend a few minutes recalling what you already know, work through one small section or example, then close your notes and explain the idea from memory. Finish by writing down one question to revisit.",
        ],
        bullets: [
          "Before: pick one topic and gather only what you need.",
          "During: solve, explain, draw or practise instead of only rereading.",
          "After: mark what you can do and what still feels unclear.",
        ],
      },
      {
        heading: "3. Revisit important ideas across the week",
        paragraphs: [
          "Instead of leaving every topic until the night before a test, return to it briefly on another day. A quick self-quiz, a few practice questions or a one-minute explanation can help you find gaps while there is still time to work on them.",
          "Mix review with new learning. For example, spend the first five minutes of a maths session on questions from an earlier topic, then use the rest of the session for the current lesson.",
        ],
      },
      {
        heading: "4. Make the plan fit your real week",
        paragraphs: [
          "Put study sessions around school, work, family responsibilities and rest. A realistic plan with a few protected sessions is more useful than a perfect plan you cannot follow. If a day changes, move the session instead of deciding that the whole week is lost.",
          "At the end of the week, ask: What did I finish? What helped me understand? What needs another attempt? Use those answers to plan the next week.",
        ],
        takeaway:
          "Plan a small number of clear sessions, practise recalling what you learned, and review your progress once a week. Consistency grows from a plan you can actually keep.",
      },
    ],
  },
  {
    slug: "digital-skills-start-here",
    title: "Digital skills for beginners: where to start and what to practise",
    description:
      "A beginner-friendly roadmap to digital confidence: communication, online safety, documents, spreadsheets and small projects.",
    category: "Digital skills",
    datePublished: "2026-10-21",
    readTime: "7 min read",
    image: "/assets/images/blog/digital-learning.webp",
    imageAlt: "A person learning and working with a laptop",
    imageCredit: "Photo via Unsplash",
    intro:
      "You do not need to learn every app or programming language at once. Begin with the everyday skills that help you communicate, organise information and solve a real problem. Then build confidence by making something of your own.",
    sections: [
      {
        heading: "Start with confident digital basics",
        paragraphs: [
          "Practise managing files and folders, writing a clear email, joining an online meeting, searching for information and recognising when a source may be unreliable. These skills make it easier to learn new tools later.",
          "Learn to protect your accounts as you go. Use a different strong password for important accounts, turn on two-step verification when it is available, and do not share passwords or verification codes in messages.",
        ],
      },
      {
        heading: "Learn documents and spreadsheets by doing",
        paragraphs: [
          "Create a one-page document with a title, headings and a short summary. Practise saving it with a helpful file name and sharing it with the right permissions. These are small habits that make your work easier to find and review.",
          "In a spreadsheet, enter a short list of items, use a formula to add totals, and sort the rows. A simple budget, reading log or stock list gives you a practical reason to learn cells, rows, columns and formulas.",
        ],
      },
      {
        heading: "Build a small project that matters to you",
        paragraphs: [
          "Choose a project that can be finished in a few sessions. You could make a study timetable, create a simple portfolio page, design a poster for a school club or organise a small shop’s product list. Keep the first version simple.",
          "Show your work to someone you trust and ask one useful question: “What was clear, and what was confusing?” Improving a real project helps you practise communication, problem-solving and digital creation together.",
        ],
        bullets: [
          "Pick one tool and one small goal.",
          "Use a practice file so mistakes are safe and easy to undo.",
          "Write down what you learned and the next feature you want to try.",
        ],
      },
      {
        heading: "A simple four-week starting path",
        paragraphs: [
          "Week one: practise files, folders and online safety. Week two: make and share a well-structured document. Week three: organise information in a spreadsheet and use a few formulas. Week four: use these skills in one small project and explain how you made it.",
          "Adjust the pace to your device access and schedule. If you share a computer or have limited data, plan offline practice where possible and save your work carefully. Progress is about what you can do, not how many tools you have installed.",
        ],
        takeaway:
          "Start with useful basics, practise on a project you care about, and build one skill at a time. Explore the CEO JACK Digital Skills Hub for guided next steps.",
      },
    ],
  },
  {
    slug: "test-a-business-idea-first-customer",
    title: "From business idea to first customer: a practical beginner’s guide",
    description:
      "Learn how to check a business idea, talk with potential customers, estimate costs and run a small, low-risk test.",
    category: "Entrepreneurship",
    datePublished: "2026-10-21",
    readTime: "7 min read",
    image: "/assets/images/blog/business-planning.webp",
    imageAlt: "A small team discussing an idea around a table",
    imageCredit: "Photo via Unsplash",
    intro:
      "An idea becomes a business only when it helps someone and they choose to pay for it. You do not need to start with a large loan, a shop or a perfect logo. Begin by learning about a customer and testing one clear offer on a small scale.",
    sections: [
      {
        heading: "Describe the customer and the problem",
        paragraphs: [
          "Write one sentence: “I want to help [a specific group] with [a problem they have] by offering [a product or service].” Keep it narrow. “Everyone needs food” is too broad; “office workers near this trading centre need a quick lunch they can collect” gives you something to investigate.",
          "Talk to a few people who might have this problem. Ask how they handle it now, what is frustrating, and what they have already tried. Listen for examples from their real experience instead of asking only whether they like your idea.",
        ],
      },
      {
        heading: "Make the offer easy to understand",
        paragraphs: [
          "Describe exactly what the customer gets, how they receive it, when it is available and what it costs. A simple offer is easier to explain and test than a long list of options.",
          "For example, a student who tutors younger learners could offer a one-hour session on one topic, at an agreed time and place. A person selling snacks could test one product and a small batch before buying ingredients for a much larger run.",
        ],
      },
      {
        heading: "Check the numbers before you spend",
        paragraphs: [
          "List the costs that change with each sale, such as materials, packaging, transport or mobile money charges. Add the costs you will pay even if you make no sales, such as a stall fee or equipment rental. Keep personal spending separate from business money where you can.",
          "Estimate what remains after each sale: price minus the costs of providing that sale. This is not the same as take-home income; fixed costs and other obligations still need to be covered. If the number is negative, change the offer, cost or price before scaling up.",
        ],
      },
      {
        heading: "Run one small test and learn from it",
        paragraphs: [
          "Set a limit on time and money for the first test. Offer the product or service to a small group, keep a record of who buys, what they ask and what it costs to deliver. Do not borrow or buy large amounts of stock just to find out whether people are interested.",
          "After the test, decide what to change. Did customers understand the offer? Did anyone pay or return? Could you deliver it reliably? A clear “not yet” is useful information: it can point to a different customer, a simpler product or a better way to reach people.",
        ],
        takeaway:
          "Talk to potential customers, make the offer specific, check the costs and run a small test before making a big commitment. Learn first, then decide what to grow.",
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
