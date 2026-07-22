import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Generic AI Endpoint for FreelanceIQ OS Modules
app.post("/api/ai/generate", async (req, res) => {
  try {
    const { prompt, systemInstruction, isJson, responseSchema } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiAI();
    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not configured yet
      return res.json({
        success: true,
        text: "Note: Running in local offline mode. Add your GEMINI_API_KEY in Secrets for live AI responses.\n\n" + prompt,
        isFallback: true,
      });
    }

    const config: any = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (isJson) {
      config.responseMimeType = "application/json";
      if (responseSchema) {
        config.responseSchema = responseSchema;
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config,
    });

    const text = response.text || "";

    res.json({
      success: true,
      text,
      isFallback: false,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/generate:", error);
    res.status(500).json({
      error: error.message || "An error occurred during AI generation.",
    });
  }
});

// Vite middleware or production static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FreelanceIQ AI OS Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
