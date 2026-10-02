
const messagesEl = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const welcomeScreen = document.getElementById("welcomeScreen");
const connectionStatus = document.getElementById("connectionStatus");
const modeLabel = document.getElementById("modeLabel");

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("mobileOverlay");

let currentMode = "general";
let isLoading = false;

let conversation = [];

const modeNames = {
  general: "General Assistant",
  education: "Education Mode",
  coding: "Coding Mode",
  business: "Business Mode"
};

function addMessage(role, text) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "You" : "CJ";

  const content = document.createElement("div");
  content.className = "message-content";

  const name = document.createElement("div");
  name.className = "message-name";
  name.textContent = role === "user" ? "You" : "CEO JACK AI";

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  // textContent prevents model output from being treated as HTML.
  bubble.textContent = text;

  content.append(name, bubble);
  wrapper.append(avatar, content);

  messagesEl.appendChild(wrapper);
  messagesEl.scrollIntoView({ block: "end", behavior: "smooth" });

  return wrapper;
}

function showTyping() {
  const wrapper = document.createElement("div");
  wrapper.className = "message assistant";
  wrapper.id = "typingIndicator";

  wrapper.innerHTML = `
    <div class="avatar">CJ</div>
    <div class="message-content">
      <div class="message-name">CEO JACK AI is thinking...</div>
      <div class="typing">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;

  messagesEl.appendChild(wrapper);
  wrapper.scrollIntoView({ behavior: "smooth", block: "end" });
}

function removeTyping() {
  document.getElementById("typingIndicator")?.remove();
}

function setMode(mode) {
  if (!modeNames[mode]) return;

  currentMode = mode;
  modeLabel.textContent = modeNames[mode];

  document.querySelectorAll(".mode-link").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.mode === mode
    );
  });
}

async function sendMessage(text = input.value) {
  const message = text.trim();

  if (!message || isLoading) return;

  welcomeScreen.style.display = "none";

  addMessage("user", message);

  conversation.push({
    role: "user",
    content: message
  });

  input.value = "";
  input.style.height = "auto";

  isLoading = true;
  sendBtn.disabled = true;
  connectionStatus.textContent = "Thinking...";

  showTyping();

  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        mode: currentMode,
        history: conversation.slice(-12)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "The AI request failed.");
    }

    if (!data.reply) {
      throw new Error("The AI returned an empty response.");
    }

    conversation.push({
      role: "assistant",
      content: data.reply
    });

    removeTyping();
    addMessage("assistant", data.reply);

    connectionStatus.textContent = "Ready";

  } catch (error) {
    removeTyping();

    addMessage(
      "assistant",
      `I couldn't complete that request. ${error.message} Please check your connection and try again.`
    );

    connectionStatus.textContent = "Connection issue";

    console.error("CEO JACK AI:", error);

  } finally {
    isLoading = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

sendBtn.addEventListener("click", () => sendMessage());

input.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 150)}px`;
});

document.querySelectorAll(".mode-link").forEach(button => {
  button.addEventListener("click", () => {
    setMode(button.dataset.mode);

    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });
});

document.querySelectorAll(".prompt-card").forEach(button => {
  button.addEventListener("click", () => {
    sendMessage(button.dataset.prompt);
  });
});

document.getElementById("newChatBtn").addEventListener("click", () => {
  conversation = [];
  messagesEl.innerHTML = "";
  welcomeScreen.style.display = "block";
  connectionStatus.textContent = "Ready";
  input.focus();
});

menuBtn.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
});