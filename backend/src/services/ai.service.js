import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const MODELS = [
  "google/gemma-2-9b-it:free",
  "minimax/minimax-m2.5:free",
  "mistralai/mistral-7b-instruct:free",
  "nvidia/nemotron-nano-9b-v2:free"
];

async function callOpenRouter(messages, max_tokens) {
  for (const model of MODELS) {
    try {
      const res = await openai.chat.completions.create({ model, messages, max_tokens });
      return res.choices[0].message.content.trim();
    } catch (err) {
      if (err.status !== 429 && err.status !== 502) {
        throw err; // if it's not a rate limit/server error, fail fast
      }
      console.warn(`[AI] Model ${model} failed (${err.status}), trying next...`);
    }
  }
  throw new Error("All free models failed (probably rate limited)");
}

/**
 * Generate tags from post text using AI
 */
export const generateTags = async (text) => {
  try {
    const resContent = await callOpenRouter([
      {
        role: "system",
        content:
          "You are a tagging assistant. Given a post, return 3 relevant short tags separated by commas. No hashtags, no explanation, just the tags.",
      },
      { role: "user", content: text },
    ], 30);
    return resContent;
  } catch (err) {
    console.error("AI generateTags error:", err.message);
    // Fallback to simple logic
    const words = text.split(/\W+/).filter((w) => w.length > 3);
    return [...new Set(words)].slice(0, 3).join(", ") || "general, post, doubt";
  }
};

/**
 * Generate a helpful hint for a doubt/question using AI
 */
export const generateHint = async (question) => {
  try {
    const resContent = await callOpenRouter([
      {
        role: "system",
        content:
          "You are a learning assistant for students. Given a question or doubt, provide a helpful HINT that guides the student toward the answer WITHOUT giving the answer directly. Keep it concise (2-3 sentences max). Use a friendly, encouraging tone.",
      },
      { role: "user", content: question },
    ], 150);
    return resContent;
  } catch (err) {
    console.error("AI generateHint error:", err.message);
    return `💡 Think about the core concepts behind: "${question}". Try breaking it into smaller steps and tackling each one individually!`;
  }
};

/**
 * Generate a quiz on a topic using AI
 */
export const generateQuiz = async (topic) => {
  try {
    const resContent = await callOpenRouter([
      {
        role: "system",
        content: `You are a quiz generator for students. Given a topic, generate exactly 3 multiple-choice questions in valid JSON array format. Each question object must have:
- "q": the question string
- "options": array of 4 option strings
- "a": the correct answer string (must match one of the options exactly)

Return ONLY the JSON array, no markdown, no explanation, no code fences.`,
      },
      { role: "user", content: `Generate a quiz on: ${topic}` },
    ], 500);

    // Try to extract JSON from the response (handle potential markdown wrapping)
    const jsonMatch = resContent.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const cleanedJson = jsonMatch[0];
      try {
        JSON.parse(cleanedJson); // Validate it's proper JSON
        return cleanedJson;
      } catch (parseErr) {
        console.warn("[AI] Regex matched but JSON.parse failed, using fallback.");
      }
    }
    return resContent;
  } catch (err) {
    console.error("AI generateQuiz error:", err.message);
    // Fallback
    return JSON.stringify([
      {
        q: `What is a core concept of ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        a: "Option A",
      },
      {
        q: `Which of these is related to ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        a: "Option B",
      },
      {
        q: `True or False: ${topic} is widely used in modern technology?`,
        options: ["True", "False", "Sometimes", "Not applicable"],
        a: "True",
      },
    ]);
  }
};
