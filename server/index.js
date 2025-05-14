import express from "express";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { getSpeakingFeedback } from "./feedback.js";

dotenv.config();

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });
const ASSEMBLY_API_KEY = process.env.ASSEMBLY_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    const filePath = path.join(__dirname, req.file.path);
    const audioData = fs.readFileSync(filePath);
    const topic = req.body.topic || "Unknown topic";

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
    res.status(500).json({ error: "Đã xảy ra lỗi khi xử lý audio." });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
