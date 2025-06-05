import express from "express";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

import questionRoutes from "./routes/questions.js";
import { getSpeakingFeedback } from "./feedback.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.error("MongoDB connection error:", err));
db.once("open", () => console.log("Connected to MongoDB"));

app.use("/api/questions", questionRoutes);

const upload = multer({ dest: "uploads/" });
const ASSEMBLY_API_KEY = process.env.ASSEMBLY_API_KEY;

import Question from "./models/Question.js";

app.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    const filePath = path.join(__dirname, req.file.path);
    const audioData = fs.readFileSync(filePath);
    const questionId = req.body.questionId;

    if (!questionId) {
      return res.status(400).json({ error: "questionId is required" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const topic = question.topic;

    // Upload audio lên AssemblyAI
    const uploadRes = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      audioData,
      {
        headers: {
          authorization: ASSEMBLY_API_KEY,
          "content-type": "application/octet-stream",
        },
      }
    );

    const audioUrl = uploadRes.data.upload_url;

    // Tạo transcript
    const transcriptRes = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: audioUrl,
        speech_model: "universal",
      },
      {
        headers: {
          authorization: ASSEMBLY_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    const transcriptId = transcriptRes.data.id;

    // Poll transcript kết quả
    const pollTranscript = async () => {
      const pollingRes = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: {
            authorization: ASSEMBLY_API_KEY,
          },
        }
      );

      if (pollingRes.data.status === "completed") {
        fs.unlinkSync(filePath);
        const transcriptText = pollingRes.data.text;

        const feedback = await getSpeakingFeedback(transcriptText, topic);
        return res.json({ text: transcriptText, feedback });
      } else if (pollingRes.data.status === "error") {
        return res.status(500).json({ error: pollingRes.data.error });
      } else {
        setTimeout(pollTranscript, 2000);
      }
    };

    pollTranscript();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi xử lý audio." });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
