// /api/googleSearch.js
export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) {
    res.status(400).json({ error: "Missing query parameter" });
    return;
  }
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;
  if (!apiKey || !cx) {
    res.status(500).json({ error: "API key or CX not configured" });
    return;
  }
  
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
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