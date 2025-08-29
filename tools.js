// Tools for Google Search, AI Pipe, JS Sandbox

export async function googleSearch(query) {
  const res = await fetch(`/api/googleSearch?query=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.items ? data.items.map(item => item.snippet).join("\n") : "No results";
}

export async function aiPipeChat(messages, model, token) {
  // Note: `token` parameter ignored here because token is used in backend now
  const resp = await fetch("/api/aipipe", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ model, messages })
  });
  const respObj = await resp.json();
  if (respObj.error) throw new Error(respObj.error);
  if (respObj.choices && respObj.choices.length && respObj.choices[0].message && typeof respObj.choices[0].message.content === "string") {
    return respObj.choices[0].message.content;
  }
  if (respObj.choices && respObj.choices.length && typeof respObj.choices[0].content === "string") {
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
