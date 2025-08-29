import { googleSearch, aiPipeChat, executeJS } from "./tools.js";
import { renderProviderPicker } from "./bootstrap-llm-provider.js";
import { showAlert } from "./bootstrap-alert.js";

let provider = null;
let msgHistory = []; // [{role:"user",content:"..."}, ...]

function appendMsg(role, text) {
  const conv = document.getElementById("conversation");
  const classMap = {
    User: "user",
    Agent: "agent",
    Tool: "tool",
    Error: "error",
    System: "agent"
  };
  const roleClass = classMap[role] || "agent";

  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${roleClass}`;
  
  // Escape HTML special characters
  const safeText = text.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
  
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

  msgDiv.innerHTML = `${safeText}<span class="timestamp">${timeString}</span>`;
  conv.appendChild(msgDiv);

  // Optionally add smooth fade-in animation
  msgDiv.style.opacity = 0;
  msgDiv.style.transform = 'translateY(15px)';
  setTimeout(() => {
    msgDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    msgDiv.style.opacity = 1;
    msgDiv.style.transform = 'translateY(0)';
  }, 20);

  conv.scrollTop = conv.scrollHeight;
}

renderProviderPicker({
  onSelect: ({ model, token }) => {
    provider = { model, token };
    showAlert("Provider set!", "success");
  }
});

document.getElementById("userform").onsubmit = async function(e) {
  e.preventDefault();
  const userinput = document.getElementById("userinput");
  const content = userinput.value.trim();
  if (!content) return;
  appendMsg("User", content);
  msgHistory.push({ role: "user", content });
  userinput.value = "";
  await agentLoop();
};

async function agentLoop() {
  if (!provider?.token) return showAlert("No provider/token set!");
  let done = false;
  while (!done) {
    try {
      // The LLM/tool interface: Tool calling style
      let tools = [
        { name: "search", function: googleSearch },
        { name: "aipipe", function: (msgs) => aiPipeChat(msgs, provider.model, provider.token) },
        { name: "code", function: executeJS }
      ];

      // Compose tool schema for the LLM (for OpenAI, use tool/function-calling API style)
      let toolsSpec = [
        {
          type: "function",
          function: { name: "search", parameters: { query: "string" }, description:"Return Google Search snippets" }
        },
        {
          type: "function",
          function: { name: "code", parameters: { code: "string" }, description:"Run a JS code snippet" }
        }
      ];

      // Call LLM for completion (simulate function-calling interface)
      let aiMsg = [
        ...msgHistory,
        { role: "system", content: "You may call search(query) and code(code) as tools. Use tool-calling style JSON objects." }
      ];

      let llmOutput = await aiPipeChat(aiMsg, provider.model, provider.token);
      appendMsg("Agent", llmOutput);

      // Simulate tool call extraction (simple regex/extract, for demo)
      let toolMatch = llmOutput.match(/TOOL_CALL: (.+)/);
      if (toolMatch) {
        const tc = JSON.parse(toolMatch[1]);
        let res;
        if (tc.name === "search") res = await googleSearch(tc.args.query);
        if (tc.name === "code") res = executeJS(tc.args.code);
        msgHistory.push({ role: "function", content: JSON.stringify(res) });
        appendMsg("Tool", res);
        continue; // Loop again, LLM sees tool result + context
      }
      done = true;
    } catch (e) {
      showAlert(e.message || e.toString());
      done = true;
    }
  }
}