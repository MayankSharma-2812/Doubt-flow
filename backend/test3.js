import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

async function findModels() {
  try {
    const models = await client.models.list();
    console.log("AVAILABLE MODELS:");
    models.data.forEach(m => console.log(m.id));
  } catch (err) {
    console.error("Error fetching models:", err.message);
  }
}

findModels();
