// Tools for Google Search, AI Pipe, JS Sandbox

export async function googleSearch(query) {
  const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyByeTQbnz7tCS4ohMYZR8ro85IFj2B6aRI&cx=e7b67ce558ce84f14&q=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.items ? data.items.map(item => item.snippet).join('\n') : "No results";
}

export async function aiPipeChat(messages, model, token) {
  const resp = await fetch("https://aipipe.org/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages }),
  });
  const respObj = await resp.json();
  if (respObj.error) throw new Error(respObj.error.message || JSON.stringify(respObj.error));
  // Defensive extraction for multiple structures
  if (
    respObj.choices &&
    respObj.choices.length &&
    respObj.choices[0].message &&
    typeof respObj.choices[0].message.content === "string"
  ) {
    return respObj.choices[0].message.content;
  }
  if (
    respObj.choices &&
    respObj.choices.length &&
    typeof respObj.choices[0].content === "string"
  ) {
    return respObj.choices[0].content;
  }
  throw new Error("Unexpected LLM response format: " + JSON.stringify(respObj));
}

export function executeJS(code) {
  try {
    return String(eval(code));
  } catch (e) {
    return "Error: " + e.message;
  }
}
