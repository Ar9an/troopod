require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/personalize", async (req, res) => {
  const { adInput, lpInput } = req.body;

  if (!adInput || !lpInput) {
    return res.status(400).json({ error: "Missing ad or landing page input." });
  }

  const PROMPT = `You are a CRO (Conversion Rate Optimization) and landing page personalization expert.

Given:
1. A description of an ad creative (headline, offer, CTA, tone, audience)
2. The current landing page copy (headline, sub, CTA, features)

Your job:
- Extract the ad's core promise, audience, urgency signals, and tone
- Rewrite the landing page copy to achieve "message match"
- Apply CRO best practices: benefit-led headline, specific offer in sub, action-verb CTA, social proof line

Return ONLY valid JSON. No markdown, no backticks, no explanation.

JSON schema:
{
  "adAnalysis": "2-3 sentence summary of what the ad communicates",
  "insights": [
    { "label": "Audience", "value": "..." },
    { "label": "Core offer", "value": "..." },
    { "label": "Tone", "value": "..." },
    { "label": "Urgency", "value": "..." }
  ],
  "before": {
    "headline": "original headline",
    "sub": "original subheadline",
    "cta": "original CTA",
    "features": ["feature 1", "feature 2", "feature 3"],
    "ctaColor": "#4f6ef7"
  },
  "after": {
    "headline": "rewritten headline matching ad promise",
    "sub": "rewritten sub matching ad tone",
    "cta": "rewritten CTA matching ad action",
    "trust": "short social proof line",
    "features": ["rewritten feature 1", "rewritten feature 2", "rewritten feature 3"],
    "ctaColor": "#hex"
  }
}

Ad creative:
${adInput}

Current landing page copy:
${lpInput}

Return only the JSON object.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Mirra LP Personalizer",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: PROMPT }],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const rawText = data.choices?.[0]?.message?.content || "";
    let clean = rawText.replace(/```json|```/g, "").trim();

// extract JSON safely
const start = clean.indexOf("{");
const end = clean.lastIndexOf("}");

if (start !== -1 && end !== -1) {
  clean = clean.substring(start, end + 1);
}

let parsed;

try {
  parsed = JSON.parse(clean);
} catch (e) {
  console.error("AI RAW RESPONSE:", rawText);

  return res.status(500).json({
    error: "AI returned invalid JSON"
  });
}

res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Mirra running at http://localhost:${PORT}`));
