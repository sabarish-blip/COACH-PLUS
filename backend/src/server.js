import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { generateRoadmap } from "./orchestrator.js";
import { getLanguagePack, listLanguagePacks } from "./utils/languagePacks.js";
import { requestSchema, validateSchema } from "./utils/validation.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "coach-plus-backend",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/language-packs", async (_req, res) => {
  try {
    res.json({
      packs: await listLanguagePacks()
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.get("/api/language-packs/:packId/download", async (req, res) => {
  try {
    const pack = await getLanguagePack(req.params.packId);
    res.download(pack.absolutePath, `${pack.id}.zip`);
  } catch (error) {
    res.status(error.code === "LANGUAGE_PACK_NOT_FOUND" ? 404 : 500).json({
      error: error.message
    });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const payload = normalizeRequest(req.body);
    const validatedInput = validateSchema(requestSchema, payload, "GenerateRequest");
    const roadmap = await generateRoadmap(validatedInput);

    res.status(roadmap.partial ? 207 : 200).json(roadmap);
  } catch (error) {
    const statusCode = error.code === "SCHEMA_VALIDATION_ERROR" ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      partial: false,
      generatedAt: new Date().toISOString(),
      errors: [
        {
          agent: "API",
          message: error.message,
          code: error.code || "SERVER_ERROR",
          details: error.details || null
        }
      ]
    });
  }
});

const server = app.listen(port, () => {
  console.log(`[Coach Plus] Server listening on http://localhost:${port}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `[Coach Plus] Port ${port} is already in use. The backend may already be running at http://localhost:${port}.`
    );
    console.error(
      "[Coach Plus] Reuse the existing server, stop the other process, or set PORT in backend/.env to a different value."
    );
    process.exit(1);
    return;
  }

  console.error("[Coach Plus] Server failed to start.", error.message);
  process.exit(1);
});

function normalizeRequest(body) {
  return {
    name: body.name,
    age: Number(body.age),
    gender: body.gender,
    heightCm: Number(body.heightCm),
    weightKg: Number(body.weightKg),
    goal: body.goal,
    sport: body.sport,
    activityLevel: body.activityLevel,
    foodPreference: body.foodPreference,
    language: body.language,
    voiceLanguage: body.voiceLanguage || body.language,
    chennaiArea: body.chennaiArea,
    outdoorTrainingTime: body.outdoorTrainingTime,
    trainingDays: Number(body.trainingDays),
    durationWeeks: Number(body.durationWeeks || 4),
    injuryHistory: body.injuryHistory,
    equipment: body.equipment
  };
}
