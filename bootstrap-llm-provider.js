// Minimal: Model/provider selector UI for OpenAI-like APIs
export function renderProviderPicker({ onSelect }) {
  const picker = document.getElementById('provider-picker');
  picker.innerHTML = `
    <label for="provider">LLM Provider:</label>
    <select id="provider" class="form-select mb-2">
      <option value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo (aipipe)</option>
      <option value="gpt-4o-mini">OpenAI GPT-4o Mini (aipipe)</option>
    </select>
    <label for="token">AI Pipe Token:</label>
    <input id="token" type="text" class="form-control mb-2" placeholder="Paste your AI Pipe token"/>
    <button id="provider-btn" class="btn btn-success">Set Provider</button>
  `;
  picker.querySelector("#provider-btn").onclick = (e) => {
    e.preventDefault();
    onSelect({
      model: picker.querySelector("#provider").value,
      token: picker.querySelector("#token").value.trim()
    });
  };
}