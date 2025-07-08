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
import submissionRoutes from "./routes/submissions.js";
import { getSpeakingFeedback } from "./feedback.js";
import SpeakingSubmission from "./models/SpeakingSubmission.js";

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
app.use("/api/submissions", submissionRoutes);

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

    // 1. Upload audio lên AssemblyAI
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

    // 2. Gửi yêu cầu transcript
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

    // 3. Poll kết quả transcript
    const getTranscriptText = async () => {
      const maxAttempts = 10;
      let attempts = 0;

      while (attempts < maxAttempts) {
        const pollingRes = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: {
              authorization: ASSEMBLY_API_KEY,
            },
          }
        );

        // if (pollingRes.data.status === "completed") {
        //   fs.unlinkSync(filePath);
        //   return pollingRes.data.text;
        // }
        if (pollingRes.data.status === "completed") {
            fs.unlinkSync(filePath);
            const transcriptText = pollingRes.data.text;

            const feedback = await getSpeakingFeedback(transcriptText, topic);

            // await SpeakingSubmission.create({
            //   question: questionId,
            //   transcript: transcriptText,
            //   feedback,
            // });

            return res.json({ text: transcriptText, feedback });
          }

        if (pollingRes.data.status === "error") {
          throw new Error("Transcription failed: " + pollingRes.data.error);
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
        attempts++;
      }

      throw new Error("Transcription timed out");
    };

    const transcriptText = await getTranscriptText();
    const feedback = await getSpeakingFeedback(transcriptText, topic);

    return res.json({
      text: transcriptText,
      feedback: feedback, // { grammar, contentLogic, fluency }
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Lỗi xử lý audio." });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
