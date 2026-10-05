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

function scrollToBottom() {
  const chatArea = document.querySelector(".chat-area") || messagesEl;
  chatArea.scrollTop = chatArea.scrollHeight;
}

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
  scrollToBottom();
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
  scrollToBottom();
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

    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.clone().text();

    if (!response.ok) {
      console.error("API Error:", rawText);
      if (rawText.startsWith("<!DOCTYPE") || rawText.includes("The page")) {
        throw new Error("API not found on Vercel. Check api/ai/chat.js + GROQ_API_KEY + Redeploy");
      }
      throw new Error(rawText.slice(0, 200));
    }

    removeTyping();

    // --- NEW CHATGPT PARAGRAPH-BY-PARAGRAPH LOGIC ---
    if (contentType.includes("application/json")) {
      const data = JSON.parse(rawText);
      const reply = data.reply || data.error || "No reply";
      
      const { bubble } = addMessage("assistant", "", true);
      
      // Split into paragraphs (ChatGPT style)
      const paragraphs = reply.split(/\n\n+/).filter(p => p.trim() !== "");
      let fullText = "";

      for (let i = 0; i < paragraphs.length; i++) {
        fullText += (fullText ? "\n\n" : "") + paragraphs[i];
        bubble.innerHTML = marked.parse(fullText) + `<span class="cursor">▌</span>`;
        scrollToBottom();
        // Speed: 35ms = ChatGPT speed, 70ms = calm, 20ms = super fast
        await new Promise(r => setTimeout(r, 35));
      }

      bubble.innerHTML = marked.parse(fullText);
      conversation.push({ role: "assistant", content: reply });

    } else {
      // Streaming fallback
      const { bubble } = addMessage("assistant", "", true);
      let fullText = "";
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        bubble.innerHTML = marked.parse(fullText) + `<span class="cursor">▌</span>`;
        scrollToBottom();
      }
      bubble.innerHTML = marked.parse(fullText);
      conversation.push({ role: "assistant", content: fullText });
    }

    connectionStatus.textContent = "Ready - FREE TEACHER";

  } catch (error) {
    removeTyping();
    console.error(error);
    addMessage("assistant", `I couldn't complete that request: ${error.message}`);
    connectionStatus.textContent = "Error";
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

setMode("general");