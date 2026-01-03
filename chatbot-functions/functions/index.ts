import * as functions from "firebase-functions";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const chatbot = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      res.status(400).json({ reply: "Message is empty" });
      return;
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't understand.";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "AI is currently unavailable. Please try again." });
  }
});
