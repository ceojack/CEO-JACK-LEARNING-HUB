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
  education: "Education Mode - UNEB",
  coding: "Coding Mode",
  business: "Business Mode"
};

function addMessage(role, text, isStreaming = false) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${role}`;
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "You" : "CJ";
  const content = document.createElement("div");
  content.className = "message-content";
  const name = document.createElement("div");
  name.className = "message-name";
  name.textContent = role === "user" ? "You" : "CEO JACK AI (FREE Groq)";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  
  if (role === "assistant" && window.marked && text) {
    bubble.innerHTML = marked.parse(text) + (isStreaming ? `<span class="cursor">▌</span>` : "");
  } else {
    bubble.textContent = text;
  }
  
  content.append(name, bubble);
  wrapper.append(avatar, content);
  messagesEl.appendChild(wrapper);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return { wrapper, bubble };
}

function showTyping() {
  const wrapper = document.createElement("div");
  wrapper.className = "message assistant";
  wrapper.id = "typingIndicator";
  wrapper.innerHTML = `
    <div class="avatar">CJ</div>
    <div class="message-content">
      <div class="message-name">CEO JACK is thinking...</div>
      <div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>
    </div>
  `;
  messagesEl.appendChild(wrapper);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeTyping() {
  document.getElementById("typingIndicator")?.remove();
}

function setMode(mode) {
  if (!modeNames[mode]) return;
  currentMode = mode;
  modeLabel.textContent = modeNames[mode] + " • gpt-oss-20b";
  document.querySelectorAll(".mode-link").forEach(button => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
}

async function sendMessage(text = input.value) {
  const message = text.trim();
  if (!message || isLoading) return;

  welcomeScreen.style.display = "none";
  addMessage("user", message);
  conversation.push({ role: "user", content: message });

  input.value = "";
  input.style.height = "auto";
  isLoading = true;
  sendBtn.disabled = true;
  connectionStatus.textContent = "Groq typing...";
  showTyping();

  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        mode: currentMode,
        history: conversation.slice(-12)
      })
    });

    // FIX 1: Check if server returned HTML (The page c... error)
    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.clone().text(); // clone to read twice

    if (!response.ok) {
      // This will show you REAL error instead of "T token"
      console.error("API Error HTML:", rawText);
      if (rawText.startsWith("<!DOCTYPE") || rawText.startsWith("<html") || rawText.includes("The page")) {
        throw new Error("API not found on Vercel. Make sure api/ai/chat.js exists and GROQ_API_KEY is set. Then Redeploy.");
      }
      throw new Error(rawText.slice(0, 200));
    }

    removeTyping();

    // FIX 2: Handle JSON response {reply: "..."} 
    if (contentType.includes("application/json")) {
      const data = JSON.parse(rawText);
      const reply = data.reply || data.error || "No reply";
      
      const { bubble } = addMessage("assistant", "", true);
      let fullText = "";
      // Typewriter effect
      for (let i = 0; i < reply.length; i++) {
        fullText += reply[i];
        bubble.innerHTML = marked.parse(fullText) + `<span class="cursor">▌</span>`;
        messagesEl.scrollTop = messagesEl.scrollHeight;
        await new Promise(r => setTimeout(r, 12)); // speed: 12 = fast
      }
      bubble.innerHTML = marked.parse(fullText);
      conversation.push({ role: "assistant", content: fullText });
    } 
    // FIX 3: Handle streaming response
    else {
      const { bubble } = addMessage("assistant", "", true);
      let fullText = "";
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        bubble.innerHTML = marked.parse(fullText) + `<span class="cursor">▌</span>`;
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
      bubble.innerHTML = marked.parse(fullText);
      conversation.push({ role: "assistant", content: fullText });
    }

    connectionStatus.textContent = "Ready - FREE TEACHER";

  } catch (error) {
    removeTyping();
    console.error(error);
    addMessage("assistant", `I couldn't complete that request: ${error.message}\n\nPlease check Vercel logs and make sure api/ai/chat.js is deployed.`);
    connectionStatus.textContent = "Error - check console";
  } finally {
    isLoading = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

// EVENTS
sendBtn.addEventListener("click", () => sendMessage());
input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 150)}px`;
});
document.querySelectorAll(".mode-link").forEach(b => {
  b.addEventListener("click", () => {
    setMode(b.dataset.mode);
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });
});
document.querySelectorAll(".prompt-card").forEach(b => {
  b.addEventListener("click", () => sendMessage(b.dataset.prompt));
});
document.getElementById("newChatBtn")?.addEventListener("click", () => {
  conversation = [];
  messagesEl.innerHTML = "";
  welcomeScreen.style.display = "block";
  connectionStatus.textContent = "Ready - FREE Groq";
  input.focus();
});
menuBtn?.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
});
overlay?.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
});

// Init
setMode("general");