import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";
const API_KEY = process.env.TOGETHER_API_KEY;

app.post("/dish-statistics", async (req, res) => {
  const { dishName } = req.body;

  if (!dishName) {
    return res.status(400).json({ error: "dishName is required" });
  }

  const prompt = `How many calories, proteins, fats, and carbohydrates are in 100 grams of ${dishName}? Return the answer as a JSON string with fields for calories, proteins, fats, and carbohydrates, and a separate field with a comment about the glycemic index in English. Do not include ANYTHING else in the response (no extra symbols or words) except the JSON string. But if ${dishName} is not a food, then return an empty string as an answer (no need any JSON string anymore)`;

  try {
    const response = await fetch(TOGETHER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`AI Proxy server running on port ${PORT}`);
});
