const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = "AIzaSyBKGkSjXZvL21lfgncqUCCCqSw2W0wk480";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Fonction qui exécute l'IA et retourne le résultat
async function getGeminiResponse(input) {
  const chatSession = model.startChat({ generationConfig });
  const result = await chatSession.sendMessage(input);
  return result.response.text();
}

// Exporter la fonction pour pouvoir l'utiliser ailleurs
module.exports = { getGeminiResponse };
