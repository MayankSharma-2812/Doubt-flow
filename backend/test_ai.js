import "dotenv/config";
import OpenAI from "openai";

const key = process.env.OPENROUTER_API_KEY;
console.log("API Key loaded:", key ? `${key.substring(0, 15)}...` : "MISSING!");

const openai = new OpenAI({
  apiKey: key,
  baseURL: "https://openrouter.ai/api/v1",
});

// Try multiple models in order
const models = [
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "openai/gpt-oss-20b:free",
  "minimax/minimax-m2.5:free",
];

async function testModel(model) {
  try {
    console.log(`\nTesting model: ${model}...`);
    const res = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: "Say hello in one sentence" }],
      max_tokens: 30,
    });
    console.log(`✅ ${model} works!`);
    console.log("Response:", res.choices[0].message.content);
    return model;
  } catch (err) {
    console.log(`❌ ${model} failed: ${err.status} ${err.message}`);
    return null;
  }
}

(async () => {
  for (const model of models) {
    const result = await testModel(model);
    if (result) {
      console.log(`\n🎯 Use this model: ${result}`);
      break;
    }
  }
})();
