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
  name.textContent = role === "user" ? "You" : "CEO JACK AI";
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
  modeLabel.textContent = modeNames[mode] + " • CEO JACK AI";
  document.querySelectorAll(".mode-link").forEach(button => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
}

async function sendMessage(text = input.value) {
  const message = text.trim();
  if (!message || isLoading) return;

  // --- CEO JACK FOUNDER GUARD (CLIENT SIDE, INSTANT) ---
  const lower = message.toLowerCase();
  if (lower.includes("who made you") || lower.includes("who created you") || lower.includes("who built you") || lower.includes("who is your founder") || lower.includes("who is your owner") || lower.includes("who developed you") || lower.includes("what is your name") || lower.includes("who are you")) {
    welcomeScreen.style.display = "none";
    addMessage("user", message);
    const founderReply = "I am **CEO JACK AI**, created and built by **CEO JACK** from Uganda 🇺🇬\n\nHe is the founder and developer of this platform. I run on Groq gpt-oss-20b, but I belong to CEO JACK.";
    const { bubble } = addMessage("assistant", "", true);
    // Paragraph typer for founder too
    const parts = founderReply.split("\n\n");
    let full = "";
    for (const p of parts) {
      full += (full? "\n\n":"") + p;
      bubble.innerHTML = marked.parse(full) + `<span class="cursor">▌</span>`;
      scrollToBottom();
      await new Promise(r => setTimeout(r, 40));
    }
    bubble.innerHTML = marked.parse(full);
    conversation.push({ role: "user", content: message });
    conversation.push({ role: "assistant", content: founderReply });
    input.value = "";
    return;
  }

  welcomeScreen.style.display = "none";
  addMessage("user", message);
  conversation.push({ role: "user", content: message });

  input.value = "";
  input.style.height = "auto";
  isLoading = true;
  sendBtn.disabled = true;
  connectionStatus.textContent = "CEO JACK typing...";
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
        throw new Error("API not found. Check api/ai/chat.js deployed on Vercel");
      }
      throw new Error(rawText.slice(0, 200));
    }

    removeTyping();

    if (contentType.includes("application/json")) {
      const data = JSON.parse(rawText);
      let reply = data.reply || data.error || "No reply";

      // Final safety: if Groq slips, force CEO JACK name
      if (/i am meta|openai|i was created by meta|i am llama|i am groq/i.test(reply.toLowerCase())) {
        reply = reply.replace(/I am.*?(Meta|OpenAI|Groq|Llama|Claude).*/i, "") + "\n\nI am CEO JACK AI built by CEO JACK.";
      }
      
      const { bubble } = addMessage("assistant", "", true);
      const paragraphs = reply.split(/\n\n+/).filter(p => p.trim() !== "");
      let fullText = "";

      for (let i = 0; i < paragraphs.length; i++) {
        fullText += (fullText ? "\n\n" : "") + paragraphs[i];
        bubble.innerHTML = marked.parse(fullText) + `<span class="cursor">▌</span>`;
        scrollToBottom();
        await new Promise(r => setTimeout(r, 25)); // 25 = ChatGPT turbo
      }

      bubble.innerHTML = marked.parse(fullText);
      conversation.push({ role: "assistant", content: reply });

    } else {
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

    connectionStatus.textContent = "Ready - CEO JACK AI";

  } catch (error) {
    removeTyping();
    console.error(error);
    addMessage("assistant", `I couldn't complete that: ${error.message}`);
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
  connectionStatus.textContent = "Ready - CEO JACK";
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