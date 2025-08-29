// /api/aipipe.js
export default async function handler(req, res) {
  const body = req.method === "POST" ? req.body : null;
  const token = process.env.AIPIPE_TOKEN;
  if (!token) {
    res.status(500).json({ error: "AI Pipe token not configured" });
    return;
  }
  try {
    const response = await fetch("https://aipipe.org/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (data.error) {
      res.status(500).json({ error: data.error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}